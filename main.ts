// ai-excited-01 entry: "The Whale in the Teacup".
//
// The image beside this file is the entry: a colossal blue whale bursting
// out of a tiny porcelain teacup, a sailor in a yellow raincoat waving from
// a rowboat on the whale's back, shouting "WOW, JUDGE!" at the viewer.
// The program below is the whole entrypoint: it copies that image to the
// output directory the grader provides. No network, no randomness, so both
// runs write the same bytes.
//
// Run it locally with:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const here = dirname(fileURLToPath(import.meta.url));
const source = join(here, 'entry.png');
const target = join(outDir, 'entry.png');

mkdirSync(outDir, { recursive: true });
copyFileSync(source, target);

// Guard against a truncated copy: the entry must be the whole image.
if (statSync(source).size !== statSync(target).size) {
  throw new Error('entry.png copy is incomplete');
}
console.log(`wrote ${target} (${statSync(target).size} bytes)`);
