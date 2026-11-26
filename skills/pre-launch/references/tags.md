# Tags and groups

## Tags

Every item in `areas/` carries tags. Step 1 marks which apply; items tagged out are skipped with a one-line reason.

| Tag | Applies when the product |
|---|---|
| `[all]` | always |
| `[payments]` | takes money in any form: one-off, subscriptions, credits |
| `[marketplace]` | has two sides, buyers and sellers, hosts and guests, and pays one side out |
| `[UGC]` | lets users post content others can see: posts, messages, reviews, profiles, images |
| `[realtime]` | pushes live updates: chat, feeds, presence |
| `[uploads]` | stores files or images from users |
| `[AI]` | calls a language model or other paid AI service |
| `[web]` | has a website or web app |
| `[Supabase]` `[Stripe]` `[Cloudflare]` `[Resend]` `[Sentry]` and similar | uses that service. The items are written for it; the idea applies to its equivalents, so an item tagged `[Supabase]` is checked on any database with row rules and owner-rights functions |

Items marked **dashboard** are settings only an account owner can change. Their findings go on the report's dashboard list, not into a fix package.

## Groups

The areas run in eight groups, one gate each, worst damage first. A group runs when any of its areas applies. Prefixes are the defaults for finding ids; a report may define its own (`references/finding-ids.md` at the repo root).

| Group | Areas | Prefixes |
|---|---|---|
| 1. Who can do what | [01 Access](areas/01-access.md), [02 Admins and roles](areas/02-admins-and-roles.md), [03 Sign-in and accounts](areas/03-sign-in-and-accounts.md) | A, AD, AU |
| 2. Logic and money | [04 Business logic](areas/04-business-logic.md), [05 Money](areas/05-money.md) `[payments]` | L, M |
| 3. Secrets and the build | [06 Secrets](areas/06-secrets.md), [07 The build process](areas/07-build-process.md), [16 Supply chain](areas/16-supply-chain.md) | S, B, SC |
| 4. What comes in and goes out | [08 Input and output](areas/08-input-and-output.md), [09 Realtime](areas/09-realtime.md) `[realtime]`, [10 Uploads and storage](areas/10-uploads-and-storage.md) `[uploads]`, [11 Bots and abuse](areas/11-bots-and-abuse.md) | I, R, U, AB |
| 5. Content and AI | [12 Trust and safety](areas/12-trust-and-safety.md) `[UGC]`, [13 AI features](areas/13-ai-features.md) `[AI]` | T, AI |
| 6. Platform and services | [14 Platform settings](areas/14-platform-settings.md), [15 Accounts and people](areas/15-accounts-and-people.md), [22 Email](areas/22-email.md), [24 Integrations](areas/24-integrations.md) | D, K, E, X |
| 7. Running it | [17 Performance and cost](areas/17-performance-and-cost.md), [18 Failure and monitoring](areas/18-failure-and-monitoring.md), [19 Recovery and release](areas/19-recovery-and-release.md) | PF, F, V |
| 8. Promises and upkeep | [20 Privacy](areas/20-privacy.md), [21 Legal](areas/21-legal.md), [23 Claims vs reality](areas/23-claims-vs-reality.md), [25 Maintainability](areas/25-maintainability.md) | P, LG, CL, MT |

## Not in the checklist yet

SEO, accessibility, and native mobile apps (OWASP MASVS). Accessibility has a partial answer: `skills/checks/a11y` run over the main routes (step 1). The others go under **Not covered** in every report until they have areas.
