# Diagnosing a failing slice

Reference for "when a slice won't pass" in [`SKILL.md`](../SKILL.md). RULES.md gives three fix attempts before a blocking failure ends the run. Three attempts spent re-running the same guess is three attempts wasted — this is how to spend them so each one actually narrows things down, without turning the bounded retry loop into the open-ended human-in-the-loop debugging session it deliberately isn't.

## Redact first

If the failure output could carry a secret — an auth header, a token, a connection string — replace it with `<REDACTED>` before it goes anywhere, including the eventual report. The finding survives redaction; the credential doesn't need to appear anywhere for the loop to work.

## Before spending an attempt: confirm and minimise

Don't fix against the first failure seen. Re-run the failing test alone to confirm it's real and not flaked, then look at whether it can be pinned to a smaller case — fewer inputs, a narrower fixture, one fewer step. This costs no attempt (it's reading, not changing code) and it shrinks what the three attempts have to consider. Skip minimising only when the failure is already as small as it can be — a single assertion on a single input.

## Rank hypotheses before touching code

Before the first fix attempt, write down **3–5 ranked, falsifiable hypotheses** for the cause. Falsifiable means each one states a prediction: "if X is the cause, changing Y will make the failure disappear." A hypothesis that can't be stated this way is a guess wearing a hypothesis's clothes — sharpen it or drop it.

Generating several before testing any of them matters more here than in an interactive session: there's no user to catch a wrong ranking mid-loop, so the ranking has to be right going in, and the report at the end is the only place anyone sees whether it was.

## Each attempt tests one hypothesis, not one guess

Spend each of the three attempts on the next-ranked untested hypothesis, not on repeating the last change with a small variation. If an attempt's result rules a hypothesis out, that's real progress even though the suite is still red — say so in the slice result, don't let it look identical to an attempt that changed nothing.

**Instrumentation, if needed, is targeted and tagged.** One well-placed check at the point that would distinguish two hypotheses beats logging everything and reading through it after. Tag anything temporary (`[DEBUG-<slice-id>]` or similar) so it's a single grep to confirm none of it survives into the passing slice.

**Never weaken the test to make it pass.** If the fix under consideration is actually loosening the assertion, deleting a case, or catching an error the test meant to surface, that's not attempt N succeeding — it's the check being defeated. The slice is still failing; report it as such.

## When it passes

Confirm the fix addresses the hypothesis, not just that the suite went green — a change unrelated to the real cause can coincidentally clear a flaky assertion. Re-run the full suite as the slice loop already requires, and strip every tagged instrumentation line before moving to the next slice.

## When the three attempts are spent and it's still red

End the run, per RULES.md. The report carries more than "the last error" — it's the only artefact anyone will have for why this stopped:

- the ranked hypotheses, in order
- which ones the three attempts tested, and what each result actually showed (ruled out / inconclusive / made it worse)
- the untested hypotheses that remain, if the ranking outlived the attempts
- the last error, in full

A report that only states the final error and not what was already ruled out sends the next session back to hypothesis one.
