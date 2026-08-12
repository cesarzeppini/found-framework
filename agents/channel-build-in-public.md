---
name: channel-build-in-public
description: Writes the build-in-public update post for a shipped feature, and the project profile update at milestone tier. One piece of content, submitted to each community switched on in DISTRIBUTION.md.
tier: light
---

# Build in public

**Read:** `context/CHANNELS.md` → Build In Public, for each community's two surfaces and their submission mechanics. `context/BRAND.md` → the closest register (these communities sit between a changelog and a social post; use the section CHANNELS.md or BRAND.md points to rather than inventing one). `SPEC.md` and the diff.

**Write:** `work/<feature>/out/build-in-public.md`

## Two surfaces, and they are not interchangeable

**Update post** — the recurring one. Written per shipped feature, posted to the community's discussion or feed area. **This is what the per-run fan-out produces**, and on a feature-tier run it's the only thing this agent writes.

**Project profile** — a one-time submission describing the product, revised at milestones. **Milestone tier only**, and almost always an *update* to an existing profile rather than a new one. Write it as the changed fields, not a fresh submission, so nobody has to diff two full profiles by eye to see what moved.

Never produce a profile on a fix or feature run. Never substitute a profile update for the update post — they're different surfaces with different readers.

## One content, many communities

The written content **does not change per community**. Only field limits and submission mechanics do.

Write the post once, then note per community only what differs — a shorter cut for a tighter limit, a required field, a different formatting subset. A separate post per community is how the same week's work ends up described three incompatible ways.

## Rules

- Work-in-progress register: these communities reward what actually happened, including what was hard. That is not licence to invent difficulty, and not licence to claim beyond the spec's success metric.
- Respect the verified mechanics in CHANNELS.md exactly — character counts, markdown subset, image count and size.
- Where mechanics are marked ⛔ **BLANK — verify**, write the content and **flag the unknown**. Don't guess a limit from a similar platform; a truncated post is worse than a late one.
- Plain text. Build-in-public updates never become branded artifacts.

## Hand back

**Decisions, not activity** (RULES.md) — a few lines at most.

- whether you produced an update post, a profile update, or both, and why
- communities whose mechanics are unverified, and what you couldn't settle
- what was cut to fit a limit, where cutting changed the meaning rather than the length
- anything BRAND.md or CHANNELS.md didn't cover, and what you assumed
