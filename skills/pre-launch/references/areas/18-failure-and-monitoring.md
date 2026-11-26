# 18 Failure and monitoring (F)

**Reuses** code-quality's guard-the-bar move on unfinished work that looks done (empty catch blocks, stubs).

- **It fails closed.** When a service is down, nobody gets access or money they should not. `[all]`
- **Errors from browser, server, functions and scheduled jobs reach a tool that alerts a person.** Common errors are not ignored for being noisy. `[all]` Dashboard, for the alert rules.
- **Uptime checks** on the main pages and the webhook endpoints. `[all]` Dashboard.
- **No empty catch blocks** on the money and access paths. `[all]` Prove: search for them.
- **Users are never shown an error after something succeeded**, nor success after a failure. `[all]`
- **States that need a person to act** (a dispute, a stuck order, a report) notify someone. `[all]`
