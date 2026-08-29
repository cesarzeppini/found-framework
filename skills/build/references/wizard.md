# Wizard: human-only prerequisites

Reference for Stage 0 in [`SKILL.md`](../SKILL.md). Some prep isn't something an agent can do at all — provisioning infrastructure, creating a third-party account and copying its API key, clicking through an unfamiliar dashboard, running a one-off production migration nobody wants unattended. This is not a failing gate to retry; it's the "unmet assumption" case in RULES.md, and the fix is to name the exact remediation, not to guess a credential or attempt the click-through blind.

## Why a script instead of a paragraph in the report

A prose instruction ("go create a Stripe key and put it in .env") gets re-read and re-interpreted by whoever picks up the report. A generated script does the walking for them: opens the right URL, says exactly what to copy, writes it to `.env` or a CI secret, and shows how many stages remain. It's built once per prerequisite and run once by a human — nothing here re-explains itself across sessions the way a chat instruction does.

## When to generate one

SPEC.md's Prerequisites section, or a Stage 0 task Plan marked **human-required**, names something that needs a human's hands. Confirm it actually can't be done another way before reaching for this — most Stage 0 tasks are ordinary refactors an agent does directly. This is for the remainder: a step where only a human has the access or the authority to act.

## Process

**1. Scope the procedure.** List every manual step and every value it produces. Read `.env`, `.env.example`, and `.github/workflows/*` (or whatever CI config the project uses) — every secret or variable referenced there that doesn't already have a value is something the wizard needs to produce.

**2. Map each stage's journey.** For each step, write the exact path: which URL to open, what to click, where the value appears, which variable it fills. **Never invent a step you don't actually know** — if the current UI or command is genuinely unclear, say so as a stage that asks the human to confirm the path themselves, rather than fabricating a menu sequence that may not exist.

**3. Author the script.** Copy [`wizard-template.sh`](wizard-template.sh) to `work/<feature>/wizard-<slug>.sh`. Replace the example stage with one `stage` block per step, using the helpers already defined above the marker: `stage`, `say`, `open_url`, `ask` / `ask_secret`, `write_env`, `set_secret` / `set_var`, `confirm` / `pause`. Set `TOTAL_STAGES`. **Never edit the library above the marker** — that plumbing is shared across every wizard this framework generates, and hand-editing it per script is how it drifts.

**4. Verify statically, don't run it.** `bash -n` the script. Trace by reading, not executing, that every captured value from step 1 lands in a `write_env` or `set_secret` call, and every `set_secret` name matches something CI actually references. Don't run it end-to-end — it opens browsers and blocks on human input, which an unattended run can't supply.

## Ending Stage 0

This is the unmet-assumption case, not a retry: don't spend the bounded fix attempts from RULES.md on a task that was never fixable by retrying. Generate the script, then **end the run into the report** naming the file path and what it sets up — same shape as any other genuinely blocked item, just with a runnable artifact instead of a paragraph. Once the human has run it, re-invoking build resumes Stage 0 from this task.

## Disposable by default

The script is scratch — it lives in `work/<feature>/`, not committed, and answers this feature's setup need. If the report notes the procedure is likely to recur (a second environment, a future teammate), say so as a suggestion to promote it into the project's own `scripts/` and commit it — but that's the human's call, not something this reference does on its own.
