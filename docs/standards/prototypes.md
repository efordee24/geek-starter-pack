# Prototype versions (single server)

One Hapi app serves all prototype cuts. Version **metadata** lives in `prototypes/<vN>/`; version **code** lives in `src/server/versions/<vN>/`.

The pack **starts with no versions** — only `prototypes/README.md`. The dashboard at `/` shows an empty state until you cut the first version.

## Layout (after your first cut)

```
prototypes/v1/VERSION.md     # milestone metadata only
src/server/
  common/                    # shared layouts, helpers, components
  dashboard/                 # GET /
  trail/                     # GET /trail, /trail/decisions, /trail/reviews
  versions/v1/               # routes at /v1/
src/client/                  # shared assets
docs/decisions/              # ADRs (tag with prototype: vN)
docs/reviews/                # review reports (tag with prototype: vN)
```

## First version

Ask the agent to create your first prototype version, or run:

```bash
node .claude/skills/gov-prototype-scaffold/scripts/scaffold.mjs "first cut"
```

That creates **v1** by default. Restart `npm start` if the server is already running, then open `/` and `/v1/`.

## Later versions

```bash
node .claude/skills/gov-prototype-scaffold/scripts/scaffold.mjs v2 "second research round"
```

Restart `npm start` so the router discovers the new plugin under `src/server/versions/`.

## Freezing a version

Set `status: frozen` in `prototypes/<vN>/VERSION.md`. Keep the routes mounted for comparison; avoid new features in that folder unless fixing a demo bug.

## Design trail

- **Dashboard** (`/`) — links to each version and the trail.
- **Trail** (`/trail`) — indexes `docs/decisions/` and `docs/reviews/` by frontmatter (filter with `?prototype=v1`).

Always tag new ADRs and reviews with `--prototype <version>` when they belong to a cut.

## Migrating from isolated `prototypes/vN/src/`

If an older repo duplicated a full app per version:

1. Move `prototypes/v1/src/server/...` → `src/server/versions/v1/...`
2. Hoist shared `common/` and `client/` to `src/`
3. Keep or recreate `prototypes/v1/VERSION.md`
4. Remove empty `prototypes/v1/src`
5. Confirm `/`, `/v1/`, `/trail` work
