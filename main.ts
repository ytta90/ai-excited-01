// ai-excited-01 entry (Node 22, standard library only): deterministically copies the
// entry.png beside this file to $MAKEFUN_OUTPUT_DIR/entry.png (or /output/entry.png).
// The gate takes a whole PNG of at most 1 MiB and 1024 by 1024 pixels, and the judge
// sees exactly the bytes copied, so this program validates the PNG magic bytes and
// the size limit before copying, and writes nothing else.
//
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const MAX_BYTES = 1024 * 1024;

const source = new URL('./entry.png', import.meta.url);
const bytes = readFileSync(source);

if (bytes.length > MAX_BYTES) {
  throw new Error(`entry.png is ${bytes.length} bytes, over the 1 MiB limit`);
}
if (!bytes.subarray(0, PNG_MAGIC.length).equals(PNG_MAGIC)) {
  throw new Error('entry.png does not start with the PNG magic bytes');
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
mkdirSync(outDir, { recursive: true });
copyFileSync(source, join(outDir, 'entry.png'));

// Determinism check: the copied file must be byte-identical to the source.
const copied = readFileSync(join(outDir, 'entry.png'));
if (!copied.equals(bytes)) {
  throw new Error('copied entry.png differs from the source');
}
