# Proofs

A **proof** is a test that performs the attack a finding describes and expects it to be refused. While the hole is open the proof fails, which shows the finding is real. Once the fix lands it passes, and it stays in the suite so the hole can't quietly come back.

## Which findings get one

Every `high` finding, always. A `medium` finding gets one when a single request can show it. A `low` finding doesn't need one.

**Holds proofs** are optional. They lock in something already safe that a likely future change could break, such as "a signed-out visitor receives no chat messages over realtime". Write them for protections the feature depends on.

## Who writes it

The audit finds; the fix writes the proof. `security-audit` describes each finding precisely enough for a proof to be written from the description alone:

- who acts: signed out, a signed-in stranger, the other party
- what they send
- what the system does now
- what it should do instead

Whoever makes the fix (build on a hand-back, or the audit fixing an unambiguous medium in place) **starts with the proof**: write it, watch it fail for the reason the finding gives, then fix until it passes. A proof that passes before any fix means the finding was wrong, or the proof doesn't reach the code. Either way, report it instead of moving on.

## Shape

- **It's an ordinary test in the project's suite.** It lives under the test directory in `security/`. Its name carries the finding id and scope: `security/invites/A2-invite-read-by-stranger`.
- **It acts through the boundary an attacker uses:** the public API, the database client with the public key, the live channel. It never calls internal functions directly. A proof that skips the boundary proves nothing about it.
- **Its assertion is the refusal:** an error, an empty result, an unchanged row. After the attempt, read the state back to confirm nothing changed. "No error" alone isn't a refusal.
- **It runs with the full suite,** so CI runs it on every pull request.

## Local only

Proofs attack things, so they run against the local stack and nothing else.

- Before acting, each proof checks its targets: the database and API hosts are `localhost` or `127.0.0.1`, and every third-party key is a test-mode key. If anything else is configured, the proof stops with exit 2 and names the target it refused. Setup failure must not look like a result.
- **A third-party sandbox can still reach deployed environments.** A test payment in a sandbox fires events to every webhook registered there, including staging's and production's. Proofs that create objects at a third party use a sandbox with no deployed endpoints. If the project has none, park the proof and say why. Don't run it.
- Proofs create their own data and leave the local database resettable. Never point a proof at shared data to save setup time.

## Proofs written by an audit

`pre-launch` writes its proofs itself, before anything is fixed, because it has to run the attack to know a finding is real. It keeps them in its own work folder and prints `PROVEN` or `NOT PROVEN` (`skills/pre-launch/references/proofs.md`). The package that fixes a finding starts by moving its proof into the suite and watching it fail.

## Where the local stack comes from

The Testing section of `context/STACK.md` says how the local stack starts and resets. Which keys count as test keys is decided by each provider's own convention (test-mode prefixes and similar). Check that convention; don't guess.
