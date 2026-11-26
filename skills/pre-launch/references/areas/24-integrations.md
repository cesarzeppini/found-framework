# 24 Integrations (X)

Every outside service is a second front door: its keys, its account, its webhooks, its bill. Payments and the database have their own areas; this covers the rest, and repeats nothing from them.

**Reuses** compliance's processor tracing for the data each service receives.

## For every outside service `[all]`

- **An inventory:** each service, what it does, what data goes to it, which environment variables it uses, who owns the account. Prove: compare the list with the environment variable names in the code and the outside addresses the app actually calls.
- **The account belongs to the company,** with two-factor, a second owner, and billing on a company card. Not a freelancer's or a personal login. Dashboard.
- **Keys have the least permission the service offers,** one key per environment, server-side unless public by design. Public keys (maps, analytics, monitoring) are restricted to your domains and to the APIs they need. Dashboard.
- **Webhooks from the service are verified:** signature on the raw body, timestamp checked against replays. Prove: send one unsigned and one replayed.
- **Quotas, usage alerts and a spending cap,** so a leaked key or a loop cannot run up the bill unnoticed. Dashboard.
- **Failure is planned:** timeouts and retries on calls; the core flow keeps working if a non-essential service is down; someone is subscribed to its status page.
- **Data:** only what is needed is sent; where it is stored is known; a data processing agreement is in place; the service is named in the privacy policy.
- **Test and live are separate:** staging uses sandbox or test keys.
- **API versions pinned,** and deprecation emails go to an inbox someone reads.
- **DNS records documented:** which record belongs to which service. Records pointing at services no longer used are removed, or someone else can claim that subdomain (subdomain takeover). Prove: resolve every record and check each target still exists and is yours.
- **An exit path:** how to export the data and switch provider, written down.

## Cloudflare, or another DNS and proxy service `[Cloudflare]`

- **SSL/TLS mode is Full (strict), never Flexible.** Flexible leaves the connection between Cloudflare and your server unencrypted. Always Use HTTPS on; minimum TLS version 1.2. Dashboard.
- **DNSSEC on.** Dashboard.
- **The origin cannot be reached directly,** or the firewall and rate limits can be skipped: allow only Cloudflare's addresses, or use a tunnel. Prove: request the origin's address directly.
- **WAF managed rules on, rate limiting rules on sign-in and API routes,** bot protection decided. Turnstile for the CAPTCHA in area 11. Dashboard.
- **API tokens scoped to what each tool needs,** not the account-wide Global API Key. Dashboard.
- **Caching never stores signed-in pages** or API answers with personal data. Prove: load a signed-in page, then fetch the same address signed out.

## Resend, or another email provider `[Resend]`

- **The sending domain is verified** with SPF, DKIM and DMARC, ideally a subdomain (for example `mail.`) so problems there do not hurt the main domain's reputation.
- **The "from" address is on the verified domain.** A key restricted to `mail.example.com` refuses `no-reply@example.com`.
- **App keys have sending access only, restricted to that domain,** one per environment. Full-access keys stay out of apps. Dashboard.
- **Bounce and complaint webhooks are verified** (Resend signs them in the Svix format) and acted on: the suppression list is respected.
- **Sign-in emails from the database's auth go through it,** with the same sender, and a sign-up confirmation has been received in a real inbox.
- **The plan's sending limits are known,** and the procedure for a leaked key is written down.

## Browser API keys: maps, places, address lookup `[web]`

- **Every key has an application restriction** (your domains as HTTP referrers) **and an API restriction** (only the APIs it uses). Google says the owner pays for abuse of an unrestricted key. Dashboard.
- **Separate keys** for browser and server, and for production and development (localhost only in the development key).
- **Quotas and a budget alert** on the billing account. Dashboard.
- **Allowed in the content security policy, named in the privacy policy,** loaded after consent if it sets cookies.

## Sentry, or another error monitor `[Sentry]`

- **Personal data is scrubbed before it leaves:** sending default personal data is off unless decided; emails, tokens and query strings are removed in the before-send hook; session replay, if used, masks text and inputs.
- **Alert rules reach a person,** environments are tagged, sample rates are set on purpose.
- **Source maps are uploaded to the monitor,** and served publicly only by decision. Prove: request a `.map` file from the deployed site.

## Analytics and marketing scripts `[web]`

- **Load only after consent,** collect the minimum, are listed in the privacy policy and allowed in the content security policy.

## Sign-in with Google, Apple and others `[all]`

- **Exact redirect addresses, the smallest scopes,** client secrets on the server, and the consent screen shows the product's own name and policy links. Dashboard.
