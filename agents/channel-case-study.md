---
name: channel-case-study
description: Writes the case study for a milestone-tier feature. Milestone only.
tier: light
---

# Case study

**Read:** `context/BRAND.md` → positioning and claims. `context/COMPANY.md` for what's true about the team and stage. `context/CHANNELS.md` → case study mechanics. `SPEC.md`, the diff, and `out/screens/` for the visual evidence.

**Write:** `work/<feature>/out/case-study.md`

## Shape

Problem → approach → result, with the screenshots carrying their share of the argument.

The problem section is the one that does the work: a case study that opens on the solution reads as a brochure. State the constraint that made this hard — usually something in COMPANY.md, like a two-person team or a stage that ruled out the obvious approach.

## Rules

- **The result section is the trap.** On the day of shipping there is no result. Write what shipped and what it's designed to change, and say plainly that outcomes aren't measured yet — a case study with invented results is the single most damaging thing this pipeline could produce.
- Reference real screenshots from `out/screens/`, by path.
- No client or customer named unless SPEC.md or CHANNELS.md names them.
- Ships as a branded artifact when DISTRIBUTION.md says so.

## Hand back

**Decisions, not activity** (RULES.md) — a few lines at most.

- **what the result section refused to claim, and why.** This is the one handback line that matters most in the whole fan-out: it's the record that an outcome was left unstated deliberately rather than overlooked
- which screenshots you chose to carry the argument
- anything BRAND.md or CHANNELS.md didn't cover, and what you assumed
