# Pre-launch proofs

The general rules for proofs live in `skills/checks/security-audit/references/proofs.md`: act through the boundary an attacker uses, assert the refusal and read the state back, local stack only, sandboxes with no deployed webhooks. This file adds only what's different when an audit writes them before anything is fixed.

## One proof per finding

The audit writes its own proofs, because it has to run the attack to know a finding is real. Every finding gets one, not only the serious ones: a script or a query that prints one line.

- `PROVEN`: the problem exists. Exit 1.
- `NOT PROVEN`: the problem is closed. Exit 0.
- A refused target, a missing tool, a stack that isn't running: say which, exit 2. Setup failure must never look like a result.

**Holds** proofs check something already safe that a likely change could break ("a signed-out visitor receives no chat messages"). They print `HOLDS` and must stay `NOT PROVEN`; if one ever prints `PROVEN`, that's a regression.

A finding that can't be shown by a request or a query (a backup never restored, an absent feature, a dashboard setting) stays `read`, and its document says why instead of carrying a proof.

## Where they live

`work/pre-launch-<date>/proofs/<id>-<slug>.<ext>`, with the finding id in the name. The audit writes nothing into the project's code or test suite.

Proofs that attack (act as a user, send a changed request, call a function) are written in the project's own test runner and format, so the build session can move one into the suite unchanged, under `security/pre-launch/`. Its first move in a fix package is exactly that: put the proof in the suite, watch it fail for the reason the finding gives, then fix until it passes. From then on it runs in CI, so a finding that comes back fails the build.

Proofs that check configuration (headers, DNS, an advisor's output, a grep over the built JavaScript) can stay small scripts; the package decides whether CI runs them.

## Targets

Attacks run on the local stack only, as the general rules say. One exception, for reads anyone on the internet can make: response headers, TLS, DNS records and public pages fetched signed out may be checked against deployed hosts. Anything that signs in, writes, or lists what a signed-out visitor shouldn't see stays local.

Proofs create their own data and leave the local stack resettable. Note how to reset it in the report.
