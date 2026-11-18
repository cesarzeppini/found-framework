# Supabase

When the web app has no server code of its own, the browser talks to Supabase directly with the public key. That makes row level security, grants and the checks inside database functions **the only barrier** between a visitor and the data. A login guard in the client protects nothing on its own.

Supabase's defaults lean open. New tables and functions in the `public` schema are granted to `anon` and `authenticated` automatically. Row level security restricts rows, not columns. A function marked `security definer` runs with its owner's rights, so the checks inside it are the only ones that apply.

The finding ids below refer to the Kancha audit of November 2026, where each of these happened. The rules are why they won't happen again.

## Build rules

Applied in the slice that creates the table, function, bucket or edge function. It's cheap there, and expensive to retrofit once code depends on the open version.

**Grants**

- **Close the defaults once per project.** Stage 0 on any project without it: revoke execute on functions from `public` and `anon` in the default privileges for the `public` schema. Revoke table privileges `anon` doesn't need. Then grant back an explicit list. *(Kancha A16, the cause of most of its access findings.)*
- **Every new function is granted on purpose.** Revoke from `public` and `anon`, then grant to the role that needs it. A function a signed-out visitor needs is named as such in the slice. *(A2, A8, A11)*

**Functions with owner rights (`security definer`)**

- **Check the caller first.** Read `auth.uid()` and confirm the caller may act on this row before doing anything. *(A2)*
- **Use the caller's id, never a parameter.** A function that accepts a user id and falls back to the caller when none is given lets anyone read anyone. *(A5)*
- **Pin the search path** (`set search_path = ''`) and schema-qualify every name inside. An unpinned path is a hijack risk. It also breaks the function when it's called from another schema: at Kancha, accounts couldn't be deleted at all because of it. *(A14, P3)*
- **Prefer `security invoker`** unless the function has to bypass row level security. Say in a comment why it does.

**Policies**

- **Row level security on every table in an exposed schema,** including log and job tables nobody thinks of as data. *(A13)*
- **Updates are limited by column, not just by row.** Policies can't do that. Revoke `update` on the table and grant it back on the specific columns users may change, or route every change through a function. Status, amounts, counters, ratings, verified flags and anything set by the system are never writable by the user. *(A3, A6, A9, L8, I6)*
- **Inserts set identity from the caller.** `with check` forces `sender_id`, `owner_id` and similar columns to equal `auth.uid()`. Fields that only the system sets get a fixed value or a trigger. *(I1, I2, I3)*
- **Participants and owners are fixed after creation.** Nothing lets a user swap who a row belongs to. *(R1)*
- **Policies that look up other tables use indexed columns,** because they run on every row read.

**Records**

- **Foreign keys to records that matter don't cascade.** Deals, payments, messages and reviews survive the deletion of whatever they point at. Use `restrict`, or deactivate instead of deleting. *(L1, P4)*
- **Length limits on every text column,** as a check constraint. *(I4)*

**Realtime**

- **Realtime sends the whole row to anyone allowed to read it.** Secrets on a row both parties can read (a PIN, a token, the other party's private field) belong in a separate table that only its owner can read. *(A4, R3)*
- **Publish a table only if every reader of every row should get every change.** *(R2)*

**Storage**

- **Every bucket has write and read policies,** a file size limit and a list of allowed types, set in a migration and not only in the dashboard. *(I8)*
- **Images come only from the project's own storage.** URLs supplied by users aren't stored as image sources. *(I7)*

**Edge functions**

- **The caller is checked before the service key is used.** The service key bypasses every policy. A function that uses it with JWT verification off does its own check: a signature for webhooks, a shared secret for jobs. *(A15)*
- **CORS allows the app's own origins only,** read from configuration. *(I10)*
- **Errors return a generic message and an id.** The detail goes to logs. *(I10, F2)*
- **Imports are pinned to exact versions,** and the lockfile is committed. *(SC3)*
- **Keys use the current format** (publishable and secret keys), which can be rotated without downtime. *(S2)*

## Audit checks

Beyond the general list in `security-audit`, on this stack:

- Every function the diff adds or changes: who it's granted to, `definer` or `invoker`, whether it checks the caller, whether its search path is pinned.
- Every policy the diff adds or changes: the columns an `update` can reach, the identity an `insert` can claim, whether a lookup in the policy is indexed.
- Every table added to a realtime publication: what each listener receives.
- Every edge function: JWT verification setting, which key it uses, CORS, what its errors return.
- Default privileges: whether the diff creates anything in a schema where they're still open.

## Linter

Supabase's Security Advisor reports tables without row level security, functions that anonymous visitors can run with owner rights, and unpinned search paths. On a hosted project it's under **Advisors → Security Advisor**. Locally, run its lint queries (Supabase's open-source `splinter`) against the local database, or use the installed CLI's advisors command if it has one. Check the CLI's help, since the commands change between versions.

Its findings are signals. A function deliberately open to signed-out visitors shows up too. Each one is either fixed or explained.

## Proofs on this stack

- **Local stack:** `supabase start`. The URL is `http://127.0.0.1:54321`. A proof that sees any other host refuses to run.
- **Accounts:** a seed or setup step creates at least two users, so "the other party" and "a stranger" exist. Proofs sign in through the normal auth API with the publishable key.
- **Signed out** means a client with the publishable key and no session.
- **Test keys:** Stripe keys start with `sk_test_` or `rk_test_`. Any other prefix stops the proof.
- **Edge functions** run locally with `supabase functions serve`, using an env file that holds test keys only.
- Reset with `supabase db reset` plus the project's seed.

## Settings outside the repository

These live in the dashboard, so code review can't see them. `readiness` walks a person through them.

| Setting | Page | Kancha finding |
|---|---|---|
| Enforce SSL on incoming connections | Project Settings → Database → SSL Configuration | D5 |
| Network restrictions | Database → Settings → Network restrictions | D5 |
| Confirm email on sign-up | Authentication → Sign In / Providers → User Signups | — |
| Minimum password length | Authentication → Sign In / Providers → Email | — |
| Prevent use of leaked passwords (paid plans) | Authentication → Sign In / Providers → Email | D6 |
| Custom SMTP and its email rate limit | Authentication → Emails → SMTP Settings; Authentication → Rate Limits | — |
| Site URL and redirect URLs | Authentication → URL Configuration | — |
| CAPTCHA on sign-up and sign-in | Authentication → Attack Protection | — |
| Backups and point-in-time recovery | Database → Backups | V2 |
| Pending Postgres upgrades | Project Settings → Infrastructure | D6 |
| Organisation members, second owner | Organization settings → Team | K |
| Security Advisor clean on production | Advisors → Security Advisor | D1 |

Dashboard page names drift. When a path no longer matches, the wizard says which setting it was looking for, and the profile gets corrected.
