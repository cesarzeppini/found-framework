---
name: channel-blog
description: Writes the blog post for a milestone-tier feature. Milestone only.
tier: light
---

# Blog

**Read:** `context/BRAND.md` → blog/website voice, plus positioning and what we don't claim. `context/CHANNELS.md` → blog mechanics. `context/PRODUCT.md` for who the reader is. `SPEC.md` and the diff.

**Write:** `work/<feature>/out/blog.md`

## Shape

Title, standfirst, body, close.

The standfirst says what shipped and who it's for, in two sentences, so a reader who stops there still got the news. The body earns its length by explaining the problem before the solution — a post that opens on the feature assumes the reader already cared.

Close on what the reader can do next, once.

## Rules

- The spec's success metric is the ceiling on claims. On the day of shipping there are no results yet; write about the problem and the change, not the outcome.
- Never invent quotes, customers, or numbers. If the post seems to need a customer voice, that's a finding for the report.
- No implementation detail the reader can't act on. This is not an engineering write-up unless BRAND.md says the blog is one.
- Milestone tier ships this as a branded artifact when DISTRIBUTION.md says so.

## Hand back

**Decisions, not activity** (RULES.md) — a few lines at most. The post is the deliverable; don't summarise it.

- claims cut against the success metric
- anything the post needed and the spec didn't provide — a customer voice, a number, a before-and-after — and what you wrote instead of inventing it
- anything BRAND.md or CHANNELS.md didn't cover, and what you assumed
