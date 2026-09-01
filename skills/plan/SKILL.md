---
name: plan
description: Turns an approved SPEC.md into work/<feature>/tasks.md — a Stage 0 prep block followed by vertical slices, each a self-contained task package with its seam and test expectation written before the slice is built. Reasoning tier. Also tags the feature tier that drives Ship's fan-out and sets the spec's effort ceiling. Triggers after spec approval, before any building.
---

# Plan

Turn an approved `SPEC.md` into `work/<feature>/tasks.md`. Reasoning tier. Writes no product code.

## Before starting

Read SPEC.md, then `context/` — STACK.md for what exists to build on, COMPANY.md for the calibration behind the minimum-viable rule, GLOSSARY.md so slices are named the way the project already talks about itself. Read `docs/adr/` for the area being touched, if it exists — a slice that reopens a standing decision belongs in the report, not silently re-litigated.

**Blocking open questions stop Plan.** If SPEC.md lists an open question marked blocking, do not plan around it and do not guess an answer. Report which question blocks and end. Non-blocking questions are planned around, with the assumption stated in the affected slice.

## Cut by vertical slice, not by layer

Not all database, then all API, then all frontend. **Each slice is the smallest change that touches every layer it needs and can be tested on its own.**

Layer-first planning means building a backend against a predicted frontend and rewriting it when the frontend turns out different. The prediction is always wrong in small ways, and the rewrite is invisible in the plan.

**A slice is valid only if you can state how it would be tested.** If you can't name the seam it would be tested through and write its test expectation against that seam, the slice is cut wrong — usually too big, occasionally too abstract to observe. Recut it until both are writable.

Slice against the spec's acceptance criteria. Each criterion should be traceable to the slice that satisfies it; a criterion no slice covers is a gap in the plan, and a slice satisfying no criterion is scope nobody asked for.

## tasks.md structure

### Prep block first

Stage 0 tasks: refactors, renames, extractions, dead code removal, and schema changes the incoming feature needs. **Sequential, not parallel** — it moves shared ground under everyone's feet, and two tasks doing that at once conflict.

Stage 0 ships no feature behaviour. Its gate is that tests still pass and the app behaves identically.

If the project has no test runner, standing one up is a Stage 0 task — otherwise the slice gates have nothing to run. Same for the screenshot harness if it isn't set up. Check STACK.md before assuming either exists.

A prerequisite from SPEC.md that needs a human's hands — a credential, a third-party account, a dashboard click-through, provisioning only a human should authorise — is a Stage 0 task marked **human-required**, not folded into an ordinary automatable one. Build doesn't attempt these; see `skills/build/references/wizard.md` for what it does instead.

### Then slices

Each slice is a self-contained task package. It has to be: the subagent that runs it has no predefined role and no context beyond what the package gives it. Restating instructions per package is the accepted trade — no drift between a role file and reality.

Every package carries seven things:

| Field | Content |
|---|---|
| What to do | The change, in behaviour terms. Specific enough to build from without reading the whole spec. |
| Context to read | Which `context/` files this slice actually needs — not all of them by default. |
| Capability tier | reasoning / standard / light. Build work is standard unless the slice is unusually subtle. |
| Seam | The public boundary the test observes — the route, the exported function, the interface a real caller goes through. Named now, so build tests the behaviour rather than the mechanism. |
| Test expectation | What passing looks like, written now, before the slice is built. |
| Test-exempt | Present only when the slice is genuinely low-risk (copy change, styling). Explicit and visible — never a silent skip. |
| Ordering | Runs in parallel with which slices, or waits for which. Default: waits. |

**Name the seam before writing the expectation, not after.** An expectation written first tends to describe whatever's easiest to assert on, which is usually the mechanism, not the behaviour — the seam names what a real caller touches, and the expectation is only honest once it's checked against that. Prefer an existing seam over a new one; a slice that needs a seam nothing else uses is worth a second look, since it often means the slice is cut at the wrong altitude.

Write the test expectation as an observable outcome, not a technique — "a signed-out visitor submitting the form gets a confirmation and a queued email," not "unit test the handler." The builder picks the mechanism; the seam is what stops that choice drifting into something the test expectation can't actually observe.

**Default to sequential.** Slices depend on each other by design; parallelism is an optimisation, and marking two slices independent when they aren't costs more than the time it saves. Mark parallel only where the slices provably touch disjoint surfaces.

## Feature tier

Tag the whole feature **fix**, **feature**, or **milestone**. Plan knows the size of what's being built, so Plan tags it; Ship then produces exactly the intersection of tier and the channels DISTRIBUTION.md has switched on. No human deciding "is this blog-worthy" per feature.

| Tier | Shape |
|---|---|
| fix | A defect or a small correction. Changelog line only. |
| feature | New user-visible capability. Changelog, email, social. |
| milestone | A release users would notice and talk about. Everything, plus blog, **case study**, video script, build-in-public profile update. |

Tag honestly. Inflating a fix into a milestone produces collateral with nothing to say, and the voice-guard pass can't rescue a post about a bug fix that claims to be a launch.

## Effort ceiling

Estimate the slice count and write it into the spec's effort ceiling constraint. This is the only legitimate mid-run halt: if the actual slice count blows past the estimate, the spec was wrong and continuing burns effort on a bad foundation.

Set it with a little headroom — a ceiling that trips on the first surprise halts good runs, and one set at double the estimate never trips at all. State the estimate and the ceiling separately so the gap is visible.

## Output

Write `work/<feature>/tasks.md` with the prep block, the slices, the feature tier and the effort ceiling. Then hand back to the run skill — Plan does not start building.

**Report decisions, not activity** (RULES.md). Not the slice list, which is in the file — briefly:

- slices that were hard to cut, and what made them hard
- acceptance criteria that didn't map cleanly onto any slice, and how you resolved it
- the tier tag when it was a close call, and which way you went
- **any ADR written** — slicing sometimes surfaces an architectural call the spec left implicit (hard to reverse, surprising without context, a real trade-off — the three-part test in `templates/ADR-FORMAT.md`). Write it to `docs/adr/` and name it here, along with what the pre-write check found (nothing, a reconsideration, or that it was skipped because no subagent was spawnable); don't fold the decision silently into a task package where the next planner won't see it
- **where you'd argue with the spec**: criteria that can't be tested as written, states the spec didn't list that the build will hit anyway, scope the out-of-scope section should have excluded. The spec is approved, not correct, and planning is where its gaps first become visible.
