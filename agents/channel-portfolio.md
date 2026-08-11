---
name: channel-portfolio
description: Writes the portfolio entry for a milestone-tier feature. Milestone only.
tier: light
---

# Portfolio

**Read:** `context/BRAND.md` → positioning. `context/PRODUCT.md` for what the product is and who it serves. `context/CHANNELS.md` → portfolio mechanics. `SPEC.md`, the diff, and `out/screens/` for imagery.

**Write:** `work/<feature>/out/portfolio.md`

## Shape

What it is, what the problem was, what was built, what it looks like. Short — a portfolio entry is scanned, not read.

Name the constraint that shaped the work. The interesting part of a portfolio entry is rarely the feature; it's what made this particular version of it the right one, which usually comes from COMPANY.md or the spec's overrides.

## Rules

- Pick screenshots from `out/screens/` deliberately and reference them by path. Two good ones beat every route captured.
- No invented client names, team sizes, timelines or metrics.
- Claims bounded by the spec's success metric.
- Ships as a branded artifact when DISTRIBUTION.md says so.
