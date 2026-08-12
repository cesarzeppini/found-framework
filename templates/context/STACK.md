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

If any of these is missing, standing it up is a Stage 0 task — the slice gates have nothing to run otherwise.

## Registry `[ask]`

> **Read by `design-system-guard`.** Keep the `registry:` key and give it a real path.

```
registry: <path or route, e.g. /design or .storybook>
```

The human-curated surface that renders every approved component. A component is approved only if it's imported and rendered there.

Not a components directory. That folder accumulates things nobody approved; the registry is the deliberate, reviewed surface. Guard parks anything it finds outside it rather than guessing.

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

Where the published legal text lives, so the check can read the live wording before claiming a document is affected. A document the project doesn't have is marked `none` explicitly — that is a real answer, and it stops the check inventing a path.

`none` means the document doesn't exist yet, not that it isn't wanted: if a feature triggers a document marked `none`, Ship drafts it from scratch rather than reporting the gap. Use a path the moment one exists.

## Known constraints `[derive → confirm]`

Standing technical limits: rate limits, platform quirks, things that are hard to change, parts of the codebase that are fragile and why.
