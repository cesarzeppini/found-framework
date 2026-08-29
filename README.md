# Found

A pipeline that turns one written spec into a shipped feature plus the collateral it earns — changelog, blog, social, email, case study — with a human gate before anything goes public.

You approve a spec. The pipeline plans it, builds it in tested vertical slices, reviews it in a second harness, writes the collateral, and hands back one report. **Two human stops: the spec at the start, the gate at the end.** Nothing in between asks you anything — ambiguity gets decided, logged, and surfaced in the report.

Everything is plain markdown in harness-neutral folders, so the same set runs in Claude Code, Codex, or anything else that reads skills.

**This file is how to use it. [ARCHITECTURE.md](ARCHITECTURE.md) is why it works this way** — read it when you want the reasoning, not to get started.

## Status

ARCHITECTURE.md's build order has five steps. **Steps 1–2 built this framework and are done.** They stay in the doc because regenerating any skill uses step 2's instructions.

**A new project starts at step 3.**

## What's here

```
skills/     run, spec, plan, build, review, ship + checks/ (7) + vendored visualize
agents/     11 predefined — 8 channel writers, finish-reviewer, asset-producer, documenter
scripts/    prose-lint, screenshots, spec-no-code
templates/  context/ — one template per project context file, + ADR-FORMAT.md
RULES.md    the operating rules every skill follows
```

No `context/` — context always belongs to a project, never to the framework.

## Add it to a project

Installed once per machine/environment, as a Claude Code plugin — not per project, and nothing to add to any project's own repo:

```bash
claude plugin marketplace add cesarzeppini/found-framework
claude plugin install found@found
```

That's it. Every project you open on that machine/environment now has found's skills available. Explicit-only — see below — so it never runs unless you ask for it.

**Cloud sessions:** each fresh container needs this run once too, same as any other plugin. Add the two commands above to the project's SessionStart hook so it happens automatically, alongside `npm install` and starting the dev server.

Running in Codex instead? `AGENTS.md` in this repo ships with an unfilled capability tier map. The first run there fills it by detecting available models.

<details>
<summary>Old submodule setup (pre-plugin)</summary>

```bash
git submodule add https://github.com/cesarzeppini/found-framework.git found
mkdir -p .claude && ln -s ../found/skills .claude/skills
```

Kept here only for projects that haven't migrated yet. New projects should use the plugin install above.
</details>

## The three prompts

**1 — Set up the project.** Once per project.

> Read found/ARCHITECTURE.md. Create context/ for this project from found/templates/context/. Derive what the templates mark as derivable from the codebase; interview me for the rest. Follow the boundaries the doc sets between files. Then run visualize's teach step and write its capture into the Artifacts section of DESIGN.md. One file at a time.

This produces `context/` — the project's facts. Everything downstream calibrates against it, so answer the interview honestly, especially COMPANY.md's team size and user numbers: they're what stop the pipeline building infrastructure for forty users that a team of two then maintains.

Three fields are read by scripts and worth getting right: STACK.md's `components` path, STACK.md's `jurisdiction`, and BRAND.md's banned-words table.

Approving a component is a separate, deliberate act: put `// @approved` at the top of its file. Say "mark X as approved" and Claude Code adds it — it never does that on its own, since a pipeline that can approve its own components isn't checking anything.

**2 — Write a spec.**

> Run the spec skill on this feature: [feature].

You get a full draft plus a short list of real questions. Correct it, answer them, approve. **This is human stop one.**

Judge the first few specs hard. If one is weak, fix the **spec skill**, not the spec, and rerun — everything downstream inherits its quality.

**3 — Run the pipeline.**

> Run the pipeline on work/<feature>/SPEC.md.

Plan → build → review → ship, unattended. It ends by surfacing the report, or terminates early into that same report if a blocking gate can't be cleared in three attempts.

## What you get back

Everything lands in `work/<feature>/out/`, unpublished:

```
out/
  changelog.md blog.md linkedin.md twitter.md email.md …   one file per channel
  manifest.md          what was generated, and what wasn't — with the reason
  report.html          ← open this
  screens/             screenshots, every affected route, mobile + desktop
  legal/               amendment drafts, when the feature touched a legal document
  skill-proposals/     proposed framework improvements from this run
```

Which channels appear is the intersection of the feature tier (fix / feature / milestone) and the channels DISTRIBUTION.md has switched on. Nobody decides per feature.

### Approval — human stop two

Open `out/report.html`. It leads with the two sections that need you:

1. **Needs you** — blocked items, questions, anything that survived its fix attempts
2. **Decided without asking** — parked decisions with their alternatives, assumptions, anything invented

Then findings, then what was produced. A run that ended early still produces a report saying where and why.

Three things are approved **individually**, not by approving the run:

- **legal amendments** in `out/legal/` — drafts for a lawyer, never published text
- **skill proposals** — accept applies the diff to this framework repo
- **`context/` changes** proposed by the documenter

Nothing in `out/` is published by the pipeline. Publishing is yours.

## Updating the framework

A fix to a skill here reaches every project on that machine/environment the next time a fresh session installs the plugin — installs always pull the latest push, there's no separate per-project pull step to remember.

```bash
claude plugin marketplace update found   # or reinstall: claude plugin install found@found
```

When a run proposes a skill change, approving it means applying that diff **in this repo** and committing — every subsequent session picks it up automatically. Commit one skill at a time; the history is the rollback when an edit makes a skill worse. There's no per-project bump step anymore, which also means a bad push reaches every project's next session immediately — there's no staging.

Skills are edited in place. No compilation, no generated copies, nothing to keep in sync.

## Requirements

Node 18+ for the scripts. Playwright and `@axe-core/playwright` are needed for screenshots and the a11y check — standing them up in a project is Stage 0's job, not yours. Scripts exit `2` when a harness is missing and `1` for real findings, so setup failures never look like clean runs.

**One more Claude Code plugin**, installed once per machine/environment alongside found itself:

```bash
claude plugin marketplace add openai/codex-plugin-cc
claude plugin install codex@openai-codex
codex login
```

Used by `skills/review/SKILL.md` for the cross-harness review swap. Falls back to same-harness reasoning tier if unreachable, so a run never breaks over this — it's just weaker without it.

`skills/checks/code-quality/SKILL.md` also calls `/code-review` for correctness bugs and simplification — that one ships bundled with Claude Code itself, no separate install needed.

**In a cloud session**, a fresh container has Codex's plugin uninstalled by default (`/code-review` works out of the box, being bundled). Add the Codex install commands above to that project's SessionStart hook so every new session gets it automatically, the same way it would install `node_modules` or start a dev server.
