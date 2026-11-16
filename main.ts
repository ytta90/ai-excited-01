// ai-excited-01 entry: "The Marble Galaxy"
// A colossal glass marble with a whole galaxy swirling inside it, smashing
// through a miniature market street at golden sunset while a tiny girl in a
// red coat reaches up toward it. One huge focal point, a scale surprise,
// debris flying toward the viewer, and a bold "WOW!" burst in the sky.
//
// This program is fully deterministic: it copies the bundled image bytes
// verbatim to the output directory, after checking the gate rules
// (PNG/JPEG magic bytes, at most 1 MiB, at most 1024x1024 pixels).
import { copyFileSync, mkdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const MAX_BYTES = 1048576;
const MAX_DIM = 1024;

const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const JPEG_MAGIC = Buffer.from([0xff, 0xd8, 0xff]);

const here = dirname(fileURLToPath(import.meta.url));
const src = join(here, "entry.png");

const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
const dest = resolve(outDir, "entry.png");

const buf = readFileSync(src);
if (buf.length > MAX_BYTES) {
  throw new Error(`entry.png is ${buf.length} bytes, over the 1 MiB limit`);
}
const isPng = buf.subarray(0, 8).equals(PNG_MAGIC);
const isJpeg = buf.subarray(0, 3).equals(JPEG_MAGIC);
if (!isPng && !isJpeg) {
  throw new Error("entry.png is neither PNG nor JPEG (bad magic bytes)");
}

// Dimensions: PNG IHDR at offset 16, JPEG SOF0/SOF2 scan. Both must fit 1024.
let width = 0;
let height = 0;
if (isPng) {
  width = buf.readUInt32BE(16);
  height = buf.readUInt32BE(20);
} else {
  let i = 2;
  while (i + 9 < buf.length) {
    if (buf[i] !== 0xff) break;
    const marker = buf[i + 1];
    const len = buf.readUInt16BE(i + 2);
    if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
      height = buf.readUInt16BE(i + 5);
      width = buf.readUInt16BE(i + 7);
      break;
    }
    i += 2 + len;
  }
}
if (width === 0 || height === 0) {
  throw new Error("could not read image dimensions");
}
if (width > MAX_DIM || height > MAX_DIM) {
  throw new Error(`image is ${width}x${height}, over the 1024x1024 limit`);
}

mkdirSync(outDir, { recursive: true });
copyFileSync(src, dest);

// Read the copy back and compare byte for byte: the two grader runs must
// produce identical output, and a short or corrupted copy must fail loudly
// instead of silently shipping a broken image.
const out = readFileSync(dest);
if (!out.equals(buf)) {
  throw new Error("output bytes differ from entry.png after copy");
}

const written = statSync(dest);
if (written.size !== buf.length) {
  throw new Error("output size mismatch after copy");
}
console.log(`wrote ${dest} (${width}x${height}, ${written.size} bytes)`);
