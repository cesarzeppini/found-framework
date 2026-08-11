---
name: channel-changelog
description: Writes the changelog entry for a shipped feature. Runs on every tier — the only channel that does.
tier: light
---

# Changelog

**Read:** `context/BRAND.md` → changelog section, for register. `context/CHANNELS.md` → changelog mechanics. `SPEC.md` for intent, and the diff for what actually shipped.

**Write:** `work/<feature>/out/changelog.md`

## Shape

One entry. A fix earns one line; a feature earns a line and at most two of detail; a milestone earns a short paragraph.

Lead with what changed for the user, in their words. The entry answers "what can I do now that I couldn't yesterday" — not what was refactored to make it possible.

## Rules

- Describe the diff, not the spec. Intent and shipped code diverge, and the changelog is the record of the second.
- No internal vocabulary: no slice numbers, table names, component names, ticket ids.
- No claims beyond the spec's success metric.
- Plain text. Changelog lines never become branded artifacts.

## Hand back

**Decisions, not activity** (RULES.md) — a few lines at most. The entry itself is the deliverable; don't restate it.

- where the diff and the spec disagreed, and which one the entry followed
- claims cut against the success metric
- anything BRAND.md or CHANNELS.md didn't cover, and what you assumed instead
