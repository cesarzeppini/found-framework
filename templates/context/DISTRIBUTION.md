# Distribution

Which channels are on for this product, who approves, and what each tier earns.

Ship produces exactly the **intersection** of the feature's tier and the channels switched on here. Written once per project, so no human decides "is this blog-worthy" per feature.

## Channels `[ask]`

On or off. A channel that's on must have a section in BRAND.md and its mechanics in CHANNELS.md — Ship reports a channel with no voice rather than guessing one.

| Channel | On | Notes |
|---|---|---|
| changelog | `<yes/no>` | |
| blog | `<yes/no>` | |
| case study | `<yes/no>` | |
| linkedin | `<yes/no>` | |
| twitter | `<yes/no>` | |
| email | `<yes/no>` | |
| portfolio | `<yes/no>` | |
| video script | `<yes/no>` | |

Adding a channel is one agent file in `agents/` plus a row here.

## Tiers `[ask]`

Plan tags every feature with a tier; these are the definitions it tags against. Adjust the *definitions* per project if the defaults don't fit — but keep the three tiers, since the skills reference them by name.

| Tier | What counts | Produces |
|---|---|---|
| fix | A defect or small correction | changelog line |
| feature | New user-visible capability | changelog, email update, social posts |
| milestone | A release users would notice and talk about | all of the above, plus blog post, case study, video script, portfolio entry |

## Approval `[ask]`

Who reviews `out/` and approves publication. Name the person per channel where they differ — legal or client sign-off on some channels and not others is common, and it belongs here rather than in someone's memory.

**The gate is between `out/` and publish.** Ship never publishes; it writes files and stops.

## Output format `[ask]`

Whether collateral ships as **branded artifacts** (through `skills/visualize/`) or plain files.

```
artifacts: <yes/no>
```

The final report is always an artifact. Changelog lines and social posts are always plain — form adds nothing to a sentence in a release note. This setting governs the middle: blog posts, case studies, portfolio entries.

## Remote delivery `[ask]`

Whether the final report is additionally published for remote review, once the Litedrop MCP is live.

```
remote-report: <yes/no>
```
