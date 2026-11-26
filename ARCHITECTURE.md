# Found Architecture

Working document. Everything here is a decision made so far, not a proposal. Edit it as decisions change.

---

## What this is

A pipeline that turns one written spec into a shipped feature plus every piece of collateral that feature earns — changelog, blog, social, email, case studies — with a human gate before anything goes public.

Built in Claude Code first, but not built *for* it. Everything is plain markdown in harness-neutral folders, so the same set runs in Codex, Cowork, or anything else that reads skills. See Portability.

---

## Two repos, not one

The framework is one repo, installed into many projects.

**Framework repo** — skills/, agents/, scripts/, RULES.md, this doc. Versioned once, improved centrally; a fix to the build skill reaches every project.

**Each project repo** — context/, work/, and a link to the framework (git submodule, or a copy while iterating early). Every client and every product gets its own context/; the skills never change per project.

"Company-level" context files below mean *that project's company* — a client's COMPANY.md describes the client, not you.

## Framework repo layout

```
found/
  RULES.md               operating rules and standing constraints — the shared source
  CLAUDE.md              thin: points at RULES.md, skills/, context/ + tier map
  AGENTS.md              thin: same content, for Codex and anything reading AGENTS.md
  references/
    writing-skills.md     house style for every skill, step file and reference
                          file in this repo — the two loads, progressive
                          disclosure, leading words, no-op pruning. Consulted
                          whenever a skill is hand-edited or regenerated.
    finding-ids.md        how security findings are named and closed
  skills/                canonical, harness-neutral
    run/                 orchestrator: chains plan → build → review → ship after spec approval
    pre-launch/          whole-product audit before launch, outside the pipeline
    visualize/           vendored from display-dev/visualize — branded HTML artifacts
    spec/
    plan/
    build/
    review/
    ship/
    checks/
      design-system-guard/
      a11y/
      voice-guard/
      security-audit/
      compliance/
      code-quality/
      design-quality/
  agents/                predefined only — jobs identical on every run
    finish-reviewer.md
    asset-producer.md
    documenter.md
    channel-linkedin.md
    channel-twitter.md
    channel-blog.md
    channel-email.md
    ...
  scripts/                 shared scripts; a check's own script lives with the check
    prose-lint.mjs
    screenshots.mjs
    spec-no-code.mjs
  templates/
    context/             one template per context file — headers, a line per
                         section on what belongs there, and markers for what is
                         derivable from the codebase vs what must be asked.
                         The project-setup interview reads these to create a
                         project's real context/.
    ADR-FORMAT.md        format and the three-part test for a project's own
                         docs/adr/ — not a context file, since a decision is a
                         record of the past rather than a standing fact.
```

The framework repo has **no context/ of its own** — context always belongs to a project.

And per project repo:

```
<project>/
  context/               this project's facts — see Context files
    COMPANY.md PRODUCT.md BRAND.md DESIGN.md tokens.css
    CHANNELS.md STACK.md DISTRIBUTION.md GLOSSARY.md
  docs/
    adr/                 architecture decision records — see templates/ADR-FORMAT.md.
                         Created lazily; doesn't exist until the first decision needs it.
  work/
    <feature>/
      SPEC.md
      tasks.md
      wizard-<slug>.sh   only when a Stage 0 task is human-required; disposable
      out/
  found/                 submodule or copy of the framework repo
  .claude/
    skills -> ../found/skills   symlink
```

Skills are edited in place, in `skills/`. No build step, no compilation, no generated copies to keep in sync. `.claude/skills` is a symlink so Claude Code reads the same files.

Operating rules live once in RULES.md. CLAUDE.md and AGENTS.md are short pointers to it, so the two harnesses can't drift.

---

## Context files

Two tiers. Company-level files are written once and shared. Project-level files are per product.

### Company-level

**COMPANY.md** — who we are and what we can sustain. Team size, who works on product, resources, stage, user numbers, traffic, current infrastructure. Plain facts, not aspirations.

This file is what stops the pipeline building bulletproof scalable infrastructure for a product with forty users and one person maintaining it. It is a living file. When the numbers change, the constraint loosens on its own — so it needs a review cadence or it silently lies.

**BRAND.md** — the verbal identity. Strategy, positioning, messaging, the one-liner, what we claim and what we don't. Tone of voice: base rules, register, banned words, sentence patterns. Then per-channel adaptations — how we sound on the website, on LinkedIn, on Twitter, in email, in a changelog.

**CHANNELS.md** — channel mechanics, true for everyone. Character limits, link placement, image specs, hashtag conventions, whether links go in body or first comment. Mechanics are universal; voice is ours. Ship reads both.

### Project-level

**PRODUCT.md** — what we're building and for whom. Purpose, users, personality.

**DESIGN.md** + **tokens.css** — the visual identity. Colors, typography, radius, spacing, elevation. Tokens are machine-readable; tokens.css is the source of truth and DESIGN.md mirrors it.

**STACK.md** — the standing technical facts of this project. Scaffolded in Lovable, Supabase, Supabase Auth, RLS applied, moved to GitHub, refined in Claude Code. Also: where the design system's components live (approval itself is a per-file `@approved` marker), which checks are enabled, baseline security rules for this stack, where the legal documents live in the repo, and the jurisdiction they're written for. A legal document the project doesn't have is recorded as `none` — meaning it doesn't exist yet, not that it's unwanted, so a feature that requires it gets it drafted rather than skipped.

STACK.md changes what the spec has to ask about. If Supabase Auth is already in place, "session handling must be production-grade" is satisfied by default and the spec skill doesn't need to raise it.

**DISTRIBUTION.md** — which channels are on for this product, who approves, and the tier definitions (below).

**GLOSSARY.md** — this project's domain vocabulary: the terms that mean something specific here, opinionated where several words compete, with the losers listed under `_Avoid_`. Spec drafts against it, Build names against it, Review checks the diff for drift from it. Starts sparse and grows as Spec resolves a new or contested term — never a separate interruption, folded into the normal draft-and-approve flow.

### Decisions — docs/adr/

Architecture decision records live in the **project repo**, at `docs/adr/`, not in `context/` — a decision is a record of the past, not a standing fact the pipeline recalibrates against every run the way COMPANY.md is. `templates/ADR-FORMAT.md` holds the format and the three-part test for when one is warranted (hard to reverse, surprising without the context, the result of a real trade-off). Written by Plan or Build when slicing or Stage 0 surfaces a call that clears the bar; read by Spec, Plan, Build and Review for the area they're touching, alongside `context/`, so nobody quietly re-litigates or contradicts a standing decision. `docs/adr/` is created lazily — the directory doesn't exist until the first decision needs it.

**One fresh-context check before writing it** — the session that made a hard-to-reverse call is the worst-placed to judge it, having just talked itself into it. A single separate subagent gets the decision and its constraints (never the reasoning that produced it, which would bias it toward agreeing) and is asked to find a problem, not confirm the call is fine. One pass, no loop, no cross-model tooling — ADR-worthy calls are already rare by the three-part test, so this doesn't need the heavier multi-round discipline a build-time doubt-check would. A real finding means reconsider before writing; nothing real means write the ADR as planned. Skipped only when no subagent is spawnable, and the skip is said out loud rather than passed off as an equivalent self-review.

### Boundary rules

BRAND.md and DESIGN.md both sound like "brand." State the boundary in line one of each:

- BRAND.md — everything written and strategic.
- DESIGN.md — everything visual.

---

## Reporting rules

Agents report decisions, not activity. A run that narrates every file it touches buries the two lines that actually needed a human.

**Don't report:** what you're about to do, each file created, each command run, each verification that passed, restatements of what the doc already says.

**Do report, briefly:**

- judgment calls made where the spec or doc was silent, and what was assumed
- anything invented that wasn't asked for
- anything in the existing setup that was changed, and why
- contradictions found between instructions
- where you'd argue with the instruction you were given

Default to a few lines. When something needs a paragraph, write the paragraph — brevity is not a reason to hide a real problem.

This applies to skill output, subagent handbacks, and the final report alike.

## The pipeline

```
1 SPEC  →  ⟨approve⟩  →  2 PLAN  →  3 BUILD [0 prep → slice → slice → …]  →  4 REVIEW  →  5 SHIP  →  ⟨gate⟩  →  publish
```

**The run skill drives it.** `skills/run/` is the orchestrator: given an approved SPEC.md, it executes plan → build → review → ship in order, unattended, and ends by assembling the final report. Without it there is no loop — just five skills you'd have to prompt one by one.

Two human stops, no more: **spec approval at the start, final gate at the end.** Everything in between runs unattended.

Anything ambiguous mid-run is **parked, not asked**: the agent makes the reversible choice, logs it, and puts it in the final report. Irreversible or genuinely blocked items land there as questions. The one exception is the effort ceiling (below) — the only legitimate mid-run halt.

**"Blocking" never means "waits for a human."** A blocking machine gate (failed test, security finding, a11y hit) makes the run fix it; if it can't after a bounded number of attempts, the run ends early and the final report says where and why. Mid-run, the pipeline either progresses or terminates into the report — it never sits waiting.

The final report = screenshots, parked decisions, audit findings, collateral in out/. One review session on your phone, not fifteen interruptions.

**Per-run flags** override the default pipeline for one invocation, never a project setting — `context/` is untouched either way. `run`'s frontmatter carries an `argument-hint` so the available flags show up in autocomplete before a run starts, and `/run` with no feature argument prints the same list instead of running. Two exist today: `--no-screenshots` (Review still runs `checks/a11y` against the live pages, just doesn't write the PNGs — see [scripts/screenshots.mjs](scripts/screenshots.mjs)'s `--no-images`) and `--no-distribution` / `--channels=<list>` (Ship's tier × channel fan-out, overridden for this run only — `out/report.html` and legal drafting are unaffected by either). A flag that needs to persist across runs belongs in `context/` instead — a flag is for "not this time," not "not ever."

---

### 1 — Spec

Reads context/, asks the gaps, writes `work/<feature>/SPEC.md`. Reasoning tier. Stops for human review.

**Hard rule: no code in the spec.** No snippets, no implementation suggestions, no library names. Intent, behaviour, constraints only. The spec is about what matters for the company and the user; the how belongs to the task package handed to the builder.

**The depth limit: naming the stack and naming the providers is allowed; anything more specific is implementation.** The spec may say the project runs on Supabase and that invitations go out through a transactional email provider — the builder needs to know what it is building against. It may not name the client library, the method, the table or the option. Stack and providers are facts about the ground; everything below them is a choice the builder makes.

Enforced by a hook that rejects fenced code blocks in SPEC.md.

**Approval is a marker, not a remembered reply.** A hedged "looks good" or "sure" doesn't count — step 5 restates the specific thing needing a yes and waits for one. Once given, it's written down as `**Status:** Approved — <date>`, the first line under the title, the same shape as a component's `@approved` marker. `run`'s precondition checks this line, not the conversation — a spec picked up in a later session or by a different agent is approved because the file says so. The line is removed on any revision and only re-added after the human confirms the new draft.

#### How the spec gets written

Not a questionnaire. Three buckets, and only one of them involves asking.

**Derive silently.** Affected screens, data model, permissions, prerequisites, and the project's existing conventions for empty / loading / error states. In a mature codebase this is already true in the code and asking would be theatre. In a fresh project it comes from STACK.md.

**Draft, human corrects.** Acceptance criteria, edge cases, copy, out of scope, data rules, rollout. Reading a draft and striking three lines beats answering six questions. Most of the spec's volume lives here.

**Actually ask.** Only where derivation is impossible and being wrong is expensive: why now and what changes for the user, the success metric, and anything genuinely blocking.

Every asked item arrives as a **numbered proposal with a recommended answer**, never as a bare open question — a human edits a proposal far faster than they generate an answer, and a bare "what do you want?" hands back the work the spec skill exists to do. Formatted per `steps/4-check-and-present.md`: a numbered, titled question, then the recommended answer with its reasoning on its own line, so an answer can reference "2: yes" instead of restating the question. Ask genuinely open only where no defensible default exists; if that happens often, the gap is in `context/`.

**Facts are the skill's job, never the human's.** A question answerable by reading the codebase, the database, or a live page belongs in step 1, not the round — the round exists only for what can't be derived and where a wrong default is expensive.

Flow: read the codebase and context → write the full draft → **state the detected picture in one line** → present the numbered question round → revise. **One round, not an iterated interview** — unlike an open-ended grilling session this round doesn't reopen once answered; if a second round feels necessary, the missing thing usually belonged in assumptions.

The detection line — stack, what exists, what's missing — is one sentence and catches a wrong assumption before it propagates. Deriving silently is right; saying nothing about what was derived is not.

What keeps the list short is the assumptions section. Anything derived but uncertain goes there as a stated assumption instead of becoming a question. Doubt gets written down rather than interrupting.

#### SPEC.md sections

**Intent** — what changes for the user, and why now. *Asked.*

**Acceptance criteria** — user-observable statements: "a signed-out visitor who submits the form sees a confirmation and receives an email." This is what the end-of-feature user-story test runs against, and what Plan slices against. Without it nothing defines what the test checks. *Drafted.*

**States and edge cases** — empty, loading, error, permission-denied, offline, first-run, too-much-data. The largest single source of features that end up 80% built. If the spec doesn't list them, the builder ships the happy path. *Drafted, using existing project conventions.*

**User-facing copy** — button labels, empty state text, error messages, confirmation wording. Copy is spec-level because it's behaviour, not implementation. If it isn't here the builder invents it, and voice-guard ends up arguing with something already shipped. *Drafted.*

**Data model** — entities, relationships, what each field means, what's required. In prose. No SQL, no type definitions — the code-free rule holds — but the builder needs it and it isn't implementation. *Derived where a schema exists.*

**Permissions** — who can see it, who can do it, what happens when someone who can't tries. *Derived from existing auth patterns.*

**Affected screens** — the routes this feature touches. Doubles as the screenshot capture list in Review, so it has to be real route paths. *Derived.*

**Prerequisites** — third-party accounts, API keys, external dependencies that must exist before work starts. *Derived.*

**Rollout** — feature flag or not, migration order, how to reverse it. *Drafted.*

**Assumptions** — what's being taken as true without checking. Stated so they can be wrong out loud rather than silently. The escape valve that keeps the question list short.

**Open questions** — unresolved, each marked blocking or non-blocking. Blocking ones stop Plan.

**Success metric** — how you'll know it worked after it ships. Also what Ship's collateral is allowed to claim. *Asked.*

**Constraints**

- *Out of scope* — explicit non-goals. The most valuable line in the file. Without it the agent helpfully builds three adjacent things nobody asked for. *Drafted.*
- *Overrides* — where minimum-viable is dangerous. Written as **bars, not solutions**. Not "use Supabase Auth" — that's implementation. Instead: "session handling must be production-grade, not hand-rolled." The spec sets the bar; the builder picks what clears it. Drafted by the skill itself against COMPANY.md and PRODUCT.md, sanity-checked by a reasoning-tier pass, approved as part of spec review — never a separate interruption. *Drafted.*
- *Security surface* — what this feature touches: new tables, new endpoints, auth changes, user input, file uploads, third-party keys. Not checks, just surface. *Derived.*
- *Compliance surface* — the same facts read for a different consequence: new personal data collected, new third-party processors, new cookies or trackers, changed retention, changed data location, anything touching minors or payments. Empty for most features, and an empty field is a checked box, not a skipped one. *Derived.*
- *Data rules* — what must not be lost, whether migrations must be reversible. *Drafted.*
- *Effort ceiling* — the only legitimate mid-run halt. If slice count blows past the plan's estimate, the spec was wrong, and continuing burns effort on a bad foundation. Stop, report, wait. *Drafted from the plan's estimate.*

#### The override question

The minimum-viable rule (below) is overridable, but only with a stated reason, and the decision is recorded once, here.

It can't be decided before the spec — nobody knows what needs hardening until the feature is on the table. Auth only matters once you know the feature touches accounts. So the spec skill drafts the overrides itself, judged against COMPANY.md, PRODUCT.md and STACK.md, and they arrive as part of the spec you review. Wrong ones you strike; missing ones you add. Never a separate interruption.

It can't be left to the builders either — they run in isolated contexts, so each would decide separately and none of the reasoning would be written down.

**Test for whether something belongs in the spec:** if removing the sentence changes *what counts as done*, it's a constraint and it belongs here. If it only changes *how it's done*, it's implementation and it belongs in the task package.

---

### 2 — Plan

SPEC.md → `tasks.md`.

**Cut by vertical slice, not by layer.** Not all database, then all API, then all frontend. Each slice is the smallest change that touches every layer it needs and can be tested on its own. Layer-first means building a backend against a predicted frontend, then rewriting it when the frontend turns out different.

A slice is only valid if Plan can name the seam it would be tested through and state how it would be tested against that seam. If it can't, the slice is cut wrong.

**Consistency check closes Plan.** Before handing back, Plan reads SPEC.md and tasks.md side by side for coverage (criterion ↔ slice, both directions), constraint conflicts, vocabulary drift against GLOSSARY.md, ordering and parallel-disjointness, and testability. Blocking mismatches are fixed in tasks.md within the standing retry limit; the rest park to the report, which carries one `consistency:` line even when clean. It is a pass inside Plan, not a new stage, so the pipeline's shape and the two human stops are unchanged. Taken from GitHub's Spec Kit `analyze` step.

#### tasks.md structure

**Prep block first** — Stage 0 tasks (below). Sequential, not parallel; it moves shared ground under everyone's feet.

**Then slices.** Each is a self-contained task package — it has to be, since the subagent that runs it has no predefined role and no context beyond what the package gives it:

- what to do
- which context files to read
- capability tier
- **seam** — the public boundary the test observes: the route, the exported function, the interface a real caller goes through. Named before the test expectation, since an expectation written first tends to describe the mechanism rather than the behaviour.
- test expectation — what passing looks like, written before the slice is built, checked against the named seam
- test-exempt flag for low-risk slices (copy changes, styling). Explicit and visible, never a silent skip.
- whether it can run in parallel with others, or must wait

Build tests through the seam the task package named rather than whichever one is convenient from inside the slice — see `skills/build/references/good-tests.md` for the two ways a test can pass the suite without actually protecting the seam.

**Feature tier** — fix / feature / milestone. Drives the Ship fan-out.

---

### 3 — Build

Standard tier.

#### Stage 0 — prepare

Before any feature work, a pass over the existing codebase and database to make it ready for what's arriving. Refactors, renames, extractions, dead code removal, schema changes that the incoming feature needs.

It reads SPEC.md so it knows what to prepare for, but it ships no feature behaviour.

**Its gate: tests still pass and the app behaves identically.** If behaviour changed, it wasn't a refactor.

If the project has no test runner, standing one up is Stage 0's job — otherwise the slice gates have nothing to run. Same for Playwright if screenshots aren't set up.

**Some prerequisites need a human, not an agent** — a credential, a third-party account, a dashboard click-through, a one-off production migration nobody wants run unattended. Plan tags these Stage 0 tasks **human-required** rather than folding them into an automatable one. Build doesn't attempt them and doesn't spend the bounded retry budget on them — this is the unmet-assumption case in RULES.md, not a failing gate. Instead it generates a small interactive script (`skills/build/references/wizard.md`, template at `wizard-template.sh`) that walks the human through the exact steps — opens the right URL, asks for the value, writes it to `.env` or a CI secret — written to `work/<feature>/wizard-<slug>.sh`, disposable unless the human asks to keep it. The run ends into the report naming the script; re-invoking build resumes Stage 0 once the human has run it.

#### Then slices

Each slice: **implement → write the test for the new behaviour → run the full suite → pass, or stop.**

Not "build now, test later." A slice that passes only because no test exists for it hasn't passed. The failure mode this prevents: building ten slices and discovering at review that slice three never worked.

A green suite isn't proof the test was worth writing — `skills/build/references/good-tests.md` names the two ways a test passes without protecting anything: coupled to the implementation instead of the behaviour, or tautological (its expected value derived the same way the code derives it, so a wrong answer agrees with itself). The gate checks against that reference before moving on, not just against the suite's exit code.

A failing slice blocks the next one. Sequential by default. Parallelism only where two slices are provably independent — which is rarer than it looks, since slices tend to depend on each other by design.

**A slice touching a third-party library feature this codebase hasn't used before checks the current official docs first** — `skills/build/references/source-check.md`. Narrowly scoped on purpose: skipped when an existing file already shows the same call (the common case, once a pattern's established), skipped entirely for internal logic, and never run at spec or review time — training data goes stale between library versions, and this is the one moment (first use, about to be written) where checking is cheap and being wrong is expensive.

RULES.md's three bounded fix attempts say *how many*; `skills/build/references/diagnosing-failures.md` says how to spend them — confirm and minimise before the first attempt, rank falsifiable hypotheses, spend each attempt on the next untested one rather than a variation of the last. If all three are spent and the slice is still red, the report carries the ranked hypotheses and what each attempt showed, not just the final error — otherwise whoever picks this up next starts from hypothesis one again.

UI-touching slices also run `checks/design-system-guard`. Auto-fixes apply inside the slice; ambiguous cases don't block — they're parked and surface in the final report next to the screenshots.

#### The minimum-viable rule

**Build the simplest thing that delivers the value in this slice.** No speculative abstraction, no premature scaling, no "we might need this later."

The justification is in COMPANY.md, not in the skill. Two people, one on product, few users — the context says what's appropriate. As the numbers grow the constraint loosens by itself.

Exceptions are the overrides listed in SPEC.md. Anything not listed there is minimum-viable.

#### Security applied inline

Not everything waits for the audit. RLS on a new table is cheap during the slice that creates it and expensive to retrofit once data and code depend on it. The builder applies the obvious ones as it goes — RLS on tables it creates, parameterised queries, auth on new routes — using the baseline rules in STACK.md. The end-of-feature audit is the net, not the only line.

---

### 4 — Review

Reasoning tier. Reads the diff against SPEC.md and context/. **Writes no code.**

Two levels:

**Per-slice** — already happened at the slice gate. Tests and checks.

**End of feature** — the full pass:

- User-story test. Does the whole feature work the way a user experiences it, not just the way the tests do.
- Screenshots of every route in the spec's affected-screens list. Playwright, mobile and desktop. This is the only real check on whether the interface is any good — taste can't be linted, so a human looks. Batched at feature level, not per slice, so approval isn't fifteen interruptions a day. Skippable per run with `--no-screenshots` (see "Per-run flags" above) — `checks/a11y` keeps running regardless, since it doesn't depend on the images existing.
- `checks/a11y` — axe-core over the same Playwright run. Blocking.
- `checks/security-audit` — once, reading the security surface plus the full diff. Blocking; unresolvable high-severity findings end the run into the final report.
- `checks/compliance` — once, alongside the security audit. Reads the compliance surface plus the diff and reports which legal documents are affected and why. Advisory as a check; its consequences land in Ship.
- `checks/code-quality` — once, over the full diff. The Standards half next to the user-story test's Spec half above — a feature can pass one and fail the other. Breach of a documented repo standard is blocking; a fixed smell baseline on top is judgment, never blocking.
- `checks/design-quality` — anti-pattern pass. Advisory, output next to the screenshots so both get reviewed together.
- `checks/design-system-guard` across the whole diff, catching drift the per-slice runs missed. Fully automated; parked cases from the slices resurface here, resolved or listed for the final report.

The checks read the same diff independently, so they run in parallel — one subagent each.

#### The builder never reviews itself

Build in Claude Code → review in Codex. Build in Codex → review in Claude Code. A harness-level split, not just a tier-level one — the same model in the same context that made a decision is the worst judge of whether it was right.

**Building in Claude Code:** the official `codex-plugin-cc` plugin (`openai/codex-plugin-cc`) runs Codex from inside the same session. No MCP server, no leaving the tool. Install once per machine:

```
claude plugin marketplace add openai/codex-plugin-cc
claude plugin install codex@openai-codex
codex login
```

`/codex:review` is Codex's own fixed pass and takes no custom instructions. `/codex:adversarial-review --base main <text>` does — it's steerable, so it's the one the review skill calls, pointed at `skills/review/SKILL.md` so Codex runs *our* review (the checks, the user-story test, our report format) rather than a generic one. Both are read-only; neither touches the diff.

**Building in Codex:** the reverse swap — review in Claude Code — has no plugin yet.

If Codex is unreachable either way, review falls back to the same harness on reasoning tier — weaker, but the pipeline doesn't stop.

This is still why the whole set has to be harness-neutral: the review half reads the same `context/`, the same `skills/checks/`, the same SPEC.md, whichever way it gets invoked.

---

### 5 — Ship

Fan-out from the merged spec and diff. Light tier for copy. Everything lands in `work/<feature>/out/`, unpublished.

#### Tier × channel

Not every change earns a blog post. DISTRIBUTION.md defines three tiers:

| Tier | Produces |
|---|---|
| Fix | changelog line |
| Feature | changelog, email update, social posts |
| Milestone | all of the above, plus blog post, case study, video script, build-in-public profile update |

Plan already knows the size of what's being built, so it tags the tier. Ship produces exactly the intersection of tier and the channels DISTRIBUTION.md has switched on. No human deciding "is this blog-worthy" each time — the rule is written once per project. Overridable per run with `--no-distribution` or `--channels=<list>` (see "Per-run flags" above), without editing DISTRIBUTION.md.

Possible outputs across tiers: changelog, blog post, case study, LinkedIn post, build-in-public update, Twitter post, YouTube video script, email update.

**One format, many destinations.** Some channels publish the same artifact to several places — a case study goes to the site, Dribbble, Clutch and Contra; a build-in-public update goes to whichever communities are joined. The artifact is written once and each destination gets trims and extra fields, never a separate piece of writing. CHANNELS.md holds each destination's mechanics; DISTRIBUTION.md toggles **per destination**, so a project can switch on Case Study → site only.

Build-in-public has two distinct surfaces that are not interchangeable: the **project profile** (one-time, updated at milestones) and the **update post** (recurring, per feature). Only the update post is in the standard fan-out.

All copy runs through `checks/voice-guard`.

#### Predefined agents

Ship is the one stage with fixed agents, one per channel: linkedin, twitter, blog, changelog, email, case-study, build-in-public, video-script. They're identical every run — only the input changes — so defining them once costs nothing and drifts less than restating the instructions per feature.

Each is thin: point at the channel's section in BRAND.md and its mechanics in CHANNELS.md, state the output shape. The knowledge stays in context/; the agent file is a wrapper. Adding a channel is one small file plus a line in DISTRIBUTION.md.

The same logic covers a few other recurring jobs — the end-of-feature reviewer, the screenshot producer, the changelog/manifest writer. Same work every time, so defined once.

**The rule:** if the job is identical on every feature, define it. If it's shaped by the spec, spawn it at runtime. Building is always the second kind.

#### Branded artifacts — visualize

Ship uses the vendored `skills/visualize/` (display-dev's skill, used as-is) for outputs that deserve form: the final report, and milestone-tier collateral like case studies. Changelog lines and social posts stay plain text.

Setup, once per project: run visualize's `teach` step against the project. It walks the codebase and live site and writes its capture into a dedicated **Artifacts section of DESIGN.md** (plus tokens.css if missing) — so the skill gets exactly the input it was built to consume, and the hand-written parts of DESIGN.md stay separate from the taught parts. Re-run teach when the visual identity changes.

DISTRIBUTION.md says per project whether outputs ship as branded artifacts or plain files.

#### out/

One file per channel, predictable names, plus `manifest.md` listing what was generated and why. Approval is a folder scan, not a hunt. Screenshots in `out/screens/`.

**`out/rollout.md`** lists the steps a person takes to put the feature live, in order: env vars, migrations and what they depend on, third-party settings, what to remove, a final check on production. It's read from the diff, it isn't a channel, and it's written only when there are steps. Its steps go in the final report's Needs you section, so nothing required to go live is missed before deploying.

The gate is here — between out/ and publish, not inside Ship.

#### Legal and compliance

When `checks/compliance` reports an affected document, Ship drafts the amendments: Privacy Policy, Terms of Service, Cookie Policy, GDPR/DPA records. If a required document doesn't exist yet, Ship drafts it from scratch rather than reporting its absence — named `<document>.draft.md`, since a full draft is not a per-clause amendment and must not read as an edit to something already published. STACK.md marking a document `none` means it doesn't exist yet, not that it isn't wanted.

**This is not a channel and is not toggleable.** It never appears in DISTRIBUTION.md, and no project setting can switch it off — it's triggered by the spec's compliance surface, not by distribution preferences. A feature that changes data retention gets a policy amendment drafted whether or not anyone remembered to enable something.

**Automatic to draft, gated to publish.** The generation is unattended like every other Ship output; only publication is held. Four rules keep that safe rather than reckless:

- **Diffs against the live text, never rewrites.** Each amendment names the triggering change beside it, so the reason is reviewable clause by clause.
- **Drafts only.** Legal text is not a changelog. Where jurisdictional exposure is real, the output is explicitly marked as a draft for a lawyer, not a finished document. Automating legal copy without this is automating liability.
- **A separate legal changelog.** Users need notice of material changes, and it follows different rules from a product changelog: effective date, what changed in plain language, whether continued use constitutes acceptance.
- **Everything lands in `out/legal/`** and stays there. Gated harder than the rest — approving the run does not approve the legal changes; those are marked individually.

Legal documents are just pages — markdown or whatever the project already uses. Approving a draft means replacing the file and updating its effective date. No database, no versioning, no admin UI, no cascade. Git history is the version record.

#### The final report

Ship's last act writes `out/report.html` — one self-contained HTML file with the manifest, screenshots, parked decisions and audit findings inline, generated through visualize so it's branded. Claude Code surfaces it when the run ends; open it, review, approve.

**Remote delivery — via Litedrop, pending its MCP launch.** Once the Litedrop MCP is live, Ship additionally publishes the report through it and returns a link for phone review. Until then, the local report.html is the whole delivery.

---

## Checks

Not stages. Invoked by stages.

| Check | Runs | Blocking |
|---|---|---|
| design-system-guard | every UI slice + full diff at review | yes |
| a11y | end of feature, on the Playwright run | yes |
| security-audit | once, after all slices | yes |
| compliance | once, at review | no, feeds Ship |
| voice-guard | on Ship's copy, and user-facing strings in build | yes |
| code-quality | end of feature | documented standard breach or a weakened check, yes; `/code-review` correctness, RULES.md scale; simplification-only, no |
| design-quality | end of feature | no, advisory |

Each check follows the same shape: a deterministic script for what machines catch, written judgment for what they can't, an explicit "park, don't guess" rule, and a fixed report format.

**Detector scripts are Node (`.mjs`), never shell.** design-system-guard's linter was shell first and shipped four bugs of kinds that only exist there — a glob pair failing when one side missed, a `sed` delimiter colliding with data containing `|`, a file-path prefix leaking into a pattern match, and `grep -i` applying in one branch but not the other. Each produced a *silent* wrong answer rather than an error, which is the worst failure mode for a check. Scripts use only the Node standard library, so there is nothing to install.

A detector with non-trivial logic keeps tests beside it (`<name>.test.mjs`, run with `node --test`), and every test corresponds to a bug that check actually shipped or a rule it depends on.

Exceptions, deliberate: `security-audit`, `compliance`, `code-quality` and `design-quality` are judgment-only, with no script. A detector for these would produce confident false negatives on exactly the cases they exist to catch — the free-text field that collects personal data without being named for it, the duplicated logic shape a line-based scanner can't recognise as duplicated. The one narrow exception is compliance's dependency signal: new packages and new third-party network calls are reliably detectable and map straight to "new processor" and "new tracker," so a script flags those and feeds the judgment layer. It never decides.

### Severity and retry thresholds

Standing defaults, so they don't get reinvented per skill:

- **Blocking severity:** critical and serious findings block; moderate and minor park to the report.
- **Severity is rated against COMPANY.md**, not in the abstract. What's critical for a product with payments and 40,000 users isn't critical for an internal tool with four.
- **Bounded retries:** three fix attempts on a blocking finding. After that the run ends into the report with the finding named — it never loops and never waits.
- **Exit codes:** scripts exit 1 for real findings and 2 for a missing harness (which is a Stage 0 job, not a failure of the work). A run must be able to tell setup failure from a genuine hit.

### design-system-guard

Already written and updated (v3). Enforces that every interface uses only approved components, no hardcoded values, no components invented on the spot, nothing pulled from Tailwind's default palette or shadcn directly. Approval is a marker, not a page: a component is approved when its own file carries `@approved` in a comment **within the first 5 lines** — the window is part of the rule, so the marker sits where a reader sees it. The guard builds its list by scanning the directories in `components:` (STACK.md), which may list several, since hand-built components and generated plumbing usually live apart. Imports are matched by directory tail, so any alias convention resolves. An incomplete `components:` is itself a finding — an unlisted directory is never scanned, so it reports clean whether or not anything is wrong in it — and a genuinely deliberate exclusion is recorded in `components-ignore:` rather than left as an absence.

It also flags **typography utilities on semantic text elements** — `<h1 className="text-2xl font-semibold">` re-specifies what the CSS base layer already sets, defeating the type scale one element at a time while nothing looks broken. Layout utilities stay legal on those elements; only size, weight, colour, tracking and leading are violations. Deleting the utility is the fix when it matches the base layer, parking is right when the value is one the scale doesn't have, since that's a design decision. Gated on `typography-base:` in STACK.md — on a project where utilities are the only styling this would fire on every heading. An absent key is resolved by looking rather than assumed: the guard scans the project's CSS, and a base layer found with no key set is a **finding** (utilities going unchecked against styling that already exists), while no base layer found is genuinely off and says so once, asking for `typography-base: false` to record it. Writing the decision down ends the message — the same shape as `components-ignore:`.

It also flags **any appearance override on an approved component, with no token exception.** `<Card className="bg-muted">` is a violation exactly like `<Card className="bg-gray-100">` — the property being protected is component authority, not theme-safety: a token still moves the decision to the call site, and the system stops owning what its own components look like. `context/tokens.css` still governs plain elements; it no longer reopens an approved component's own appearance. An override with no covering variant is parked with the variant proposed, not resolved locally — the one exception is a component that declares itself an unstyled layout or slot primitive, next to its own `@approved` marker. Detection tracks each file's actual imports from the configured `components:` directories and scans the opening tag by brace depth rather than up to the first `>`, since an expression prop like `onClick={() => {}}` contains one.

The final report carries a **Component registry** section: the approved components, then every unmarked component imported anywhere with its import count, then a count of the unmarked and unimported (a count, never a listing — nothing depends on them, so they are inventory rather than decisions). It reads the **whole codebase, not the run's diff**: in a new project the codebase is the backlog, and a component in use since before the framework was installed appears in no diff and would never surface. Inventory, not a finding — it doesn't block, and it shrinks as components get marked. **Only the human adds that marker** — an agent may add it when asked to in the moment, never on its own initiative, because an agent that can approve its own components turns the check into a mirror. Any marker added during a run is listed in the final report as a Needs-you item, **even when a human asked for it**: a report filed only when the agent thinks it necessary is one the agent can decide not to file, so the listing is unconditional and review detects added markers from the diff rather than trusting the report. Token allowlist derives from tokens.css, runs per UI slice plus full-diff at review, parks instead of halting.

On request, it also **generates a `/components` page** documenting every currently-approved component and token — a living reference, regenerated on demand, never a hand-maintained registry and never itself the source of approval (that's still the marker). Documentation only: no new CSS, no new primitives, nothing that changes how the app looks anywhere else. This reverses an earlier call to leave the page as project work with no framework opinion on its shape — the shape is framework-documented now, since every project needs the same one, but the page itself is still built per project, through the normal pipeline, from that project's own approved components.

**A second page ships as a template: the status and approval view.** The reference page answers "what is our design system?"; a vibe-coded project's first question is different — *which of the components the AI already built do I accept?* — so `template/Components.tsx` is a dev-only triage page: stats and adoption, **Decisions waiting** sorted by import count, the approved list, and an approve-all-in-use baseline. This amends the earlier rule that the page is never shared infrastructure: the reference page still isn't, but this one is a shared, versioned template, because its job is identical in every project. Two choices keep it inside the human-only-approval rule. Its buttons **copy a prompt** and never write a file, so approval is still a human sending an instruction and the marker is still added by the assistant at that moment, never by the page. And it is dev-only by construction (`import.meta.env.DEV`, lazy-loaded), so a production build contains neither the page nor any source text. An optional localhost helper (`ds-lint.mjs --serve`) lets the buttons edit directly; the page detects it, and it states plainly that any local process can read its token, so `--added-markers` stays the backstop.

**One source of truth for the code.** The linter, its tests, the shared `scan-core.mjs` and the page template are developed in the standalone repo (github.com/cesarzeppini/design-guard) and copied in by `scripts/sync-design-guard.mjs`; `--check` reports drift. SKILL.md and `references/allowed-customization.md` stay framework-adapted and are not synced. This exists because the two copies drifted once already: the standalone fell several commits behind before anyone noticed.

### code-quality

The Standards half of review, next to the user-story test's Spec half: a feature can pass one and fail the other, and reporting them separately is what stops one masking the other. Distinct from design-system-guard, which enforces approved components and tokens — this judges whether the code itself, UI or not, is correct and shaped well.

Two jobs, two owners. **Documented standards** are this check's own judgment call, no script — reads `CODING_STANDARDS.md`, `CONTRIBUTING.md`, or `STACK.md`'s "How it was built"; what the project's own linter and type checker already enforce continuously is exactly the layer this must not re-flag. **Correctness bugs and general cleanup** are handed to Anthropic's bundled `/code-review --high` plugin rather than reinvented as a bespoke smell list — it already hunts these across a diff, and duplicating it without catching real defects was the earlier design. **The repo overrides**: a documented standard always wins over anything `/code-review` flags.

**Guards the bar itself, not just the code.** An agent under pressure to turn red green tends to weaken the check rather than fix what it's checking — a moved threshold, an easier test (`.skip`, a deleted assertion), a new suppression comment (`@ts-ignore`, `eslint-disable`), an unfinished stub, an unowned exception. All five are visible in the diff with no new tooling; unlike the other findings here, any one of them is **always blocking** regardless of how small it looks — the problem is that the gate moved at all, not the specific instance.

Severity: breach of a **documented** standard is blocking, per RULES.md's retry limit. A `/code-review` **correctness** finding is rated on RULES.md's normal scale. Any other `/code-review` category (simplification, efficiency, reuse) is always advisory — a judgment call about form, not a defect. A **guard-the-bar** finding is always blocking.

### voice-guard

Denylist table — banned / why / use instead — plus `scripts/prose-lint.mjs` that fails on hits. Structure taken from Impeccable's STYLE.md, words replaced with ours. Judgment layer on top for register.

---

## Pre-launch audit

`skills/pre-launch` audits a whole product before launch, outside the pipeline. It's run when asked, and offered once when there are signs of production. It replaced `readiness-audit` in November 2026, keeping the best of three versions: the Kancha baseline audit's method (map, one stop for intended rules, area documents with what holds, fix order, status), readiness-audit's ask-first habit and research step, and a generic pre-launch checklist written after Kancha.

- **A tagged checklist, not project rules.** 25 areas, one reference file each, every item tagged (`[all]`, `[payments]`, `[marketplace]`, `[UGC]`, `[realtime]`, `[uploads]`, `[AI]`, `[web]`, and service tags such as `[Supabase]` or `[Stripe]` whose idea applies to equivalents). Step 1 marks which tags apply and the rest are skipped with a reason. The earlier objection to a rulebook was to rules that fit one project; a checklist filtered by what the product is stays general. Research at the start of each audit adds what has changed since, dated.
- **Read and prove, never fix.** Every finding gets a proof that prints `PROVEN` (exit 1) or `NOT PROVEN` (exit 0), exit 2 on a refused target. Proofs live in `work/pre-launch-<date>/proofs/`; the audit writes nothing into the project's code. A fix package's first move is putting its proofs in the suite, where they become its acceptance test and then run in CI. Attacks stay on the local stack; the one exception is reads anyone on the internet can make (headers, TLS, DNS, public pages signed out), which may target deployed hosts, because a laptop has no domain, DNS or proxy to prove those against.
- **Gated in eight groups,** worst damage first, with a "go" between each. Ask before mapping, stop once after the map for intended rules and product decisions, then one gate per group.
- **Four severities** (critical, high, medium, low) rated against stage and scale, plus `not built` for planned work, counted apart.
- **The report** ranks findings by severity with proof and fix, groups fixes into packages, keeps product decisions apart from bugs, and lists the dashboard settings only account owners can change (service, page, setting, finding).
- **Reuses the review checks** rather than repeating them: security-audit's method, compliance's document mapping, code-quality's `/code-review` and guard-the-bar moves, and a11y for accessibility, which has no area yet (nor do SEO and native mobile).
- **Features don't undo it.** security-audit checks each diff against the area items it touches, among the product's tags. Review's user-story walk also checks that nothing the app shows claims something untrue (advisory).

## Proofs and finding ids

Judgment-only security review leaves nothing behind once a hole is fixed. So every `high` finding gets a **proof**: a test that performs the attack, expects it refused, and stays in the suite (`skills/checks/security-audit/references/proofs.md`). The fix starts by watching it fail. Proofs run against the local stack only and exit 2 on anything else, so a misconfiguration can't look like a result. The pre-launch audit's public reads are the one exception (see Pre-launch audit). A third-party sandbox whose webhooks reach deployed environments counts as "anything else". The pre-launch audit keeps its proofs in its own work folder, so the suite stays green until a fix package moves them in.

Findings carry ids (`references/finding-ids.md`): a prefix the report defines plus a number. They're never reused, and they're closed by adding a status line rather than editing.

## Skills learn from runs — with a gate

Agents reviewing each other's work will notice skill weaknesses ("the plan skill keeps cutting slices too big"). They don't fix the skills directly: an agent editing its own instructions mid-run is how a framework quietly rewrites itself into something nobody approved.

Instead:

- Any agent that hits a skill weakness writes a **proposed skill change** — the diff plus one line of why — into `out/skill-proposals/`.
- Proposals appear in the final report next to everything else. Approving one applies the diff to the framework repo; it reaches every project from then on.
- Agents may also propose **observations** for `skills/<name>/LESSONS.md` — softer than a rule, read by the skill on later runs. These land in the final report too, as accept/decline items next to the skill proposals. Nothing enters LESSONS.md unreviewed: a file that skills read every run is a side door if it's unmoderated.

Same two-stop model: skills improve every run, but every change — rule or note — passes the gate you're already standing at. The report marks each proposal approve/decline; approving applies it.

### Managed blocks, and stopping on unmet assumptions

Two conventions for skills that touch things they don't own.

**Marker-delimited managed blocks.** Nothing in the framework currently writes into a project-owned file, but if a skill ever does, it wraps its output in `found:<skill>:start` / `found:<skill>:end` comments and replaces only that block on re-run. Before writing, it reads the file and flags pre-existing instructions on the same subject sitting outside the markers — a stale hand-written rule quietly contradicting the managed one is worse than either alone.

**Unmet assumptions stop the skill.** A skill whose hard requirements aren't met — wrong major version, missing base layer, absent context file — stops and names the specific remediation instead of degrading into a run that produces confidently wrong output. The same intent as scripts' exit 2: a setup failure must never be mistakable for a clean result.

### The doc states the conventions

An approved skill change often introduces a **convention** the implementation then depends on — what a file is named, what a marker means, which exit code carries which meaning, where a threshold sits. Record it here, in the same commit as the change.

This document is the input to build-order step 2, so a convention living only in a skill file is erased the next time that skill is regenerated from this doc. A follow-up commit isn't enough: the gap between the two is exactly where a regeneration would lose it.

The scope is conventions, not decisions. **Design decisions stay with the human** — a skill records what it now depends on, and never rewrites this document's decisions to match itself. When the two genuinely disagree, that's a report item, not an edit.

## Portability

The set has to run in Anthropic, Codex, Lovable, or whatever comes next. Four rules make that true.

### Capability tiers, not model names

Nothing in `skills/` or `tasks.md` names a model. Tasks carry a tier:

| Tier | Used for |
|---|---|
| reasoning | spec, plan, review, audits |
| standard | build |
| light | copy |

The tier→model table in CLAUDE.md (and AGENTS.md for other harnesses) is **written by the LLM, never by the human**. During scaffold — and again whenever it notices the table is stale — the running LLM detects which models its harness offers and fills the mapping itself (e.g. in Claude Code: light → Haiku, standard → Sonnet, reasoning → the strongest available), with a one-line reason per row. It never guesses another harness's models: each harness's first run fills its own table. The human reviews it like any other generated file. If a harness offers only one model, every tier resolves to it and the pipeline still runs.

### Build subagents are spawned at runtime

No builder role files. When a skill reaches parallel build work, it says so, and each subagent receives a task package that *is* its role for that run.

Predefined agents exist, but only for jobs that are identical on every feature — the Ship channel writers, the finish reviewer, the screenshot producer, the documenter. See Ship.

The task package is therefore the important artifact and has to be self-contained:

- what to do
- which context files to read
- capability tier
- what done means
- what to hand back

Trade-off accepted: instructions get restated per package instead of being reused from a role file. The upside is no drift between a role definition and reality, and roles shaped to the actual feature rather than guessed in advance.

### Skills describe intent, never mechanism

"These tasks are independent and can run in parallel" — never a tool-specific invocation. Each harness spawns work its own way.

### Parallelism degrades to sequential

Lovable has no subagents. `tasks.md` marks which tasks are independent; a harness that can't parallelise runs them in order and produces the same output. Parallel is an optimisation, not a requirement.

Where it applies:

- **Build — sequential.** Slices depend on each other and each gates on tests.
- **Review — parallel.** a11y, security-audit, compliance, design-quality and design-system-guard all read the same diff independently. Five checks; voice-guard is the sixth and runs at Ship, on the copy.
- **Ship — parallel, the biggest win.** Changelog, blog, LinkedIn, Twitter, email and case study have no dependency on each other. One subagent per channel.

Reviewer-checks-builder is a pairing, not parallelism: the builder finishes a slice, a separate subagent checks it, then the next slice starts.

---

## Worth taking from Impeccable

- STYLE.md denylist structure, enforced at build time by a prose validator.
- `reference/` one-file-per-verb, so SKILL.md stays small and verbs load on demand. For multi-verb skills only.
- **`steps/` one-file-per-phase**, the same idea for a skill that runs phases in order rather than dispatching verbs. SKILL.md becomes an index — purpose, the rules that govern every phase, and a table of the step files — and each phase's instructions load only when that phase runs. `spec` is split this way; `run` earns it if it grows. Single-purpose checks stay single files. Numbered filenames, and each step ends by naming the next, so the order is in the files rather than only in the index.
- The deterministic-detector-plus-judgment pattern, already used in design-system-guard.
- The hook pattern (later, optional hardening): run a check's detector automatically after every file edit via a post-tool-use hook, instead of trusting the skill to remember to call it. Candidate: design-system-guard's ds-lint on UI file edits. Add only after the pipeline works.
- The doctor pattern: a maintenance verb that reports drift between context files and reality. See open item 3.
- `skill/agents/*.md` as templates — his four are utility jobs (documenter, finish-reviewer, asset-producer, manual-edit-applier), not builders. Same split as ours.

Deliberately not taking: the multi-harness compile step (symlinks and a shared RULES.md do the same job without generated files), `context.mjs` state signals, the CLI, the extension, DESIGN.md's actual token values. All of them solve problems of scale this doesn't have yet.

---

## Worth taking from Matt Pocock's skills

His repo is a toolbox of small, human-driven commands rather than a pipeline, so most of it doesn't transplant directly — but several of its reference disciplines strengthened checks and steps this framework already had:

- **`writing-for-agents` as the house style** for every skill in this repo — `references/writing-skills.md`, above. The rest of his repo is what that skill is a style guide *for*; this is the one piece that governs how every other piece gets written.
- `tdd`'s anti-patterns (implementation-coupled, tautological) — `skills/build/references/good-tests.md`, checked before a slice's test is trusted.
- `code-review`'s Standards-vs-Spec split — `skills/checks/code-quality/`, sitting next to the user-story test as review's other axis.
- `diagnosing-bugs`'s falsifiable-hypothesis loop, condensed to fit inside three bounded, unattended fix attempts instead of an open-ended interactive session — `skills/build/references/diagnosing-failures.md`.
- `domain-modeling`'s glossary discipline and ADR test — `context/GLOSSARY.md` and `templates/ADR-FORMAT.md`.
- `grilling`'s numbered-question-with-a-recommended-answer format, kept to Found's single question round rather than his iterated frontier — `skills/spec/steps/4-check-and-present.md`.
- `wizard`'s generated-script pattern for a step only a human can take, reframed from a chat aside into the unmet-assumption exit RULES.md already has — `skills/build/references/wizard.md` and `wizard-template.sh`.

Deliberately not taking: the issue-tracker/triage/wayfinder machinery (tasks.md and the two-stop model already cover that ground), `ask-matt`'s router (six pipeline skills chained by `run` need no router), `handoff` and `teach` (no session-to-session handoff problem in an unattended run).

## Worth taking from GitHub's Spec Kit

A spec, plan, tasks, implement toolkit with a constitution file, built for human-driven use across many agents. Found already covers its stages and goes further (review, ship, checks, unattended runs). Two pieces taken: `analyze`'s read-only cross-artifact consistency pass, as the closing check inside Plan, and `checklist`'s "unit tests for requirements" idea, as a requirements test in spec's step 4 (measurable criteria, no conflicts, states covered, one term per concept) run before the draft is presented. Not taking: its extension, preset and catalog machinery, which solve a many-teams distribution problem this repo doesn't have, and its separate `clarify` step, which spec's single question round already covers.

---

## Open items

1. ~~How the cross-harness review actually runs~~ — resolved: the `codex-plugin-cc` plugin runs Codex review from inside Claude Code via `/codex:adversarial-review`, steered to execute the review skill. No MCP server, no harness switch. Same-harness fallback when Codex isn't reachable.
2. **Does BRAND.md hold positioning and messaging, or does that get its own file.** Currently in BRAND.md, which risks making it the drawer everything goes in.
3. **COMPANY.md review cadence.** Stale numbers mean the minimum-viable rule calibrates against a company that no longer exists. Planned fix: a small `doctor` maintenance verb (pattern from Impeccable's doctor) that checks context files against reality — user counts, stack facts, component paths — and reports drift instead of silently trusting stale files. Build it after the pipeline works, not before.
4. **First pilot project and feature.** The framework is project-agnostic — clients, your own products, anything. Pick one project and one small feature for the first end-to-end run.

---

## Build order — how to bootstrap this

All of it happens inside Claude Code (desktop app — it runs the folder and symlink commands itself). This doc is the input; nothing is written by hand.

### Step 1 — scaffold the framework repo

Create an empty folder, `git init` it (Claude Code can do this), drop this file and the design-system-guard-v2 folder into it, commit. Commit again after every generated skill in step 2 — the history is the rollback when a later edit makes a skill worse. Prompt:

> Read ARCHITECTURE.md. Scaffold the framework repo exactly as §Framework repo layout describes — folders, symlink, RULES.md, CLAUDE.md, AGENTS.md stubs. Move design-system-guard into skills/checks/. Clone https://github.com/display-dev/visualize into skills/visualize/ — the only skill that is downloaded rather than generated.

### Step 2 — generate the skills

Same session. Prompt:

> Read ARCHITECTURE.md. Build the skills in skills/ — run, spec, plan, build, review, ship — plus the remaining checks (a11y, voice-guard, security-audit, design-quality), the predefined agents in agents/, scripts/screenshots.mjs and scripts/prose-lint.mjs, and the context templates in templates/context/. Follow the doc exactly: no code in specs, vertical slices, tests per slice, two human stops, park-don't-ask, blocking-never-waits, capability tiers, harness-neutral wording, and the house style in references/writing-skills.md. One skill at a time, show me each before moving on.

Review each skill like a spec. This is where the doc's decisions either land in the files or silently don't.

### Step 3 — set up the pilot project

Open the pilot project's repo in Claude Code. Link the framework (submodule or copy), symlink `.claude/skills`. Prompt:

> Read found/ARCHITECTURE.md. Create context/ for this project from found/templates/context/. Derive what the templates mark as derivable from the codebase; interview me for the rest. Follow the boundaries the doc sets between files. Then run visualize's teach step and write its capture into the Artifacts section of DESIGN.md. One file at a time.

### Step 4 — first spec, real feature

> Run the spec skill on this feature: [small real feature].

Judge the spec hard. If it's weak, fix the **spec skill** (not the spec) and rerun. Do not continue until a spec comes out genuinely good — everything downstream inherits its quality.

### Step 5 — first full run

> Run the pipeline on work/<feature>/SPEC.md.

Pick a feature you don't care much about. Expect breakage in review or ship; fix the skill, not the output. The second run is the real test.
