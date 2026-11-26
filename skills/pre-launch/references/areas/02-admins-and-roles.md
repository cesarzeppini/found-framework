# 02 Admins and roles (AD)

**Reuses** security-audit's authorisation check.

- **Role and status columns are not writable by the user:** admin, role, verified, plan, credits, rating. `[all]` Prove: set your own role to admin.
- **Every admin endpoint checks the role on the server.** Admin pages hidden from the menu while their endpoints stay open is a common AI pattern. `[all]` Prove: call admin endpoints as a normal user.
- **Admins sign in with two-factor.** `[all]` Dashboard, where the provider holds the setting.
- **Admin actions are logged:** who, what, when. `[all]`
- **Support or impersonation tools**, if any, are limited and logged. `[all]`
