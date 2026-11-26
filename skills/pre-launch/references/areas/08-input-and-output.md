# 08 Input and output (I)

**Reuses** security-audit's input-at-the-boundary and output checks.

- **Every write is validated on the server:** types, lengths, ranges, allowed values. Not only in the form. `[all]`
- **Identity and system fields can't be set by the user:** owner, created-by, timestamps, counters. `[all]` Prove: send them in a write.
- **Size limits** on text fields and requests. `[all]` Prove: send a 1 MB message.
- **No SQL built from strings**, including inside database functions. `[all]`
- **No user content rendered as raw HTML.** Markdown is sanitised. `[all]` Prove: post a script tag and an image with an error handler.
- **Users cannot pose as the platform:** reserved names, no "system" messages from users. `[all]`
- **Security headers:** content security policy, frame protection, `nosniff`, referrer policy, permissions policy, HSTS. `[web]` Prove: `curl -I` the site.
- **CORS** allows only your own sites, never `*` on anything that uses credentials. `[web]`
- **Errors do not leak internals:** no stack traces, SQL or internal messages to users. `[all]`
- **Server-side fetches of user-given URLs** cannot reach internal addresses (SSRF). `[all]`
