---
name: channel-email
description: Writes the product update email for a shipped feature. Feature and milestone tiers.
tier: light
---

# Email

**Read:** `context/BRAND.md` → email section. `context/CHANNELS.md` → email mechanics: subject length, preheader, whether it's plain or templated, sending platform conventions. `context/PRODUCT.md` for who's on the list. `SPEC.md` and the diff.

**Write:** `work/<feature>/out/email.md`

## Shape

Subject, preheader, body, one call to action.

The subject and preheader are read together in the inbox and should not repeat each other — the preheader continues the subject rather than restating it.

Body stays short. This is a product update to existing users, not an announcement to strangers: they already know what the product is, so the first sentence can be the news.

## Rules

- **One call to action.** Two is how an update email becomes a newsletter nobody finishes.
- Existing users already have context — don't re-pitch the product.
- Claims bounded by the spec's success metric.
- Write the body as plain markdown; the sending platform owns the template.

## Hand back

**Decisions, not activity** (RULES.md) — a few lines at most.

- what you left out to keep it to one call to action
- claims cut against the success metric
- anything BRAND.md's email section or CHANNELS.md didn't cover, and what you assumed
