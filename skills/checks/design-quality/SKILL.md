---
name: design-quality
description: Advisory anti-pattern pass at end of feature, reading the screenshots rather than the code. Catches what compiles, passes the design system and still reads badly — unconsidered states, hierarchy, density, copy in situ. Never blocks; output lands next to the screenshots so both get reviewed together at the gate. Triggers during review, after the screenshots are captured.
---

# design-quality

End of feature. **Advisory — never blocks.**

design-system-guard asks whether the parts are approved. This asks whether the result is any good. An interface can use every approved token and component and still be unusable, and no linter will say so.

## Read the screenshots

Work from `out/screens/` — both viewports, every route in the spec's affected-screens list — not from the code. The rendered result is the thing users get, and problems here are mostly invisible in a diff.

Output lands next to the screenshots so the human reviews both together at the gate, in one pass.

## Anti-patterns

**Unconsidered states.** The spec lists empty, loading, error, permission-denied, first-run. Do they look designed, or do they look like the happy path with the content removed? An empty state that is a bare centred sentence is the most common miss in the pipeline, because it satisfies every mechanical check.

**No hierarchy.** Everything the same size and weight, so nothing leads. Look at each screenshot for two seconds: whatever you noticed first should be the thing that matters most on that screen. If nothing stands out, the screen has no answer to "what is this for."

**Density.** Text at full container width across a desktop viewport, controls with no breathing room, or a page so airy it needs scrolling for three fields. Judge against the rest of the product, not against a general standard — consistency beats abstract correctness here.

**Alignment and rhythm.** Edges that nearly line up, inconsistent gaps between comparable groups, a grid broken by one element. Cheap to fix, and disproportionately what makes an interface feel unfinished.

**Copy in situ.** Labels that made sense in the spec and don't in place: truncated buttons, headings that repeat the page title, error messages stating what failed but not what to do. Read the words as they render, at both widths.

**Mobile as an afterthought.** Desktop layout squeezed rather than reconsidered — horizontal scroll, tap targets too small or too close, a table that should have become a list, a modal taller than the viewport.

**Interaction affordance.** Controls that don't look pressable, destructive actions styled like ordinary ones, or a primary action competing with three other things styled just as loudly.

## How to report

Advisory means **specific**, not soft. A finding a human can't act on in one read is noise, and noise next to screenshots is how a gate starts skimming.

Each finding: the route, the viewport, what's wrong, and what would fix it. Rank by how much the fix improves the screen, so the gate can stop reading partway down and still have seen the ones that matter.

Say when a screen is good. A check that only ever emits complaints gets discounted, and "the invite empty state reads well" is real information about where the bar is.

Never edit anything. This check writes no code and files no blocking findings — its entire output is one section of the final report.

## Report

```text
design-quality (advisory)
  /invites [mobile]   Empty state is one centred line of grey text. Everything
                      else here has an illustration and a primary action —
                      propose matching the /projects empty state.
  /invites [desktop]  Table stretches to 1440px; rows read as disconnected at
                      that width. Propose a max-width matching /projects.
  /invites/:id        "Resend" and "Revoke" are styled identically; revoke is
                      destructive and should not compete with the safe action.
  Good: the pending/accepted status treatment reads instantly at both widths.
```
