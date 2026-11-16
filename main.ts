// ai-excited-01 entry: copy entry.png to MAKEFUN_OUTPUT_DIR/entry.png.
// The image is a JPEG (magic bytes FF D8 FF) stored under the name entry.png,
// which the competition rules allow: the file is told apart by its first bytes.
// Deterministic: a plain byte copy, so both grader runs produce identical output.
import { copyFileSync, mkdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const MAX_BYTES = 1048576; // 1 MiB

const outDir = process.env.MAKEFUN_OUTPUT_DIR;
if (!outDir) {
  throw new Error("MAKEFUN_OUTPUT_DIR is not set");
}

const repoDir = dirname(fileURLToPath(import.meta.url));
const src = join(repoDir, "entry.png");
const data = readFileSync(src);

const isPng =
  data.length >= 8 &&
  data[0] === 0x89 &&
  data[1] === 0x50 &&
  data[2] === 0x4e &&
  data[3] === 0x47 &&
  data[4] === 0x0d &&
  data[5] === 0x0a &&
  data[6] === 0x1a &&
  data[7] === 0x0a;
const isJpeg =
  data.length >= 3 && data[0] === 0xff && data[1] === 0xd8 && data[2] === 0xff;
if (!isPng && !isJpeg) {
  throw new Error("entry.png is neither PNG nor JPEG (bad magic bytes)");
}
if (data.length > MAX_BYTES) {
  throw new Error(`entry.png is ${data.length} bytes, over the 1 MiB limit`);
}

mkdirSync(outDir, { recursive: true });
copyFileSync(src, join(outDir, "entry.png"));
console.log(`wrote ${data.length} bytes to ${join(outDir, "entry.png")}`);
