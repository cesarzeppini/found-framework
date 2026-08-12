---
name: design-system-guard
description: Runs at the end of every slice that touches UI, and once more across the full diff at review. Verifies every component used carries an @approved marker in its own file (component directory defined in context/STACK.md; only a human adds the marker), auto-fixes raw HTML, hardcoded colors, and unauthorized style overrides, and parks ambiguous cases for the final report — it never halts the run. Triggers on UI/component work, styling changes, and new pages or sections.
---

# Design system guard

Run this check at the end of every slice that touches UI, and once more across the whole diff at review. Its purpose is to keep every rendered element an instance of the approved design system instead of a one-off — drift is cheap to introduce and expensive to unwind once it spreads across pages.

## Approved components

**A component is approved when its own file carries an `@approved` marker in a comment within the first 5 lines.** Nothing else confers approval — not living in a components directory, not being imported somewhere, not looking finished.

```tsx
// @approved
export const Button = ...
```

Any comment syntax the file uses is fine (`//`, `/* */`, `{/* */}`, `#`).

**The 5-line window is part of the rule, not an implementation detail.** The marker has to be where someone opening the file sees it immediately; a marker below line 5 does not count and the component reads as unapproved. If that surprises someone, the fix is to move the marker up, never to widen the window.

Build the approved list at check time by scanning the directories in `components:` (`context/STACK.md`), which **may list several** — hand-built components and generated plumbing usually live apart, and every listed directory is checked. Defaults to `src/components/ui` when the key is absent. Never hardcode a list.

Imports are matched by directory tail rather than by a fixed alias, so `@/components/ui/x`, `~/components/ui/x` and `../../components/ui/x` all resolve to the same component. A project that uses no alias at all works the same way.

### An incomplete `components:` is a finding

Every run, report component directories the project has that `components:` doesn't list.

This matters because the failure is silent in the worst way: an unlisted directory is never scanned, so its components are neither approved nor flagged, and the check comes back clean. A narrowed check and a healthy project produce the same output.

Never treat an omission as deliberate. A deliberate exclusion is written down — `components-ignore:` in STACK.md — for directories that genuinely aren't design-system components: icon sets, generated output, a legacy folder being retired. Anything not in either key is an unanswered question, and the resolution is a human's: list it, ignore it, or move it.

### Agents never add the marker

**Only the human decides what is approved.** An agent may add `@approved` when — and only when — the human asks for it in that moment ("mark Button as approved"). Never on its own initiative.

That means never during a pipeline run, never as the fix for a parked item, never because a component looks finished or well-built, never bundled into a skill proposal, and never "while I'm in the file anyway."

The reason is the whole point of the check: an agent that can mark components approved is an agent that approves whatever it invented, and the guard becomes a mirror. The marker is the trust boundary — a human put it there, or it isn't approval.

If a slice needs an unapproved component, that is a parked item, not a reason to reach for the marker.

### Every marker added during a run is reported

Any `@approved` marker that appears in the run's diff goes into the final report as a **Needs-you** item: the file, the component, and who asked for it.

**Report it even when the human did ask.** A report filed only when the agent judges it necessary is a report the agent can decide not to file — and an agent that added a marker it shouldn't have is exactly the one that would judge it unnecessary. Unconditional listing is the whole mechanism: it makes an unrequested marker visible without anyone having to suspect it first.

Don't rely on self-reporting for this. The full-diff pass at review detects them mechanically:

```bash
skills/checks/design-system-guard/scripts/ds-lint.sh --added-markers main...HEAD
```

Every marker it finds is reported, whether or not any stage mentioned adding one. A marker in the diff that no stage reported is itself the finding.

Consequences:

- Component used but its file has no `@approved` marker → park it: note whether it should be marked (a question for the human) or replaced with an approved component. Do not use it silently, do not decide silently.
- Slice genuinely needs a component that does not exist yet → park it with the closest existing match named. The final report carries the question.
- Component directory missing, or STACK.md has no `components:` key → report it as a finding and fall back to flagging only mechanical violations.
- **No component carries the marker yet** → report that plainly. Everything is unapproved, which is the correct reading of a project that hasn't approved anything, not a reason to assume the check is misconfigured.

## Component registry, for the final report

Once per run, produce the inventory that becomes the report's **Component registry** section:

```bash
skills/checks/design-system-guard/scripts/ds-lint.sh --registry src
```

Three groups, and the split is the point:

**Approved** — every component carrying the marker. The current design system, stated plainly.

**Unmarked but in use** — every unmarked component imported anywhere, with how many files import it. Each is a decision waiting: mark it approved, or replace its uses.

**Unmarked and unimported** — a count only, never a listing. Nothing depends on them, so they're inventory rather than decisions, and listing them would bury the group that needs answers.

**Scan the whole codebase, not this run's diff.** In a new project the entire codebase is the backlog, and a component that has been in use since before the framework was installed appears in no diff — it would never surface otherwise. That's exactly the component most worth asking about, since it's load-bearing and unreviewed.

This section is an inventory, not a finding: it doesn't block, and a long list on the first run is expected rather than alarming. It shrinks as components get marked.

## Tokens

The color/token allowlist is not maintained by hand. Derive it at check time from `context/tokens.css` — every semantic token defined there is allowed; anything else is a violation. `references/allowed-customization.md` covers layout classes and props only.

## Violations

| # | Violation | Examples |
| --- | --- | --- |
| 1 | Raw HTML for core UI | `<button>`, `<input>`, `<select>`, `<textarea>`, hand-rolled card / modal / dropdown / tab `<div>` structures |
| 2 | Off-system component | local component duplicating an `@approved` one; component in the components directory with no `@approved` marker |
| 3 | Unauthorized customization | color / font / border / shadow / radius overrides on a design-system component, raw hex or `rgb()` values, non-token utilities like `bg-white` `text-black` `text-[#333]`, `!important` |

Plain layout wrappers (`<div>`, `<section>`, `<span>`, `<ul>`) are fine. The rule targets interactive controls and visual surfaces, not structure.

Allowed customization is narrow: approved `variant` / `size` props plus layout classes (spacing, flex, grid, width, position, alignment). See `references/allowed-customization.md` for the full allowlist before deciding an override is acceptable.

## Fix or ask

Run this skill's own `skills/checks/design-system-guard/scripts/ds-lint.sh` on the files the task touched to get the mechanical hits, then apply judgment to the rest. (The framework's shared scripts live in the repo-root `scripts/`; this one is the skill's.)

**Fix immediately** when the correct replacement is unambiguous:

- raw `<button>` → `Button` with the matching variant
- raw `<input>` / `<textarea>` → `Input` / `Textarea`
- hex or non-token color utility → the semantic token that matches (`bg-primary`, `text-muted-foreground`, `border-border`)
- duplicate local component with an exact `@approved` equivalent → the approved component

**Do not touch — park instead** when intent is unclear: a custom component with no close equivalent, an override that looks deliberate (a brand-specific surface, a one-off marketing treatment), or a genuinely new component need. Guessing here either destroys intentional work or silently approves drift. Parked items don't halt the slice — they go in the report block and surface in the final report next to the screenshots.

## Report

**Report decisions, not activity** (RULES.md): what was fixed and what was parked, not the files scanned or the rules evaluated. The fixed list is decisions — each one is a change someone might disagree with — so it stays; the scan itself is activity and doesn't.

End every UI slice with this block, even when nothing was found (`Design system check: clean`). One result for the check, not one per file: a clean line is a reported decision, and its absence is indistinguishable from the check never running.

```text
Design system check
Fixed (3)
  src/routes/dashboard.tsx:42  raw <button> -> <Button variant="outline">
  src/routes/dashboard.tsx:57  text-[#1f2937] -> text-foreground
  src/components/Row.tsx:12    bg-white -> bg-card
Parked (1)
  src/components/StatTile.tsx:8  custom card surface, closest match: Card
  -> Replace with Card, or mark StatTile @approved? (a human's call, never mine)
```

Parked items never halt the run. They accumulate into the final report for the human gate. The full-diff pass at review re-checks them: some resolve themselves (the component got replaced in a later slice); the rest stay listed.
