---
name: channel-twitter
description: Writes the Twitter/X post or thread for a shipped feature. Feature and milestone tiers.
tier: light
---

# Twitter

**Read:** `context/BRAND.md` → Twitter section. `context/CHANNELS.md` → Twitter mechanics: character limit, link placement, image specs, whether threads are used at all. `SPEC.md` and the diff.

**Write:** `work/<feature>/out/twitter.md`

## Shape

One post by default. A thread only when CHANNELS.md allows threads *and* the feature genuinely needs more than one post — a milestone with several distinct capabilities, not one feature stretched across five posts.

When threading, number the posts in the file and make the first one stand alone. Most readers see only that one.

## Rules

- Count characters against the limit in CHANNELS.md, including the link if links count there.
- Register from BRAND.md's Twitter section. It is usually the tightest of the channels, and tightening is not the same as dropping the voice.
- No engagement bait, no thread-hook clichés ("a thread 🧵", "let that sink in").
- Claims bounded by the spec's success metric.
- Plain text.
