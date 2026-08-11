# Context templates

One template per context file. The project-setup interview reads these to create a project's real `context/`.

The framework repo has no `context/` of its own — context always belongs to a project.

## Markers

Every section carries one:

| Marker | Meaning |
|---|---|
| `[derive]` | Read it out of the codebase, the database, or the live site. Asking would be theatre. |
| `[ask]` | Cannot be derived. Ask the human — these are the interview. |
| `[derive → confirm]` | Derive a draft, then show it for correction. Faster to strike a wrong line than to dictate a right one. |

Delete the markers and the guidance lines when writing a project's real file. What's left is the file.

## Two tiers

**Company-level** — COMPANY.md, BRAND.md, CHANNELS.md. Written once and shared across that company's projects.

**Project-level** — PRODUCT.md, DESIGN.md, tokens.css, STACK.md, DISTRIBUTION.md. Per product.

"Company" means *that project's company*. A client's COMPANY.md describes the client, not you.

## Boundary

BRAND.md and DESIGN.md both sound like "brand". Line one of each states the boundary and it is not decoration:

- **BRAND.md** — everything written and strategic.
- **DESIGN.md** — everything visual.

## What reads what

Two files are consumed by scripts, so their structure is load-bearing:

- `BRAND.md` — the **banned words table** is parsed by `scripts/prose-lint.mjs`. It needs a heading containing "banned" followed by a `| word | why | use instead |` table.
- `STACK.md` — the **registry** key is read by `design-system-guard`. `tokens.css` is parsed for the token allowlist.
