# Step 3: Audit the areas

Go through every area in `../references/areas.md` that applies, starting from the map's **To check** list for that area, and following the stack profile's **Audit checks**. Read first, then prove.

The areas are independent once the map exists, so **they can run in parallel**, one per area group. A harness without parallel agents runs them in order and produces the same documents.

## Area documents

Group related areas into one document, the way Kancha did (Access alone; Logic with Money; Secrets with Supply chain; Input with Realtime; Failure with Privacy and Claims; Platform with Accounts and Recovery; Performance alone). Write `work/baseline-<date>/<nn>-<areas>.md` in the shape in `../references/documents.md`:

- **How far this goes,** at the top: what was read, what was run, what wasn't seen and why.
- **Proven,** as a table: finding, who acted, result. A reader can check the strongest claims at a glance.
- **Findings by severity,** each with its id, `proven` or `read`, the file and line, and what someone can actually do with it, in one plain sentence first. A finding that comes from a decision in step 2 cites it.
- **What holds.** Protections that were checked and work. This tells the reader the base is sound where it is, and it's what keeps the audit honest. An area with no "what holds" was probably not looked at closely enough.
- **Not covered.**

## Severity

Four levels, rated against COMPANY.md and the decisions from step 2:

| Severity | Meaning |
|---|---|
| critical | Exploitable now by anyone who finds it, and it moves money or exposes or destroys data |
| high | Exploitable now, by a narrower set of people or with a narrower effect |
| medium | A real weakness that needs a precondition |
| low | Hardening, defence in depth |

`not built` sits beside the severity for known unfinished work from step 2. Such a finding is still rated, so the report shows what's missing before launch, but it's counted separately.

A finding that's real but harmless in this product (an admin-only path two people use) is rated by what it lets someone do here, not by how it would sound in the abstract.

## Proofs

Every `critical` and `high` finding, and every `medium` a single request can show, gets a proof, following `skills/checks/security-audit/references/proofs.md`. One difference applies here: the audit writes the proofs itself, because it has to run the attack to know whether the finding is real.

- **Write them in expected-to-fail form,** using the test runner's own mechanism (`test.fails`, `xfail` and similar), with the finding id in the name, under `security/baseline/`. The suite stays green while the hole is open. If someone fixes a hole by accident, its proof starts passing unexpectedly and the runner flags it.
- If the runner has no such mechanism, keep the proofs in `work/baseline-<date>/proofs/`, outside the suite, and say so in the report. The fix stage moves each one in.
- **A proof that passes, meaning the attack is refused, is good news.** It goes under **What holds**. If the attack failed for a different reason than expected, the finding changes instead of disappearing. Kancha had five of these: four were good news, one turned into a different finding.
- A finding that can't be shown by a request (a missing backup, an absent feature, a setting) stays `read`, and its document says why.

Leave the local database resettable, and note in the report how to reset it.

## Done when

Every applicable area has a document. Every finding has an id, a severity, and `proven` or `read`. Every `critical` and `high` has a proof or a stated reason it can't have one. The full suite passes.

→ Next: `4-fix-order.md`
