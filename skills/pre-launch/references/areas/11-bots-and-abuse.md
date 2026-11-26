# 11 Bots and abuse (AB)

AI tools almost never add these unless asked.

- **CAPTCHA on sign-up, reset and contact forms, enforced on the server.** A widget on the form alone stops nothing: a bot calls the API directly. `[all]` Prove: call the sign-up API without a token.
- **Rate limits** on sign-in, on anything that sends email or SMS, and on expensive endpoints like search. `[all]` Prove: hit each one in a loop.
- **Email and SMS sending** have quotas and alerts. SMS sign-up is protected against SMS pumping (country limits, blocking virtual numbers). `[all]` Dashboard.
- **Limits per user** on posts, messages and offers per hour. `[all]`
- **Free credits or trials** only after verification. `[payments]`
