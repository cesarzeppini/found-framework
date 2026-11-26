# Step 2: Map and decide

An inventory of what's there, written before anything is judged, then the one stop where a human says what the product is *meant* to do. Write `work/pre-launch-<date>/00-map.md` in the shape in `../references/documents.md`.

## Map

1. **Shape.** Each app, package, service and function directory: what it is, its framework, whether it ships. Say where access decisions are actually made: server code, database rules, functions, or the browser. A check in the browser protects nothing, and the map says so. This is often the one fact that shapes everything else.
2. **Data.** Tables and their row rules, database functions and who may call them, realtime channels, storage buckets, scheduled jobs and their last runs, extensions.
3. **Entry points.** Everything callable from outside: routes, endpoints, functions the browser can call, webhooks, jobs. For each, the caller check seen and the key it uses.
4. **Money,** when `[payments]` applies. Provider calls, webhook events handled, ledger tables, where fees live, and what's missing (refunds, disputes, payouts).
5. **Sign-in.** Methods, two-factor, reset, sessions, admin roles.
6. **Secrets and config.** Every environment variable name the code reads, split into public (shipped to the browser) and server-only. Whether env files are ignored by git, ever committed across the full history, or sitting in a synced folder.
7. **Outside services.** Every service called and every host code is loaded from. Read the dependency manifests and search the code for outside hosts directly; `compliance-scan.mjs` reads a diff, and a whole-history diff can be too large for it, while a range from the first commit leaves out that commit, which in an imported app holds most of the code. Then compare the list with the environment variable names from item 6.
8. **Environments and delivery.** Which exist, whether they're separate projects, what CI runs, how deploys happen, whether branch protection exists.
9. **The build process.** Which coding agents and tools work on the repository, what they can reach (environment variables, tokens, database links), their instruction files and MCP configuration.
10. **Already audited.** Earlier audits and issues with their states, so known findings aren't found again as new.

**Dashboard only** lists every setting that matters but can't be read from here: auth settings, members and two-factor, backups, payment provider settings, DNS, spending caps. Each becomes a line on the report's dashboard list unless a platform tool can read it.

Anything that looks odd goes under **To check, by area**, without a verdict yet. The map records; step 3 judges.

## Decide

Present the map's **Shape** and **To check** in brief, then numbered proposals, each with a recommended answer:

1. **Intended rules** the code can't settle: who may see what (other users' offers, profiles, locations), what deleting an account does to records the other party relies on, who sets a trust signal such as a verified badge. One answer can move a finding from medium to high, so ask once here rather than rate everything against a guess.
2. **Known unfinished work.** Parts absent on purpose, such as payouts not built yet. These get marked `not built` rather than rated as defects, so planned work doesn't bury real holes.
3. **Product decisions** the checklist raises: two-factor for users, email confirmation, point-in-time recovery, who answers abuse reports. These go in the report's own list, so they aren't mistaken for bugs.

Then the order the groups will run in, skipping the groups where nothing applies.

## The stop

Wait for "go". Record the answers in the map under **Decisions**, with the date; each finding that depends on one cites it.

A question that comes up later, mid-audit, goes in the same table with its own date. Take the reversible reading, mark the finding `pending decision`, and carry it to the report. That's park, don't ask, applied here.

## Done when

Every map section is filled in or marked `none`, every **To check** entry names its area, and every proposal has an answer or is marked `pending decision` with the reading used meanwhile.

→ Next: `3-areas.md`
