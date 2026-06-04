---
id: 2026-06-04-chat-first-setup-and-product-design-context-files-gkb3
title: Chat-first setup and PRODUCT/DESIGN context files
date: 2026-06-04T00:00:00.000Z
author: unknown
status: accepted
prototype:
supersedes:
---

# Chat-first setup and PRODUCT/DESIGN context files

## Status

Accepted.

## Context

The starter pack was configured by editing `config/project.json` and running `scripts/bootstrap.mjs` — workable for developers, opaque for non-technical prompters. Agents only received thin identity lines from rendered placeholders, with no durable product brief, research links, or service-specific GDS constraints.

[Impeccable](https://impeccable.style) popularised `PRODUCT.md` and `DESIGN.md` as portable context for frontend agents, including a conversational teach flow. This pack serves GOV.UK prototypes under GDS constraints, not marketing or bespoke brand surfaces.

## Decision

We adopted a **chat-first setup skill** (`gov-prototype-setup`) that interviews users, writes artifacts via `apply-setup.mjs`, runs `bootstrap.mjs`, then `sync-context.mjs` and `check-setup.mjs`.

We split configuration into three layers:

1. **`config/project.json`** — structured fields for bootstrap tokens and MCP connector names.
2. **`PRODUCT.md`** — narrative product context: users, purpose, tone, anti-references, requirements/research URLs.
3. **`DESIGN.md`** — **GDS-first** constraints: GOV.UK Frontend version, reuse hierarchy, approved `app-` extensions, Figma links, explicit non-goals (no custom brand palette).

We **rejected**:

- Replacing `project.json` with markdown-only config (bootstrap still needs deterministic tokens).
- Impeccable-style brand registers and visual specs (conflicts with GDS-first prototypes).
- Putting `PRODUCT.md` / `DESIGN.md` in `.gitignore` (templates stay in repo; teams customise via setup).

Bootstrap remains **one-way** for `{{PLACEHOLDER}}` substitution. Reconfigure uses `sync-context.mjs` to refresh identity paragraphs without re-running placeholder replacement.

## Consequences

- Non-technical users can complete setup without opening JSON; technical users retain the manual path.
- `check-setup.mjs` fails on unconfigured clones until setup runs (expected).
- Agents and rules reference `@PRODUCT.md` and `@DESIGN.md` on every session.
- Future fields in `project.json` should stay minimal; rich context belongs in markdown.
- If bootstrap targets change, update `bootstrap.mjs`, `sync-context.mjs`, and `check-setup.mjs` together.
