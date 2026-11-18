# Finding ids

Every security finding gets an id: a short area prefix plus a number, e.g. `A3` for an access finding. The same id is used in the report, the fix's commit, the proof test, and the status line that closes it.

- **Prefixes come from the report itself.** Each report defines its areas once at the top (`A` access, `S` secrets, and so on), based on what that project actually has. There's no fixed list.
- **Ids are unique within one report.** Outside it, write the scope too: `invites/A2`, `readiness/S1`.
- **Never reuse or renumber an id.** A finding that turns out wrong is closed as `withdrawn`, with the reason.
- **Close a finding with a status line, not an edit.** The original text stays. Underneath it goes `closed`, `accepted` (with the reason and date), or `withdrawn`.
