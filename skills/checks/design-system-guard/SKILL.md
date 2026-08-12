---
name: design-system-guard
description: Runs at the end of every slice that touches UI, and once more across the full diff at review. Verifies every component used carries an @approved marker in its own file (component directory defined in context/STACK.md; only a human adds the marker), auto-fixes raw HTML, hardcoded colors, and unauthorized style overrides, and parks ambiguous cases for the final report — it never halts the run. Triggers on UI/component work, styling changes, and new pages or sections.
---

# Design system guard

Run this check at the end of every slice that touches UI, and once more across the whole diff at review. Its purpose is to keep every rendered element an instance of the approved design system instead of a one-off — drift is cheap to introduce and expensive to unwind once it spreads across pages.

## Approved components

**A component is approved when its own file carries an `@approved` marker in a comment in the first few lines.** Nothing else confers approval — not living in the components directory, not being imported somewhere, not looking finished.

```tsx
// @approved
export const Button = ...
```

Any comment syntax the file uses is fine (`//`, `/* */`, `{/* */}`, `#`), as long as the marker is near the top where a human reading the file sees it immediately.

Build the approved list at check time by scanning the component directory — `components:` in `context/STACK.md`, defaulting to `src/components/ui`. Never hardcode a list.

### Agents never add the marker

**Only the human decides what is approved.** An agent may add `@approved` when — and only when — the human asks for it in that moment ("mark Button as approved"). Never on its own initiative.

That means never during a pipeline run, never as the fix for a parked item, never because a component looks finished or well-built, never bundled into a skill proposal, and never "while I'm in the file anyway."

The reason is the whole point of the check: an agent that can mark components approved is an agent that approves whatever it invented, and the guard becomes a mirror. The marker is the trust boundary — a human put it there, or it isn't approval.

If a slice needs an unapproved component, that is a parked item, not a reason to reach for the marker.

Consequences:

- Component used but its file has no `@approved` marker → park it: note whether it should be marked (a question for the human) or replaced with an approved component. Do not use it silently, do not decide silently.
- Slice genuinely needs a component that does not exist yet → park it with the closest existing match named. The final report carries the question.
- Component directory missing, or STACK.md has no `components:` key → report it as a finding and fall back to flagging only mechanical violations.
- **No component carries the marker yet** → report that plainly. Everything is unapproved, which is the correct reading of a project that hasn't approved anything, not a reason to assume the check is misconfigured.

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
