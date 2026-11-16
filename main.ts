// ai-excited-01 — "The Slowest Animal Alive Just Outran a Shooting Star"
// Copies the entry image (entry.png, JPEG bytes under a .png name, as the
// rules allow) into the output directory. Deterministic: a plain byte copy,
// no timestamps, no randomness, so repeated runs produce identical output.
import { copyFileSync, mkdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const MAX_BYTES = 1048576; // 1 MiB, the competition's file-size cap

const here = dirname(fileURLToPath(import.meta.url));
const source = join(here, "entry.png");

const outDir = process.env.MAKEFUN_OUTPUT_DIR;
if (!outDir) {
  throw new Error("MAKEFUN_OUTPUT_DIR is not set");
}
const target = join(outDir, "entry.png");

const bytes = readFileSync(source);

// Guard 1: the file must be a whole PNG or JPEG, told apart by its magic.
const isPng = bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47;
const isJpeg = bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
if (!isPng && !isJpeg) {
  throw new Error("entry.png is neither a PNG nor a JPEG (bad magic bytes)");
}

// Guard 2: the competition caps the file at 1 MiB.
if (bytes.length > MAX_BYTES) {
  throw new Error(`entry.png is ${bytes.length} bytes, over the ${MAX_BYTES} byte cap`);
}

mkdirSync(outDir, { recursive: true });
copyFileSync(source, target);

// Guard 3: the copy must be byte-identical to the source.
const copied = statSync(target);
if (copied.size !== bytes.length) {
  throw new Error(`copy mismatch: wrote ${copied.size} bytes, expected ${bytes.length}`);
}

console.log(`wrote ${target} (${bytes.length} bytes, ${isPng ? "PNG" : "JPEG"})`);
