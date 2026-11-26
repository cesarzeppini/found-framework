# Step 6: Status (`--status`)

Keeps the audit record true as packages close, without rewriting what was found. Runs after a fix package merges, or when asked.

1. **Run every proof**, in the suite and in `work/pre-launch-<date>/proofs/`. `NOT PROVEN` means the finding is closed. `PROVEN` means it's open. A `HOLDS` line that now prints `PROVEN` is a regression: report it first.
2. **Findings without a proof** (settings, absent features, `read` findings) take their status from the package that closed them: its merged pull request and its review. A dashboard setting stays `open` until a person confirms it. Never infer it.
3. **Append a status section** dated today to the end of each group document and to the top of `report.md`, following `references/finding-ids.md` at the repo root:
   - **Closed:** ids, grouped by the package that closed them.
   - **Accepted:** ids, each with its reason and the date decided.
   - **Open:** ids, each with what it's waiting on.
   - **Found while fixing:** anything new a package turned up, with a fresh id in the same numbering.

   The section in `report.md` also lists each package with its pull request and merge date.
4. **Unexpected closes.** A proof that prints `NOT PROVEN` before its package merged means the hole closed some other way. Report the id and what closed it.

Earlier status sections stay, and the original findings are never edited.

## Done when

Every finding in the audit appears in today's status section exactly once.
