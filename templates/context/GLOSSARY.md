# Glossary

This project's domain language — the words that mean something specific here, not general programming vocabulary. Spec uses these terms so acceptance criteria read the way the team actually talks; Build uses them for naming; Review checks the diff against them for drift.

> **Living file.** Starts sparse — most projects begin with only a handful of terms worth pinning down. Grows as Spec resolves a new or contested term into the draft; it is never a separate interruption; see `skills/spec/steps/5-stop-and-report.md`.

## Language `[ask]`

One entry per term:

```md
**Order**
A request from a customer for one or more products, from placement to fulfillment.
_Avoid_: purchase, transaction — both are used loosely elsewhere in the codebase for this.
```

**Be opinionated.** When several words already exist for the same concept, pick the one that wins and name the others under `_Avoid_`. A glossary that lists five synonyms as equally valid isn't a decision, it's a shrug.

**Keep it tight.** One or two sentences. State what the thing *is*, not what it does or how it's implemented — behaviour belongs in SPEC.md, implementation in the task package.

**Only terms specific to this project.** A general programming concept — timeout, cache, retry — doesn't belong here even if the codebase leans on it constantly. Before adding a term, ask: would a new engineer need this defined to understand *this* domain, or would they need it defined to understand programming? Only the former qualifies.

**Group under subheadings** once natural clusters appear — a marketplace project might split Ordering, Fulfillment, Billing. A flat list is correct until that split earns itself; don't impose structure the project hasn't grown into.

> **Decisions live elsewhere.** Architectural and domain calls this project has made — hard to reverse, surprising without the context, the result of a real trade-off — are recorded as ADRs in `docs/adr/` in the project repo, not in this file. This file is the glossary only. See `templates/ADR-FORMAT.md` for the format and the three-part test for when one is warranted. `docs/adr/` is created lazily: the directory doesn't exist until the first decision needs it.
