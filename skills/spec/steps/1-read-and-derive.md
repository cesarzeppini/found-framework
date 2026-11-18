# Step 1 — Read and derive

1. Read `context/` — all of it. COMPANY.md and STACK.md especially: they decide how much the spec has to raise. GLOSSARY.md sets the vocabulary the draft is written in.
2. Read the codebase for the conventions the feature will inherit — routes, auth patterns, existing empty/loading/error treatments, the data model.
3. Read `docs/adr/` for decisions already made in the area this feature touches, if the directory exists. A spec that contradicts a standing ADR without saying so is a spec that will surprise whoever wrote it.
4. **A baseline fix stage** ("spec this: baseline stage 3") starts from that stage in `work/baseline-<date>/report.md`. Its *what changes* lines are the behaviour, its proofs are the acceptance criteria, and its decisions are already made. Draft from them, and only ask about what the stage leaves open.

## Vocabulary

A term this feature needs that GLOSSARY.md doesn't have, or that the codebase uses differently than GLOSSARY.md defines it, is handled the same way as everything else in the derive/draft/ask split below — **never a separate interruption.** Draft the canonical term into the spec the way any other section gets drafted, and note the addition or the conflict in the stop-and-report handback (`steps/5-stop-and-report.md`) so approving the spec also confirms the glossary. Only ask outright if the term is genuinely ambiguous between two real meanings — the same bar as everything else in "actually ask," below.

## Three buckets

Not a questionnaire. Only one bucket involves asking.

**Derive silently.** Affected screens, data model, permissions, prerequisites, and the project's existing conventions for empty / loading / error states. In a mature codebase these are already true in the code, and asking would be theatre. In a fresh project they come from `context/STACK.md`.

**Draft, and let the human correct.** Acceptance criteria, edge cases, user-facing copy, out of scope, data rules, rollout. Reading a draft and striking three lines beats answering six questions. Most of the spec's volume lives here.

**Actually ask.** Only where derivation is impossible *and* being wrong is expensive: why now and what changes for the user, the success metric, and anything genuinely blocking.

**Every asked item arrives as a numbered proposal with a recommended answer, never as a bare open question** — see `steps/4-check-and-present.md` for the exact format. A human is far better at editing a proposal than generating one from nothing, and a bare question makes them do the work the spec skill exists to do. Only leave a question genuinely open when no defensible default exists — and if that happens often, the gap is usually in `context/`.

What keeps the question list short is the assumptions section. Anything derived but uncertain goes there as a stated assumption instead of becoming a question. Doubt gets written down rather than interrupting.

## What STACK.md removes

STACK.md changes what has to be asked at all. If Supabase Auth is already in place, "session handling must be production-grade" is satisfied by default and this skill shouldn't raise it as an override.

→ Next: `steps/2-draft-sections.md`
