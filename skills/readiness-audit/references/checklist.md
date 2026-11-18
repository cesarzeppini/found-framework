# Readiness checklist

The starting list. Items 1–23 and 26 always apply. Items 24 and 25 apply when the map finds them. The audit adds whatever else the map and the best-practices search turn up for this project.

1. Environment variables
2. Never commit API keys
3. Authentication vs authorization
4. Input validation
5. SQL injection
6. Rate limiting
7. CORS
8. HTTPS
9. Row level security, or the project's equivalent for data access
10. Password hashing
11. Database backups
12. Error logging
13. Rollbacks
14. Dependency updates
15. Secrets rotation
16. Never trust the client: prices, roles, statuses and permissions are decided on the server
17. Output escaping (XSS)
18. Security headers (CSP, HSTS, frame protection)
19. Safe error handling: no internal errors shown to users, and no half-finished operations
20. Monitoring and alerts that reach a person
21. Backups that have been restored at least once
22. Least privilege for keys and accounts, including two-factor on every service
23. Supply chain: lockfiles, pinned versions, no unknown packages
24. File storage and uploads: private by default, no overwriting other people's files, no listing, type and size checked on the server, cleanup on delete, size and cost limits *(when present)*
25. Privacy basics: account deletion, data export, privacy policy *(when personal data is present)*
26. Performance basics: indexes, paginated lists, a load test of the main paths
