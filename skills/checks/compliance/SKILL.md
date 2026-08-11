---
name: compliance
description: Runs once at review, alongside the security audit. Reads the spec's compliance surface plus the diff and reports which legal documents are affected and why. Advisory as a check — it never blocks; its consequences land in Ship, which drafts the amendments into out/legal/. Triggers during review, after every slice has passed.
---

# compliance

Runs **once**, at review, alongside `security-audit`. Advisory — it never blocks.

## What this is for

This reads the same facts as the security audit for a **different consequence**.

Security asks: can someone reach data they shouldn't? Compliance asks: **did we start doing something we have to tell people about, or get their permission for?** A feature can be perfectly secure and still put the product out of step with its own published privacy policy.

The output is not a fix. It's a list of **which legal documents this feature affects and why**, handed to Ship, which drafts the amendments.

## Inputs

**SPEC.md's compliance surface** — new personal data collected, new third-party processors, new cookies or trackers, changed retention, changed data location, anything touching minors or payments.

**The full diff.** The surface is where to start, not the boundary. A diff that touches something the spec didn't list is a finding in its own right: it means the spec's surface was wrong, which is a spec-quality signal worth the report.

**`context/STACK.md`** — where the legal documents live in the repo, and the jurisdiction they're written for. Both are needed: the same change has different consequences under different regimes, and a check that guesses the jurisdiction produces confident nonsense. If STACK.md names neither, **that is the finding** — report it and stop there rather than assuming.

**`context/COMPANY.md`** — stage and scale, for judging whether an obligation actually bites.

## What to look for

**New personal data.** Any field the product didn't previously store about a person: email, name, phone, address, date of birth, IP, location, device identifiers, uploaded photos, free-text fields where users will inevitably put personal information. Data about **people who aren't users** — an invitee, a referral, a contact — is the case most often missed, because no existing clause covers someone who never agreed to anything.

**New third-party processors.** Any service the diff starts sending data to: email providers, analytics, error tracking, payment processors, storage, AI APIs. Each is a processor if personal data reaches it, and processors are usually enumerated in a published list that is now out of date.

**New cookies or trackers.** Anything written to a browser that isn't strictly necessary, plus the consent mechanism that should gate it. A tracker added without touching the consent banner is the single most common compliance regression in a web product.

**Changed retention.** Data now kept longer, kept after deletion, soft-deleted where it used to be hard-deleted, or copied somewhere the deletion path doesn't reach. Deletion paths that silently stop being complete are invisible in review and very visible in a data subject request.

**Changed data location.** Data crossing a region boundary — a new service in another jurisdiction, a CDN, a backup target.

**Minors and payments.** Either one raises the floor sharply. Flag the moment the feature makes them plausible, not once they're certain.

## Mapping to documents

For each finding, name the affected document and the clause or section, using the paths in STACK.md:

| Trigger | Usually affects |
|---|---|
| New personal data, new purpose | Privacy Policy — what we collect, why, legal basis |
| New processor | Privacy Policy sub-processor list; DPA records |
| New cookie or tracker | Cookie Policy; the consent mechanism itself |
| Changed retention or deletion | Privacy Policy retention section |
| New data location | Privacy Policy transfers section; DPA |
| New user obligation, new paid tier, new liability | Terms of Service |

**Read the live text before claiming a document is affected.** An existing clause often already covers the change, and a finding that ignores what the policy actually says wastes a lawyer's time — which is the expensive kind of false positive.

## Advisory, and why

This check never blocks, for a structural reason: the question it raises is answered by a human with legal responsibility, and a blocking check would sit waiting for one. The pipeline forbids waiting.

So findings flow to Ship, which drafts amendments into `out/legal/`, and the human gate decides. **Approving the run does not approve the legal changes** — those are marked and approved individually.

**An empty surface is a checked box, not a skipped one.** Report "no legal documents affected" explicitly, with what was examined. Silence here is indistinguishable from the check never running, and that distinction is the whole value of the check on the ninety features that don't touch anything.

## Limits

**Never give legal advice.** Report what changed and which document covers it. Whether that change is lawful, and what the amendment should say, are a lawyer's — this check's job is making sure the question reaches one.

**Never decide jurisdiction.** It comes from STACK.md or it is a finding.

**Park, don't guess** when it's genuinely unclear whether a field is personal data or whether a clause already covers the change. Park it with both readings stated. Guessing "not personal data" is the failure with consequences.

## Report

**Report decisions, not activity** (RULES.md): which documents are affected and why, not the diff you read. The explicit "not affected" list is required rather than optional — an empty result stated is a reported decision, an empty result omitted is missing information.

```text
compliance
Jurisdiction: <from STACK.md>   Documents: <paths from STACK.md>
Affected (2)
  Privacy Policy    "What we collect" — the invite flow stores an invitee's
                    email before that person has an account; the current clause
                    only covers data about registered users
  DPA / processors  Sub-processor list — slice 4 sends invitee emails to a
                    transactional email provider not currently listed
Not affected
  Terms of Service  no new user obligation or paid surface
  Cookie Policy     no new cookie, storage write or tracker in the diff
Surface drift (1)
  the spec's compliance surface listed no third-party processors; slice 4 adds one
Parked (1)
  the free-text "note to invitee" field will predictably contain personal data,
  but is not personal data by design — reading A: no change needed; reading B:
  retention section should cover user-generated content about third parties
```

When nothing is affected: `compliance: no legal documents affected (surface: …, jurisdiction: …)`.
