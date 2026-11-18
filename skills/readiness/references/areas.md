# Areas

The fourteen areas a baseline audit covers. Each uses its id prefix from `references/finding-ids.md` at the repo root. The stack profile adds platform-specific checks to each one.

Every item here comes from something that went wrong in a real audit. The Kancha id in brackets is the example.

## 1. Access (A)

- Who can call each table, function and endpoint, signed out included. Look for default grants that open new objects automatically. *(A16)*
- Functions that run with elevated rights: does each one check its caller? *(A2)*
- Any parameter naming a user: does the code use it instead of the caller's own id? *(A5)*
- Policies: whether they restrict columns, not just rows, and who an insert can claim to be. *(A3, A9)*
- Background jobs and internal endpoints reachable with the public key. *(A15)*

## 2. Logic (L)

Walk each record type through every state it can be in. For each move: who can make it, what stops the wrong person, what happens when it goes backwards.

- Deletes that cascade into records the other party relies on. *(L1)*
- States the code names but nothing ever sets, such as `completed` or `disputed`. *(L5, L7)*
- An action that commits other parties before anything is confirmed. *(L3)*
- Secrets that can be guessed without limit. *(L4)*

## 3. Money (M)

- Who decides the amount and currency charged. *(M1)*
- Webhooks: signature, repeats, whether they check state, events arriving out of order. *(L2, M2)*
- Idempotency on payment creation. *(M5)*
- Whether the money path matches the intended design (fees, payouts, connected accounts). *(M3)*
- Refunds, disputes, payouts: built, listened for, reachable? *(M4)*
- Failures that get logged and then forgotten. *(M6)*

## 4. Secrets (S)

- Committed keys and tokens, across the full history, including tool and editor config folders. *(S1, S5)*
- When each key was last rotated, compared with who held it before then. *(S2)*
- Env files synced to cloud folders. *(S3)*
- Secret scanning and push protection. *(S4)*

## 5. Deployment and platform (D)

- The platform's own security linter on every environment. *(D1)*
- Whether environments are isolated: separate projects, separate payment sandboxes. *(D2)*
- Whether what's deployed matches the repository: functions, migrations, deployed things that exist nowhere in the code. *(D4)*
- Database connection settings, auth settings, pending upgrades. *(D5, D6)*
- Whether the hosting plan allows commercial use. *(D7)*

## 6. Accounts and people (K)

- The scope of every key in use. *(K1)*
- Who has write access to the code and admin access to each service. Whether branch protection exists. *(K2)*
- Two-factor on every service, and a second owner. Usually `read`, from a person.

## 7. Input and output (I)

- Whether identity fields and system fields can be set by the user. *(I1, I2, I3, I6)*
- Size limits, reserved names, image URLs supplied by users. *(I4, I5, I7)*
- Uploads checked on the server. *(I8)*
- Security headers, CORS, what errors return. *(I9, I10)*

## 8. Realtime (R)

- What each live channel sends, and to whom, including signed-out listeners. *(R2, R3)*
- Whether participants can be changed after a room is created. *(R1)*

## 9. Supply chain (SC)

- Known advisories, separated into what ships and what's tooling only. *(SC1)*
- Dependency alerts on, lockfiles enforced at deploy, imports from URLs pinned. *(SC2, SC3, SC4)*
- CI actions pinned, workflow permissions. *(SC5)*

## 10. Failure behaviour (F)

- What a user sees when something succeeded but a later step failed. *(F1)*
- Raw internal errors returned to the caller. *(F2)*
- Which failures reach a person: errors caught and shown only as a toast, outages on an ignore list, functions and the database reporting nowhere. *(F3)*
- Empty catch blocks. *(F4)*
- States that need a person to act: does anyone get told?

## 11. Recovery (V)

- Whether migrations can be pushed safely to every environment. *(V1)*
- Backups, point-in-time recovery, and whether a restore has ever been tried. *(V2, V3)*
- Rollback notes and an incident runbook. *(V4)*
- Region against the market. *(V5)*

## 12. Privacy (P)

- Personal data readable by people it doesn't belong to: precise locations, the user directory. *(P1, P2)*
- Whether an account can actually be deleted, and what that does to the other party's records. *(P3, P4)*
- Privacy policy, terms, consent, data export, retention. *(P5)*
- Third parties every viewer's browser contacts without being told. *(P6)*

## 13. Claims (CL)

- What the product promises that the code doesn't back up: badges, landing-page lines, security features. *(CL1, CL2)*
- Jobs written but never scheduled. *(CL3)*
- Server-side code with no tests behind it. *(CL4)*
- Docs and agent instructions naming commands that don't exist. *(CL5)*

## 14. Performance (PF)

Kancha didn't cover this, so these items come from the platform, not from a finding yet. Add Kancha-style references here as real ones arrive.

- Foreign keys and columns that policies filter on, without an index.
- Lists with no limit, and queries inside loops.
- Database connections from serverless functions, with and without pooling.
- Region distance between users, app and database.
- What the client downloads on first load.
