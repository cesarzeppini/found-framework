# Step 3: Audit the areas

Work through the groups in `../references/tags.md`, in order, worst damage first. One group per gate.

## Each group

1. **Before.** In a few lines: which areas this group covers, which items are tagged out and why, and anything from the map's **To check** list that lands here. Ask any question the group raises, with a recommended answer.
2. **Read, then prove.** Open each area file in `../references/areas/` for this group. For every item that applies: read the code to find candidates, then try it, signed out, as another user, with a changed request. Reading finds candidates; trying confirms them. Write each proof as you go (`../references/proofs.md`).
3. **Write the group's document,** `work/pre-launch-<date>/<nn>-<group>.md`, in the shape in `../references/documents.md`.
4. **After.** A short report in chat: findings by severity, one line each, what holds, and what wasn't covered. Then name the next group and wait for "go".

Each area file names what it reuses from the review checks. Follow that check's method for those items rather than inventing a new one: security-audit for authorisation, row rules, input and output; compliance for whether data reaches a processor and which document covers it; code-quality's `/code-review` and guard-the-bar moves for maintainability.

## Findings

Each finding carries:

- an **id**: the area's prefix plus a number, never reused (`references/finding-ids.md` at the repo root)
- a **severity**, from the table below
- **`proven` or `read`**: proven means a proof ran and printed `PROVEN`; read means it was seen in code or config and not run, with the reason
- **one plain sentence first** on what someone can actually do with it, then the evidence with file and line
- the **fix someone else should make,** as behaviour, not code: "the amount comes from the stored price, whatever the request says"
- the **decision** it depends on, cited from the map, if any
- **dashboard**, when only an account owner can change it

A finding that comes from a tagged item names the item, so the report can show coverage.

## Severity

Rated against the stage and scale from step 1, and the decisions from step 2:

| Severity | Meaning |
|---|---|
| critical | Exploitable now by anyone who finds it, and it moves money or exposes or destroys data |
| high | Exploitable now, by a narrower set of people or with a narrower effect |
| medium | A real weakness that needs a precondition |
| low | Hardening, defence in depth |

`not built` sits beside the severity for unfinished work named in step 2. It's still rated, so the report shows what's missing before launch, but counted separately.

Rate on what the finding lets someone do in this product. A theoretical issue in an admin path two people use is not high.

## What holds

Protections checked and found working go under **What holds**, with their `HOLDS` proof where one was written. An area with nothing under it was probably not looked at closely enough. A proof that prints `NOT PROVEN` is good news; if the attack failed for a different reason than expected, the finding changes rather than disappears.

## Done when

Every group in scope has a document. Every applicable item is a finding, under **What holds**, or under **Not covered** with the reason. Every finding has an id, a severity, `proven` or `read`, and a fix. Every `critical` and `high` has a proof or a stated reason it can't have one. The human has said "go" after the last group.

→ Next: `4-fix-packages.md`
