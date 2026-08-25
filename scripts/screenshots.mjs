#!/usr/bin/env node
// Captures every route in the spec's affected-screens list at two viewports, and
// optionally runs axe-core in the same browser pass so a11y and screenshots come
// from one run rather than two.
//
// Usage:
//   node scripts/screenshots.mjs --base http://localhost:3000 \
//     --routes /,/dashboard,/settings \
//     --out work/<feature>/out/screens [--axe] [--wait networkidle] [--no-images]
//
// --no-images skips writing the PNGs (route/viewport still navigated and still
// checked by --axe if passed) — for when a run only wants a11y, not the visual
// artifact. See ARCHITECTURE.md, "Per-run flags".
//
// Exits 1 if any route fails to load, or if --axe found violations.
// Playwright and (for --axe) @axe-core/playwright must be installed — standing
// them up is Stage 0's job, not this script's.

import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const VIEWPORTS = [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'desktop', width: 1440, height: 900 },
];

function arg(name, fallback = null) {
  const i = process.argv.indexOf(`--${name}`);
  return i === -1 ? fallback : process.argv[i + 1];
}

const base = arg('base');
const routes = (arg('routes') ?? '/').split(',').map((r) => r.trim()).filter(Boolean);
const outDir = arg('out', 'out/screens');
const waitUntil = arg('wait', 'networkidle');
const withAxe = process.argv.includes('--axe');
const noImages = process.argv.includes('--no-images');

if (!base) {
  console.error('usage: screenshots.mjs --base <url> --routes /a,/b --out <dir> [--axe]');
  process.exit(2);
}

let chromium, AxeBuilder;
try {
  ({ chromium } = await import('playwright'));
} catch {
  console.error('playwright is not installed. Standing up the screenshot harness is a Stage 0 task.');
  process.exit(2);
}
if (withAxe) {
  try {
    ({ default: AxeBuilder } = await import('@axe-core/playwright'));
  } catch {
    console.error('@axe-core/playwright is not installed. Add it in Stage 0, or drop --axe.');
    process.exit(2);
  }
}

const slug = (route) => (route === '/' ? 'index' : route.replace(/^\/+|\/+$/g, '').replace(/\//g, '-'));

await mkdir(outDir, { recursive: true });

const browser = await chromium.launch();
const captured = [];
const violations = [];
let failed = 0;

for (const viewport of VIEWPORTS) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    deviceScaleFactor: 2,
  });

  for (const route of routes) {
    const page = await context.newPage();
    const url = new URL(route, base).toString();
    const file = noImages ? null : join(outDir, `${slug(route)}-${viewport.name}.png`);

    try {
      const response = await page.goto(url, { waitUntil, timeout: 30_000 });
      if (response && response.status() >= 400) {
        console.error(`FAIL ${url} -> HTTP ${response.status()}`);
        failed++;
        await page.close();
        continue;
      }

      if (!noImages) {
        await page.screenshot({ path: file, fullPage: true });
      }
      captured.push({ route, viewport: viewport.name, file });
      console.log(`ok   ${viewport.name.padEnd(7)} ${route}${file ? ` -> ${file}` : ' (no image)'}`);

      if (withAxe) {
        const { violations: found } = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
          .analyze();
        for (const v of found) {
          violations.push({
            route,
            viewport: viewport.name,
            id: v.id,
            impact: v.impact,
            help: v.help,
            nodes: v.nodes.map((n) => n.target.join(' ')).slice(0, 5),
          });
        }
      }
    } catch (err) {
      console.error(`FAIL ${url} -> ${err.message.split('\n')[0]}`);
      failed++;
    }

    await page.close();
  }

  await context.close();
}

await browser.close();

await writeFile(join(outDir, 'manifest.json'), JSON.stringify({ base, captured }, null, 2));

if (withAxe) {
  await writeFile(join(outDir, 'a11y.json'), JSON.stringify(violations, null, 2));
  const serious = violations.filter((v) => v.impact === 'critical' || v.impact === 'serious');
  console.log(`\naxe: ${violations.length} violation(s), ${serious.length} critical/serious`);
  for (const v of serious) {
    console.error(`  ${v.impact.padEnd(8)} ${v.route} [${v.viewport}] ${v.id} — ${v.help}`);
  }
  if (serious.length > 0) failed++;
}

console.log(
  noImages
    ? `\n${captured.length} route(s) checked, no images written (--no-images)`
    : `\n${captured.length} screenshot(s) in ${outDir}`,
);
process.exit(failed > 0 ? 1 : 0);
