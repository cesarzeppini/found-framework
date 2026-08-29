---
name: spec
description: Writes work/<feature>/SPEC.md from context/ and the codebase, then stops for human approval — the first of the pipeline's two human stops. Reasoning tier. Derives what the codebase already answers, drafts what a human can correct faster than they can dictate, and asks only where being wrong is expensive. Triggers only for larger work — a new feature, module, or anything spanning multiple screens/files with real acceptance criteria — not small tweaks, one-off fixes, or copy changes. Those get built directly, no spec. Explicit ask ("spec this," "run found on this") always applies regardless of size.
---

# Spec

Turn a described feature into `work/<feature>/SPEC.md`. Reasoning tier.

This is the first of the pipeline's two human stops. Everything downstream — slices, tests, screenshots, collateral — inherits this file's quality. A vague spec doesn't fail here; it fails in review, after the effort is spent.

## Steps

**Read the step file at the start of each phase. Work through them in order and don't skip ahead** — each one assumes the previous is done.

| Step | File | Produces |
|---|---|---|
| 1 | [`steps/1-read-and-derive.md`](steps/1-read-and-derive.md) | context and codebase read; what to derive, draft, ask |
| 2 | [`steps/2-draft-sections.md`](steps/2-draft-sections.md) | the full draft, every section |
| 3 | [`steps/3-overrides.md`](steps/3-overrides.md) | overrides, as bars rather than solutions |
| 4 | [`steps/4-check-and-present.md`](steps/4-check-and-present.md) | code-free check, detection line, questions, revision |
| 5 | [`steps/5-stop-and-report.md`](steps/5-stop-and-report.md) | the stop, and what to hand back |

## Hard rule: no code in the spec

Applies to every step.

No snippets, no fenced code blocks, no library names, no type or schema definitions, no implementation suggestions. Intent, behaviour and constraints only.

The spec is about what matters for the company and the user. The *how* belongs to the task package the builder receives. `scripts/spec-no-code.mjs` enforces the mechanical half — run it before presenting the spec, and wire it as a post-edit hook if the harness supports one.

**The test for whether a sentence belongs here:** if removing it changes *what counts as done*, it is a constraint and it belongs in the spec. If it only changes *how it is done*, it is implementation and it belongs in the task package.

Naming a library is the most common breach, and it usually arrives disguised as a constraint. "Use Supabase Auth" is implementation. "Session handling must be production-grade, not hand-rolled" is the constraint underneath it — write that instead, and let the builder pick what clears the bar.

**The depth limit: naming the stack and naming the providers is allowed; anything more specific is implementation.** The spec may say the project runs on Supabase and that invitations go out through a transactional email provider — the builder needs to know what it's building against. It may not name the client library, the method, the table or the option. Stack and providers are facts about the ground; everything below them is a choice the builder makes.
