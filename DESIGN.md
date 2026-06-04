# Design constraints (GDS-first)

> Run setup before relying on this file: ask the agent to **set up this prototype pack**, or use the `gov-prototype-setup` skill.

This file describes **service-specific choices within GOV.UK Design System constraints** — not a separate brand system.

## Stack

- GOV.UK Frontend: [TODO version, e.g. 5.x]
- GOV.UK Design System components by default
- Custom styles: `app-` prefix only, with explicit approval — see [docs/standards/styling.md](docs/standards/styling.md)

## Reuse hierarchy

1. Existing app styles in the prototype
2. GOV.UK Design System / Frontend styles
3. New `app-` styles (last resort, user approval required)

## Prototype-specific patterns

[TODO Patterns to prefer or avoid for this service — e.g. task list for bulk actions, summary list for review.]

## Figma

- [TODO Figma file URL or "none yet"]

## Non-goals

Do **not** introduce for this service:

- Custom colour palettes or typography outside GDS
- Marketing-style hero sections or decorative motion
- Components that duplicate GOV.UK patterns without recorded justification

Record justified departures in `docs/decisions/`.
