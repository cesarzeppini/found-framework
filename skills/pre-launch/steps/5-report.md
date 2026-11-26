# Step 5: Report

Write `work/pre-launch-<date>/report.md` in the shape in `../references/documents.md`. It's the document most people will read, often someone who owns the risk but isn't technical, so it leads with what changes what they do next. The evidence stays in the group documents.

## Order

1. **Bottom line.** Up to five numbered sentences, in plain words, on what someone can actually do today: "a buyer can pay 0.50 for a 650 order". The last one says whether anything needs a redesign. Usually nothing does, and that's the most useful thing a worried reader can hear.
2. **The numbers.** Areas audited and not applying, findings by severity, proofs run, proven, not proven. One sentence on urgency, from the stage and scale ("no real users or money yet").
3. **Product decisions.** The answers from step 2 with their dates, then the open product decisions, kept apart from the bugs.
4. **Findings, ranked by severity.** Critical first, then high, medium, low. Each one line: id, what someone can do, `proven` or `read`, the proof's path, and the fix someone else should make.
5. **Fix packages,** from step 4.
6. **Dashboard list:** service, page, setting, finding id.
7. **What holds,** across all areas.
8. **Opinion.** The maintainability area's advice on whether the structure fits where the product is going. Advice for the owner, not a verdict.
9. **Not covered:** areas that didn't apply and why, what's out of scope, what needs a signed-in dashboard, and the areas the checklist doesn't have yet (SEO, native mobile; accessibility unless `skills/checks/a11y` ran).
10. **How the audit ran.** The research date and sources, anything touched indirectly (a sandbox event reaching a webhook), test data left on the local stack and how to reset it.
11. **Where the evidence is:** each group document with its id ranges, and the proofs folder.

## Ending

Present the bottom line, the critical and high findings, and the first package in chat, and point to the report. The next move is the human's: the dashboard list and package 0, then the first package in a build session.

## Done when

`report.md` exists in this order, every id it mentions has evidence in a group document, every finding has a fix, and the handback names the first package.
