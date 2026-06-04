---
id: 2026-01-01-decentralised-decision-trail-seed
title: Keep design decisions as immutable per-file records in the repo
date: 2026-01-01T00:00:00.000Z
author: starter-pack
status: accepted
prototype: ""
supersedes: ""
---

# Keep design decisions as immutable per-file records in the repo

## Status

Accepted. This is the seed record and an example of the format.

## Context

The team works locally on individual machines and pushes to a shared remote. Design and technical decisions need a durable trail, but the obvious approaches — sequentially numbered records, or a single shared decision log — produce merge conflicts the moment two people record decisions in parallel. The records also need to live with the code for this iteration, not in an external system.

## Decision

Record each decision as its own immutable markdown file in `docs/decisions/`, named `YYYY-MM-DD-<slug>-<shortid>.md`. Capture author and timestamp from git. Supersede decisions by reference rather than editing them. Keep no committed index.

Rejected: sequential numbering (collides across branches); a single append-only log file (conflicts on every push); an external decisions store as the source of truth this iteration (can be added later as a mirror via the docs MCP connector, but in-repo files stay canonical).

## Consequences

Decisions merge cleanly across machines because git reconciles separate files without conflict. The trade-off is no built-in ordering beyond the date prefix and no single-file overview — acceptable, since the directory listing serves as the index and tools can generate a view on demand. Anyone wanting a browsable external view can mirror these files out via MCP without changing where the truth lives.
