# Document shapes

All documents are plain markdown in `work/pre-launch-<date>/`, written for a person who owns the risk but may not be technical. Lead each finding with what someone can do, then give the evidence.

## 00-map.md

```text
<date>. Read from <branch>. An inventory, not a verdict.

## Tags             table: tag | applies | reason
## Stage and scale
## Shape            table: piece | what is there. Then one paragraph on where
                    access decisions are actually made.
## Data
## Entry points     table: name | caller check seen | key used
## Money
## Sign-in
## Secrets and config
## Outside services table: service | what it does | data sent | variables | account owner
## Environments and delivery
## The build process
## Already audited
## Decisions        table: topic | decision | date
## To check, by area
## Dashboard only   table: service | setting | why it matters
```

## <nn>-<group>.md

```text
<date>. Read from <branch>, then run against <local stack>, proofs in proofs/.

**How far this goes.** What was read, what was run, what wasn't seen and why.
**Tagged out.** Items skipped, with the reason.

## Proven
table: id | who acted | result        e.g. M1 | buyer | order marked paid, amount 650 → 1

## <Area name>
### Critical / High / Medium and low
**M1. One sentence on what someone can do.** Evidence with file:line.
Proven / Read. Proof: proofs/M1-amount-from-browser.test.ts.
Fix: the amount comes from the stored price, whatever the request says.
Decision it depends on, if any. Dashboard, if only an owner can change it.

### What holds
### Not covered

---
## Status, <date>       (added by --status, never edited afterwards)
```

## report.md

```text
## Status, <date>       (added by --status, newest first)

<date>. Branch <branch>. Nothing was fixed during the audit.

## Bottom line          up to five numbered sentences
## The numbers          table, then one sentence on urgency
## Product decisions    decided, with dates; then open
## Findings             by severity: id | what someone can do | proven/read |
                        proof | fix
## Fix packages         package 0 … n: closes, what changes, proofs,
                        must ship with, decisions, verify after deploy
## Dashboard list       table: service | page | setting | finding
## What holds
## Opinion              maintainability advice for the owner
## Not covered
## How the audit ran    research date and sources, side effects, reset
## Where the evidence is   table: group | document | id range; then proofs/
```

When a shape here and a real need disagree, follow the need, say so in the report, and propose the change to this file through `out/skill-proposals/`.
