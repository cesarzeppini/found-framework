# Rules

Operating rules and standing constraints. The shared source — CLAUDE.md and AGENTS.md point here so harnesses can't drift. See ARCHITECTURE.md for the reasoning behind each.

## Standing constraints

- **Two human stops, no more.** Spec approval at the start, final gate at the end. Everything between runs unattended.
- **Park, don't ask.** Anything ambiguous mid-run: make the reversible choice, log it, surface it in the final report. Irreversible or genuinely blocked items land in the report as questions.
- **Blocking never means waiting for a human.** A blocking gate makes the run fix it; if it can't after a bounded number of attempts, the run ends early into the final report. Mid-run, the pipeline progresses or terminates — it never sits waiting.
- **No code in specs.** SPEC.md carries intent, behaviour, constraints — no snippets, no library names, no implementation suggestions.
- **Minimum-viable rule.** Build the simplest thing that delivers the value in this slice. Justification lives in the project's COMPANY.md. Exceptions are only the overrides listed in SPEC.md.
- **Cut by vertical slice, not by layer.** A slice is valid only if Plan can state how it would be tested.
- **Tests per slice.** Implement → write the test → run the full suite → pass, or stop. A slice without a test for its behaviour hasn't passed.
- **The builder never reviews itself.** Build in one harness, review in the other; same-harness reasoning-tier fallback if the MCP link is absent.
- **Capability tiers, not model names.** Skills and tasks say reasoning / standard / light. Each harness maps tiers to models in its own CLAUDE.md / AGENTS.md table.
- **Harness-neutral wording.** Skills describe intent ("these tasks are independent and can run in parallel"), never tool-specific mechanism.
- **Parallelism degrades to sequential.** tasks.md marks independence; a harness that can't parallelise runs in order and produces the same output.
- **Skill changes pass the gate.** Agents propose skill diffs and LESSONS.md observations into out/skill-proposals/; nothing is applied or recorded unreviewed.
- **Context belongs to projects.** The framework repo has no context/ of its own.
