---
name: spec
description: Writes work/<feature>/SPEC.md from context/ and the codebase, then stops for human approval — the first of the pipeline's two human stops. Reasoning tier. Derives what the codebase already answers, drafts what a human can correct faster than they can dictate, and asks only where being wrong is expensive. Triggers when a new feature is described and no approved spec exists yet.
---

# Spec

Turn a described feature into `work/<feature>/SPEC.md`. Reasoning tier.

This is the first of the pipeline's two human stops. Everything downstream — slices, tests, screenshots, collateral — inherits this file's quality. A vague spec doesn't fail here; it fails in review, after the effort is spent.

## Hard rule: no code in the spec

No snippets, no fenced code blocks, no library names, no type or schema definitions, no implementation suggestions. Intent, behaviour and constraints only.

The spec is about what matters for the company and the user. The *how* belongs to the task package the builder receives. `scripts/spec-no-code.mjs` enforces the mechanical half — run it before presenting the spec, and wire it as a post-edit hook if the harness supports one.

**The test for whether a sentence belongs here:** if removing it changes *what counts as done*, it is a constraint and it belongs in the spec. If it only changes *how it is done*, it is implementation and it belongs in the task package.

Naming a library is the most common breach, and it usually arrives disguised as a constraint. "Use Supabase Auth" is implementation. "Session handling must be production-grade, not hand-rolled" is the constraint underneath it — write that instead, and let the builder pick what clears the bar.

## Three buckets

Not a questionnaire. Only one bucket involves asking.

**Derive silently.** Affected screens, data model, permissions, prerequisites, and the project's existing conventions for empty / loading / error states. In a mature codebase these are already true in the code, and asking would be theatre. In a fresh project they come from `context/STACK.md`.

**Draft, and let the human correct.** Acceptance criteria, edge cases, user-facing copy, out of scope, data rules, rollout. Reading a draft and striking three lines beats answering six questions. Most of the spec's volume lives here.

**Actually ask.** Only where derivation is impossible *and* being wrong is expensive: why now and what changes for the user, the success metric, and anything genuinely blocking.

What keeps the question list short is the assumptions section. Anything derived but uncertain goes there as a stated assumption instead of becoming a question. Doubt gets written down rather than interrupting.

## Flow

1. Read `context/` — all of it. COMPANY.md and STACK.md especially: they decide how much the spec has to raise.
2. Read the codebase for the conventions the feature will inherit — routes, auth patterns, existing empty/loading/error treatments, the data model.
3. Write the **full draft**, every section, assumptions included.
4. Run `scripts/spec-no-code.mjs` and clear any hits.
5. Present the draft with a **short list of real questions** — the "actually ask" bucket only.
6. Revise against the answers.

**One round of questions, not twenty.** If a second round feels necessary, the missing thing almost always belongs in assumptions instead.

STACK.md changes what has to be asked at all. If Supabase Auth is already in place, "session handling must be production-grade" is satisfied by default and this skill shouldn't raise it as an override.

## Sections

Write all of these, in this order.

**Intent** — what changes for the user, and why now. *Asked.*

**Acceptance criteria** — user-observable statements: "a signed-out visitor who submits the form sees a confirmation and receives an email." This is what the end-of-feature user-story test runs against and what Plan slices against. Without it, nothing defines what the test checks. *Drafted.*

**States and edge cases** — empty, loading, error, permission-denied, offline, first-run, too-much-data. The largest single source of features that end up 80% built: if the spec doesn't list them, the builder ships the happy path. *Drafted, using the project's existing conventions.*

**User-facing copy** — button labels, empty state text, error messages, confirmation wording. Copy is spec-level because it is behaviour, not implementation. If it isn't here the builder invents it, and voice-guard ends up arguing with something already shipped. *Drafted.*

**Data model** — entities, relationships, what each field means, what is required. In prose. No SQL and no type definitions — the code-free rule holds — but the builder needs it and it isn't implementation. *Derived where a schema exists.*

**Permissions** — who can see it, who can do it, and what happens when someone who can't tries. *Derived from existing auth patterns.*

**Affected screens** — the real route paths this feature touches. Doubles as the screenshot capture list in Review, so the paths must be real. *Derived.*

**Prerequisites** — third-party accounts, API keys, external dependencies that must exist before work starts. *Derived.*

**Rollout** — feature flag or not, migration order, how to reverse it. *Drafted.*

**Assumptions** — what is being taken as true without checking. Stated so they can be wrong out loud rather than silently. This is the escape valve that keeps the question list short. *Derived.*

**Open questions** — unresolved items, each marked blocking or non-blocking. Blocking ones stop Plan. *Mixed.*

**Success metric** — how you'll know it worked after it ships. Also the ceiling on what Ship's collateral is allowed to claim. *Asked.*

**Constraints** — five sub-sections:

- *Out of scope* — explicit non-goals. The most valuable lines in the file; without them the pipeline helpfully builds three adjacent things nobody asked for. *Drafted.*
- *Overrides* — where minimum-viable is dangerous. See below. *Drafted.*
- *Security surface* — what this feature touches: new tables, new endpoints, auth changes, user input, file uploads, third-party keys. Not checks, just surface — security-audit reads this. *Derived.*
- *Data rules* — what must not be lost, whether migrations must be reversible. *Drafted.*
- *Effort ceiling* — the only legitimate mid-run halt. Filled from the plan's slice estimate once Plan runs; leave it stated as "to be set by Plan" in the approved spec. *Drafted from the plan's estimate.*

## Overrides

The minimum-viable rule is overridable, but only with a stated reason, and the decision is recorded once — here.

It can't be decided before the spec: nobody knows what needs hardening until the feature is on the table, and auth only matters once the feature is known to touch accounts. So draft the overrides here, judged against COMPANY.md, PRODUCT.md and STACK.md, and let them arrive as part of the spec under review. Wrong ones get struck, missing ones added. **Never a separate interruption.**

It can't be left to the builders either — they run in isolated contexts, so each would decide separately and none of the reasoning would be written down.

Write overrides as **bars, not solutions**. The spec sets the bar; the builder picks what clears it.

Sanity-check the drafted overrides with a reasoning-tier pass before presenting: each one should name a real risk from COMPANY.md or the security surface, not a general preference for robustness. Anything not listed as an override is minimum-viable by default.

## Stopping

End by presenting the draft and the question list, and stop. Do not continue into Plan — spec approval is a human stop, and the run skill picks up only once a human has approved.

If the feature is trivial enough that the question list is empty, say so explicitly rather than inventing questions to justify the stop.
