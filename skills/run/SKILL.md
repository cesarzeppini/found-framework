---
name: run
description: The orchestrator. Given an approved SPEC.md, executes plan → build → review → ship in order, unattended, and ends by assembling the final report. Enforces the two-stop model, park-don't-ask, the effort ceiling as the only mid-run halt, and terminate-into-the-report on any blocking failure. Triggers when a human approves a spec or asks to run the pipeline on one.
---

# Run

Given an approved `work/<feature>/SPEC.md`, execute the pipeline end to end:

```text
2 PLAN  →  3 BUILD [0 prep → slice → slice → …]  →  4 REVIEW  →  5 SHIP  →  ⟨gate⟩
```

Without this skill there is no loop — just five skills a human prompts one by one.

## Preconditions

Start only when **a human has approved the spec**. An unapproved SPEC.md is not an input to this skill; if one is handed over, run the spec skill instead and stop at the approval.

Check before starting:

- SPEC.md exists and is approved
- no open question in it is marked blocking
- `context/` exists, with at least COMPANY.md, PRODUCT.md and STACK.md

A missing `context/` is not something to invent your way around. Report it and stop — every downstream judgment calibrates against those files.

## The two stops

**Spec approval at the start. The final gate at the end.** Nothing else stops.

Between them the run is unattended. That is the whole point: the human trades fifteen interruptions for one review session, and the report is what makes the trade honest.

## Standing rules for the whole run

**Park, don't ask.** Ambiguous mid-run: make the reversible choice, log it with the alternative named, keep going. Irreversible or genuinely blocked items go to the report as questions.

**Blocking never waits.** A failed test, a security finding, an a11y hit — the run fixes it. Bounded attempts, then the run *ends early* and the report says where and why. Mid-run the pipeline progresses or terminates. It never sits waiting for a human who isn't there.

**The effort ceiling is the only legitimate mid-run halt.** If the slice count blows past the spec's ceiling, the spec was wrong; continuing burns effort on a bad foundation. Stop, report, wait.

**No model names.** Tasks carry tiers; the tier map in this harness's CLAUDE.md or AGENTS.md resolves them.

## Stages

**Plan** — reasoning tier. SPEC.md → tasks.md, feature tier tagged, effort ceiling written back to the spec. Blocking open questions stop here.

**Build** — standard tier. Stage 0 prep, then slices in order, each gated on implement → test → full suite. A failing slice blocks the next; bounded fix attempts, then terminate into the report.

**Review** — reasoning tier, in the other harness where the MCP link exists, otherwise same harness with the fallback noted. User-story test, screenshots, then the four checks in parallel. Blocking findings go back to build for bounded attempts.

**Ship** — light tier for copy. Tier × channel fan-out, all channels in parallel, everything into `out/`, unpublished.

Each stage hands the next what it produced, and hands the report what it decided. A stage that ends the run still hands over everything up to that point — a terminated run produces a report, never silence.

## Assembling the final report

Ship writes `out/report.html`, but the run owns what goes in it. Collect across every stage:

- what shipped, against the spec's acceptance criteria
- screenshots, per route and viewport
- every parked decision, with its alternative
- audit and check findings, severity marked, blocking or advisory
- the collateral in `out/`, linked from the manifest
- legal amendment drafts from `out/legal/`, each gated individually — **approving the run never approves a legal change**
- skill proposals and LESSONS.md observations, as accept/decline items
- **if the run ended early: which stage, why, what was attempted**

A terminated run's report is the most useful one to get right — it's the only record of why the pipeline stopped.

Surface the report when the run ends. The human opens it, reviews once, and approves.

## Skills learn from runs — with a gate

Any stage that hits a skill weakness ("plan keeps cutting slices too big") writes a **proposed skill change** — the diff plus one line of why — into `out/skill-proposals/`. Softer observations go as proposals for `skills/<name>/LESSONS.md`, read by that skill on later runs.

**No stage edits a skill directly, including this one.** An agent editing its own instructions mid-run is how a framework quietly rewrites itself into something nobody approved, and a LESSONS.md that anything can append to is a side door into every future run.

Proposals appear in the final report as accept/decline items. Approving one applies the diff to the framework repo, where it reaches every project from then on.
