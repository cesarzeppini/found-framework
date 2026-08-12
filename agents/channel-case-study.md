---
name: channel-case-study
description: Writes the case study for a milestone-tier feature or a completed project. One artifact, trimmed per destination. Milestone only. Absorbs what used to be the portfolio entry — Contra is a destination, not a separate channel.
tier: light
---

# Case study

**Read:** `context/CHANNELS.md` → Case Study, for the canonical structure and each destination's mechanics. `context/BRAND.md` → positioning and claims. `context/COMPANY.md` for what's true about the team and stage. `SPEC.md`, the diff, and `out/screens/` for the visual evidence.

**Write:** `work/<feature>/out/case-study.md`

## One artifact, many destinations

Write the **canonical version once**, to the structure CHANNELS.md names as the source. Every other destination is a *trim* of it plus that platform's extra fields — never a separate piece of writing. Four independently written case studies become four drifting versions of the same story, and the drift is invisible until a client reads two of them.

In one file, under a heading per destination: the canonical version in full, then for each destination switched on in DISTRIBUTION.md, only what differs — the cut, the extra fields, the image selection. If a destination needs no changes beyond length, say so rather than pasting the text again.

Images are shared across destinations. Pick them once, from `out/screens/`, and reference them by path.

## Shape

Problem → approach → result, following the canonical structure in CHANNELS.md.

The problem section does the work: a case study that opens on the solution reads as a brochure. State the constraint that made this hard — usually something in COMPANY.md, like a two-person team or a stage that ruled out the obvious approach.

## Rules

- **The result section is the trap.** On the day of shipping there is no result. Write what shipped and what it's designed to change, and say plainly that outcomes aren't measured yet. A case study with invented results is the most damaging thing this pipeline could produce.
- A destination whose mechanics are marked ⛔ **BLANK — verify** in CHANNELS.md: produce the trim, but **do not guess the limit**. Flag it and let the other destinations ship.
- No client or customer named unless SPEC.md or CHANNELS.md names them. Clutch in particular may require a verified client review before publishing — that's a human's to obtain, never something to assert.
- Claims bounded by the spec's success metric.
- Ships as a branded artifact when DISTRIBUTION.md says so.

## Hand back

**Decisions, not activity** (RULES.md) — a few lines at most.

- **what the result section refused to claim, and why.** The most important line in this handback: it's the record that an outcome was left unstated deliberately rather than overlooked
- destinations you couldn't complete because their mechanics are unverified
- which screenshots you chose to carry the argument
- anything BRAND.md or CHANNELS.md didn't cover, and what you assumed
