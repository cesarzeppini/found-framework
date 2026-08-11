#!/usr/bin/env node
// Fails on banned words and phrases in prose. The denylist is not maintained
// here — it is read from the project's context/BRAND.md, so the words are the
// project's and this script is only the mechanism.
//
// Usage:
//   node scripts/prose-lint.mjs work/<feature>/out/*.md
//   node scripts/prose-lint.mjs --brand context/BRAND.md out/blog.md
//
// BRAND.md supplies the list as a markdown table under a heading containing
// "banned" or "denylist", with columns: word/phrase | why | use instead.
// Exits 1 on any hit.

import { readFileSync } from 'node:fs';

function arg(name, fallback = null) {
  const i = process.argv.indexOf(`--${name}`);
  return i === -1 ? fallback : process.argv[i + 1];
}

const brandPath = arg('brand', 'context/BRAND.md');
const files = process.argv.slice(2).filter((a, i, all) => {
  if (a.startsWith('--')) return false;
  if (i > 0 && all[i - 1] === '--brand') return false;
  return true;
});

if (files.length === 0) {
  console.error('usage: prose-lint.mjs [--brand context/BRAND.md] <file.md> [...]');
  process.exit(2);
}

function loadDenylist(path) {
  let text;
  try {
    text = readFileSync(path, 'utf8');
  } catch {
    return null;
  }

  const lines = text.split('\n');
  const entries = [];
  let inTable = false;

  for (const line of lines) {
    if (/^#{1,6}\s/.test(line)) {
      inTable = /banned|denylist|deny list/i.test(line);
      continue;
    }
    if (!inTable) continue;

    const cells = line.split('|').map((c) => c.trim()).filter(Boolean);
    if (cells.length < 2) continue;
    if (/^-+$/.test(cells[0])) continue;
    if (/^(word|phrase|banned|term)$/i.test(cells[0])) continue;

    entries.push({
      term: cells[0].replace(/^[`*_]+|[`*_]+$/g, ''),
      why: cells[1] ?? '',
      instead: cells[2] ?? '',
    });
  }

  return entries;
}

const denylist = loadDenylist(brandPath);

if (denylist === null) {
  console.error(`prose-lint: cannot read ${brandPath} — voice-guard needs the project's BRAND.md.`);
  process.exit(2);
}

if (denylist.length === 0) {
  console.error(
    `prose-lint: no banned-words table found in ${brandPath}. ` +
      `Add a heading containing "banned" followed by a | word | why | use instead | table.`
  );
  process.exit(2);
}

const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
let hits = 0;

for (const file of files) {
  let lines;
  try {
    lines = readFileSync(file, 'utf8').split('\n');
  } catch (err) {
    console.error(`${file}: cannot read (${err.code})`);
    hits++;
    continue;
  }

  lines.forEach((line, i) => {
    const found = [];

    for (const { term, instead } of denylist) {
      // Word-boundary match for single words; substring for multi-word phrases.
      const pattern = /\s/.test(term)
        ? new RegExp(escape(term), 'gi')
        : new RegExp(`\\b${escape(term)}\\b`, 'gi');

      for (const m of line.matchAll(pattern)) {
        found.push({ col: m.index + 1, text: m[0], instead });
      }
    }

    for (const { col, text, instead } of found.sort((a, b) => a.col - b.col)) {
      const fix = instead ? ` -> ${instead}` : '';
      console.error(`${file}:${i + 1}:${col}  "${text}"${fix}`);
      hits++;
    }
  });
}

if (hits > 0) {
  console.error(`\nprose-lint: ${hits} hit(s) against ${denylist.length} banned term(s)`);
  process.exit(1);
}

console.log(`prose-lint: clean (${files.length} file(s), ${denylist.length} banned term(s))`);
