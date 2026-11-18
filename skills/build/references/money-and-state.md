# Money and state

These apply to any slice that touches the spec's **Money and state** constraint. They hold on every stack. The stack profile says how to do each one on its platform.

Every rule here comes from a hole the Kancha audit proved. The id names it.

## The server decides

- **Amounts and currency come from the record being paid for,** read on the server. The client sends which offer, never how much. *(M1: a buyer paid 0.50 for a 650 deal.)*
- **The client changes no state field directly.** The status of a record (paid, delivered, completed) and the counters, ratings and expiry times that depend on it are set by server code or the database. Never by an update the client sends. *(A3, I6, L8)*
- **The client never reports the result of something the server learns on its own.** Payment success comes from the provider's webhook, not from the browser saying "it worked". The browser waits for the record to change. *(M8, F1)*

## Every move is checked

- **Each transition checks the state it starts from.** "Mark as paid" only moves a record that is waiting for payment. Anything else is refused and logged. *(L2: a withdrawn offer could still be paid.)*
- **No move goes backwards because of a late event.** Outside events arrive out of order. A later "failed" after a "succeeded" doesn't undo the payment. *(M2)*
- **Repeats do nothing.** Webhooks deduplicate by event id. Payment creation sends an idempotency key. One record per thing paid for is enforced by a unique constraint, not by hoping. *(L2, M5)*
- **Nothing commits other people before it's confirmed.** Rejecting the other offers and closing the request wait for the payment, and unconfirmed holds expire. *(L3)*
- **Money taken with no valid record to attach to is refunded,** not left sitting. *(L2)*

## Records last

- **Records that matter outlive whatever they point at.** A paid deal, its messages and its reviews survive the offer, the request or the account being deleted. References to them don't cascade. Leaving deactivates the account and blanks its personal fields. *(L1, P3, P4)*
- **Proof of handover can't be read by the person it's meant to check.** The PIN belongs to the buyer alone, it comes from a cryptographic random source, and wrong guesses are capped. *(A4, L4)*

## States that need a person

- **Every such state tells someone,** the moment it's reached, through a channel a person actually reads. A dispute nobody hears about is a refund nobody makes. *(Found while fixing Kancha.)*
- **Every state the code names, something sets.** A `completed` or `disputed` that nothing ever reaches means a review never publishes and a payout never goes out. *(L5, L7)*

## Testing these

The slice's test covers the refusal as well as the happy path: a late event, a repeat, a move from the wrong state. A test that only proves the happy path proves the slice works when nothing goes wrong, which is the one case these rules don't need.
