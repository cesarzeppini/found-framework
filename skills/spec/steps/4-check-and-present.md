# Step 4 — Check, state, present

1. Run `scripts/spec-no-code.mjs` and clear any hits.
2. **State what you detected, in one line**, before the draft: stack, what already exists, what's missing. "Detected: Next app router + Supabase Auth, invites table absent, no existing empty-state pattern on this route — drafting against `/projects` conventions." A wrong assumption caught here costs a sentence; caught at review it has propagated through every slice.
3. Present the draft with the question round — the "actually ask" bucket only, formatted per below.
4. Revise against the answers.

**One round of questions, not twenty.** Unlike an open-ended interview, this round doesn't reopen once answered — if a second round feels necessary, the missing thing almost always belonged in assumptions instead of a question. Get the one round right rather than planning to iterate it.

## Format each question as a proposal, not a blank

Number every question and give it a title, so an answer can reference "2: yes" instead of restating the question. Every question carries **one recommended answer**, stated with its reasoning, not left open for the human to fill in from nothing:

```text
❓ Q1 — Success metric: PRODUCT.md frames this as an onboarding problem.
Is activation rate at 7 days the right number for this feature to move,
or is there a different one you're actually watching?

➡️ Recommended: activation rate at 7 days — it's the first number PRODUCT.md's
onboarding framing would move, and Ship's collateral won't claim more than
this metric supports.
```

A human corrects a proposal faster than they compose an answer from nothing — that's the entire justification for drafting instead of asking, and it applies just as much inside the one bucket that does ask. A question with no recommended answer is a step 1 that gave up too early.

## Facts are your job, never the human's

Before a question goes in the round, ask whether it's answerable by looking rather than asking — the codebase, the database, a live page, an existing config file. If it is, that's step 1's job: go read it. A question the round could have derived costs the human's attention for something the agent could have spent its own tool calls on instead. The round exists only for what genuinely can't be derived and where a wrong default is expensive — see step 1's three buckets.

→ Next: `steps/5-stop-and-report.md`
