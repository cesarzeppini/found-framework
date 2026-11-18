# Step 6: Status (`baseline --status`)

Keeps the baseline record true as stages close, without rewriting what was found. It runs after a fix stage merges, or whenever asked.

1. **Run every baseline proof** in the suite. A proof that passes means its finding is closed. A proof still in expected-to-fail form means the finding is open. A proof under `work/baseline-<date>/proofs/` that hasn't been moved into the suite is open.
2. **Findings without a proof** (`read` findings, settings, absent features) take their status from the stage that closed them: its merged pull request and what its review reported. A setting outside the repository stays `open` until a person confirms it. Never infer it.
3. **Append a status section** dated today to the end of each area document and to the top of `report.md`, following `references/finding-ids.md` at the repo root:
   - **Closed:** ids, grouped by the stage that closed them.
   - **Accepted:** ids, each with its reason and the date it was decided.
   - **Open:** ids, each with what it's waiting on.
   - **Found while fixing:** anything new a stage turned up, with a fresh id in the baseline numbering.

   The status section in `report.md` also lists each stage, with its pull request and the date it merged.
4. **Unexpected passes.** A proof that passes while still marked expected-to-fail means the hole closed without its stage. Report the id. Its stage removes the marker and records what closed it.

Earlier status sections stay, and the original findings are never edited. A reader can always see what was found, when it closed, and what's left.

## Done when

Every finding in the baseline appears in today's status section exactly once.
