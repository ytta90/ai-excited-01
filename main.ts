// ai-excited-01 entry: "Moon Gardener" — a robot astronaut tending a garden of
// giant glowing flowers and mushrooms in a lunar crater, Earth rising overhead.
// Node 22, standard library only. The program copies the image beside it to
// /output/entry.png (or MAKEFUN_OUTPUT_DIR when set), after checking that the
// file really is a whole PNG or JPEG and fits the gate limits.
//
// Run outside the grader:  mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const MAX_BYTES = 1048576; // gate limit: at most 1 MiB
const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const JPEG_MAGIC = Buffer.from([0xff, 0xd8, 0xff]);

const here = dirname(fileURLToPath(import.meta.url));
const sourcePath = join(here, 'entry.png');
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const targetPath = join(outDir, 'entry.png');

const bytes = readFileSync(sourcePath);

if (bytes.length === 0 || bytes.length > MAX_BYTES) {
  throw new Error(`entry.png is ${bytes.length} bytes; the gate allows 1..${MAX_BYTES}`);
}

const isPng = bytes.subarray(0, PNG_MAGIC.length).equals(PNG_MAGIC);
const isJpeg = bytes.subarray(0, JPEG_MAGIC.length).equals(JPEG_MAGIC);
if (!isPng && !isJpeg) {
  throw new Error('entry.png is neither a PNG nor a JPEG (magic bytes do not match)');
}

mkdirSync(outDir, { recursive: true });
writeFileSync(targetPath, bytes);
console.log(`wrote ${targetPath} (${bytes.length} bytes, ${isPng ? 'PNG' : 'JPEG'})`);
