---
name: gov-prototype-scaffold
description: Initialise a new GOV.UK prototype or cut a new version of one, and create decision records. Use this whenever the user wants to start a prototype, spin up a new prototype environment, create a new versioned prototype, scaffold a feature, or record a design decision in a government/GDS-style project. Trigger even if they don't say "scaffold" — "let's start v2", "set up a fresh prototype", "new version of the upload flow" all mean this.
---

# Prototype scaffolding

Procedures for standing up versioned prototypes and writing decision records. Standards (how to build) live in `docs/standards/` and load as rules — this skill is only the *how to set things up* layer.

## Cut a new prototype version

Run the bundled script rather than building the structure by hand:

```bash
node .claude/skills/gov-prototype-scaffold/scripts/scaffold.mjs <version-label> "<short description>"
```

If `<version-label>` is omitted it defaults to the next `vN` by scanning `prototypes/`. The script creates `prototypes/<version>/` with the standard `src/` layout and a `VERSION.md` stamped with the label, description, author (from git) and creation date. It does not overwrite an existing version.

Versions are deliberate milestones decided by a person, so a shared `vN` scheme is fine. If two people might cut versions in parallel, agree the label first or pass an explicit one.

## Save a review report

After an accessibility or design review, persist the report under `docs/reviews/`:

```bash
node .claude/skills/gov-prototype-scaffold/scripts/new-review.mjs "<title>" --type accessibility|design [--prototype <version>]
```

Filenames use `YYYY-MM-DD-HHMM-<slug>-<shortid>.md` (local time). See `docs/reviews/README.md`.

## Record a design decision

Decisions live in `docs/decisions/` as one immutable file per decision, designed for a decentralised trail (many people, local work, pushed to a remote). Create one with:

```bash
node .claude/skills/gov-prototype-scaffold/scripts/new-adr.mjs "<title>" [--prototype <version>] [--supersedes <id>]
```

This generates a collision-safe filename (`YYYY-MM-DD-<slug>-<shortid>.md`), captures author and timestamp from git, and writes a template with `status: proposed`. Then fill in the Context, Decision and Consequences sections from the reasoning or the discussion with the user. See `gov-decision-log` for how to write a good record. Never edit a past decision to change it — supersede it with `--supersedes`.

## Scaffold a feature within a prototype

Follow the file layout in `docs/standards/templates.md` (folder per feature under `src/server/`, registered in `router.js`). Reuse existing components and styles first per `docs/standards/styling.md`.
