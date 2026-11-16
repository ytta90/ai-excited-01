// ai-excited-01: copy entry.png to the output directory.
//
// The entry image is a JPEG (magic bytes FF D8 FF) kept under the name
// entry.png, as the competition rules allow. This program only copies it:
// no network, no generation, no randomness — byte-identical every run.
import { copyFileSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const MAX_BYTES = 1048576; // 1 MiB cap from the rules

const outDir = process.env.MAKEFUN_OUTPUT_DIR;
if (!outDir) {
  throw new Error("MAKEFUN_OUTPUT_DIR is not set");
}

const src = new URL("./entry.png", import.meta.url);
const buf = readFileSync(src);

const isPng =
  buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47;
const isJpeg = buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff;
if (!isPng && !isJpeg) {
  throw new Error("entry.png is neither PNG nor JPEG (bad magic bytes)");
}
if (buf.length > MAX_BYTES) {
  throw new Error(`entry.png is ${buf.length} bytes, over the 1 MiB cap`);
}

mkdirSync(outDir, { recursive: true });
const dest = join(outDir, "entry.png");
copyFileSync(src, dest);
console.log(`wrote ${dest} (${buf.length} bytes)`);
