---
name: review
description: End-of-feature pass over the diff against SPEC.md — user-story test, screenshots of every affected route, then a11y, security-audit, compliance, code-quality, design-quality and design-system-guard running in parallel on the same diff. Reasoning tier, writes no code, and runs in the harness that did not build. Triggers when every slice in tasks.md has passed.
---

# Review

Read the diff against `SPEC.md` and `context/` — GLOSSARY.md included, plus `docs/adr/` for the area touched, if it exists. Reasoning tier. **Writes no code.**

If review finds something broken, it reports it — the fix goes back through build. A reviewer that patches what it finds stops being able to tell you how good the build was.

## Two levels

**Per-slice** already happened, at the slice gate: tests and checks, inside the build.

**End of feature** is this pass, and it is the one that decides whether the feature is done.

## The passes

**User-story test.** Does the whole feature work the way a user experiences it, not just the way the unit tests do? Walk the spec's acceptance criteria end to end, in order, as a person would. This catches the feature that passes every slice test and still doesn't work, because nothing ever exercised the seams between slices.

**Screenshots.** Every route in the spec's affected-screens list, mobile and desktop, via `scripts/screenshots.mjs`. This is the only real check on whether the interface is any good — taste can't be linted, so a human looks. Batched at feature level, never per slice, so approval is one session rather than fifteen interruptions. Skipped with `run`'s `--no-screenshots` flag — the images aren't written, but `checks/a11y` still runs on the same browser pass (`--no-images`, not a skipped pass).

**`checks/a11y`** — over the same browser run. Blocking.

**`checks/security-audit`** — once, reading the spec's security surface plus the full diff. Blocking; unresolvable high-severity findings end the run into the final report.

**`checks/compliance`** — once, alongside the security audit, reading the spec's compliance surface plus the diff. Reports which legal documents this feature affects and why. **Advisory as a check; its consequences land in Ship**, which drafts the amendments into `out/legal/`. It never blocks — the question it raises is answered by a human with legal responsibility, and a blocking check would sit waiting.

**`checks/code-quality`** — once, over the full diff, against any coding standards the repo documents plus a fixed smell baseline. This is the Standards half sitting next to the user-story test's Spec half above — a feature can pass one and fail the other. Breach of a documented standard is blocking; baseline smells are judgment calls that never block.

**`checks/design-quality`** — anti-pattern pass. Advisory. Output lands next to the screenshots so both get reviewed together.

**`checks/design-system-guard`** — across the whole diff, catching drift the per-slice runs missed. Parked cases from the slices resurface here, either resolved by a later slice or still listed.

The six checks read the same diff independently, so **they can run in parallel** — one subagent each. A harness without subagents runs them in order and produces the same output.

security-audit and compliance read the same surface for different consequences, so a finding in one often implies a finding in the other — a new third-party processor is both a key to protect and a sub-processor to disclose. Run them independently anyway; correlating them is the report's job, not theirs.

## Blocking, and what it means

A blocking check makes the run fix it — hand the finding back for the retry limit in RULES.md, then re-run the check. It never means waiting for a human. Severity thresholds are RULES.md's too; a check states only where it departs from them.

If a blocking finding survives its attempts, **end the run** and put it in the final report with what was tried. Advisory findings never end a run; they accumulate for the gate.

## The builder never reviews itself

Build in Claude Code → review in Codex. Build in Codex → review in Claude Code. A harness-level split, not just a tier-level one: the same model in the same context that made a decision is the worst judge of whether it was right.

**In Claude Code, invoke the `codex-plugin-cc` plugin** — installed once per machine (`claude plugin marketplace add openai/codex-plugin-cc`, `claude plugin install codex@openai-codex`, `codex login`), not per project. Use `/codex:adversarial-review`, not `/codex:review` — only the adversarial command takes free text after its flags, and that text is what points Codex at this skill instead of running its own generic pass:

```
/codex:adversarial-review --base main Read skills/review/SKILL.md in this repo and act as
the review skill: run the user-story test, capture screenshots, and run the checks in
skills/checks/. Report findings in this skill's format.
```

`--background` for anything non-trivial, then `/codex:status` and `/codex:result` to collect it. Both review commands are read-only — nothing Codex runs here touches the diff.

**If Codex isn't installed or reachable, fall back** to the same harness at reasoning tier, and say so in the report. Weaker, but the pipeline doesn't stop.

This is why the whole set has to be harness-neutral: the review half runs somewhere else, reading the same `context/`, the same `skills/checks/`, the same SPEC.md.

## Report

**Report decisions, not activity** (RULES.md). Not the routes you visited or the checks you launched — what came back from them. Hand back one block for the final report, leading with what needs a human:

- blocking findings that survived their fix attempts, and what was tried
- acceptance criteria, each met or not, with the failing ones named — including the ones that passed, so the gate can tell coverage from silence
- findings per check, severity marked, blocking or advisory, one line per check including the clean ones
- affected legal documents from `checks/compliance`, passed to Ship
- parked decisions carried from the slices, resolved or still open
- **where you'd argue with the spec** — a feature that meets every criterion and still isn't right is the finding only this stage can make, since it's the first time anyone sees the whole thing working
- any skill weakness noticed, written to `out/skill-proposals/` rather than applied

Anything you'd have fixed yourself belongs in the report, not in the code.
