# 04 Business logic (L)

The steps of the product itself. AI tools build the happy path and rarely ask what happens out of order.

- **Draw the life of each core object** (order, booking, deal, subscription): every state, every move between states. Each move happens on the server, by the right person, once. `[all]`
- **Every state the code names is reachable.** A `completed` or `disputed` that nothing ever sets is unfinished work. `[all]`
- **No step can be skipped, repeated, reversed or done by the wrong person.** `[all]` Prove: call each move out of order and twice.
- **Nothing commits other people before it's confirmed.** An action that reserves, charges or notifies the other party should wait for the step that confirms it. `[all]`
- **Two requests at once** cannot double-accept, double-book or double-spend. "One per" rules are unique constraints in the database, not checks in the form. `[all]` Prove: fire two requests in parallel.
- **Things that should expire do:** unpaid orders, holds, invitations, posts. `[all]`
- **Time zones and daylight saving time** are handled for every deadline, schedule and "within 24 hours" rule: stored in UTC, shown in the user's zone. `[all]` Prove: a deadline that crosses a clock change.
- **Scheduled jobs are actually scheduled, and running.** Code for a job nobody scheduled is common. `[all]` Prove: list the schedules and their last runs.
- **Records others rely on** (orders, messages, reviews) cannot be deleted or rewritten by one side. `[marketplace]`
- **Each side sees only what it should:** a seller does not see other sellers' bids, a buyer does not see the handover code before it is due, and so on. `[marketplace]`
