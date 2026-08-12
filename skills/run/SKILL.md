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

**Blocking never waits.** A failed test, a security finding, an a11y hit — the run fixes it. RULES.md sets the retry limit and the blocking severity threshold for every stage; the run enforces them rather than each stage choosing. After the attempts, the run *ends early* and the report says where and why. Mid-run the pipeline progresses or terminates. It never sits waiting for a human who isn't there.

**The effort ceiling is the only legitimate mid-run halt.** If the slice count blows past the spec's ceiling, the spec was wrong; continuing burns effort on a bad foundation. Stop, report, wait.

**No model names.** Tasks carry tiers; the tier map in this harness's CLAUDE.md or AGENTS.md resolves them.

## Stages

**Plan** — reasoning tier. SPEC.md → tasks.md, feature tier tagged, effort ceiling written back to the spec. Blocking open questions stop here.

**Build** — standard tier. Stage 0 prep, then slices in order, each gated on implement → test → full suite. A failing slice blocks the next; bounded fix attempts, then terminate into the report.

**Review** — reasoning tier, in the other harness where the MCP link exists, otherwise same harness with the fallback noted. User-story test, screenshots, then the five checks in parallel. Blocking findings go back to build for the retry limit.

**Ship** — light tier for copy. Tier × channel fan-out, all channels in parallel, everything into `out/`, unpublished.

Each stage hands the next what it produced, and hands the report what it decided. A stage that ends the run still hands over everything up to that point — a terminated run produces a report, never silence.

## Assembling the final report

Ship writes `out/report.html`, but the run owns what goes in it.

**Report decisions, not activity** — see RULES.md. Nobody needs the list of files touched or commands run; a report that narrates the run buries the two lines that actually needed a human. Order it so a reader who stops after the first section has still seen everything that changes what they do next:

**1 — Needs you.** Whatever the run couldn't settle:

- if the run ended early: which stage, why, what was attempted
- irreversible or genuinely blocked items, as questions
- blocking findings that survived their fix attempts
- **every `@approved` marker added during the run** — the file, the component, and who asked for it. Listed even when a human did ask, because a report filed only when the agent judges it necessary is a report the agent can decide not to file. Unconditional listing is what makes an unrequested marker visible.

**2 — Decided without asking.** The price of not being interrupted:

- every parked decision, with the alternative named
- assumptions made where the spec was silent
- anything invented that nobody asked for
- anything in the existing setup that was changed, and why
- contradictions found between the spec, `context/` and the skills
- **where a stage would argue with the spec it was given** — the spec is approved, not correct, and a run that noticed the difference is the only chance to hear about it before the next feature inherits the same wording

**3 — Findings.** Check results, severity marked, blocking or advisory. One line per check including the clean ones, so a check that never ran is distinguishable from one that found nothing.

**4 — Produced.** What shipped against the spec's acceptance criteria, screenshots per route and viewport, and the collateral in `out/` linked from the manifest.

**5 — Component registry.** From `design-system-guard --registry`: the approved components, then every unmarked component that is imported anywhere with its import count, then a count of the unmarked and unimported. **The whole codebase, not this run's diff** — in a new project the codebase is the backlog, and a component in use since before the framework arrived shows up in no diff. Inventory, not a finding; it doesn't block, and a long first list is expected.

**6 — Approve individually.** Legal amendment drafts from `out/legal/` — **approving the run never approves a legal change** — then skill proposals and LESSONS.md observations, each accept/decline.

A terminated run's report is the most useful one to get right: it's the only record of why the pipeline stopped, and section 1 is the whole report in that case.

Brevity is not a reason to hide a real problem. Default to a few lines per item; when something needs a paragraph, write the paragraph.

Surface the report when the run ends. The human opens it, reviews once, and approves.

## Skills learn from runs — with a gate

Any stage that hits a skill weakness ("plan keeps cutting slices too big") writes a **proposed skill change** — the diff plus one line of why — into `out/skill-proposals/`. Softer observations go as proposals for `skills/<name>/LESSONS.md`, read by that skill on later runs.

**No stage edits a skill directly, including this one.** An agent editing its own instructions mid-run is how a framework quietly rewrites itself into something nobody approved, and a LESSONS.md that anything can append to is a side door into every future run.

Proposals appear in the final report as accept/decline items. Approving one applies the diff to the framework repo, where it reaches every project from then on.
