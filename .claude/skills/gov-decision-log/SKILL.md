---
name: gov-decision-log
description: Capture a design or technical decision as a decision record in docs/decisions/. Use whenever a non-obvious choice is made — picking one GOV.UK pattern over another, deviating from a default, resolving a trade-off, settling a question raised in discussion — or whenever the user says to log, capture, or write up a decision. Trigger proactively as decisions happen, not only on request.
---

# Decision log

Keeps a decentralised, append-only trail of *why* the prototype is the way it is. Records are immutable markdown files in `docs/decisions/`, one per decision, safe for many people working locally and pushing to a shared remote.

## When to write one

Two modes, both expected:

- **Proactively, from your own reasoning.** When you make a non-obvious decision while working, write it up as you make it — while the reasoning is fresh and complete. Don't wait to be asked, and don't batch them.
- **On request, from discussion.** When the user says "log this" or talks through a decision with you, capture what was discussed: the question, the options weighed, what was chosen and why.

Skip the trivial. A record earns its place only when a future reader would otherwise wonder "why did they do it this way?" — not for routine choices the standards already cover.

## How to write one

1. Create the file with the bundled script (handles the collision-safe id, author and date):
   ```bash
   node .claude/skills/gov-prototype-scaffold/scripts/new-adr.mjs "<title>" [--prototype <version>]
   ```
2. Fill the three sections:
   - **Context** — the problem, constraint or question. Bring in the requirement or research finding that prompted it (pull from the research MCP source if relevant).
   - **Decision** — what you chose *and what you rejected*. Naming the road not taken is the most useful part for the next person.
   - **Consequences** — trade-offs accepted, new constraints, what to revisit.
3. Set `status` to `accepted` once it's agreed.

## Changing a past decision

Never edit a record to reverse it, and never renumber. Write a new record and pass `--supersedes <old-id>`; mark the old one `superseded by <new-id>` in its Status section. The trail should show how thinking changed, not hide it.

## Where records can go

This iteration keeps records local to the prototype source in `docs/decisions/`, so they version and merge with the code. They can later be mirrored to an external store via the docs MCP connector if the team wants a browsable view — but the in-repo files stay the source of truth.
