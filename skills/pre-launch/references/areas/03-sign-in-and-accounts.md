# 03 Sign-in and accounts (AU)

- **Sign-in is decided on the server.** No password checks in the browser, no "logged in" flag in local storage that anyone can set. `[all]` Prove: set the flag in developer tools.
- **Email confirmation** is on, or turned off as a recorded decision. `[all]` Dashboard.
- **Passwords:** at least 8 characters, a leaked-password check where the provider offers it, hashing left to the provider and never written by hand. `[all]` Dashboard, for the provider's settings.
- **Password reset** answers the same whether or not the account exists. Tokens are random, short-lived and single-use. A reset signs out other sessions. `[all]` Prove: reset a real and a made-up email and compare.
- **Sensitive changes ask for the password again:** changing the email, the password, two-factor settings, payout or bank details, or deleting the account. The old email address is notified of the change, and other sessions are ended. Quietly swapping the payout account is a classic way to rob a marketplace. `[all]` Prove: change the email from a signed-in session without the password.
- **Sign-in, sign-up and reset are rate limited.** `[all]` Prove: send twenty sign-in attempts in a row.
- **Guessable secrets have a limit:** PINs, handover codes and short codes can't be tried without end. `[all]` Prove: try a hundred codes.
- **Sessions** expire, sign-out ends them, tokens in httpOnly cookies where the stack allows. `[web]`
- **Redirect URLs** after sign-in are limited to your own domains. No open redirects. `[all]` Prove: sign in with a redirect to an outside domain.
- **Two-factor for users** if the product holds money or sensitive data. A product decision. `[payments]`
- **Closing an account** works, and does what the privacy policy says. `[all]`
