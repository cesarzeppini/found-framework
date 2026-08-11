---
name: security-audit
description: Runs once at end of feature, reading the spec's security surface plus the full diff against the baseline rules in STACK.md. Blocking — unresolvable high-severity findings end the run into the final report. Covers what a per-slice pass structurally cannot see: reachability across the whole diff, tenancy, and what leaves the system. Triggers during review, after every slice has passed.
---

# security-audit

Runs **once**, at end of feature, over the spec's security surface plus the full diff. Blocking.

## What this is for

The builder already applied the obvious protections inline, per slice — RLS on tables it created, parameterised queries, auth on new routes. **This audit is the net, not the only line**, and it exists because per-slice review is structurally blind to three things:

- **Reachability.** Slice 2 adds an endpoint; slice 6 adds a link to it from an unauthenticated page. Neither slice is wrong alone.
- **Tenancy across the whole diff.** One query missing a tenant filter is invisible in a slice that reads correct in isolation.
- **What leaves the system.** Serialisers, logs, error payloads and analytics events accumulate fields slice by slice, and no single slice added a leak.

Read the whole diff at once. That is the point of running here rather than per slice.

## Inputs

Start from **SPEC.md's security surface** — new tables, new endpoints, auth changes, user input, file uploads, third-party keys. It names the surface; this check decides what that surface implies.

Then `context/STACK.md` for the project's baseline rules — the stack's own conventions decide what "correct" looks like here, and a finding that ignores them is noise.

The surface is a starting point, not a boundary. A diff that touches something the spec didn't list is itself worth reporting: it means the spec's surface was wrong, and that's a spec-quality signal.

## What to check

**Authorisation, not just authentication.** Signed in is not the same as allowed. Every new route, action and query: who can reach it, and what stops a signed-in user reaching another user's data by changing an identifier.

**Row-level security.** Every table the diff creates or newly exposes. Enabled *and* the policy expresses the intended rule — an enabled policy that always evaluates true is a table with no protection and a green checkbox.

**Input at the boundary.** Validated where it arrives, not deep inside. Untrusted input reaching a query, a filesystem path, a shell, a template, or a redirect target.

**Output.** What the new endpoints and serialisers actually return, field by field. Internal identifiers, other users' data, password or token fields, and full error objects in production responses.

**Secrets.** Nothing added to the diff that belongs in the environment. Keys in client-side code — including anything the framework inlines into a client bundle at build time.

**Uploads,** where the feature has them: type and size enforced server-side, stored outside the web root or behind a signed URL, filenames never trusted.

**Dependencies** the diff introduces: currently maintained, no known critical advisories.

## Severity and blocking

Thresholds and the retry limit come from RULES.md. This check keeps security's conventional three-level scale, which maps onto them as follows:

| Severity | Meaning | Handling |
|---|---|---|
| high | Exploitable now, or exposes data | The blocking tier, per RULES.md. Survives its attempts → the run ends into the report. |
| medium | Real weakness needing a precondition | Park, per RULES.md. Fix in place if unambiguous. |
| low | Hardening, defence in depth | Park. Never blocks. |

Report findings in this vocabulary rather than translating them, so a finding stays greppable against the tools and advisories that use it.

Rate on what the finding lets someone actually do in this system — RULES.md says severity is rated against COMPANY.md, and this is where that bites hardest. A theoretical issue in an admin-only path used by two people is not high severity.

**Park, don't guess** when the fix changes intended behaviour — tightening a permission that might be deliberately open, or restricting a field something else consumes. Name the exact change proposed and what might depend on it.

**Never weaken a control to make the check pass.** If a policy blocks a legitimate flow, that's a finding about the flow.

## Report

**Report decisions, not activity** (RULES.md): findings and what you changed, not the surface you walked through to get there. One result for the check, including when it's clean — on a stack where most features find nothing, a silent audit and an absent one look identical.

```text
security-audit
Blocking (1)
  high    src/api/invites.ts:34  invite lookup by id has no tenant filter;
                                 any signed-in user can read any invite
Fixed (2)
  medium  src/api/invites.ts:12  email validated at the boundary
  medium  supabase/policies.sql  invites RLS policy always evaluated true,
                                 now owner-scoped
Parked (1)
  low     src/lib/log.ts:8       invite payload logged in full, includes email —
                                 propose redacting; check nothing parses the log
Surface drift (1)
  spec listed no file uploads; the diff adds avatar upload in slice 5
```

Clean runs report `security-audit: clean (N files, surface: …)`.
