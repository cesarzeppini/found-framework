# Found

Read [RULES.md](RULES.md) — the operating rules and standing constraints. [ARCHITECTURE.md](ARCHITECTURE.md) holds the decisions behind them.

Skills live in `skills/` (pipeline: run, spec, plan, build, review, ship; checks under `skills/checks/`). Predefined agents in `agents/`. Context files are per project, in the project repo's `context/` — this repo has none.

## Capability tier map

| Tier | Model |
|---|---|
| reasoning | gpt-5.2 high |
| standard | gpt-5.2 medium |
| light | gpt-5.2-mini |
