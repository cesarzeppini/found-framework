# Step 3 — Draft the overrides

The minimum-viable rule is overridable, but only with a stated reason, and the decision is recorded once — here.

It can't be decided before the spec: nobody knows what needs hardening until the feature is on the table, and auth only matters once the feature is known to touch accounts. So draft the overrides here, judged against COMPANY.md, PRODUCT.md and STACK.md, and let them arrive as part of the spec under review. Wrong ones get struck, missing ones added. **Never a separate interruption.**

It can't be left to the builders either — they run in isolated contexts, so each would decide separately and none of the reasoning would be written down.

Write overrides as **bars, not solutions**. The spec sets the bar; the builder picks what clears it.

Sanity-check the drafted overrides with a reasoning-tier pass before presenting: each one should name a real risk from COMPANY.md or the security surface, not a general preference for robustness. Anything not listed as an override is minimum-viable by default.

→ Next: `steps/4-check-and-present.md`
