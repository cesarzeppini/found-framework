# 16 Supply chain (SC)

**Reuses** security-audit's dependencies check, across every dependency instead of the new ones.

- **Every dependency exists and is the one intended.** AI tools invent package names, and attackers register them ("slopsquatting"). `[all]` Prove: for each package, check the registry page, download count and source repository.
- **Lockfile committed, installs with** `npm ci` (or the equivalent). No flags that hide dependency conflicts. `[all]`
- **Known vulnerabilities reviewed,** split into what ships and what's tooling only. None critical in what ships. `[all]` Prove: the package manager's audit command.
- **Dependabot or Renovate on.** `[all]` Dashboard.
- **CI actions pinned to a commit**, workflow permissions minimal, secrets only where needed. The Nx attack began with a flawed CI workflow that leaked a publishing token. `[all]`
- **Server-side imports pinned** to exact versions (edge functions, Deno). `[all]`
- **Maintainers are protected against phishing:** two-factor with a security key or passkey on the code host and package registry. Shai-Hulud began with a fake npm security email. `[all]` Dashboard.
