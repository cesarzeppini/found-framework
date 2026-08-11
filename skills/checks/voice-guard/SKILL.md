---
name: voice-guard
description: Runs on all of Ship's copy and on user-facing strings a build slice had to invent. scripts/prose-lint.mjs fails on the banned terms in the project's BRAND.md; a judgment layer covers register, channel fit, and claims the spec's success metric doesn't support. Blocking. Triggers whenever copy is written or changed.
---

# voice-guard

Runs on every piece of copy Ship produces, and on user-facing strings a build slice had to invent. Blocking.

Copy that SPEC.md already specifies is used **verbatim** — it was approved at the spec stop. This check exists for words nobody approved.

## Deterministic pass

```bash
node scripts/prose-lint.mjs --brand context/BRAND.md work/<feature>/out/*.md
```

The denylist is not maintained in this skill. It comes from the **banned words table in the project's BRAND.md** — word, why, use instead — so the words belong to the project and the script is only the mechanism. A project whose BRAND.md has no such table fails the lint with instructions rather than passing silently; an empty denylist that reports "clean" is worse than no check.

## What the lint cannot see

**Register.** BRAND.md defines base tone, and per-channel adaptations on top. The same feature announcement is not the same sentence on LinkedIn and in a changelog. Read the channel's section, not just the base rules.

**Claims.** The spec's success metric is the ceiling. Copy may describe what shipped and what it's for; it may not claim outcomes nothing has measured yet. "Cuts onboarding time in half" needs a measurement behind it — on the day of shipping there isn't one.

**Sentence patterns.** BRAND.md's patterns are as load-bearing as its banned words: opening on a benefit versus a fact, sentence length, whether questions are used, whether the product is ever the subject. These are what make copy recognisable; a post can clear the denylist and still not sound like anyone.

**What we don't claim.** BRAND.md states positioning and what the project explicitly does not say about itself. Collateral that quietly adopts a competitor's framing passes every word check.

## Blocking

Denylist hits and unsupported claims are blocking — fix and re-run, within the run's bounded attempts.

Register and pattern findings are blocking too, but the fix is a rewrite rather than a substitution. Rewrite once, re-check, and if it still doesn't land, **park it with both versions** so the gate can choose. Copy is the cheapest thing in the pipeline to change at the gate and the most expensive to get wrong after publishing.

**Never invent brand voice.** If BRAND.md has no section for a channel that DISTRIBUTION.md has switched on, that is a finding for the report — not an excuse to write in a plausible voice. A house style guessed once becomes the house style forever.

## Report

**Report decisions, not activity** (RULES.md): what you changed and what you couldn't settle, not the files you read. One result for the check, including when it's clean.

```text
voice-guard
Fixed (2)
  out/linkedin.md:3   "leverage" -> "use"
  out/blog.md:11      "seamless onboarding" -> "onboarding in three steps"
Blocking (1)
  out/email.md:6      claims "cuts setup time in half" — no measurement exists;
                      the spec's success metric is activation rate at 7 days
Parked (1)
  out/twitter.md      register reads closer to the website voice than the
                      Twitter section; both versions in out/twitter.alt.md
```

Clean runs report `voice-guard: clean (N files, M banned terms)`.
