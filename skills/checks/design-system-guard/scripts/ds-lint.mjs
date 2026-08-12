#!/usr/bin/env node
// design-system-guard mechanical linter.
//
// Usage:
//   ds-lint.mjs <file-or-dir> [...]          lint (defaults to src/)
//   ds-lint.mjs --added-markers <git-range>  audit @approved markers added in a range
//   ds-lint.mjs --registry [root]            inventory for the report's registry section
//
// Exit 1 when any hit is found, 0 when clean. --registry always exits 0 (inventory,
// not a finding). --added-markers exits 1 when markers were added.
//
// Node rather than shell, deliberately. The shell version accumulated four bugs of
// kinds this file cannot have: `ls a b` failing when only one glob missed, a sed
// delimiter colliding with data containing "|", a path prefix leaking into a
// pattern match, and grep's -i flag applying in one branch but not the other.

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, basename } from 'node:path';
import { execFileSync } from 'node:child_process';

// A component is approved when @approved appears in a comment within the first
// MARKER_WINDOW lines of its own file. The window is deliberate: the marker has to
// be where a human opening the file sees it, not buried at the bottom.
const MARKER_WINDOW = 5;
const MARKER_RE = /(^|[\s/*#{])@approved(\s|$)/;

const SKIP_DIRS = new Set(['node_modules', '.git', 'dist', 'build', '.next', 'coverage']);
const LINT_EXTS = ['.tsx', '.jsx'];
const COMPONENT_EXTS = ['.tsx', '.jsx', '.ts'];

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const norm = (p) => p.replace(/^\.\//, '').replace(/\/+$/, '');

// ---- config from context/STACK.md ----

function stackKey(name) {
  try {
    const text = readFileSync('context/STACK.md', 'utf8');
    const m = text.match(new RegExp(`^${name}:[ \\t]*(.*)$`, 'm'));
    return m ? m[1].trim() : '';
  } catch {
    return '';
  }
}

function dirList(raw, fallback = '') {
  const s = (raw || fallback).trim();
  return s ? s.split(/[,\s]+/).filter(Boolean).map(norm) : [];
}

// `components:` may list several directories — hand-built components and the
// generated plumbing they sit on usually live apart.
const COMPONENT_DIRS = dirList(stackKey('components'), 'src/components/ui');
const IGNORE_DIRS = dirList(stackKey('components-ignore'));

// Import specifiers use whatever alias the project prefers (@/, ~/, ../), so match
// each directory's path tail rather than assuming one.
const tailOf = (d) => norm(d).replace(/^src\//, '');
const TAILS = COMPONENT_DIRS.map(tailOf);
const TAIL_ALT = TAILS.map(esc).join('|');
const IMPORT_RE = TAIL_ALT ? new RegExp(`from\\s+["'][^"']*(?:${TAIL_ALT})/[A-Za-z0-9_-]+["']`) : null;
const KEY_RE = TAIL_ALT ? new RegExp(`(?:${TAIL_ALT})/[A-Za-z0-9_-]+`) : null;

// ---- filesystem ----

function* walk(dir) {
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const e of entries) {
    if (e.isDirectory()) {
      if (SKIP_DIRS.has(e.name)) continue;
      yield* walk(join(dir, e.name));
    } else if (e.isFile()) {
      yield join(dir, e.name);
    }
  }
}

function filesUnder(target, exts) {
  const out = [];
  let st;
  try {
    st = statSync(target);
  } catch {
    return out;
  }
  if (st.isFile()) {
    if (exts.some((x) => target.endsWith(x))) out.push(norm(target));
    return out;
  }
  for (const f of walk(target)) if (exts.some((x) => f.endsWith(x))) out.push(norm(f));
  return out;
}

const isDir = (p) => {
  try {
    return statSync(p).isDirectory();
  } catch {
    return false;
  }
};

const readLines = (f) => {
  try {
    return readFileSync(f, 'utf8').split('\n');
  } catch {
    return [];
  }
};

// Is this file inside one of the configured component directories? Those files
// define the system rather than consume it, so lint skips them.
const inComponentDir = (file) =>
  COMPONENT_DIRS.some((d) => norm(file) === d || norm(file).startsWith(d + '/'));

function isMarked(file) {
  return readLines(file).slice(0, MARKER_WINDOW).some((l) => MARKER_RE.test(l));
}

const componentKey = (dir, file) => `${tailOf(dir)}/${basename(file).replace(/\.[^.]+$/, '')}`;

// The imported component key, taken from the LINE CONTENT only. A component's own
// path contains the same directory tail, so matching against the path would return
// the file itself instead of what it imports.
const importKey = (content) => (KEY_RE ? (content.match(KEY_RE) || [null])[0] : null);

function* importsIn(files) {
  if (!IMPORT_RE) return;
  for (const file of files) {
    const lines = readLines(file);
    for (let i = 0; i < lines.length; i++) {
      if (IMPORT_RE.test(lines[i])) {
        const key = importKey(lines[i]);
        if (key) yield { file, line: i + 1, content: lines[i], key };
      }
    }
  }
}

// ---- mode: --added-markers ----

function addedMarkers(range) {
  let diff;
  try {
    diff = execFileSync('git', ['diff', '--unified=0', range], {
      encoding: 'utf8',
      maxBuffer: 64 * 1024 * 1024,
    });
  } catch {
    console.error(`ds-lint: cannot diff "${range}" — pass an explicit range, e.g. main...HEAD`);
    return 2;
  }

  const found = new Set();
  let file = null;
  for (const line of diff.split('\n')) {
    if (line.startsWith('+++ ')) {
      const p = line.slice(4).trim();
      file = p === '/dev/null' ? null : p.replace(/^b\//, '');
    } else if (file && line.startsWith('+') && !line.startsWith('+++') && line.includes('@approved')) {
      found.add(file);
    }
  }

  if (found.size > 0) {
    console.log(`== @approved markers added in ${range}`);
    for (const f of [...found].sort()) console.log(`  ${f}`);
    console.log('');
    console.log('   Report each of these in the final report as a Needs-you item, naming who');
    console.log('   asked for it — including when a human did ask.');
    return 1;
  }
  console.log(`No @approved markers added in ${range}`);
  return 0;
}

// ---- mode: --registry ----

function registry(root) {
  // Scan the WHOLE codebase for imports, not this run's diff: in a new project the
  // entire codebase is the backlog, and a component in use since before the framework
  // was installed appears in no diff and would never otherwise surface.
  const tally = new Map(); // key -> Set of importing files
  for (const hit of importsIn(filesUnder(root, LINT_EXTS))) {
    if (!tally.has(hit.key)) tally.set(hit.key, new Set());
    tally.get(hit.key).add(hit.file);
  }

  const approved = [];
  const usedUnmarked = [];
  let unusedCount = 0;

  for (const dir of COMPONENT_DIRS) {
    if (!isDir(dir)) continue;
    for (const f of filesUnder(dir, COMPONENT_EXTS)) {
      const key = componentKey(dir, f);
      if (isMarked(f)) {
        approved.push(key);
      } else {
        const n = tally.get(key)?.size ?? 0;
        if (n > 0) usedUnmarked.push({ key, n });
        else unusedCount++;
      }
    }
  }

  const uniq = (a) => [...new Set(a)].sort();
  const approvedList = uniq(approved);
  const usedList = uniq(usedUnmarked.map((u) => `${u.key.padEnd(44)} used in ${u.n} file(s)`));

  console.log('== component registry');
  console.log('');
  console.log(`Approved (${approvedList.length})`);
  if (approvedList.length) approvedList.forEach((k) => console.log(`  ${k}`));
  else console.log('  (none yet — expected on a new project)');
  console.log('');
  console.log(`Unmarked but in use (${usedList.length})`);
  if (usedList.length) {
    usedList.forEach((l) => console.log(`  ${l}`));
    console.log('');
    console.log('  Each is a decision waiting: mark it approved, or replace its uses.');
  } else {
    console.log('  (none)');
  }
  console.log('');
  console.log(`Unmarked and unimported: ${unusedCount} file(s) — not listed.`);
  console.log('  Nothing depends on them, so they are inventory rather than a decision.');
  return 0;
}

// ---- mode: lint ----

const PATTERNS = [
  ['raw hex / rgb / hsl color', /#[0-9a-fA-F]{3,8}\b|rgba?\(|hsla?\(/],
  ['arbitrary-value utility', /(bg|text|border|shadow|rounded|font|ring)-\[/],
  [
    'non-token color utility',
    /\b(bg|text|border|ring|from|to|via)-(white|black|gray|slate|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)(-[0-9]{2,3})?\b/,
  ],
  // Case-sensitive on purpose: <button> is a raw element, <Button> is the component.
  ['raw interactive HTML element', /<(button|input|select|textarea)[\s>]/],
  ['inline style attribute', /style=\{\{/],
  ['important override', /className="[^"]*![a-z-]/],
];

function unlistedComponentDirs() {
  // Component directories the project has but `components:` doesn't list. Without
  // this, an incomplete key narrows the check silently: an unlisted directory is
  // never examined, which looks exactly like a directory with no violations.
  const excluded = [...COMPONENT_DIRS, ...IGNORE_DIRS];
  const out = new Set();

  // Directly holds component-shaped files — checked per directory, so a directory
  // of subdirectories doesn't count on its children's behalf.
  const holdsComponents = (dir) => {
    try {
      return readdirSync(dir, { withFileTypes: true }).some(
        (e) => e.isFile() && LINT_EXTS.some((x) => e.name.endsWith(x))
      );
    } catch {
      return false;
    }
  };

  const visit = (dir) => {
    let entries;
    try {
      entries = readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const e of entries) {
      if (!e.isDirectory() || SKIP_DIRS.has(e.name)) continue;
      const full = norm(join(dir, e.name));
      const covered = excluded.some((c) => full === c || full.startsWith(c + '/'));
      if (!covered && /(^|\/)components?(\/|$)/i.test(full) && holdsComponents(full)) {
        out.add(full);
      }
      visit(full);
    }
  };

  visit('.');
  return [...out].sort();
}

function lint(targets) {
  let hits = 0;

  const files = [...new Set(targets.flatMap((t) => filesUnder(t, LINT_EXTS)))]
    .filter((f) => !inComponentDir(f))
    .sort();

  for (const [label, re] of PATTERNS) {
    const found = [];
    for (const f of files) {
      const lines = readLines(f);
      for (let i = 0; i < lines.length; i++) {
        if (re.test(lines[i])) found.push(`${f}:${i + 1}:${lines[i]}`);
      }
    }
    if (found.length) {
      console.log(`== ${label}`);
      found.forEach((l) => console.log(l));
      console.log('');
      hits = 1;
    }
  }

  const unlisted = unlistedComponentDirs();
  if (unlisted.length) {
    console.log('== component directories not listed in components:');
    unlisted.forEach((d) => console.log(`  ${d}`));
    console.log('');
    console.log('   These are never examined, so their components are neither approved nor');
    console.log('   flagged. Add each to components: in context/STACK.md, or record it under');
    console.log('   components-ignore: to say the exclusion is deliberate.');
    console.log('');
    hits = 1;
  }

  const existing = COMPONENT_DIRS.filter(isDir);
  if (existing.length === 0) {
    console.log(
      '== component directory not found (set components: in context/STACK.md) — approval cannot be verified'
    );
    console.log(`   looked for: ${COMPONENT_DIRS.join(' ')}`);
    console.log('');
    return 1;
  }

  const approved = new Set();
  for (const dir of existing) {
    for (const f of filesUnder(dir, COMPONENT_EXTS)) {
      if (isMarked(f)) approved.add(componentKey(dir, f));
    }
  }

  if (approved.size === 0) {
    console.log(`== no component in ${existing.join(' ')} carries an @approved marker`);
    console.log(`   (looked in the first ${MARKER_WINDOW} lines of each file)`);
    console.log('   Every component below is therefore unapproved. If that looks wrong, a human');
    console.log('   marks components — agents never add @approved on their own initiative.');
    console.log('');
  }

  const unapproved = new Set();
  for (const hit of importsIn(files)) {
    if (!approved.has(hit.key)) unapproved.add(`${hit.file}  ->  ${hit.key}`);
  }

  if (unapproved.size > 0) {
    console.log('== component used but not marked @approved');
    [...unapproved].sort().forEach((l) => console.log(l));
    console.log('');
    hits = 1;
  }

  if (hits === 0) console.log('Design system check: clean');
  return hits;
}

// ---- dispatch ----

const argv = process.argv.slice(2);

if (argv[0] === '--added-markers') {
  process.exit(addedMarkers(argv[1] || 'main...HEAD'));
} else if (argv[0] === '--registry') {
  process.exit(registry(argv[1] || '.'));
} else {
  let targets = argv.filter((a) => !a.startsWith('--'));
  if (targets.length === 0) {
    targets = ['src/routes', 'src/components'].filter(isDir);
    if (targets.length === 0) targets = ['src'];
  }
  process.exit(lint(targets));
}
