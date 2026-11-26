# 14 Platform settings (D)

Mostly read through the platforms' own tools, and mostly dashboard.

- **Database:** SSL enforced; network restrictions decided; security and performance advisors clean; pending version upgrades applied. `[all]` Dashboard.
- **Auth settings:** email confirmation, code expiry, CAPTCHA, rate limits, own email server, allowed redirect URLs, password length, leaked-password check. `[all]` Dashboard.
- **What's deployed matches the repository:** functions, migrations and jobs that exist in production but nowhere in the code are a finding. `[all]` Prove: list what's deployed and compare.
- **Hosting plan allows commercial use.** Some free tiers do not (Vercel Hobby). `[web]` Dashboard.
- **Preview deployments** use no production secrets or data, and are protected if they show unreleased work. `[web]` Dashboard.
- **Framework patched**, and access not checked only in middleware: a 2025 Next.js flaw (CVE-2025-29927) let attackers skip middleware entirely. `[web]`
- **Custom domain:** HTTPS, HSTS, http and www redirect to one address. `[web]` Prove: `curl -I` each variant.
