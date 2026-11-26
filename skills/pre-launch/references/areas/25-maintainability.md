# 25 Maintainability (MT)

What the next six months of changes will cost. Where a tool can decide, the item is pass or fail. What tools can't decide goes in the report's **Opinion** section, as advice, not a verdict.

**Reuses** code-quality: run `/code-review` over the whole codebase rather than a diff, and check the five guard-the-bar moves against the current config. The project's documented standards win over anything flagged.

- **Type check strict and passing; lint passing,** with no growing pile of warnings. `[all]` Prove: run both.
- **Each business rule lives in one place.** A price, a fee, a limit or "who may do what" is written once, not copied into the browser, the server and the database. AI tools tend to repeat logic instead of reusing it. `[all]` Prove: search for each rule's numbers and conditions; more than one source of truth is a finding.
- **No dead code or unused dependencies.** `[all]` Prove: a tool such as knip.
- **No copy-paste duplication** beyond a set threshold. `[all]` Prove: a tool such as jscpd.
- **No circular imports.** `[all]` Prove: a tool such as madge.
- **No oversized files or functions** beyond a set threshold. `[all]`
- **One way to do each common thing:** fetch data, handle errors, validate input, show a loading state. `[all]`
- **Tests on the core flows run in CI.** `[all]`
- **A new developer can set it up from the README** in under an hour. `[all]`
- **Someone on the team can explain each part of the code** without asking the AI. Where nobody can, it is listed as a risk. `[all]`
- **Opinion, in the report:** does the structure fit where the product is going (scale, team, next features)? Needs product context, so it is advice for the owner, not a pass or fail.
