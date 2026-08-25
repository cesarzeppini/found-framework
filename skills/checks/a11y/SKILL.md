---
name: a11y
description: Runs once at end of feature, over the same browser pass that captures the screenshots. axe-core catches the mechanical violations; a judgment layer covers keyboard traps, focus order, and labels that exist but say nothing. Blocking on critical and serious findings. Triggers during review, on every route in the spec's affected-screens list.
---

# a11y

Runs at end of feature, over the same browser pass as the screenshots — one run, two outputs. Blocking.

## Deterministic pass

```bash
node scripts/screenshots.mjs --base <url> --routes <affected screens> --out work/<feature>/out/screens --axe
```

If `run` was invoked with `--no-screenshots`, add `--no-images`: the browser still navigates every route and axe still runs, the PNGs just aren't written. This check never skips because screenshots were turned off — the two are independent outputs of the same pass.

axe-core runs against WCAG 2.0/2.1 A and AA on every route at both viewports, and writes `out/screens/a11y.json`. The script exits non-zero when anything critical or serious is found.

Run it at both viewports deliberately: contrast and focus behaviour differ between them, and a mobile nav that traps focus usually passes on desktop.

## What axe cannot see

axe reliably catches roughly a third of real accessibility problems — the mechanical third. The rest is this pass's job, on the routes the feature touched:

**Keyboard.** Tab through the feature start to finish. Every interactive element reachable, focus visible at every stop, no trap that can't be escaped, and modals returning focus to the control that opened them. A feature that works only with a mouse passes axe cleanly.

**Focus order.** Does it follow the visual order and the reading order? A grid that tabs down columns when it reads across rows is disorienting and entirely invisible to a linter.

**Labels that say nothing.** axe checks a label exists, not that it means anything. "Click here", "Button", an icon button labelled `icon-button`, four links all reading "Read more" — all pass mechanically and all fail a screen reader user.

**Announcements.** Content that changes without a page load — validation errors, toasts, live results, loading states — needs to reach assistive tech. Silent updates are the most common real-world failure in a modern app.

**Motion.** Anything animated should respect a reduced-motion preference.

## Severity and blocking

Severity thresholds and the retry limit come from RULES.md — axe's scale maps onto them directly, so this check adds only what's specific to it:

| Severity | Handling |
|---|---|
| critical, serious | Blocking, per RULES.md. |
| moderate, minor | Park, per RULES.md. Fix in place when the fix is unambiguous. |
| judgment findings | Rate on user impact, not on axe's absent verdict. A keyboard trap is critical however it was found. |

Blocking never means waiting for a human. If a critical finding survives its fix attempts, the run **ends** and the finding goes to the final report with what was tried.

**Park, don't guess** when the fix changes what the interface says or does — rewriting a label alters user-facing copy, which is spec territory, and restructuring headings can change the visual hierarchy someone chose. Park it with the specific replacement proposed, so the gate is one decision rather than an investigation.

## Report

**Report decisions, not activity** (RULES.md): findings, not the routes you walked or the assertions axe ran. One result for the check — including when it's clean, so a check that never ran can't be mistaken for one that found nothing.

```text
a11y check
Blocking (1)
  /invite [mobile]  serious  color-contrast — "Resend" 3.1:1 against surface, needs 4.5:1
Fixed (2)
  /invite           critical button-name — icon button given an accessible name
  /invite [mobile]  moderate landmark-unique — second <nav> labelled
Parked (1)
  /invite  link text "Read more" repeated 4x; each needs distinct text — proposed:
           "Read more about <invitee name>" (changes user-facing copy, spec territory)
```

Clean runs still report: `a11y check: clean (7 routes, 2 viewports)`.
