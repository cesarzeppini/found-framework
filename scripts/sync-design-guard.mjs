#!/usr/bin/env node
// Syncs the design-system-guard code from the standalone design-guard repo.
//
// The standalone (https://github.com/cesarzeppini/design-guard) is the source of
// truth for the linter, its tests, the shared scan core and the /components page
// template. This copies those files into skills/checks/design-system-guard/ so the
// two never drift. SKILL.md and references/allowed-customization.md are NOT synced:
// they are adapted to this framework (pipeline, context/, tokens.css) and edited here.
//
// Usage:
//   node scripts/sync-design-guard.mjs <path-to-design-guard-checkout>   copy
//   node scripts/sync-design-guard.mjs <path> --check                    report drift, change nothing
//
// Exits 0 when in sync (or after copying), 1 on drift under --check, 2 on a bad source.

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const DEST = join(HERE, '..', 'skills', 'checks', 'design-system-guard');

// source (in the standalone repo) -> destination (under DEST)
const FILES = [
  ['scripts/ds-lint.mjs', 'scripts/ds-lint.mjs'],
  ['scripts/ds-lint.test.mjs', 'scripts/ds-lint.test.mjs'],
  ['scripts/scan-core.mjs', 'scripts/scan-core.mjs'],
  ['scripts/scan-core.d.mts', 'scripts/scan-core.d.mts'],
  ['template/Components.tsx', 'template/Components.tsx'],
];

const args = process.argv.slice(2);
const check = args.includes('--check');
const src = args.find((a) => !a.startsWith('--'));
if (!src) {
  console.error('usage: sync-design-guard.mjs <path-to-design-guard-checkout> [--check]');
  process.exit(2);
}
const root = resolve(src);
if (!existsSync(join(root, 'scripts', 'ds-lint.mjs'))) {
  console.error(`sync-design-guard: ${root} does not look like a design-guard checkout (no scripts/ds-lint.mjs)`);
  process.exit(2);
}

let drift = 0;
for (const [from, to] of FILES) {
  const a = join(root, from);
  const b = join(DEST, to);
  if (!existsSync(a)) {
    console.error(`sync-design-guard: missing in source: ${from}`);
    process.exit(2);
  }
  const next = readFileSync(a);
  const prev = existsSync(b) ? readFileSync(b) : null;
  if (prev && prev.equals(next)) {
    console.log(`  same     ${to}`);
    continue;
  }
  drift++;
  if (check) {
    console.log(`  DIFFERS  ${to}`);
    continue;
  }
  mkdirSync(dirname(b), { recursive: true });
  writeFileSync(b, next);
  console.log(`  ${prev ? 'updated ' : 'added   '} ${to}`);
}

if (check && drift) {
  console.log(`\n${drift} file(s) differ from the standalone. Run without --check to sync.`);
  process.exit(1);
}
console.log(drift ? `\nSynced ${drift} file(s).` : '\nAlready in sync.');
