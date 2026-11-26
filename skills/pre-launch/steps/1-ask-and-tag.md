# Step 1: Ask and tag

Settle what the audit covers before reading any code. Every later step filters on what's decided here.

## Ask

One message, numbered proposals, each with a recommended answer read from whatever is already visible (the README, the package manifest, `context/` if the project has one). In the format of `skills/spec/steps/4-check-and-present.md`.

1. **Tags.** Which tags from `../references/tags.md` apply: payments, marketplace, user content, realtime, uploads, AI features, web, and which services (Supabase, Stripe, Cloudflare, Resend, Sentry, or their equivalents). Recommend the set the manifest and config suggest.
2. **Stage and scale.** Real users yet? Real money? How many of each expected at launch? Severity is rated against this, so read `context/COMPANY.md` if it exists and confirm it, and ask when it doesn't.
3. **Environments.** Which exist (local, staging, production), which the audit may read, and whether a local stack starts. Proofs that act as a user need one.
4. **Off limits.** Apps, folders or services out of scope. Each one is listed in the report under **Not covered**.
5. **Sandboxes.** For each third party a proof would touch: is there a sandbox with no deployed webhooks pointing at it? Without one, those proofs are parked (`../references/proofs.md`).
6. **Accessibility.** Not one of the 25 areas. If the product is a consumer service in the EU (the European Accessibility Act), recommend a run of `skills/checks/a11y` over the main routes alongside the audit, with findings under prefix `AX`.

Wait for answers. A tag the human leaves unanswered takes the recommended reading, and the map records it as assumed.

## Research

Lists go stale, so check what's current before mapping:

- the current OWASP Top 10 and ASVS
- the OWASP Top 10 for LLM Applications, when `[AI]` applies
- the production or go-live checklist of every service tagged, and of the framework and hosting in use

An item the research turns up that the areas don't have goes into the area it fits, marked `added by research` with its source. Record the date of the research; it goes in the report.

## Done when

Every tag is marked applies or doesn't, with a one-line reason. Stage and scale are recorded. Every area in `../references/tags.md` is marked in scope or not applying. The research date and any added items are written down.

→ Next: `2-map-and-decide.md`
