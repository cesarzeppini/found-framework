---
name: channel-video-script
description: Writes the YouTube video script for a milestone-tier feature. Milestone only.
tier: light
---

# Video script

**Read:** `context/BRAND.md` → spoken register if one exists, otherwise the base voice. `context/CHANNELS.md` → video mechanics: target length, format, whether it's narrated or on-camera. `SPEC.md`, the diff, and `out/screens/` for what can actually be shown.

**Write:** `work/<feature>/out/video-script.md`

## Shape

Hook, demonstration, close. Mark each section with an approximate timestamp so length is checkable before anything is recorded.

Write **spoken** English. Sentences that read fine and don't say aloud are the failure mode here: no parentheticals, no semicolons, no clause stacking. Read it back before finishing.

Pair narration with what's on screen. Two columns, or narration with bracketed screen directions — CHANNELS.md decides which.

## Rules

- Only describe screens that exist. Check against `out/screens/` and the affected-screens list; a script demoing a screen nobody built wastes a recording session.
- Claims bounded by the spec's success metric.
- Plain text. The script is a working document, not a published artifact.
