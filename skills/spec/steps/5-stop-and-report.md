# Step 5 — Stop and report

End by presenting the draft and the question list, and stop. Do not continue into Plan — spec approval is a human stop, and the run skill picks up only once a human has approved.

If the feature is trivial enough that the question list is empty, say so explicitly rather than inventing questions to justify the stop.

## What counts as approval

A hedged reply is not a yes. "Looks good," "sure," "go ahead" — treat these as **not yet approved**: restate the specific thing that still needs confirming ("to confirm: proceed with the draft as shown, including the recommended answers to Q1–Q3?") and wait for an unambiguous reply, the same discipline as the question round itself.

Once given, write it down — don't rely on the conversation remembering it. Add `**Status:** Approved — <date>` as the first line under SPEC.md's title. This is the marker `run` checks before starting (see `skills/run/SKILL.md`'s preconditions); a spec picked up in a later session, or by a different agent, is approved because the file says so, not because someone recalls a chat from last week. If the draft changes after this line is added — a revision, a new answer — remove the line; it's re-added only after the human confirms the revised draft.

Alongside the draft, **report decisions, not activity** (RULES.md). Not which files you read — briefly:

- which overrides you drafted, and the risk each one answers
- what you derived but weren't certain of, which should already be in Assumptions
- **contradictions found between context files** — COMPANY.md describing two people while PRODUCT.md implies enterprise scale is the kind of thing only spec work surfaces, and it invalidates far more than this feature. Includes the diff's own vocabulary: a term the codebase uses one way while GLOSSARY.md defines it another, or a choice this spec is about to make that a standing `docs/adr/` entry already ruled on
- **glossary terms added or resolved this round** — new or contested terms drafted into GLOSSARY.md's canonical form, so approving the spec also confirms the vocabulary rather than silently changing it
- where you'd argue with the request itself: a feature whose stated intent doesn't match what was asked for is cheapest to challenge here, before a plan is cut against it
