// Meteor Rodeo — entrypoint for make.fun ai-excited-01.
//
// Copies the repository's entry.png (a 1024x1024 PNG drawn for this
// bounty: a tiny astronaut riding a blazing meteor over a sleeping city)
// into MAKEFUN_OUTPUT_DIR/entry.png, after validating the file the gate
// cares about: PNG magic bytes, the 1 MiB size cap, and dimensions of at
// most 1024x1024. Pure Node standard library, no network, deterministic:
// the same input bytes always produce the same output bytes.
import { createHash } from "node:crypto";
import { copyFile, mkdir, readFile, stat } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const MAX_BYTES = 1048576;
const MAX_DIMENSION = 1024;

const repoDir = dirname(fileURLToPath(import.meta.url));
const sourcePath = join(repoDir, "entry.png");
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "out";
const outputPath = join(outputDir, "entry.png");

function fail(message: string): never {
  console.error(`error: ${message}`);
  process.exit(1);
}

// Read the bundled image and check its size before doing anything else.
const info = await stat(sourcePath).catch(() => {
  fail(`entry.png not found next to main.ts (${sourcePath})`);
});
if (info.size > MAX_BYTES) {
  fail(`entry.png is ${info.size} bytes, over the 1 MiB limit`);
}

const bytes = await readFile(sourcePath);
if (bytes.length !== info.size || bytes.length > MAX_BYTES) {
  fail(`entry.png is ${bytes.length} bytes, over the 1 MiB limit`);
}

// Guard 1: PNG magic bytes.
if (!bytes.subarray(0, PNG_MAGIC.length).equals(PNG_MAGIC)) {
  fail("entry.png does not start with the PNG magic bytes");
}

// Guard 2: IHDR dimensions (width at offset 16, height at offset 20).
if (bytes.length < 33 || bytes.toString("latin1", 12, 16) !== "IHDR") {
  fail("entry.png has no IHDR chunk where a PNG must have one");
}
const width = bytes.readUInt32BE(16);
const height = bytes.readUInt32BE(20);
if (width === 0 || height === 0 || width > MAX_DIMENSION || height > MAX_DIMENSION) {
  fail(`entry.png is ${width}x${height}, over the 1024x1024 limit`);
}

// Deterministic copy: the output is byte-for-byte the bundled image.
await mkdir(outputDir, { recursive: true });
await copyFile(sourcePath, outputPath);

// Re-read what we wrote and prove it matches the source exactly.
const written = await readFile(outputPath);
const hash = createHash("sha256").update(written).digest("hex");
const sourceHash = createHash("sha256").update(bytes).digest("hex");
if (hash !== sourceHash) {
  fail("output differs from entry.png after copy");
}
console.log(`wrote ${outputPath}: ${width}x${height} PNG, ${written.length} bytes, sha256 ${hash}`);
