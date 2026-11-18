# Step 5: Report

Write `work/baseline-<date>/report.md` in the shape in `../references/documents.md`. It's the one document most people will read, so it leads with what changes what they do next. The evidence stays in the area documents.

## Order

1. **Bottom line.** Up to five numbered sentences, in plain words, about what someone can actually do today: "a buyer can pay 0.50 for a 650 deal". The last one says whether anything needs a redesign. That's usually not the case, and it's the most useful thing a worried reader can hear.
2. **The numbers.** Areas audited, findings by severity, checks run, proven, not proven. Then one sentence on why it is or isn't an emergency (for example, "no real users or money yet").
3. **Decisions** from step 2, with their dates.
4. **Critical findings,** as a table: id, finding, proven how.
5. **High findings,** grouped by what they affect, one line each.
6. **Fix order,** from step 4.
7. **What holds,** across all areas.
8. **Not covered:** what needs a signed-in browser, what's out of scope, which areas didn't apply.
9. **How the audit ran.** Anything it touched indirectly (a sandbox event reaching a deployed webhook), test data left on the local database and how to reset it.
10. **Where the evidence is:** each area document with its id ranges, and each proof file.

## Ending

Present the bottom line and the fix order, and point to the report. The next move is the human's: approve stage 0's human-required steps, then `spec this: baseline stage 1`.

Medium and low findings outside any stage stay in the report under their area. They aren't listed again in the handback.

## Done when

`report.md` exists in this order, every id it mentions has evidence in an area document, and the handback names the first stage to run.
