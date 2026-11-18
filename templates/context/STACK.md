# Stack

The standing technical facts of this project. Not a feature's implementation — the ground every feature is built on.

STACK.md changes what the spec has to ask about. If production-grade auth is already in place, "session handling must be production-grade" is satisfied by default and the spec skill doesn't raise it as an override.

## How it was built `[derive → confirm]`

The history that still constrains the code: what scaffolded it, what was migrated, where it's edited now. Matters because it explains patterns that otherwise look arbitrary.

## Runtime `[derive]`

Language, framework, versions. Hosting and deploy target. How the app is run locally, including the dev server command and port — `asset-producer` needs this to capture screenshots.

## Data `[derive]`

Database and version. Where the schema lives, how migrations are written and applied, whether they're reversible by default.

## Auth `[derive]`

How authentication works, where sessions live, how authorisation is expressed. Whether row-level security is applied and to which tables.

## Testing `[derive]`

Test runner, how the suite is invoked, where tests live, what "the full suite" means. Browser/screenshot harness, if configured.

How the local stack is started and reset, for proofs (the security tests that attack it, local only — `skills/checks/security-audit/references/proofs.md`).

If any of these is missing, standing it up is a Stage 0 task — the slice gates have nothing to run otherwise.

## Approved components `[ask]`

> **Read by `design-system-guard`.** Keep the `components:` key and give it a real path.

```
components: <path>[, <path>...]   e.g. src/components/ui, src/components/app
```

Where the design system's components live. **List as many directories as the project has** — hand-built components and generated plumbing usually sit in different folders, and the guard checks every directory listed. Living in one of them is not approval.

**A component is approved when its own file carries an `@approved` marker in a comment within the first 5 lines** — that marker is the entire registry. The window is deliberate: the marker has to be where someone opening the file sees it, not buried further down. A marker below line 5 does not count, and the component reads as unapproved.

The guard scans these directories, treats marked files as the approved list, and parks every use of an unmarked one. Import paths are matched by directory tail, so whatever alias the project uses — `@/`, `~/`, or a relative path — resolves the same way.

**An incomplete list is reported, not obeyed.** Every run, the guard looks for component directories the project has and this key doesn't mention, and reports them as a finding. A directory nobody listed is never examined — its components are neither approved nor flagged — and that silence is indistinguishable from a directory with nothing wrong in it.

```
components-ignore: <path>[, <path>...]   e.g. src/components/icons
```

Use this for directories that genuinely aren't design-system components — icon files, generated output, a legacy folder being retired. The point is that the exclusion is **written down and deliberate**, rather than inferred from an absence nobody notices.

**Only a human adds the marker.** Agents may add it when explicitly asked to in the moment ("mark Button as approved") and never on their own initiative — not during a run, not as a fix for a parked item, not because a component looks done. An agent that can approve its own components turns the check into a mirror.

Expect everything to be unapproved on a new project. That is the correct starting state; mark components as they're actually reviewed.

## Typography base `[derive → confirm]`

> **Read by `design-system-guard`.**

```
typography-base: <true|false>
```

`true` when the CSS base layer already styles semantic elements — headings, paragraphs, links, `<strong>`, lists, labels — with size, weight, colour, tracking and leading. The guard then flags typography utilities on those elements, since re-specifying what the base layer sets defeats the type scale.

`false` on projects where utilities are the only styling.

**Set it either way.** If the key is absent the guard scans your CSS: a base layer found with no key set is reported as a finding, and no base layer found asks you to record `false`. Writing the answer down is what ends the message.

## Checks enabled `[ask]`

Which of `skills/checks/` run on this project, and any project-specific configuration. A check that can't run here — no UI, no browser — is switched off explicitly, never left to fail silently every run.

## Baseline security rules `[ask]`

What "secure by default" means on this stack, concretely: RLS on every new table, parameterised queries only, auth required on new routes unless stated, validation at the boundary, secrets in the environment.

The builder applies these inline as it goes. They are the floor, not overrides — they need no spec entry to justify them.

## Legal documents `[ask]`

> **Read by `checks/compliance`.** Keep both keys. The check reports a missing jurisdiction as a finding rather than assuming one — the same change has different consequences under different regimes, and a guessed jurisdiction produces confident nonsense.

```
jurisdiction: <e.g. EU/GDPR, UK, US-California/CCPA, or several>
legal-docs:
  privacy-policy: <path in the repo, or where it is published>
  terms-of-service: <path>
  cookie-policy: <path, or "none">
  dpa-records: <path, or "none">
```

Where the published legal text lives, so the check can read the live wording before claiming a document is affected. These are pages in the repo, nothing more.

A document the project doesn't have is marked `none` explicitly — that is a real answer, and it stops the check inventing a path. `none` means the document doesn't exist yet, not that it isn't wanted: if a feature triggers a document marked `none`, Ship drafts it from scratch rather than reporting the gap. Use a path the moment one exists.

## Known constraints `[derive → confirm]`

Standing technical limits: rate limits, platform quirks, things that are hard to change, parts of the codebase that are fragile and why.
