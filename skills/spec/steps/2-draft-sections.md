# Step 2 — Draft every section

Write the **full draft**, every section, assumptions included. Nothing is left for a later round.

Write all of these, in this order.

**Intent** — what changes for the user, and why now. *Asked.*

**Acceptance criteria** — user-observable statements: "a signed-out visitor who submits the form sees a confirmation and receives an email." This is what the end-of-feature user-story test runs against and what Plan slices against. Without it, nothing defines what the test checks. *Drafted.*

**States and edge cases** — empty, loading, error, permission-denied, offline, first-run, too-much-data. The largest single source of features that end up 80% built: if the spec doesn't list them, the builder ships the happy path. *Drafted, using the project's existing conventions.*

**User-facing copy** — button labels, empty state text, error messages, confirmation wording. Copy is spec-level because it is behaviour, not implementation. If it isn't here the builder invents it, and voice-guard ends up arguing with something already shipped. *Drafted.*

**Data model** — entities, relationships, what each field means, what is required. In prose. No SQL and no type definitions — the code-free rule holds — but the builder needs it and it isn't implementation. *Derived where a schema exists.*

**Permissions** — who can see it, who can do it, and what happens when someone who can't tries. *Derived from existing auth patterns.*

**Affected screens** — the real route paths this feature touches. Doubles as the screenshot capture list in Review, so the paths must be real. *Derived.*

**Prerequisites** — third-party accounts, API keys, external dependencies that must exist before work starts. *Derived.*

**Rollout** — feature flag or not, migration order, how to reverse it. *Drafted.*

**Assumptions** — what is being taken as true without checking. Stated so they can be wrong out loud rather than silently. This is the escape valve that keeps the question list short. *Derived.*

**Open questions** — unresolved items, each marked blocking or non-blocking. Blocking ones stop Plan. *Mixed.*

**Success metric** — how you'll know it worked after it ships. Also the ceiling on what Ship's collateral is allowed to claim. *Asked.*

**Constraints** — five sub-sections:

- *Out of scope* — explicit non-goals. The most valuable lines in the file; without them the pipeline helpfully builds three adjacent things nobody asked for. *Drafted.*
- *Overrides* — where minimum-viable is dangerous. See `steps/3-overrides.md`. *Drafted.*
- *Security surface* — what this feature touches: new tables, new endpoints, auth changes, user input, file uploads, third-party keys. Not checks, just surface — security-audit reads this. *Derived.*
- *Compliance surface* — the same facts read for a different consequence: new personal data collected, new third-party processors, new cookies or trackers, changed retention, changed data location, anything touching minors or payments. **Empty for most features, and an empty field is a checked box, not a skipped one** — write "none" rather than omitting the field, so a later reader can tell it was considered. Read alongside the jurisdiction in STACK.md, since what counts as consequential depends on it. *Derived.*
- *Data rules* — what must not be lost, whether migrations must be reversible. *Drafted.*
- *Effort ceiling* — the only legitimate mid-run halt. Filled from the plan's slice estimate once Plan runs; leave it stated as "to be set by Plan" in the approved spec. *Drafted from the plan's estimate.*

→ Next: `steps/3-overrides.md`
