# 06 Secrets (S)

**Reuses** security-audit's secrets check, across the full history instead of a diff.

- **No secrets in the repository or its history.** `[all]` Prove: run a secret scanner (gitleaks, trufflehog) over the full history.
- **Nothing secret in the browser.** Only public-by-design keys in variables the browser sees (`NEXT_PUBLIC_`, `VITE_`, `EXPO_PUBLIC_`). Scans of AI-built apps keep finding API keys in shipped JavaScript. `[all]` Prove: search the built JavaScript for key patterns.
- **Calls that need a secret key go through the server.** `[all]`
- **Secrets users give you are encrypted at rest** and never shown back: their API keys, access tokens, connected-account credentials. Moltbook kept users' API keys in plain text. `[all]`
- **Env files are git-ignored and not synced** by Dropbox, iCloud or Drive. `[all]`
- **Every key can be rotated, and has been** after anyone who held it left. Know how for each one; some providers retire old key formats. `[all]` Dashboard.
- **Secret scanning and push protection** on in the code host, or a scanner in CI. `[all]` Dashboard.
- **Tool and agent config folders** (`.cursor`, `.kiro`, `mcp.json` and similar) hold no tokens, and are not committed if they could. `[all]` Prove: scan them, including their history.
