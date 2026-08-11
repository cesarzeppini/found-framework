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
  legal/               amendment drafts — gated separately, see below
  skill-proposals/     proposed skill changes and LESSONS.md observations
```

`manifest.md` lists what was generated and why — including the channels that produced nothing, so a silent omission is distinguishable from a failure.

## Legal and compliance

When `checks/compliance` reports an affected document, draft the amendments: Privacy Policy, Terms of Service, Cookie Policy, GDPR/DPA records. Read the live text from the paths in `context/STACK.md`, and write against the jurisdiction it names.

Four rules make this safe rather than reckless.

**Diffs against the live text, never rewrites.** Amend the clauses that changed and leave the rest untouched. Each amendment names the triggering change beside it, so the reason is reviewable clause by clause. A regenerated policy is unreviewable — nobody can tell which of two hundred lines moved, and the wording that changed silently is exactly the one that mattered.

**Drafts only.** Legal text is not a changelog. Where jurisdictional exposure is real, mark the output explicitly as a draft for a lawyer, not a finished document. Automating legal copy without that marking is automating liability.

**A separate legal changelog.** Users need notice of material changes, and it follows different rules from a product changelog: effective date, what changed in plain language, and whether continued use constitutes acceptance. Write it as `out/legal/legal-changelog.md` — never fold it into `out/changelog.md`, whose register and audience are entirely different.

**Everything lands in `out/legal/` and stays there.** Gated harder than the rest: **approving the run does not approve the legal changes.** Mark each one individually so the gate has to say yes to each, and never write into the project's published legal files directly.

```text
out/legal/
  privacy-policy.amendments.md    per-clause diffs, each with its trigger
  terms-of-service.amendments.md
  cookie-policy.amendments.md
  dpa-records.amendments.md
  legal-changelog.md              user-facing notice, plain language
```

Where nothing is affected, `out/legal/` is absent and the manifest says the compliance check found no affected documents — the same distinction the manifest draws everywhere else between "not earned" and "failed."

### Where this stops

Drafting an amendment is Ship's job. **Storing, versioning and publishing it is not** — that belongs in the project's own codebase, as a feature the pipeline can build like any other.

Hold that line, because the alternative is the first run that touches a privacy policy trying to build a legal CMS as part of shipping an unrelated feature. If a project needs versioned legal records, that is its own spec and its own run. Approved amendments from `out/legal/` then feed it as the next pending version, rather than a file someone pastes into a CMS by hand.

## What Ship hands back

**Report decisions, not activity** (RULES.md). The manifest already lists what was produced; repeating it as prose is the activity this rule exists to cut. Hand back only:

- claims trimmed because the success metric didn't support them, and what the copy says instead
- channels that produced nothing, and whether that was the tier, the switch in DISTRIBUTION.md, or a failure
- anything BRAND.md or CHANNELS.md didn't cover, and what was assumed in its place
- where you'd argue with the spec — a feature whose collateral is hard to write is usually a feature whose intent was thin, and Ship is the last stage positioned to notice

## The final report

Ship's last act writes `out/report.html`: one self-contained file, generated through visualize so it's branded.

The run skill owns what goes in it and hands it over in five sections; Ship's job is rendering them in that order, because the order is the point. **Decisions, not activity** — see RULES.md.

1. **Needs you** — early termination, blocked items as questions, blocking findings that survived their attempts.
2. **Decided without asking** — parked decisions with alternatives, assumptions, anything invented, anything changed in the existing setup, contradictions found, and where a stage would argue with the spec.
3. **Findings** — check results, severity marked, one line per check including the clean ones.
4. **Produced** — acceptance criteria met, screenshots inline per route and viewport, collateral linked from the manifest.
5. **Approve individually** — legal amendments from `out/legal/`, visibly separate from the run approval, then skill proposals and LESSONS.md observations.

Render sections 1 and 2 first and in full. They're the ones a person reads on a phone in a queue, and everything below them is reference — a report that opens on a screenshot gallery has buried its own reason for existing.

One review session. Everything the run decided without asking is in this file — that's the trade for not being interrupted fifteen times.

**Remote delivery — via Litedrop, pending its MCP launch.** Once the Litedrop MCP is live, Ship additionally publishes the report through it and returns a link for phone review. Until then, the local `report.html` is the whole delivery.
