---
name: design-system-guard
description: Runs at the end of every slice that touches UI, and once more across the full diff at review. Verifies every component used comes from the approved design system registry (path defined in context/STACK.md), auto-fixes raw HTML, hardcoded colors, and unauthorized style overrides, and parks ambiguous cases for the final report — it never halts the run. Triggers on UI/component work, styling changes, and new pages or sections.
---

# Design system guard

Run this check at the end of every slice that touches UI, and once more across the whole diff at review. Its purpose is to keep every rendered element an instance of the approved design system instead of a one-off — drift is cheap to introduce and expensive to unwind once it spreads across pages.

## The registry

The registry path is defined in `context/STACK.md` (key: `registry`) — typically a human-curated page that renders every approved component, like `/design`, or a Storybook index. A component is approved only if it is imported and rendered there. Read that file at check time to build the approved list — never hardcode a list, and never treat `src/components/ui/*` as the registry. That folder can accumulate components nobody asked for; the registry is the deliberate, human-reviewed surface.

Consequences:

- Component in `src/components/ui` but not in the registry → park it: note whether it should be added to the registry or replaced with an approved component. Do not use it silently, do not decide silently.
- Slice genuinely needs a component that does not exist yet → park it with the closest existing match named. The final report carries the question.
- Registry file missing or STACK.md has no `registry` key → report it as a finding and fall back to flagging only mechanical violations. Never invent a registry.

## Tokens

The color/token allowlist is not maintained by hand. Derive it at check time from `context/tokens.css` — every semantic token defined there is allowed; anything else is a violation. `references/allowed-customization.md` covers layout classes and props only.

## Violations

| # | Violation | Examples |
| --- | --- | --- |
| 1 | Raw HTML for core UI | `<button>`, `<input>`, `<select>`, `<textarea>`, hand-rolled card / modal / dropdown / tab `<div>` structures |
| 2 | Off-system component | local component duplicating something on `/design`; component in `src/components/ui` absent from `/design` |
| 3 | Unauthorized customization | color / font / border / shadow / radius overrides on a design-system component, raw hex or `rgb()` values, non-token utilities like `bg-white` `text-black` `text-[#333]`, `!important` |

Plain layout wrappers (`<div>`, `<section>`, `<span>`, `<ul>`) are fine. The rule targets interactive controls and visual surfaces, not structure.

Allowed customization is narrow: approved `variant` / `size` props plus layout classes (spacing, flex, grid, width, position, alignment). See `references/allowed-customization.md` for the full allowlist before deciding an override is acceptable.

## Fix or ask

Run `scripts/ds-lint.sh` on the files the task touched to get the mechanical hits, then apply judgment to the rest.

**Fix immediately** when the correct replacement is unambiguous:

- raw `<button>` → `Button` with the matching variant
- raw `<input>` / `<textarea>` → `Input` / `Textarea`
- hex or non-token color utility → the semantic token that matches (`bg-primary`, `text-muted-foreground`, `border-border`)
- duplicate local component with an exact registry equivalent → the registry component

**Do not touch — park instead** when intent is unclear: a custom component with no close equivalent, an override that looks deliberate (a brand-specific surface, a one-off marketing treatment), or a genuinely new component need. Guessing here either destroys intentional work or silently approves drift. Parked items don't halt the slice — they go in the report block and surface in the final report next to the screenshots.

## Report

End every UI slice with this block, even when nothing was found (`Design system check: clean`).

```text
Design system check
Fixed (3)
  src/routes/dashboard.tsx:42  raw <button> -> <Button variant="outline">
  src/routes/dashboard.tsx:57  text-[#1f2937] -> text-foreground
  src/components/Row.tsx:12    bg-white -> bg-card
Parked (1)
  src/components/StatTile.tsx:8  custom card surface, closest match: Card
  -> Replace with Card, or approve StatTile and add it to the registry?
```

Parked items never halt the run. They accumulate into the final report for the human gate. The full-diff pass at review re-checks them: some resolve themselves (the component got replaced in a later slice); the rest stay listed.
