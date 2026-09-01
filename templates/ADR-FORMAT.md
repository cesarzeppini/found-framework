# ADR format

Architecture decision records for a project. Referenced from `context/GLOSSARY.md`; live in the project repo at `docs/adr/`, not in `context/` — a decision is a record of the past, not a standing fact the pipeline recalibrates against.

`docs/adr/` is created lazily: the directory and the numbering both start when the first decision actually needs recording.

## Template

```md
# {Short title of the decision}

{One to three sentences: the context, what was decided, and why.}
```

That's it. An ADR can be a single paragraph. The value is in recording *that* a decision was made and *why*, not in filling out sections. Add **Considered options** or **Consequences** only when the rejected alternatives or the downstream effects are themselves worth remembering — most ADRs won't need either.

## Numbering

`docs/adr/0001-slug.md`, `0002-slug.md`, sequential. Scan for the highest existing number and increment.

## When to write one

All three must be true:

1. **Hard to reverse.** The cost of changing this later is real.
2. **Surprising without context.** A future reader — human or agent — will look at the code and wonder why it was done this way.
3. **The result of a real trade-off.** Genuine alternatives existed and one was picked for specific reasons.

Skip it if any one is missing: an easily reversed choice will just get reversed, an unsurprising one draws no question, and a choice with no real alternative has nothing to record beyond "did the obvious thing."

**What qualifies:** architectural shape (event-sourced vs. CRUD, monorepo vs. not), a technology choice that carries lock-in (database, auth provider, deploy target — not every library, only the ones a quarter of work would be needed to swap), a deliberate deviation from the obvious path ("hand-rolled instead of the ORM because X" — stops the next pass from "fixing" something that was intentional), a constraint invisible in the code (a compliance rule, a partner contract's latency ceiling), or a rejected alternative whose rejection isn't obvious from the code alone.

## Before writing it: one fresh-context check

An ADR only gets written for a decision that's already hard to reverse — which is exactly the class of call where the session that made it is the worst-placed to judge whether it's right, having just talked itself into it. Before writing the file, spawn **one** separate subagent to try to find a problem with the decision, and only proceed straight to writing when that returns nothing real. This is a single check, not a loop — it isn't `doubt-driven-development`'s multi-round, cross-model ceremony; one pass is what the cost is worth here, since ADR-worthy calls are already rare by the three-part test.

Hand the subagent the **decision and the constraints it has to satisfy** — not the reasoning that produced it. Pasting your own justification biases it toward agreeing with you; a fresh read of "here's what's being decided and what it has to hold true" is what makes the check worth running. Prompt it to find problems, not to confirm the decision is fine — "assume this might be wrong, look for what would make it wrong" reliably produces sharper answers than "does this look OK."

Treat what comes back as one input, not a verdict: a real, specific problem means reconsider the decision before writing the ADR; a vague or generic objection ("consider edge cases") isn't a finding and doesn't block writing. If the harness can't spawn an isolated subagent in this context, skip the check, write the ADR anyway, and say in the report that it went out without the check rather than silently treating a same-session self-review as equivalent.

## Who writes one, and who reads it

**Build** writes one during Stage 0 when a prep task makes a call that fits the three-part test — the same moment `context/GLOSSARY.md` gets a new term, if the decision also coins one. **Plan** writes one when slicing surfaces a hard-to-reverse architectural choice the spec didn't settle. Neither happens mid-slice: a slice implements, it doesn't decide the shape it's implemented in.

**Spec, Plan, Build and Review all read `docs/adr/`** for the area they're touching, same as they read `context/`. A spec, slice, or diff that contradicts a standing ADR is a finding, not a silent override — Review's "contradictions found between the spec, context/ and the skills" line (RULES.md) covers a contradiction with a recorded decision exactly as it covers one between context files.

An ADR is never revised to match a later decision that reverses it. Record the new decision as a new ADR and mark the old one superseded, so the history of *why* stays intact rather than being overwritten into a document that always agreed with the present.
