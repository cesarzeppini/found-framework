---
name: build
description: Executes tasks.md — Stage 0 prep first, then vertical slices, each gated on implement → test → full suite → pass or stop. Standard tier. Applies the minimum-viable rule and inline security, runs design-system-guard on UI slices, and parks ambiguity instead of asking. Triggers once tasks.md exists and the spec is approved.
---

# Build

Execute `work/<feature>/tasks.md`. Standard tier unless a task package says otherwise.

## Stage 0 — prepare

Before any feature work, a pass over the existing codebase and database to make it ready for what's arriving: refactors, renames, extractions, dead code removal, schema changes the incoming feature needs.

Read SPEC.md so you know what to prepare for, and `context/GLOSSARY.md` so renames and extractions land on the project's own vocabulary rather than inventing a parallel one. **Ship no feature behaviour.**

If a prep task makes a call that's hard to reverse, would surprise a reader without the context, and came from a real trade-off, write it to `docs/adr/` before moving on — the three-part test in `templates/ADR-FORMAT.md`. Most prep tasks don't clear that bar; don't manufacture one that isn't there.

**The gate: tests still pass and the app behaves identically.** If behaviour changed, it wasn't a refactor — revert and recut the task.

If the project has no test runner, standing one up is Stage 0's job; the slice gates have nothing to run otherwise. Same for the screenshot harness if it isn't configured. Stage 0 is sequential throughout.

A task Plan marked **human-required** — a credential, a dashboard click-through, a one-off migration only a human should run — is not attempted and not a retry target. See [`references/wizard.md`](references/wizard.md): generate the setup script it describes, then end the run into the report naming the script's path. This is the unmet-assumption case in RULES.md, not a blocking-gate failure.

## Then slices

Each slice, in order:

**implement → write the test for the new behaviour → run the full suite → pass, or stop.**

Not "build now, test later." A slice that passes only because no test exists for it hasn't passed. The failure this prevents is building ten slices and discovering at review that slice three never worked.

Write the test through the **seam** the task package named, not whichever one is easiest to reach from inside the slice. A test that goes around the named seam to assert on something else is a sign the seam was wrong, not licence to pick a new one mid-slice — recut the task package's seam and park the discrepancy instead.

A test that exists is not the same as a test that protects the slice. Before running the suite, check the test just written against [`references/good-tests.md`](references/good-tests.md) — the two failure modes that make a green suite meaningless: a test coupled to how the behaviour is implemented rather than what it does, and a test whose expected value is derived the same way the code derives it, so it can't disagree with a wrong answer. Both pass the suite and protect nothing.

Run the **full** suite, not just the new test. The new test passing while an old one breaks is the single most common way a slice looks green and isn't.

A failing slice blocks the next one. **Sequential by default** — parallelism only where the task package marks two slices provably independent, which is rarer than it looks.

If a slice is marked test-exempt, say so out loud in its result line. An exemption that passes silently is indistinguishable from a skipped test.

### When a slice won't pass

Fix it. Blocking never means waiting for a human: attempt the fix, re-run, and repeat up to the bounded retry limit in RULES.md, unless the task package sets a different one.

Three attempts spent guessing at the same fix from three angles is three attempts wasted. See [`references/diagnosing-failures.md`](references/diagnosing-failures.md) for spending them well: confirm and minimise the failure first, rank falsifiable hypotheses before the first attempt, and spend each attempt on the next untested one rather than a variation of the last.

If it still fails, **end the run** and hand the report what failed, at which slice, the ranked hypotheses and what each attempt actually showed, and the last error. Do not proceed to the next slice on a red suite, and do not sit waiting for input.

## The minimum-viable rule

**Build the simplest thing that delivers the value in this slice.** No speculative abstraction, no premature scaling, no "we might need this later."

The justification lives in `context/COMPANY.md`, not here — team size, resources, user numbers. As those numbers grow the constraint loosens on its own.

The exceptions are the overrides listed in SPEC.md. **Anything not listed there is minimum-viable.** If a slice seems to need hardening that no override covers, that is a parked decision, not a licence.

## Security applied inline

Not everything waits for the audit. RLS on a new table is cheap during the slice that creates it and expensive to retrofit once data and code depend on it.

Apply the obvious ones as you go, using the baseline rules in `context/STACK.md`: row-level security on tables you create, parameterised queries, auth on new routes, validation on user input at the boundary. The end-of-feature audit is the net, not the only line.

Inline security is not an override. It's the floor, and it doesn't need a spec entry to justify it.

## UI slices

Any slice touching UI also runs `skills/checks/design-system-guard` before its gate. Auto-fixes apply inside the slice. Ambiguous cases don't block — they park and surface in the final report next to the screenshots.

User-facing strings introduced by a slice run through `skills/checks/voice-guard`. Copy that SPEC.md already specifies is used verbatim; the check is for strings the slice had to invent.

## Park, don't ask

Anything ambiguous mid-slice: make the reversible choice, log it, keep going. The final report carries it.

Park with the alternative named — "used the existing empty state pattern; the spec's wording suggests a lighter one" is reviewable, "made a judgment call on the empty state" is not.

Irreversible or genuinely blocked items also go to the report, as questions rather than decisions. The only legitimate mid-run halt is the spec's effort ceiling: if the slice count blows past it, stop and report.

## Result block

**Report decisions, not activity** (RULES.md). Nobody needs the files you created or the commands you ran — the diff already says that. One block per slice, then one handback at the end of the build.

End every slice with this block.

```text
Slice 3 — invite acceptance
  Tests      4 added, 61 passed, 0 failed
  DS guard   clean
  Parked (1) src/routes/invite.tsx:22  used existing toast for expiry error;
             spec implies an inline message
```

The test and check lines are one result each, not a narration of every assertion — that distinction is what keeps a slice block readable.

At the end of the build, hand back briefly:

- anything invented that the spec didn't ask for, and why the slice needed it
- anything in the existing setup that changed beyond Stage 0's plan
- **any ADR written during Stage 0**, and why it cleared the three-part test
- **where you'd argue with the spec**: criteria that turned out untestable, states that didn't exist, copy that didn't survive contact with the interface. Build is where a spec's wishful thinking becomes concrete, and nothing downstream will notice it as clearly.
