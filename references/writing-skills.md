# Writing skills

The house style for every `SKILL.md`, `steps/*.md`, `references/*.md` and context template in this repo — followed whether a skill is hand-edited or regenerated from ARCHITECTURE.md (Build order, step 2). Two skills that read like they came from different authors is the failure this exists to prevent.

Adapted from Matt Pocock's [`writing-for-agents`](https://github.com/mattpocock/skills) skill, cut to what this repo actually needs — its invocation-choice mechanics don't apply here, since every skill in `skills/` is reachable both by name and by the `run` orchestrator, not split into user-invoked vs. model-invoked.

## The two loads

Every document spends one of two budgets. **Context load** is what an always-loaded thing costs — a `SKILL.md` description, a line in RULES.md — spent on every turn whether or not it fires. **Cognitive load** is the cost on the human deciding which of several files to reach for. Found already keeps context load low by design: `run` is the one thing a human has to remember, and it dispatches everything else. Don't undo that by writing a check or step description longer than the branch it triggers needs.

## Information hierarchy

Three tiers, ranked by how immediately the material is needed:

1. **In-file step or rule** — what the skill does or requires, read on every invocation.
2. **In-file reference** — definitions and thresholds consulted on demand, fine as a flat list within the file (RULES.md's severity table, a check's report format).
3. **Disclosed reference** — pushed into a sibling file, reached only when that branch fires.

Found already applies this at tier 3 without naming it: `spec/steps/*.md` (one file per phase, each naming the next) and `checks/*/references/*.md` (design-system-guard's allowlist, build's `good-tests.md` and `diagnosing-failures.md`) are both the disclosure move — push out what only some branches need, keep the index legible. The test before adding a new disclosed file: does *every* invocation need this, or only some? If every invocation needs it, it belongs in the `SKILL.md` itself; splitting it out would just add a hop.

**Sprawl** is the failure mode at every tier: a file long enough that attention thins across it even though every line is live. The fix is always the same — disclose by branch, not compress the prose.

## Leading words

A leading word is a plain-language term reused verbatim so it accumulates one fixed meaning across the whole repo, instead of being re-explained at each site: **seam**, **park**, **blocking**, **tier**, **advisory**. When a skill needs the same idea a leading word already carries elsewhere in this repo, reuse the word — don't paraphrase it into new prose that means the same thing. A newly coined term pays its definition in tokens every place it appears; a reused one pays once.

## Steer positive, not negative

A prohibition drags the forbidden behaviour into view and makes it more available, not less — "don't skip the test" half-reads as a reminder that skipping is an option. State the target behaviour instead: "write the test, then run the full suite" needs no companion sentence about what happens if you don't. Reach for a hard "never" only as a genuine guardrail (RULES.md's "never weaken a control to make the check pass" is a real one), and even there, pair it with the positive instruction so attention lands on what to do.

## No-op pruning

Before a sentence goes into a skill, check whether it changes behaviour or just restates what the model would already do. "Be careful" and "make sure it's correct" are no-ops — they cost tokens on every read and move nothing. A sentence that fails this test gets deleted whole, not trimmed to a shorter no-op.

## Completion criteria

Every step needs a condition an agent can check itself against, not a vague sense of being done. "Every acceptance criterion traced to a slice" is checkable; "the plan looks complete" is not. Found's existing gates are the right shape — a slice's test-then-full-suite gate, a blocking check's severity threshold, spec's one-round rule — keep new steps to that same standard: state the check, not the feeling.

## Where this doesn't apply

Router skills, disclosed reference split by *invocation choice*, and the user-invoked/model-invoked distinction are all part of the original skill but don't map onto this repo's shape — Found has one orchestrator and a fixed pipeline, not a growing shelf of standalone commands a human has to remember to reach for. Don't import that machinery here; if this repo ever grows a second, unrelated pipeline, revisit then.
