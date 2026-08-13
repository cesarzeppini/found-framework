# Rules

Operating rules and standing constraints. The shared source — CLAUDE.md and AGENTS.md point here so harnesses can't drift. See ARCHITECTURE.md for the reasoning behind each.

## Standing constraints

- **Two human stops, no more.** Spec approval at the start, final gate at the end. Everything between runs unattended.
- **Park, don't ask.** Anything ambiguous mid-run: make the reversible choice, log it, surface it in the final report. Irreversible or genuinely blocked items land in the report as questions.
- **Blocking never means waiting for a human.** A blocking gate makes the run fix it; if it can't after a bounded number of attempts, the run ends early into the final report. Mid-run, the pipeline progresses or terminates — it never sits waiting. Thresholds below.
- **No code in specs.** SPEC.md carries intent, behaviour, constraints — no snippets, no library names, no implementation suggestions.
- **Minimum-viable rule.** Build the simplest thing that delivers the value in this slice. Justification lives in the project's COMPANY.md. Exceptions are only the overrides listed in SPEC.md.
- **Cut by vertical slice, not by layer.** A slice is valid only if Plan can state how it would be tested.
- **Tests per slice.** Implement → write the test → run the full suite → pass, or stop. A slice without a test for its behaviour hasn't passed.
- **The builder never reviews itself.** Build in one harness, review in the other; same-harness reasoning-tier fallback if the MCP link is absent.
- **Capability tiers, not model names.** Tasks carry a tier: reasoning (deepest thinking), standard (balanced), light (fast/cheap). The tier→model table in this harness's CLAUDE.md / AGENTS.md is the only place models are named — never hardcode one in a skill, task package or agent file. The table is filled by detection, not by hand: the first run in a harness detects the models it offers, maps the tiers, and writes one line per row saying why. If only one model is available, every tier resolves to it and the pipeline still runs.
- **Harness-neutral wording.** Skills describe intent ("these tasks are independent and can run in parallel"), never tool-specific mechanism.
- **Parallelism degrades to sequential.** tasks.md marks independence; a harness that can't parallelise runs in order and produces the same output.
- **Skill changes pass the gate.** Agents propose skill diffs and LESSONS.md observations into out/skill-proposals/; nothing is applied or recorded unreviewed.
- **Only the human approves components.** A component is approved when its file carries an `@approved` marker; design-system-guard reads those markers and parks every unmarked use. An agent adds the marker only when explicitly asked to in that moment, never on its own initiative — not during a run, not to clear a parked item, not as a skill proposal. Self-approval turns the check into a mirror. **Every marker added during a run is listed in the final report as a Needs-you item, even when a human asked for it** — an unconditional list is what makes an unrequested one visible, and review detects added markers from the diff rather than trusting the report.
- **Managed blocks are marker-delimited.** A skill that writes into a file the human also owns wraps its output in `<!-- found:<skill>:start -->` / `<!-- found:<skill>:end -->` comments, and on re-run replaces only that block. Before writing, read the file and flag any pre-existing instructions on the same subject living *outside* the markers — a stale hand-written rule silently contradicting the managed one is worse than either alone.
- **Unmet assumptions stop the skill.** A skill whose hard requirements aren't met — wrong major version, missing base layer, absent context file — stops and names the specific remediation, rather than degrading into a run that produces confidently wrong output. Same intent as scripts' exit 2: setup failure must never look like a clean result.
- **The doc states the conventions.** When a change to a skill, agent, script or template introduces a convention the implementation then depends on — a file-naming rule, what a marker means, an exit-code choice, a threshold — record it in ARCHITECTURE.md **in the same commit**. A convention living only in a skill file is erased the next time that skill is regenerated from the doc, and the gap between commits is exactly where that happens. This covers conventions only: **design decisions stay with the human**, and a skill never rewrites the doc's decisions to match itself.
- **Legal text is drafted, never finalised.** Compliance findings become drafts in out/legal/ — per-clause amendments to existing documents, full drafts for documents that don't exist yet — written against the jurisdiction in STACK.md, marked as drafts for a lawyer, and gated individually; approving a run never approves a legal change. Drafting is automatic and not toggleable: it answers the spec's compliance surface, never a distribution setting. Published legal files are never written directly by a run. Legal documents are just pages: approving a draft means replacing the file and updating its effective date. No database, no versioning, no admin UI — git history is the version record.
- **Context belongs to projects.** The framework repo has no context/ of its own.
- **Report decisions, not activity.** See below. Applies to skill output, subagent handbacks and the final report alike.

## Severity and retries

Standing defaults, so they don't get reinvented per skill. A skill states only where it *departs* from these, and says why.

**Blocking severity.** Critical and serious findings block. Moderate and minor park to the report.

Checks that inherit a different scale from their tooling map onto that line rather than restating it — a security audit's `high` is the blocking tier, its `medium` and `low` park. Keep the tool's own vocabulary in the report, so a finding stays greppable against the tool that produced it.

**Severity is rated against COMPANY.md,** not in the abstract. What's critical for a product with payments and 40,000 users isn't critical for an internal tool with four. Inflating severity trains the gate to skim, which costs more than the finding was worth.

**Bounded retries: three fix attempts** on a blocking finding. After that the run ends into the report with the finding named, what was attempted, and the last error. It never loops and never waits.

**Exit codes.** Scripts exit **1** for real findings and **2** for a missing harness — a Stage 0 job, not a failure of the work. A run must be able to tell setup failure from a genuine hit.

A script that produces signals rather than findings exits **0** either way, and says so: a non-zero exit is a verdict, and a detector that feeds a judgment layer isn't entitled to one.

## Reporting

**Agents report decisions, not activity.** A run that narrates every file it touches buries the two lines that actually needed a human.

**Don't report:** what you're about to do, each file created, each command run, each verification that passed, restatements of what the doc already says.

**Do report, briefly:**

- judgment calls made where the spec or doc was silent, and what was assumed
- anything invented that wasn't asked for
- anything in the existing setup that was changed, and why
- contradictions found between instructions
- where you'd argue with the instruction you were given

Default to a few lines. When something needs a paragraph, write the paragraph — **brevity is not a reason to hide a real problem.**

This applies to skill output, subagent handbacks, and the final report alike.

### One result per check, not one per assertion

"Each verification that passed" means the individual assertions, not the check itself. A check still reports its own outcome once, including when that outcome is clean — `a11y: clean (7 routes, 2 viewports)` is a decision-grade line, because without it a check that never ran is indistinguishable from one that found nothing.

The same logic runs through the manifest's list of what was *not* produced and the spec's `none` compliance surface. **An explicitly empty result is a reported decision. A silent one is missing information.**

### Ordering

Lead with what needs a human: blocked items and questions, then decisions and assumptions, then findings, then everything produced. A reader who stops after the first section should have seen the things that change what they do next.
