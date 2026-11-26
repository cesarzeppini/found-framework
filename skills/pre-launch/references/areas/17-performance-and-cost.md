# 17 Performance and cost (PF)

AI-generated code is usually written against ten test rows. It slows down at a few hundred users.

- **Indexes** on foreign keys and on the columns used in filters and row rules. `[all]` Prove: the database's performance advisor; `EXPLAIN` on the slowest queries.
- **No query per item in a list** (the N+1 problem). A page is a handful of queries. `[all]` Prove: watch the query log while a list loads.
- **Every list is paginated** and every query bounded. `[all]`
- **Row rules are cheap:** in Supabase, write `(select auth.uid())`, not `auth.uid()`, so it runs once instead of per row. `[Supabase]`
- **Database connections from serverless functions** go through a pooler. `[all]`
- **Tested with realistic data volumes**, plus a basic load test. `[all]`
- **The database is close to the users.** Measure the latency from where they are. `[all]`
- **Server and database sizes** are a decision, not a default nobody looked at. `[all]` Dashboard.
- **Images resized and compressed, bundle size checked, Core Web Vitals checked.** `[web]`
- **Usage alerts and spending caps** on every paid service. `[all]` Dashboard.
