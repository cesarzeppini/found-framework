---
name: code-quality
description: Runs once at end of feature, reading the full diff against any coding standards the repo documents plus a fixed smell baseline. The Standards half of review, next to the user-story test's Spec half — a feature can pass one and fail the other. Breach of a documented repo standard blocks; baseline smells are judgment calls that never block. Triggers during review, alongside the other checks.
---

# code-quality

Runs **once**, at end of feature, over the full diff since Plan's starting point. Same diff design-system-guard and security-audit read.

## Why this exists next to the user-story test

The user-story test asks whether the feature does what the spec asked — **Spec**. This check asks whether the code that does it is any good — **Standards**. The two are independent: code that follows every convention can still implement the wrong thing, and code that implements exactly the right thing can still be a mess nobody wants to maintain. A feature can pass one and fail the other, and reporting them separately is what stops one masking the results of the check the pipeline actually ran.

This is not design-system-guard. That check enforces approved components and tokens — whether the UI is built from the right parts. This checks whether the code itself, UI or not, is shaped well: named clearly, free of duplication, not doing more than one thing per module.

## Why there's no script

**Judgment-only, deliberately**, same reasoning as `security-audit` and `design-quality`. Duplicate code, a long function, a misleading name — these are shape judgments about a diff, not properties a line-based scanner can see reliably. What the project's own linter and type checker already enforce continuously is exactly the mechanical layer this check must **not** re-do; re-flagging it would be noise on top of a tool that already blocks the commit.

## Inputs

**Repo-documented standards**, if they exist: `CODING_STANDARDS.md`, `CONTRIBUTING.md`, or whatever `context/STACK.md` names under "How it was built." If none exists, say so in the report rather than inventing one — an undocumented repo has no Standards half beyond the baseline below.

**The smell baseline**, always in force regardless of what the repo documents:

| Smell | What it is | Fix |
|---|---|---|
| Mysterious name | A function, variable, or type whose name doesn't reveal what it does or holds. | Rename it. If no honest name comes, the design is the actual problem. |
| Duplicated code | The same logic shape appears in more than one hunk or file in the diff. | Extract the shared shape, call it from both. |
| Feature envy | A function reaches into another module's data more than its own. | Move the function onto the data it envies. |
| Data clumps | The same few fields or parameters keep travelling together. | Bundle them into one type, pass that. |
| Primitive obsession | A primitive or string standing in for a domain concept that deserves its own type. | Give the concept its own small type. |
| Repeated conditionals | The same `switch`/`if`-cascade on the same value recurs across the diff. | Replace with polymorphism, or one shared lookup. |
| Shotgun surgery | One logical change forced edits scattered across many files in the diff. | Gather what changes together into one module. |
| Divergent change | One file or module is edited for several unrelated reasons in this diff. | Split so each module changes for one reason. |
| Speculative generality | Abstraction, parameters, or hooks added for needs the spec doesn't have. | Delete it; inline back until a real need shows. This is the minimum-viable rule's own smell — see RULES.md. |
| Message chains | Long `a.b().c().d()` navigation the caller shouldn't depend on. | Hide the walk behind one method on the first object. |
| Middle man | A function or module that mostly just delegates onward. | Cut it, call the real target direct. |
| Refused bequest | A subclass or implementer that ignores or overrides most of what it inherits. | Drop the inheritance, use composition. |

**The repo overrides.** A documented standard always wins over the baseline — where it endorses something the baseline would flag, suppress the smell. Every smell here is a labelled heuristic, never a hard violation, and always a judgment call: skip anything the project's own tooling already enforces.

## Severity and blocking

This departs from RULES.md's default critical/serious/moderate/minor scale — severity here isn't measured by user impact, since a smell has none on its own. It's measured by whether a documented rule was broken:

| Source | Handling |
|---|---|
| Breach of a **documented** repo standard | Blocking, per RULES.md's retry limit. Survives its attempts → the run ends into the report. |
| **Baseline smell** | Always advisory. Never blocks, however severe it looks — these are judgment calls about shape, not defects. |

**Park, don't guess** when the fix would change behaviour, not just shape — extracting a function is safe to do inline; restructuring how two modules communicate is a design decision the report should carry, not one this check makes unilaterally.

## Report

**Report decisions, not activity** (RULES.md): findings, not the files walked to reach them. One result for the check, including when it's clean.

```text
code-quality
Blocking (1)
  CODING_STANDARDS.md#3  src/api/invites.ts     repo requires typed API responses;
                          this handler returns `any`
Fixed (1)
  Duplicated code        src/lib/format.ts,
                          src/routes/invite.tsx  date formatting logic duplicated
                          across two files; extracted to formatInviteDate()
Advisory (2)
  Divergent change       src/routes/invite.tsx  this file changed for both the
                          new invite flow and an unrelated copy fix; propose
                          splitting the copy fix into its own commit
  Speculative generality src/lib/queue.ts       retry-with-backoff added for a
                          failure mode the spec doesn't mention; nothing in this
                          feature calls it with a nonzero retry count
Good: the invite state machine reads cleanly through one small reducer.
```

Clean runs report `code-quality: clean (N files, standards: <source or "baseline only">)`.
