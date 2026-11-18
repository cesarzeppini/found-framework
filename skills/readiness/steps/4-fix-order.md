# Step 4: Fix order

Turn ninety findings into a sequence someone can actually work through. Each stage becomes one run of Found's pipeline: `spec this: baseline stage 3`. So each stage has to be something a spec can describe and a single review can judge.

## Ordering

1. **Stage 0: before any code.** Things done outside the repository, or that make the rest safe to do: revoke a committed token, remove tool folders that carried it, repair a migration history so fixes can reach production, turn on dependency alerts. Mark each one **human-required** (`skills/build/references/wizard.md`).
2. **Root causes before their symptoms.** One setting that causes thirty findings is one stage, done first. At Kancha, the default grants to anonymous visitors (A16) caused most of the access findings, and a single migration closed nine of them.
3. **Then by what the holes let someone do:** money and destroyed records, then exposed data, then everything else.
4. **Known unfinished work** gets its own stages, after the defects, labelled `not built`.
5. **Platform settings and accounts** come last as their own stage. Most of it is a checklist for a person, not code.

## Each stage lists

- **Closes:** the finding ids.
- **What changes,** as behaviour, not implementation: "the seller never receives the PIN, from any table, function or live channel". This is what the stage's spec starts from.
- **Proofs:** the proofs that flip from expected-to-fail to passing. These are the stage's acceptance criteria.
- **Must ship with:** stages whose changes are only safe together. At Kancha, making account deletion work (stage 1) without stopping deletes from cascading (stage 6) would have let one deletion erase the other party's paid deals. Say it on both stages.
- **Decisions it depends on,** cited from step 2.

## Fixing a stage, later

When a stage runs through the pipeline, build's first move for each proof is removing its expected-to-fail marker. The proof then fails for real, and the fix works until it passes. This is the same "the fix starts with the proof" rule from `proofs.md`.

## Done when

Every finding except `low` is in exactly one stage, or is listed as deliberately left with a reason. Every stage lists its proofs. Every must-ship-with pair is written on both sides.

→ Next: `5-report.md`
