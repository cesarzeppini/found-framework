---
name: pre-launch
description: Audits a whole product before launch, area by area, against a tagged checklist of 25 areas (access, money, secrets, the build process, integrations, privacy, legal, maintainability and more). Asks which tags apply and skips the rest, maps the product, then works through the areas in gated groups, waiting for "go" between them. Reads and proves only; every finding gets a proof a separate build session uses as its acceptance test. Ends with a ranked report, fix packages and the list of dashboard settings only account owners can change. Reasoning tier. Runs when asked ("pre-launch audit", "is this ready to launch"), and is offered, never started, at signs of production.
argument-hint: "[--status]"
---

# Pre-launch

The pipeline's checks read one feature's diff. Some things are in no diff: a database left open by its platform's defaults, a key nobody rotated, a backup nobody restored, a DNS record pointing at a service the product stopped using. This skill looks at the product as a whole, once, before real users and real money arrive.

Reasoning tier. Outside the pipeline.

## Modes

| Mode | When | Produces |
|---|---|---|
| **audit** | Before a launch, or when a project comes into Found | `work/pre-launch-<date>/`: map, one document per area group, proofs, report |
| **--status** | After a fix package merges, or when asked | A dated status section on every audit document, from the proofs' results |

## Audit

**Read the step file at the start of each step, and work through them in order.** Each one assumes the previous one is done.

| Step | File | Ends with |
|---|---|---|
| 1 | [`steps/1-ask-and-tag.md`](steps/1-ask-and-tag.md) | Tags, stage and scale, research. Wait for answers |
| 2 | [`steps/2-map-and-decide.md`](steps/2-map-and-decide.md) | `00-map.md` and the product decisions. Wait for "go" |
| 3 | [`steps/3-areas.md`](steps/3-areas.md) | One document per group. Wait for "go" after each group |
| 4 | [`steps/4-fix-packages.md`](steps/4-fix-packages.md) | Fix packages and the dashboard list |
| 5 | [`steps/5-report.md`](steps/5-report.md) | `report.md`, presented in chat |

`--status` skips all of these and follows [`steps/6-status.md`](steps/6-status.md).

## Standing rules for every step

- **Read and prove, never fix.** The audit's value is an honest picture of where things stand. A fix made mid-audit hides what was found and skips its own proof. Fixes go to a separate build session, package by package, each starting from its proofs.
- **Ask, never assume.** Every question comes with a recommended answer. A bare question makes the human do the thinking twice.
- **Wait for "go" at every gate.** A hedged reply ("looks fine") is not a go; restate what needs a yes and wait.
- **Read-only on every hosted service.** Read settings through the platforms' own tools where they're signed in. Change nothing: no setting, key, deploy or data. What only a dashboard shows goes on the map's **Dashboard only** list, and from there to the report's dashboard list.
- **Every finding gets a proof,** a script or a query that prints `PROVEN` or `NOT PROVEN`, or a stated reason it can't have one (a backup never restored, a dashboard setting). Attacks run on the local stack only. [`references/proofs.md`](references/proofs.md).
- **Ids** follow `references/finding-ids.md` at the repo root, with each area's prefix and the scope `pre-launch`. **Each finding says `proven` or `read`.**
- **Report decisions, not activity** (RULES.md). Brief reports at each gate: what was found and what holds, not the files walked.

## The checklist

[`references/tags.md`](references/tags.md) holds the tags and the eight groups. Each area is one file in [`references/areas/`](references/areas/), read only when its group runs. Every item carries tags; items tagged out are skipped with a one-line reason.

The areas lean on the review checks rather than repeating them: security-audit's method for access and input, compliance's mapping from data to legal documents, code-quality's `/code-review` and its guard-the-bar moves, and a11y's browser pass. Each area file names what it reuses.

## Unmet assumptions

Stop and name the remedy when any of these holds:

- **No local stack that starts.** Offer a read-only audit with every finding marked `read`, and recommend fixing the stack first. Proceed only on an explicit yes.
- **An existing `work/pre-launch-*/` with open findings.** A second audit over an unfinished first splits the record. Offer `--status` instead.

## Done when

`report.md` exists in the order step 5 gives. Every finding has an id, a severity, `proven` or `read`, a proof or a stated reason it can't have one, and the fix someone else should make. Every area is audited or marked as not applying with its reason.

## When to offer it

Offer it once, in one line, without starting it, at signs of production: a production deploy config appears, a custom domain or live payment keys are added, someone talks about launch or real users, or a milestone feature finishes. If the answer is no, don't offer it again for the same signal.
