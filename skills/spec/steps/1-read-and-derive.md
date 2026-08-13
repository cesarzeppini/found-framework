# Step 1 — Read and derive

1. Read `context/` — all of it. COMPANY.md and STACK.md especially: they decide how much the spec has to raise.
2. Read the codebase for the conventions the feature will inherit — routes, auth patterns, existing empty/loading/error treatments, the data model.

## Three buckets

Not a questionnaire. Only one bucket involves asking.

**Derive silently.** Affected screens, data model, permissions, prerequisites, and the project's existing conventions for empty / loading / error states. In a mature codebase these are already true in the code, and asking would be theatre. In a fresh project they come from `context/STACK.md`.

**Draft, and let the human correct.** Acceptance criteria, edge cases, user-facing copy, out of scope, data rules, rollout. Reading a draft and striking three lines beats answering six questions. Most of the spec's volume lives here.

**Actually ask.** Only where derivation is impossible *and* being wrong is expensive: why now and what changes for the user, the success metric, and anything genuinely blocking.

**Every asked item arrives as a proposal with its reasoning, never as an open question.** Not "what's the success metric?" but "success metric: activation rate at 7 days, because PRODUCT.md frames this as an onboarding problem and that's the first number it would move — confirm or change." A human is far better at editing a proposal than generating one from nothing, and a bare question makes them do the work the spec skill exists to do. Only ask open when no defensible default exists — and if that happens often, the gap is usually in `context/`.

What keeps the question list short is the assumptions section. Anything derived but uncertain goes there as a stated assumption instead of becoming a question. Doubt gets written down rather than interrupting.

## What STACK.md removes

STACK.md changes what has to be asked at all. If Supabase Auth is already in place, "session handling must be production-grade" is satisfied by default and this skill shouldn't raise it as an override.

→ Next: `steps/2-draft-sections.md`
