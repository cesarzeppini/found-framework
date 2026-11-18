# Finding ids

Every finding from `security-audit`, and from any audit `readiness` runs (a baseline uses the scope `baseline`), carries an **id**: an area prefix and a number, such as `A3` or `M2`. The id is how a finding is named everywhere afterwards: in the report, in the fix's commit, in its proof test, in the status line that closes it.

## Prefixes

| Prefix | Area | Covers |
|---|---|---|
| A | Access | Who can reach which rows, functions and endpoints. Grants, policies, ownership checks. |
| L | Logic | State changes: who moves a record from one state to the next, and what stops the wrong move. |
| M | Money | Amounts, currency, payment events, refunds, payouts. |
| I | Input and output | Validation, size limits, what responses and errors return, uploads, headers. |
| R | Realtime | What live channels push, and to whom. |
| S | Secrets | Keys, tokens, env files, rotation. |
| SC | Supply chain | Dependencies, lockfiles, imports by URL, CI actions. |
| D | Deployment and platform | Hosting, database and auth settings, environments, what is deployed. |
| K | Accounts and people | Who has access to each service, two-factor, owners. |
| V | Recovery | Backups, restores, rollbacks, runbooks. |
| F | Failure behaviour | Errors swallowed, unreported, or shown wrongly to the user. |
| P | Privacy | Personal data exposed, kept, or impossible to delete. |
| CL | Claims | What the product says that isn't true. |
| PF | Performance | Missing indexes, unbounded queries, connection limits, payload size. |

A finding that spans two areas takes the prefix of the place it gets fixed. The other area's report refers to it by that id instead of giving it a second one.

## Rules

- **Ids are unique within one report.** A feature's review and a baseline audit each start their own numbering. Outside its own report, a finding is written with its scope: `invites/A2`, `baseline/M1`.
- **An id is never reused or renumbered.** A finding that turns out to be wrong keeps its id and closes as `withdrawn`, with the reason.
- **Closing is a status line, not an edit.** The original finding text stays as written. Its status is added underneath: `closed`, `accepted` (with the reason and date), or `withdrawn`. A reader can always see what was found and what happened to it.
