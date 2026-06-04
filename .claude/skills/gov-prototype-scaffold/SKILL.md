---
name: gov-prototype-scaffold
description: Create or extend GOV.UK prototype versions on the shared server, and record decisions or reviews. Use when the user wants a first prototype version, to cut v1/v2, start prototyping, scaffold a feature, log a decision, or save a review. Trigger on "create my first prototype", "cut a new version", "start v1", "new version of the flow", or an empty dashboard with no versions yet.
---

# Prototype scaffolding

Versioned prototypes on one Hapi app. Full model: `docs/standards/prototypes.md`.

## Check what exists

```bash
ls prototypes/ 2>/dev/null
ls src/server/versions/ 2>/dev/null
```

The pack ships **without** pre-made v1 or v2 folders. An empty `prototypes/` directory is normal until the first cut.

## Run the app

```bash
npm install
npm start
```

Open `http://localhost:3000/` — the dashboard lists versions or shows an empty state with next steps.

## First prototype version

When `prototypes/` has no `vN` folders (or the user asks for their first version):

1. Confirm pack setup is done (`node scripts/check-setup.mjs` — context files matter; missing versions is fine).
2. Ask for a **short description** of this cut (one sentence is enough).
3. Default label to **v1** unless they name another (`v2`, `pilot`, etc.).
4. Run:
   ```bash
   node .claude/skills/gov-prototype-scaffold/scripts/scaffold.mjs v1 "<description>"
   ```
   Or omit the label to auto-pick the next `vN`:
   ```bash
   node .claude/skills/gov-prototype-scaffold/scripts/scaffold.mjs "<description>"
   ```
5. Tell the user to **restart `npm start`** if the server is already running, then open `http://localhost:3000/v1/` (or their label).
6. When logging decisions or reviews for this cut, pass `--prototype v1` (or the label used).

Do not create v1 and v2 placeholders “just in case” — one version at a time, when the team is ready.

## Cut another version

When at least one version exists and the team wants a new milestone:

```bash
node .claude/skills/gov-prototype-scaffold/scripts/scaffold.mjs <version-label> "<short description>"
```

Creates `prototypes/<version>/VERSION.md` and `src/server/versions/<version>/` (routes at `/<version>/`). Restart `npm start` after scaffolding if the server is running.

To **freeze** a version, set `status: frozen` in its `VERSION.md`.

## Save a review report

```bash
node .claude/skills/gov-prototype-scaffold/scripts/new-review.mjs "<title>" --type accessibility|design [--prototype <version>]
```

See `docs/reviews/README.md`.

## Record a design decision

```bash
node .claude/skills/gov-prototype-scaffold/scripts/new-adr.mjs "<title>" [--prototype <version>] [--supersedes <id>]
```

See `gov-decision-log` and `docs/decisions/README.md`.

## Scaffold a feature within a version

Add `src/server/versions/<version>/<feature-name>/` (`index.js`, `controller.js`, templates). Register routes in that version’s `index.js`. Shared code stays in `src/server/common/`. Follow `docs/standards/templates.md`.
