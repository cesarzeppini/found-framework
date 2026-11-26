# 10 Uploads and storage (U)

**Reuses** security-audit's uploads check.

- **Buckets are not publicly listable.** Public only what must be. An open bucket leaked 72,000 photos and IDs from the Tea app in 2025. `[uploads]` Prove: list a bucket signed out.
- **Upload rules live in the storage, not the form:** only your own folder, size and type limits. `[uploads]` Prove: upload a 50 MB file and an `.html` file.
- **No overwriting other people's files.** `[uploads]` Prove: upload to another user's path.
- **Pictures only from your own storage.** No arbitrary outside URLs saved as avatars or images. `[uploads]`
- **Private files use signed, expiring links.** `[uploads]`
- **Risky types are blocked or served safely:** SVG and HTML can carry scripts. `[uploads]`
- **Files of deleted accounts** are removed or kept as the privacy policy says. `[uploads]`
- **Storage has size and cost limits.** `[uploads]` Dashboard.
