# Decision records

This folder is the project's design-decision trail. Each file records one decision — why something is the way it is, what was rejected, and what follows.

## Why it's built this way

The trail is designed for a team working on their own machines and pushing to a shared remote. That rules out two common patterns:

- **No sequential numbers** (`0001`, `0002`…). Two people working in parallel both grab the same next number and collide on merge.
- **No shared append-only log file.** Everyone editing one file conflicts on every push.

Instead: **one immutable file per decision**, named `YYYY-MM-DD-<slug>-<shortid>.md`. The date keeps them sorted, the slug makes them readable, and the random shortid means two people can create records on the same day without colliding. Git merges separate files cleanly, so the trail reconciles on push with no conflicts. There is deliberately no committed index — the directory listing *is* the index.

## Creating a record

```bash
node .claude/skills/gov-prototype-scaffold/scripts/new-adr.mjs "Use radios not a select for status" --prototype v2
```

This captures your name and the timestamp from git and writes a template to fill in. Or just ask Claude to record a decision — the `gov-decision-log` skill does the same thing.

## Changing a decision

Never edit a past record to reverse it, and never renumber. Create a new record with `--supersedes <old-id>` and mark the old one superseded. The history of *how the thinking changed* is the point.

## Frontmatter

Each record carries `id`, `title`, `date`, `author`, `status` (proposed / accepted / superseded), `prototype` (which version it relates to, if any) and `supersedes` (the id it replaces, if any).
