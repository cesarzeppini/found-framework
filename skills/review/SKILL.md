---
name: review
description: End-of-feature pass over the diff against SPEC.md — user-story test, screenshots of every affected route, then a11y, security-audit, design-quality and design-system-guard running in parallel on the same diff. Reasoning tier, writes no code, and runs in the harness that did not build. Triggers when every slice in tasks.md has passed.
---

# Review

Read the diff against `SPEC.md` and `context/`. Reasoning tier. **Writes no code.**

If review finds something broken, it reports it — the fix goes back through build. A reviewer that patches what it finds stops being able to tell you how good the build was.

## Two levels

**Per-slice** already happened, at the slice gate: tests and checks, inside the build.

**End of feature** is this pass, and it is the one that decides whether the feature is done.

## The passes

**User-story test.** Does the whole feature work the way a user experiences it, not just the way the unit tests do? Walk the spec's acceptance criteria end to end, in order, as a person would. This catches the feature that passes every slice test and still doesn't work, because nothing ever exercised the seams between slices.

**Screenshots.** Every route in the spec's affected-screens list, mobile and desktop, via `scripts/screenshots.mjs`. This is the only real check on whether the interface is any good — taste can't be linted, so a human looks. Batched at feature level, never per slice, so approval is one session rather than fifteen interruptions.

**`checks/a11y`** — over the same browser run. Blocking.

**`checks/security-audit`** — once, reading the spec's security surface plus the full diff. Blocking; unresolvable high-severity findings end the run into the final report.

**`checks/design-quality`** — anti-pattern pass. Advisory. Output lands next to the screenshots so both get reviewed together.

**`checks/design-system-guard`** — across the whole diff, catching drift the per-slice runs missed. Parked cases from the slices resurface here, either resolved by a later slice or still listed.

The four checks read the same diff independently, so **they can run in parallel** — one subagent each. A harness without subagents runs them in order and produces the same output.

## Blocking, and what it means

A blocking check makes the run fix it — hand the finding back for a bounded number of fix attempts, then re-run the check. It never means waiting for a human.

If a blocking finding survives its attempts, **end the run** and put it in the final report with what was tried. Advisory findings never end a run; they accumulate for the gate.

## The builder never reviews itself

Build in Claude Code → review in Codex. Build in Codex → review in Claude Code. A harness-level split, not just a tier-level one: the same model in the same context that made a decision is the worst judge of whether it was right.

The handoff runs over MCP — each harness exposes a server, the other connects to it, and the builder calls the reviewer as a tool inside the same run. Configured once per machine, not per project.

**If the link is absent, fall back** to the same harness at reasoning tier, and say so in the report. Weaker, but the pipeline doesn't stop. Verify current Codex MCP support before relying on the cross-harness path.

This is why the whole set has to be harness-neutral: the review half runs somewhere else, reading the same `context/`, the same `skills/checks/`, the same SPEC.md.

## Report

Hand back one block for the final report:

- acceptance criteria, each met or not, with the failing ones named
- screenshot paths, per route and viewport
- findings per check, severity marked, blocking or advisory
- parked decisions carried from the slices, resolved or still open
- any skill weakness noticed, written to `out/skill-proposals/` rather than applied

Anything you'd have fixed yourself belongs in the report, not in the code.
