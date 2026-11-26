# 05 Money (M)

**Reuses** security-audit's "never trust the client" rule.

- **The amount and currency come from the server**, from stored prices. The browser never sends a price that gets charged. `[payments]` Prove: change the amount in the request.
- **Amounts are stored as whole minor units** (cents) or exact decimals, never floating-point numbers. `[payments]`
- **Every paid feature is checked on the server.** A common vibe-coding hack is opening the browser console, setting your own plan to "pro", and getting it for free. `[payments]` Prove: unlock a paid feature by changing your own plan or credits.
- **Only a verified webhook decides that a payment succeeded**, never the browser's redirect. `[payments]`
- **Webhooks:** signature checked on the raw body; repeated events ignored; a late or out-of-order event cannot move a paid order backwards; failures answer with an error so the provider retries. `[payments]` Prove: replay an event, send events in the wrong order, send one unsigned.
- **Idempotency keys** on creating payments, refunds and payouts. `[payments]`
- **A payment with nothing to attach to is refunded**, not left in the account. `[payments]`
- **Failures on the money path reach a person,** not only a log line nobody reads. `[payments]`
- **Fees and commission live in one place**, on the server. `[payments]`
- **Refunds and disputes** are handled in code and in the webhook, with a person who decides. `[payments]`
- **Subscriptions:** upgrades, downgrades, failed renewals and cancellation work, and access ends when it should. `[payments]`
- **Sellers are verified by the payment provider before they can be paid.** Payouts only after the refund and dispute window; one payout per order; the ledger matches the provider's numbers. `[marketplace]`
- **Test and live keys and webhook endpoints are separate per environment.** Staging never shares a sandbox with production. `[payments]` Dashboard.
- **Restricted keys** where the provider allows. Test first: some calls refuse restricted keys whatever their permissions (Stripe's Express dashboard login link, for one). `[Stripe]` Dashboard.
- **The provider's go-live checklist** is done; fraud rules looked at; the team on the account reviewed. `[Stripe]` Dashboard.
