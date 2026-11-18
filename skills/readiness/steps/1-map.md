# Step 1: Map

An inventory of what's there, written before anything is judged. It's the shared ground every area audit starts from, and it's where a reader learns the one fact that shapes everything else. At Kancha that fact was that the web app had no server code, so the browser talked to the database directly and row level security was the only barrier.

Write `work/baseline-<date>/00-map.md`, in the shape given in `../references/documents.md`.

## What to inventory

1. **Shape.** Each app, package, service and function directory: what it is, its framework, whether it ships. Say where access decisions are actually made: server code, database policies, edge functions, or the client. A client-side guard protects nothing, and the map says so.
2. **Data.** Tables, which ones have row level security, the policy count, functions and how they're granted, realtime publications, storage buckets, scheduled jobs, extensions.
3. **Entry points.** Everything that can be called from outside: routes, database functions callable from the browser, edge functions with the caller check each one does and the key each one uses, webhooks, jobs.
4. **Money.** Payment provider calls, which events the webhooks handle, ledger tables, where commission lives, and what's missing (refunds, disputes, payouts).
5. **Auth.** Sign-in methods, second factor, password reset, session handling.
6. **Secrets and config.** Every variable name the code reads, split into public (shipped to the browser) and server-only. Whether env files are ignored by git. Whether any were ever committed, checked across the full history. Where the repository lives on disk: a synced folder (Dropbox, iCloud) carries env files to every device on it.
7. **Third parties.** Every service called, plus every host that code is loaded from.
8. **Environments and delivery.** Local, staging, production: which exist, whether they're separate projects, what CI runs, what deploys and how, whether branch protection exists.
9. **Already audited.** Earlier issues, audits and their states, so known findings aren't re-found as new ones.

## While mapping

Anything that looks odd goes into **To check, by area**, listed under its area from `../references/areas.md`, without a verdict yet. The map records; step 3 judges.

**Not visible from the repository** lists every dashboard and account that matters but can't be read from here: auth settings, members and two-factor, backups, payment provider settings, hosting environment variables. Each one becomes a wizard step later. A list that's honest about its gaps is worth more than one that guesses.

Use the platforms' command-line tools to read hosted settings where they're signed in: deployed functions, backups, the platform's security linter on each environment. Read only.

## Done when

Every section above is filled in or marked `none`, and every entry under **To check** names its area.

→ Next: `2-scope-stop.md`
