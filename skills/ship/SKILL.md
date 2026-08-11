---
name: ship
description: Fans out from the merged spec and diff into per-channel collateral in work/<feature>/out/, producing exactly the intersection of the feature tier and the channels DISTRIBUTION.md has switched on. Light tier for copy. Ends by writing out/report.html through visualize — the human gate sits between out/ and publish. Triggers after review passes.
---

# Ship

Fan out from the merged SPEC.md and the diff. Light tier for copy work. Everything lands in `work/<feature>/out/`, **unpublished**.

Ship writes files. It never posts, sends, or publishes anything — the gate is between `out/` and publish, and it is a human's.

## Tier × channel

Not every change earns a blog post. Plan already tagged the feature tier; `context/DISTRIBUTION.md` says which channels are on for this product.

| Tier | Produces |
|---|---|
| fix | changelog line |
| feature | changelog, email update, social posts |
| milestone | all of the above, plus blog post, case study, video script, portfolio entry |

**Produce exactly the intersection** of the tier's list and the channels DISTRIBUTION.md has switched on. No human deciding "is this blog-worthy" each time — the rule is written once per project. A channel that's off produces nothing, silently; a channel that's on but has no section in BRAND.md is a finding for the report, not a guess at the voice.

## What the copy may claim

The spec's success metric is the ceiling. Collateral may describe what shipped and what it's for; it may not claim results that haven't happened yet, or numbers nothing measured.

Read the diff, not just the spec — the spec is intent, and what shipped is sometimes narrower. Copy describing the intent rather than the code is how a changelog ends up lying.

All copy runs through `skills/checks/voice-guard` before it lands.

## Channel agents

Ship is the one stage with predefined agents, one per channel in `agents/`: changelog, blog, case-study, linkedin, twitter, email, portfolio, video-script. They're identical every run — only the input changes — so defining them once costs nothing and drifts less than restating the instructions per feature.

Each agent is thin: it points at the channel's section in BRAND.md and its mechanics in CHANNELS.md, and states the output shape. The knowledge stays in `context/`; the agent file is a wrapper. Adding a channel is one small file plus a line in DISTRIBUTION.md.

Channels have no dependency on each other, so **they can all run in parallel** — one subagent per channel, the pipeline's biggest parallelism win. A harness without subagents runs them in order.

## Branded artifacts

`skills/visualize/` (vendored, used as-is) produces the outputs that deserve form: the final report, and milestone-tier collateral like case studies and portfolio entries. Changelog lines and social posts stay plain text — form adds nothing to a sentence that goes in a release note.

DISTRIBUTION.md says per project whether outputs ship as branded artifacts or plain files.

Setup, once per project: run visualize's `teach` step against the project. It walks the codebase and live site and writes its capture into a dedicated **Artifacts section of DESIGN.md** (plus tokens.css if missing), so the skill gets the input it was built to consume and the hand-written parts of DESIGN.md stay separate from the taught parts. Re-run teach when the visual identity changes.

## out/

One file per channel, predictable names, so approval is a folder scan rather than a hunt.

```text
out/
  changelog.md  blog.md  linkedin.md  twitter.md  email.md
  portfolio.md  case-study.md  video-script.md
  manifest.md          what was generated and why, what was skipped and why
  report.html          the final report
  screens/             screenshots from review
  skill-proposals/     proposed skill changes and LESSONS.md observations
```

`manifest.md` lists what was generated and why — including the channels that produced nothing, so a silent omission is distinguishable from a failure.

## The final report

Ship's last act writes `out/report.html`: one self-contained file, generated through visualize so it's branded, carrying

- the manifest, with every piece of collateral linked
- screenshots, inline, per route and viewport
- parked decisions from every slice, each with its alternative
- audit findings, severity marked
- skill proposals and LESSONS.md observations, each as an accept/decline item

One review session, on a phone. Everything the run decided without asking is in this file — that's the trade for not being interrupted fifteen times.

**Remote delivery — via Litedrop, pending its MCP launch.** Once the Litedrop MCP is live, Ship additionally publishes the report through it and returns a link for phone review. Never through display.dev or any other third party. Until that MCP exists, the local `report.html` is the whole delivery.
