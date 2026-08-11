# Design

**This file covers everything visual. Everything written and strategic is BRAND.md.**

`tokens.css` is the source of truth for values; this file mirrors it in prose and explains intent. When they disagree, tokens.css wins and this file is stale.

## Colour `[derive → confirm]`

The palette, by semantic role rather than by hue — surface, foreground, primary, muted, destructive, border. What each is for and where it's used.

Derived from tokens.css and the live site. Semantic roles matter more than values here: design-system-guard builds its allowlist from tokens.css, and a colour with no semantic name can't be enforced.

## Typography `[derive → confirm]`

Families, weights, the scale, line heights. Which role each step plays — page title, section heading, body, caption.

## Spacing and layout `[derive → confirm]`

The spacing scale, container widths, grid, breakpoints.

## Radius, elevation, borders `[derive → confirm]`

Corner radii, shadow levels, border treatment, and when each applies.

## Motion `[derive → confirm]`

Durations, easing, what animates and what doesn't. Reduced-motion behaviour.

## Component conventions `[derive]`

How the design system is applied in practice: which variants exist for the common components, which combinations are approved, what's deliberately absent.

The authoritative list is the registry in STACK.md. This section is intent, not inventory.

## Iconography and imagery `[ask]`

Icon set, stroke weight, sizing. Illustration or photography style, if any.

---

## Artifacts `[derive]`

> **Written by visualize's `teach` step. Do not hand-edit.**
>
> Everything above this line is hand-written and durable. Everything below is captured, and is replaced wholesale when teach re-runs — so keeping them separate is what stops a re-run overwriting decisions somebody made deliberately.

Run teach once per project, and again whenever the visual identity changes. It walks the codebase and the live site and writes its capture here, plus `tokens.css` if that file is missing.

Ship reads this section when producing branded artifacts — the final report, and milestone collateral like case studies and portfolio entries.

`<teach output goes here>`
