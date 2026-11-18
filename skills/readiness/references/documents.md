# Document shapes

All three documents are plain markdown in `work/baseline-<date>/`. They're written for a person who isn't technical but owns the risk. Lead each finding with what someone can do, then give the evidence.

## 00-map.md

```text
<date>. Read from <branch>. An inventory, not a verdict.

## Shape            table: piece | what is there. Then one paragraph on where
                    access decisions are actually made.
## Data
## Entry points     table for functions: name | caller check seen | key used
## Money
## Auth
## Secrets and config
## Third parties
## Environments and delivery
## Already audited
## Decisions        table: topic | decision | date   (filled in step 2)
## To check, by area
## Not visible from the repository
```

## <nn>-<areas>.md

```text
<date>. Read from <what>, then run against the local stack with <proof location>.

**How far this goes.** What was read, what was run, what wasn't seen and why.

## Proven on the local stack
table: finding | who | result        e.g. A3 | buyer | deal marked paid, amount 650 → 1

## <Area name>
### Critical / High / Medium and low
**A1. One-line statement of what someone can do.** Evidence with file:line.
Proven / Read. Decision it depends on, if any.

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
## Decisions
## Critical findings    table: id | finding | proven
## High findings        grouped by what they affect, one line each
## Fix order            stage 0 … n, each: status line, closes, what changes,
                        proofs, must ship with
## What holds
## Not covered
## How the audit ran
## Where the evidence is   table: areas | document | id range; then proof files
```

The Kancha audit (November 2026) is the reference example of all three shapes. When a shape here and a real need disagree, follow the need and say so in the report. Then propose the change to this file through `out/skill-proposals/`.
