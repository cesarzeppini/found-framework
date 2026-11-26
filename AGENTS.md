# Found

Read [RULES.md](RULES.md) — the operating rules and standing constraints. [ARCHITECTURE.md](ARCHITECTURE.md) holds the decisions behind them.

Skills live in `skills/` (pipeline: run, spec, plan, build, review, ship; checks under `skills/checks/`; `pre-launch` outside the pipeline). Predefined agents in `agents/`. Context files are per project, in the project repo's `context/` — this repo has none.

## Capability tier map

Tasks carry a tier — reasoning (deepest thinking), standard (balanced), light (fast/cheap). Skills never name a model; this table is the only place the mapping exists.

| Tier | Model | Why |
|---|---|---|
| reasoning | *(unfilled)* | |
| standard | *(unfilled)* | |
| light | *(unfilled)* | |

**Unfilled on purpose.** It was written in Claude Code, which can't see this harness's lineup, and a guessed table is worse than an empty one. The first run here fills it: detect the models this harness actually offers, map the three tiers to the best fits, and write one line per row saying why. Until then, resolve tiers at runtime to the best available model. If only one model is offered, every tier resolves to it and the pipeline still runs.
