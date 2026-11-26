# 07 The build process (B)

Everything else checks the finished product. This checks how it gets built. In 2025 an AI agent deleted a company's production database during a declared code freeze, then wrongly said it could not be restored (Replit). A malicious release of the Nx package ran the AI tools already on developers' machines with their safety prompts switched off, to hunt for secrets; about 2,300 were stolen.

- **Agents never hold production credentials** or access to the production database. They work on local or staging copies. `[all]` Prove: list the environment variables, tokens and database links each agent can reach.
- **Destructive actions need a person to approve them,** enforced by the tool's permissions, not by an instruction in the prompt: deleting data, running migrations, deploying, force-pushing. A code freeze is a permission, not a request. `[all]`
- **What an agent says it did is checked, not trusted:** tests run, data counted, the restore tried. `[all]`
- **No permission-skipping flags** in daily use (`--dangerously-skip-permissions`, `--yolo`, `--trust-all-tools` and similar), and never on a machine holding production secrets. `[all]`
- **Instruction files and agent settings are reviewed like code:** `CLAUDE.md`, `.cursorrules`, rules folders, skills, MCP configuration. Scanned for hidden Unicode characters, which can carry instructions a person cannot see but the AI follows ("rules file backdoor"). `[all]` Prove: search them for zero-width and bidirectional characters.
- **MCP servers and agent plugins are trusted sources,** pinned to versions, with the least access they need. `[all]`
- **No agent combines the "lethal trifecta":** access to private data, exposure to untrusted content (web pages, emails, issues, user input) and a way to send data out. If all three are present, remove one. `[all]`
- **Install scripts are limited** (`ignore-scripts`, or an allow-list), and package-publishing and GitHub tokens are scoped, short-lived and protected with two-factor. The Shai-Hulud worm spread through stolen publishing tokens. `[all]`
- **Every AI-written change is reviewed by someone who can explain it** before it is merged. Code nobody on the team understands gets fixed by asking the AI again, and every fix becomes a gamble ("comprehension debt"). `[all]`
