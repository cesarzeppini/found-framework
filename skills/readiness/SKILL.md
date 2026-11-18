---
name: readiness
description: Project-level production readiness, for what no single feature's diff shows. Baseline mode is a one-off full audit of a project coming into Found (inherited, or built in Lovable, Bolt or similar). It maps the codebase, audits it area by area with proofs run against the local stack, and ends with findings and a fix order that Found's pipeline can then build stage by stage. Reasoning tier. Changes nothing on any hosted service, and fixes nothing itself. Only runs when explicitly asked: "run a baseline audit", "audit this project", "readiness baseline".
argument-hint: baseline [--status]
---

# Readiness

The pipeline's checks read one feature's diff. Some things aren't in any diff: a database left open by its platform's defaults before Found arrived, keys nobody has rotated since the first build, a backup nobody has restored. This skill looks at the project as a whole.

Reasoning tier. Read `context/COMPANY.md`, because every severity here is rated against it.

## Modes

| Mode | When | Produces |
|---|---|---|
| **baseline** | Once, when an existing project comes into Found, before its first feature runs | `work/baseline-<date>/`: map, one document per area, report with fix order, proofs in the suite |
| **baseline --status** | After each fix stage merges, or whenever asked | A status section added to every baseline document, from the proofs' results |

## Baseline

**Read the step file at the start of each phase. Work through them in order and don't skip ahead.** Each one assumes the previous one is done.

| Step | File | Produces |
|---|---|---|
| 1 | [`steps/1-map.md`](steps/1-map.md) | `00-map.md`: an inventory, not a verdict |
| 2 | [`steps/2-scope-stop.md`](steps/2-scope-stop.md) | The one stop: intended rules, what counts as unfinished, what's out of scope |
| 3 | [`steps/3-audit-areas.md`](steps/3-audit-areas.md) | One document per area group, findings with ids, proofs |
| 4 | [`steps/4-fix-order.md`](steps/4-fix-order.md) | Fix stages, each small enough for one pipeline run |
| 5 | [`steps/5-report.md`](steps/5-report.md) | `report.md`, and the end of the audit |

`--status` skips all of these and follows [`steps/6-status.md`](steps/6-status.md).

## Standing rules for every step

- **Read-only on every hosted service.** Read settings through the platforms' own command-line tools where they're signed in. Change nothing: no setting, no key, no deploy, no data. Anything only a signed-in browser can show goes in the map's **Not visible from the repository** list.
- **Attacks run against the local stack only,** through proofs: `skills/checks/security-audit/references/proofs.md`, including its sandbox rule. The audit's proofs are written in expected-to-fail form (step 3), so the suite stays green while the holes are open.
- **Fix nothing.** The audit's value is an honest picture of where things stand. A fix made mid-audit hides what was found and skips the fix's own proof. Holes get fixed later, through the pipeline, stage by stage.
- **Ids and statuses** follow `references/finding-ids.md` at the repo root. The scope is `baseline`.
- **Say how far each document goes.** Every document opens with what was read, what was run, and what wasn't seen. A finding marked `read` was never run. A finding marked `proven` was.

## Unmet assumptions

Stop and name the remedy when any of these is missing. Don't work around it:

- `context/COMPANY.md` and `context/STACK.md`, including `stack-profile:`. Without COMPANY.md every severity is a guess. Without the profile, the audit misses the platform's own defaults, which is where Kancha's root cause was.
- A local stack that starts. If it can't, the stop in step 2 offers a read-only audit, with every finding marked `read`. Proceed only on an explicit yes.
- An existing `work/baseline-*/` with open findings. A second baseline over an unfinished first one splits the record. Offer `--status` instead.

## Done when

`report.md` exists with a fix order, every finding has an id, severity, `proven` or `read`, and an area document holding its evidence, every `high` and `critical` has a proof or a stated reason it can't have one, and the suite is green.

The model output is the Kancha audit of November 2026 (13 areas, 90 findings, 61 checks run). `references/documents.md` holds the document shapes it established.
