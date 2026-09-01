---
name: code-quality
description: Runs once at end of feature, checking the full diff against any coding standards the repo documents, calling Anthropic's `/code-review` plugin for correctness bugs and general simplification/reuse/efficiency cleanup, and watching for the diff quietly weakening its own checks (a moved threshold, a skipped test, a new suppression comment, an unowned exception). The Standards half of review, next to the user-story test's Spec half — a feature can pass one and fail the other. Breach of a documented repo standard or a weakened check blocks; correctness bugs from `/code-review` are rated on RULES.md's normal scale; simplification-only findings stay advisory. Triggers during review, alongside the other checks.
---

# code-quality

Runs **once**, at end of feature, over the full diff since Plan's starting point. Same diff design-system-guard and security-audit read.

## Why this exists next to the user-story test

The user-story test asks whether the feature does what the spec asked — **Spec**. This check asks whether the code that does it is any good — **Standards**. The two are independent: code that follows every convention can still implement the wrong thing, and code that implements exactly the right thing can still be a mess nobody wants to maintain, or hide a bug nothing else caught. A feature can pass one and fail the other, and reporting them separately is what stops one masking the results of the check the pipeline actually ran.

This is not design-system-guard. That check enforces approved components and tokens — whether the UI is built from the right parts. This checks whether the code itself, UI or not, is correct and shaped well.

## Two jobs, two owners

**Documented standards — this check's own job, deliberately no script.** Same reasoning as `security-audit`: whether a project's own written convention was honoured is a judgment call, not a pattern a scanner catches reliably. What the project's own linter and type checker already enforce continuously is exactly the mechanical layer this check must **not** re-do; re-flagging it would be noise on top of a tool that already blocks the commit.

Read `CODING_STANDARDS.md`, `CONTRIBUTING.md`, or whatever `context/STACK.md` names under "How it was built." If none exists, say so in the report rather than inventing one — an undocumented repo has no Standards half beyond whatever `/code-review` finds below.

**Correctness bugs and general cleanup — `/code-review`'s job, not reinvented here.** Anthropic's `code-review` plugin already hunts correctness bugs and reuse/simplification/efficiency issues across a diff — this used to be a bespoke smell list in this check, which duplicated it without catching actual defects. Call the plugin instead:

```
/code-review --high
```

`--high` because this runs at end-of-feature, not as a quick local pass — broader coverage is worth the extra findings here. Fold its findings into this check's report by category (below), rather than repeating them as a separate section.

Bundled with Claude Code itself — unlike the `codex-plugin-cc` plugin in `skills/review/SKILL.md`, there's no separate marketplace install. **If `/code-review` isn't available in the harness this runs in, say so plainly in the report and continue** — the documented-standards pass above still runs; only the bug-hunting half is missed for this run.

**The repo overrides.** A documented standard always wins over anything `/code-review` flags — where it endorses something the plugin would flag, note the override and don't report it.

## Guard the bar itself, not just the code

An agent under pressure to turn a red check green doesn't craft clever workarounds — it takes the cheapest path to green, and the cheapest path is usually to weaken the thing doing the checking rather than fix what it's checking. This is the diff pattern that's invisible if code-quality only asks "is this code good": look instead for whether *the checks themselves* got quietly turned down. Five moves, checked against the diff every run:

1. **A threshold moved.** A coverage or performance budget lowered, a lint rule downgraded or removed, a check dropped out of CI config — compare the project's lint/test/CI config against its state at the branch point.
2. **A test got easier.** `.skip` added, a test file deleted, assertions pulled out of a test that stayed.
3. **A checker got silenced.** A new `@ts-ignore`, `eslint-disable`, `# noqa`, `# type: ignore`, or equivalent suppression comment where none was there before.
4. **Work is unfinished but looks done.** A stub that throws `Not implemented`, an empty `catch {}` swallowing a failure into silence, a `TODO` sitting where the real logic belongs.
5. **An exception appeared with no owner.** A new allowlist entry, ignore-rule, or carve-out that nobody's name is attached to.

None of these need new tooling — they're all visible in what the diff added or removed. **Always blocking**, regardless of what triggered it: an agent shouldn't be able to make its own gate easier to pass, and the fact that this pattern exists at all is worse news than any single finding it turns up. Tightening a check is never a finding; only loosening one is.

## Severity and blocking

Three sources, three rules:

| Source | Handling |
|---|---|
| Breach of a **documented** repo standard | Blocking, per RULES.md's retry limit. Survives its attempts → the run ends into the report. |
| `/code-review` finding, category `correctness` | Rated and handled on RULES.md's normal severity scale (critical/serious block, moderate/minor park) — a real bug is a real bug regardless of which tool found it. |
| `/code-review` finding, any other category (`simplification`, `efficiency`, reuse, altitude, …) | Always advisory. Never blocks, however severe it looks — these are judgment calls about form, not defects. |
| A **guard-the-bar** finding (above) | Always blocking, regardless of how small the specific instance looks — the finding isn't the one suppressed line, it's that the gate got weakened at all. |

**Park, don't guess** when a fix would change behaviour, not just shape — extracting a function is safe to do inline; restructuring how two modules communicate, or changing what a query returns, is a design decision the report should carry, not one this check makes unilaterally.

## Report

**Report decisions, not activity** (RULES.md): findings, not the files walked to reach them. One result for the check, including when it's clean.

```text
code-quality
Blocking (3)
  CODING_STANDARDS.md#3   src/api/invites.ts      repo requires typed API responses;
                          this handler returns `any`
  correctness (high)      src/api/invites.ts:41   /code-review: tenant id read from
                          the request body, not the authenticated session — a client
                          can pass anyone's id
  guard-the-bar           vitest.config.ts        coverage threshold lowered from
                          80% to 60% in this diff to get the new slice's tests green
Fixed (1)
  correctness (medium)    src/lib/format.ts:12    /code-review: off-by-one in the
                          pagination offset, fixed
Advisory (2)
  simplification          src/lib/queue.ts        /code-review: retry-with-backoff
                          added for a failure mode the spec doesn't mention
  efficiency               src/routes/invite.tsx   /code-review: re-fetches the same
                          list on every keystroke instead of debouncing
Good: the invite state machine reads cleanly through one small reducer.
```

Clean runs report `code-quality: clean (N files, standards: <source or "baseline only">, /code-review: clean)`. If the plugin was unreachable: `code-quality: standards clean; /code-review unavailable this run`.
