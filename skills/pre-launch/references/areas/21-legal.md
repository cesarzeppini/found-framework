# 21 Legal (LG)

The checklist can confirm the documents exist, are linked, are accepted and match what the code does. Whether the wording holds up is a job for a lawyer or a template service.

**Reuses** compliance's mapping from triggers to documents, and its rule to read the live text before calling a document affected. Findings name the document and clause; drafting the amendment is the build side's job (`out/legal/`, per RULES.md), never the audit's.

- **Privacy policy** that matches reality: data collected, services that process it, where it is stored, how long, how to get a copy or delete it. `[all]` Prove: every outside service the code sends data to is named in it.
- **Terms of use:** who may use it, what is forbidden, how accounts get closed, liability. `[all]`
- **Consent at sign-up:** an unticked checkbox linking both. The version accepted and the time are stored. `[all]`
- **Cookie banner and policy:** nothing non-essential loads before opt-in, choices stored. `[web]` Prove: load the site fresh and list what's set and called before any choice.
- **Legal notice:** company name and contact details. Required for businesses in the EU. `[web]`
- **Links** to all of the above from sign-up and from the footer. `[web]`
- **Refund and cancellation policy**, and what happens in a dispute. `[payments]`
- **Seller terms** that reference the payment provider's agreement for connected accounts (Stripe's Connected Account Agreement). `[marketplace]`
- **Separate rules for each side,** and who is responsible when a deal goes wrong. Reporting illegal content is covered in area 12. Check what the EU Digital Services Act asks of the product; small companies have lighter duties. `[marketplace]`
- **A data processing agreement and a list of processors**, if business customers' data is handled. `[all]`
