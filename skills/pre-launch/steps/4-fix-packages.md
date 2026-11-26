# Step 4: Fix packages

Turn the findings into a sequence someone else can work through. The audit fixes nothing, so each package goes to a separate build session: one pull request per package, or one pipeline run (`spec this: pre-launch package 3`). Each has to be something a spec can describe and a single review can judge.

## Ordering

1. **Package 0: before any code.** Things done outside the repository, or that make the rest safe: revoke a committed key, remove a tool folder that carried a token, repair a migration history so fixes can reach production, turn on dependency alerts. Each is marked **human-required** (`skills/build/references/wizard.md`).
2. **Root causes before their symptoms.** One setting behind thirty findings is one package, done first. A default that opens every new table to signed-out visitors is the classic case.
3. **Then by what the holes let someone do:** money and destroyed records, then exposed data, then everything else.
4. **Known unfinished work** gets its own packages after the defects, labelled `not built`.

## Each package lists

- **Closes:** the finding ids.
- **What changes,** as behaviour, not implementation. This is what the package's spec starts from.
- **Proofs:** the proofs that move into the suite and must go from `PROVEN` to `NOT PROVEN`. These are the acceptance test. The build session's first move is putting each one in the suite and watching it fail for the reason the finding gives.
- **Must ship with:** packages whose changes are only safe together, written on both sides. Making account deletion work without stopping deletes from cascading could let one deletion erase the other party's paid orders.
- **Decisions it depends on,** cited from the map.
- **Verify after deploy:** what to check on staging through the API and the database once it's live, not by screenshot.

## The dashboard list

Settings only an account owner can change are not a package. Each gets one line: **service, page, setting, finding id**. Where the steps are long or unfamiliar, generate a wizard script for them (`skills/build/references/wizard.md`) rather than a paragraph.

## Done when

Every finding except `low` is in exactly one package, on the dashboard list, or listed as deliberately left with a reason. Every package lists its proofs. Every must-ship-with pair is written on both sides.

→ Next: `5-report.md`
