# 13 AI features (AI)

The product's own use of models. Area 07 covers the agents that build it.

- **Model API keys stay on the server.** `[AI]` Prove: search the built JavaScript for the key.
- **Per-user quotas and a spending cap at the provider**, with alerts. Without them anyone can run up the bill (OWASP calls it denial of wallet). `[AI]` Dashboard, for the cap.
- **Prompt injection:** content from users and outside sources is marked as untrusted; the model gets the least access it needs; tools run in code, not by the model's say-so; risky actions need a person to confirm. No feature combines private data, untrusted content and a way to send data out. `[AI]` Prove: a document or message carrying an instruction to reveal another user's data.
- **Model output is untrusted input:** never rendered as raw HTML or run as SQL or commands. `[AI]`
- **Personal data sent to the model** is the minimum, the provider's retention and training settings are checked, and the privacy policy says so. `[AI]` Dashboard, for the provider's settings.
