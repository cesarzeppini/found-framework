---
name: readiness-audit
description: Checks whether a project is ready for production, then fixes it phase by phase with the human's go-ahead. Starts from a fixed checklist plus a best-practices search, maps the codebase to find what else needs auditing, plans in phases, and ends with a short markdown checklist of what's done and what's open. Runs when asked ("readiness audit", "is this ready for production"). It's also offered, never started on its own, when there are signs the project is heading to production.
---

# Readiness audit

Reasoning tier. Outside the pipeline.

## How to talk

- **Never assume. Ask.** Ask before mapping, before planning, and before each phase, whenever something is unclear. Each question comes with a recommended answer.
- **Keep it short.** Explanations take a few lines. Reports say what went well and what didn't, without repeating what was built.

## Steps

1. **Ask first.** Confirm scope, environments, anything off-limits, and whether a local stack is available for proofs.
2. **Research.** Start from `references/checklist.md`. Then search current best practices for this project's stack and type, and add any items that apply.
3. **Map.** Read the whole codebase and work out what actually needs auditing: data, entry points, auth, money, files, third parties, environments, and anything else that's there. Each checklist item gets marked as applies or doesn't apply, with a one-line reason.
4. **Ask again.** Anything the map couldn't settle, like intended rules or unfinished work.
5. **Plan.** Group the findings into phases, most dangerous first. Write `work/readiness-<date>/plan.md`, then present it briefly.
6. **Each phase.**
   - Before starting: explain the task in a few lines, ask any questions, and wait for "go phase N".
   - Build it.
   - Afterwards: a short report of what went well and what didn't.
7. **Finish.** Write `work/readiness-<date>/report.md`: a brief checklist of what's done and what's left open, each with one line. Present it in chat.

## Rules

- **Read-only on hosted services.** Read settings through the platforms' own tools. Change nothing there. Anything that needs a dashboard becomes a step for a person, with exact instructions.
- **Proofs.** Every serious finding gets a proof that runs locally: `skills/checks/security-audit/references/proofs.md`. Write it expected-to-fail during the audit. The fixing phase removes the marker first, then fixes until the proof passes.
- **Ids.** Each finding gets an id: `references/finding-ids.md` at the repo root.
- **Each finding says `proven` or `read`,** so it's clear which ones were actually run.

## When to offer it

Offer it once, with one line, without starting it, when there are signs of going to production: a production deploy config appears, a custom domain or live payment keys are added, someone talks about launch or real users, or a milestone feature finishes. If the answer is no, don't offer it again for the same signal.
