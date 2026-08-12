# Distribution

Which channels are on for this product, who approves, and what each tier earns.

Ship produces exactly the **intersection** of the feature's tier and the channels switched on here. Written once per project, so no human decides "is this blog-worthy" per feature.

## Channels `[ask]`

On or off. A channel that's on must have a section in BRAND.md and its mechanics in CHANNELS.md — Ship reports a channel with no voice rather than guessing one.

**Toggle per destination, not per format.** Case Study and Build In Public are each one written artifact sent to several places, and a project often wants some of those places and not others — a client project might switch on Case Study → Found website only.

| Channel | Destination | On | Notes |
|---|---|---|---|
| changelog | — | `<yes/no>` | |
| blog | — | `<yes/no>` | |
| linkedin | — | `<yes/no>` | |
| twitter | — | `<yes/no>` | |
| email | — | `<yes/no>` | |
| video script | — | `<yes/no>` | |
| case study | Found website | `<yes/no>` | canonical version; others are cut from it |
| case study | Dribbble | `<yes/no>` | |
| case study | Clutch | `<yes/no>` | may require a verified client review |
| case study | Contra | `<yes/no>` | portfolio project entry |
| build in public | Built in Baltics | `<yes/no>` | update post per feature; profile at milestone |
| build in public | `<community>` | `<yes/no>` | add a row per community joined |

Turning on one destination of a multi-destination channel doesn't turn on the others. Turning them all off switches the channel off.

Adding a channel is one agent file in `agents/` plus a row here. Adding a *destination* to an existing channel is a row here plus its mechanics in CHANNELS.md — no new agent, since the artifact is already written.

## Tiers `[ask]`

Plan tags every feature with a tier; these are the definitions it tags against. Adjust the *definitions* per project if the defaults don't fit — but keep the three tiers, since the skills reference them by name.

| Tier | What counts | Produces |
|---|---|---|
| fix | A defect or small correction | changelog line |
| feature | New user-visible capability | changelog, email update, social posts |
| milestone | A release users would notice and talk about | all of the above, plus blog post, **case study**, video script, and a build-in-public profile update |

## Approval `[ask]`

Who reviews `out/` and approves publication. Name the person per channel where they differ — legal or client sign-off on some channels and not others is common, and it belongs here rather than in someone's memory.

**The gate is between `out/` and publish.** Ship never publishes; it writes files and stops.

## Output format `[ask]`

Whether collateral ships as **branded artifacts** (through `skills/visualize/`) or plain files.

```
artifacts: <yes/no>
```

The final report is always an artifact. Changelog lines, social posts and build-in-public updates are always plain — form adds nothing to a sentence in a release note. This setting governs the middle: blog posts and case studies.

## Remote delivery `[ask]`

Whether the final report is additionally published for remote review, once the Litedrop MCP is live.

```
remote-report: <yes/no>
```
