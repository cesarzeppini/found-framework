#!/usr/bin/env node
// Flags two things a machine can decide without guessing: dependencies added in
// this range, and third-party hosts appearing in added lines.
//
// It does NOT look for personal data. Whether a field is personal data, whether
// a host is a processor, and whether any document is affected are judgment calls
// this script is structurally unable to make — it produces candidates, and the
// check's judgment layer confirms, dismisses, or maps them.
//
// Usage:
//   node compliance-scan.mjs [--range main...HEAD] [--ignore-host example.com]...
//
// Always exits 0 on a successful scan, with or without signals: a non-zero exit
// would read as a verdict, and this script does not have one. Exit 2 is reserved
// for being unable to scan at all.

import { execFileSync } from 'node:child_process';

const IGNORED_HOSTS = new Set([
  'localhost', '127.0.0.1', '0.0.0.0', '::1',
  'example.com', 'www.example.com', 'example.org',
  'schemas.microsoft.com', 'www.w3.org', 'xmlns.jcp.org', // XML namespaces, not calls
]);

// Manifests whose added lines are worth showing. package.json and composer.json
// are parsed properly; the rest fall back to added-line reporting.
const JSON_MANIFESTS = new Set(['package.json', 'composer.json']);
const LINE_MANIFESTS = new Set([
  'requirements.txt', 'pyproject.toml', 'go.mod', 'Gemfile', 'Cargo.toml', 'pubspec.yaml',
]);

// Never scanned for hosts: generated, vendored, or prose.
const SKIP_PATTERNS = [
  /(^|\/)(package-lock\.json|yarn\.lock|pnpm-lock\.yaml|composer\.lock|Cargo\.lock|poetry\.lock)$/,
  /(^|\/)node_modules\//,
  /\.(md|mdx|txt|snap|map)$/,
  /(^|\/)dist\//,
  /(^|\/)build\//,
];

function arg(name, fallback = null) {
  const i = process.argv.indexOf(`--${name}`);
  return i === -1 ? fallback : process.argv[i + 1];
}

function argAll(name) {
  const out = [];
  process.argv.forEach((a, i) => {
    if (a === `--${name}` && process.argv[i + 1]) out.push(process.argv[i + 1]);
  });
  return out;
}

const range = arg('range', 'main...HEAD');
for (const h of argAll('ignore-host')) IGNORED_HOSTS.add(h.toLowerCase());

function git(args) {
  return execFileSync('git', args, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
}

// Resolve the left-hand side of the range, so "before" versions can be read.
function resolveBase(r) {
  if (r.includes('...')) {
    const [a, b] = r.split('...');
    return git(['merge-base', a || 'HEAD', b || 'HEAD']).trim();
  }
  if (r.includes('..')) return r.split('..')[0] || 'HEAD';
  return r;
}

let base, diff;
try {
  base = resolveBase(range);
  diff = git(['diff', '--unified=0', range]);
} catch (err) {
  console.error(`compliance-scan: cannot diff "${range}" — ${String(err.stderr || err.message).trim()}`);
  console.error('Pass an explicit --range, e.g. --range main...HEAD');
  process.exit(2);
}

// ---- parse the unified diff into added lines, with file and line numbers ----

const added = []; // { file, line, text }
let file = null;
let lineNo = 0;

for (const raw of diff.split('\n')) {
  if (raw.startsWith('+++ ')) {
    const p = raw.slice(4).trim();
    file = p === '/dev/null' ? null : p.replace(/^b\//, '');
    continue;
  }
  const hunk = raw.match(/^@@ -\d+(?:,\d+)? \+(\d+)(?:,\d+)? @@/);
  if (hunk) {
    lineNo = Number(hunk[1]);
    continue;
  }
  if (!file) continue;
  if (raw.startsWith('+') && !raw.startsWith('+++')) {
    added.push({ file, line: lineNo, text: raw.slice(1) });
    lineNo++;
  }
}

const changedFiles = [...new Set(added.map((a) => a.file))];

// ---- 1. new dependencies ----

function depsOf(json) {
  const out = new Map();
  for (const field of ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies', 'require']) {
    const block = json?.[field];
    if (block && typeof block === 'object') {
      for (const [name, version] of Object.entries(block)) out.set(name, { version, field });
    }
  }
  return out;
}

function readAt(ref, path) {
  try {
    return git(['show', `${ref}:${path}`]);
  } catch {
    return null; // file did not exist at that ref
  }
}

const newDeps = [];

for (const f of changedFiles) {
  const name = f.split('/').pop();

  if (JSON_MANIFESTS.has(name)) {
    let before = new Map();
    let after = new Map();
    try {
      const beforeText = readAt(base, f);
      if (beforeText) before = depsOf(JSON.parse(beforeText));
    } catch { /* unparseable before: treat as empty, everything reads as new */ }
    try {
      const afterText = readAt('HEAD', f) ?? null;
      if (afterText) after = depsOf(JSON.parse(afterText));
    } catch {
      console.error(`compliance-scan: ${f} is not valid JSON at HEAD — skipping dependency comparison`);
      continue;
    }
    for (const [dep, meta] of after) {
      if (!before.has(dep)) newDeps.push({ file: f, dep, version: meta.version, field: meta.field });
    }
    continue;
  }

  if (LINE_MANIFESTS.has(name)) {
    for (const a of added.filter((x) => x.file === f)) {
      const text = a.text.trim();
      if (!text || text.startsWith('#') || text.startsWith('//')) continue;
      newDeps.push({ file: f, dep: text, version: null, field: `added line ${a.line}` });
    }
  }
}

// ---- 2. third-party hosts in added lines ----

const hosts = new Map(); // host -> { count, first: {file, line} }

for (const a of added) {
  if (SKIP_PATTERNS.some((re) => re.test(a.file))) continue;

  for (const m of a.text.matchAll(/https?:\/\/([A-Za-z0-9.-]+(?::\d+)?)/g)) {
    const host = m[1].replace(/:\d+$/, '').toLowerCase();
    if (IGNORED_HOSTS.has(host)) continue;
    if (/^\d+\.\d+\.\d+\.\d+$/.test(host) && host.startsWith('192.168.')) continue;
    if (!host.includes('.')) continue; // bare word, not a domain

    const entry = hosts.get(host);
    if (entry) entry.count++;
    else hosts.set(host, { count: 1, first: { file: a.file, line: a.line } });
  }
}

// ---- report ----

const pad = (s, n) => String(s).padEnd(n);
const out = [];

out.push('compliance-scan (signals, not findings)');
out.push(`Range: ${range}`);
out.push('');

if (newDeps.length > 0) {
  out.push(`New dependencies (${newDeps.length})`);
  const w = Math.max(...newDeps.map((d) => d.file.length));
  for (const d of newDeps) {
    const label = d.version ? `${d.dep}@${d.version}` : d.dep;
    out.push(`  ${pad(d.file, w)}  ${pad(label, 34)}${d.field}`);
  }
  out.push('');
}

if (hosts.size > 0) {
  out.push(`New third-party hosts (${hosts.size})`);
  const w = Math.max(...[...hosts.keys()].map((h) => h.length));
  for (const [host, { count, first }] of [...hosts].sort((a, b) => b[1].count - a[1].count)) {
    const more = count > 1 ? `  (+${count - 1} more)` : '';
    out.push(`  ${pad(host, w)}  ${first.file}:${first.line}${more}`);
  }
  out.push('');
}

if (newDeps.length === 0 && hosts.size === 0) {
  out.push('No new dependencies and no new third-party hosts in this range.');
  out.push('');
  out.push('This is a signal, not a clearance: a feature can add personal data,');
  out.push('change retention or move data between regions without adding either.');
} else {
  out.push('Nothing above is a finding. Each line is a candidate for the judgment');
  out.push('layer to confirm, dismiss, or map to a document. A dependency is not a');
  out.push('processor until personal data reaches it, and a host in a diff may never');
  out.push('be called at runtime.');
}

console.log(out.join('\n'));
process.exit(0);
