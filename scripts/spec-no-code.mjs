#!/usr/bin/env node
// Enforces the spec's code-free rule. Fenced code blocks are an error; inline
// code spans are a warning, since a spec occasionally needs one for a route path.
// Usage: node scripts/spec-no-code.mjs work/<feature>/SPEC.md [...]
// Exits 1 on any error, so it can back a post-edit hook.

import { readFileSync } from 'node:fs';

const files = process.argv.slice(2);

if (files.length === 0) {
  console.error('usage: spec-no-code.mjs <SPEC.md> [...]');
  process.exit(2);
}

let errors = 0;
let warnings = 0;

for (const file of files) {
  let lines;
  try {
    lines = readFileSync(file, 'utf8').split('\n');
  } catch (err) {
    console.error(`${file}: cannot read (${err.code})`);
    errors++;
    continue;
  }

  let fenceOpenedAt = null;

  lines.forEach((line, i) => {
    const lineNo = i + 1;
    const fence = line.match(/^\s*(```|~~~)/);

    if (fence) {
      if (fenceOpenedAt === null) {
        fenceOpenedAt = lineNo;
      } else {
        console.error(
          `${file}:${fenceOpenedAt}  error  fenced code block (closed at line ${lineNo}) — ` +
            `the spec carries intent and constraints, not implementation`
        );
        errors++;
        fenceOpenedAt = null;
      }
      return;
    }

    if (fenceOpenedAt !== null) return;

    // Inline spans: flag only ones that look like code rather than a route or filename.
    for (const span of line.matchAll(/`([^`]+)`/g)) {
      const text = span[1];
      const looksLikePath = /^[\w./:@-]+$/.test(text);
      if (!looksLikePath) {
        console.warn(`${file}:${lineNo}  warn   inline code span: \`${text}\``);
        warnings++;
      }
    }
  });

  if (fenceOpenedAt !== null) {
    console.error(`${file}:${fenceOpenedAt}  error  unclosed code fence`);
    errors++;
  }
}

const summary = `spec-no-code: ${errors} error(s), ${warnings} warning(s)`;

if (errors > 0) {
  console.error(summary);
  process.exit(1);
}

console.log(warnings > 0 ? summary : 'spec-no-code: clean');
