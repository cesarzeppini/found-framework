# 01 Access (A)

Who can read and change what. The most common serious hole in AI-built apps: Lovable apps in 2025 and Moltbook in 2026 both left the database readable and writable by anyone holding the public key.

**Reuses** security-audit's authorisation and row-level security checks, applied to the whole product instead of a diff.

- **Every table has row rules, and the default is deny.** `[all]` Prove: list tables without row level security; run the database's own security advisor.
- **New tables and functions are not granted to anonymous visitors by default.** `[Supabase]` Prove: check default privileges; create a table in a test migration and read its grants.
- **Every rule is tested as three people:** signed out, another user, the owner. `[all]` Prove: a script with two test accounts.
- **Swapping an id gets nothing** (IDOR). `[all]` Prove: request another user's record, order, file or chat by its id.
- **Rules say which rows and which columns.** A policy like "users can update their own row" usually lets them rewrite status, amount, owner, role or counters too. Limit columns with column privileges or by writing through functions. `[all]` Prove: update each sensitive column on your own row.
- **Inserts cannot create rows owned by someone else, or already in a privileged state** (already paid, already accepted, already verified). `[all]` Prove: insert a row with another user's id, and one with a privileged status.
- **Functions that run with owner rights check the caller** and have a pinned search path. They walk past every row rule, so each one is a door. Not callable by anonymous visitors unless meant to be. `[Supabase]` Prove: the security advisor, then call each as signed out and as another user.
- **No function decides whose data to use from a user id the caller sends.** It uses the signed-in user's id. `[all]` Prove: call it with another user's id.
- **Every server route and API endpoint checks who is calling.** Hidden buttons and middleware are not protection on their own. `[web]` Prove: call each endpoint directly, signed out and as another user.
- **Background jobs and internal endpoints are not reachable with the public key.** `[all]` Prove: call each with the public key, signed out.
- **Deleting does not cascade into other people's records.** Deleting an account, post or offer must not erase someone else's order, messages or reviews. `[all]` Prove: delete as a user, count related rows before and after.
