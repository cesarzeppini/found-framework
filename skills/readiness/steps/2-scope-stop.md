# Step 2: The scope stop

The baseline audit's one stop before the work. Some findings depend on what the product is *meant* to do, and only a human knows that. At Kancha, "offers are readable by everyone" was medium until Cesar said sellers must never see each other's prices. Then it became high. Asking once, here, is cheaper than rating ninety findings against a guess.

## What to present

Show the map's **Shape** and **To check** sections in brief. Then show numbered proposals, each with a recommended answer, in the format of `skills/spec/steps/4-check-and-present.md`. Never a bare question.

1. **Intended rules** the map raised and the code can't settle: who may see what (other users' offers, profiles, locations), what deleting an account does to records the other party relies on, who sets a trust signal such as a verified badge.
2. **Known unfinished work.** Parts that are absent on purpose, such as payouts not built yet. These get flagged as `not built` rather than rated as defects, so the report doesn't bury real holes under planned work.
3. **Out of scope.** Parked apps, legacy code. Each one is listed in the report under **Not covered**.
4. **Areas that don't apply.** No payments means no Money area. Write that down. It isn't skipped silently.
5. **Proofs.** Whether the local stack runs. If it doesn't, offer a read-only audit with every finding marked `read`, and recommend fixing the stack first.
6. **Sandboxes.** For every third party the proofs would touch: is there a sandbox with no deployed webhooks pointing at it? If not, those proofs are parked (`proofs.md`).

## The stop

Wait for explicit answers. Record them in the map under **Decisions**, with the date. Each decision is cited by the findings it changes.

A decision made later, mid-audit, goes in the same table with its own date. It isn't a reason to stop again: when an area raises something new, take the reversible reading, mark the finding `pending decision`, and carry it to the report. That's park, don't ask, applied here.

## Done when

Every numbered proposal has an answer recorded, or is marked `pending decision` with the reading used meanwhile.

→ Next: `3-audit-areas.md`
