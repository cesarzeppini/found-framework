# Stack profiles

A **stack profile** holds the security rules specific to one platform: what that platform leaves open by default, and how to close it. The general rules in a project's `context/STACK.md` say *what* must be true ("every row is reachable only by the people it belongs to"). The profile says how that goes wrong on this platform, and what to do about it.

A project names its profile in `context/STACK.md`:

```
stack-profile: supabase
```

That key resolves to `references/stacks/<name>.md`. A project on several platforms lists several profiles, separated by commas. A project on a platform with no profile writes `stack-profile: none`. Setting it to `none` is a recorded decision, not a gap.

## Who reads it

| Reader | Uses |
|---|---|
| build | **Build rules**, applied inline in the slice that creates the thing |
| security-audit | **Audit checks**, plus **Linter** when the profile names one |
| proofs | **Proofs on this stack**: how the local stack starts, which keys are test keys |
| readiness | **Settings outside the repository**, for wizard steps |

## Shape

Every profile has the same five sections, under those exact headings, so each reader finds its part without reading the rest:

1. **Build rules.** Each rule is something the builder does, followed by the finding it prevents.
2. **Audit checks.** What the audit looks at on this platform, beyond the general list.
3. **Linter.** The platform's own checker, and how to run it locally. Write `none` if there isn't one.
4. **Proofs on this stack.** Starting the local stack, making test accounts, recognising test keys.
5. **Settings outside the repository.** Dashboard settings that matter, each with its page path.

Each rule comes from a finding that actually happened, and the profile says which. A rule nobody can trace to a real failure gets cut at the next edit.
