---
id: 2026-06-04-single-server-prototype-versioning-and-dashboard-8557
title: Single-server prototype versioning and dashboard
date: 2026-06-04T12:00:00.000Z
author: unknown
status: accepted
prototype:
supersedes:
---

# Single-server prototype versioning and dashboard

## Status

Accepted.

## Context

Early scaffold created a full duplicate app under `prototypes/vN/src/` per version, while standards described `src/server/` at repo root. That made two servers worth of code, confused agents about where to edit, and split the testing story from shared `docs/decisions/` and `docs/reviews/`.

Teams wanted a clearer timeline: one running app, versioned routes, and navigation to the design trail.

## Decision

Adopt a **single Hapi app** with:

- **Code** under `src/server/versions/<vN>/`, auto-registered at `/<vN>/`
- **Metadata** under `prototypes/<vN>/VERSION.md` only (no per-version `src/` tree)
- **Shared** `src/server/common/`, `src/client/`, dashboard at `GET /`, trail at `/trail` indexing `docs/decisions/` and `docs/reviews/`

Rejected: isolated server per version (duplicate dependencies and unclear “current” tree); committed index files for decisions/reviews (merge conflicts).

## Consequences

- `npm start` serves all versions; restart after `scaffold.mjs` cuts a new version.
- Freeze a cut by setting `status: frozen` in `VERSION.md`; routes stay for comparison.
- Consumers on the old layout must migrate code into `src/server/versions/` (documented in `docs/standards/prototypes.md`).
- Scaffold and templates must stay aligned on import paths and feature folders.
