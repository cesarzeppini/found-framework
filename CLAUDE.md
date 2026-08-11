# Found

Read [RULES.md](RULES.md) — the operating rules and standing constraints. [ARCHITECTURE.md](ARCHITECTURE.md) holds the decisions behind them.

Skills live in `skills/` (pipeline: run, spec, plan, build, review, ship; checks under `skills/checks/`). Predefined agents in `agents/`. Context files are per project, in the project repo's `context/` — this repo has none.

## Capability tier map

Tasks carry a tier — reasoning (deepest thinking), standard (balanced), light (fast/cheap). Skills never name a model; this table is the only place the mapping exists.

| Tier | Model | Why |
|---|---|---|
| reasoning | `opus` (Claude Opus 5) | The deep-thinking model here. Carries spec, plan, review and audits, where a miss is expensive. |
| standard | `sonnet` (Claude Sonnet 5) | Strong enough to build against a written test expectation, cheap enough to run across every slice. |
| light | `haiku` (Claude Haiku 4.5) | Fastest and cheapest; copy work is bounded by BRAND.md and voice-guard, so it doesn't need depth. |

If `opus` is ever unavailable, reasoning falls back to `sonnet` — weaker, but the pipeline doesn't stop.

Filled by detection, not by hand: this session read the model options the harness exposes for spawning subagents. Re-run that detection and rewrite the table when the lineup changes — don't leave it to go stale, and don't hardcode these names anywhere else.
