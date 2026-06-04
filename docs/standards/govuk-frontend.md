# GOV.UK Frontend in this pack

This prototype serves [GOV.UK Frontend](https://github.com/alphagov/govuk-frontend) from `node_modules` and composes pages with official Nunjucks macros. Layout chrome uses the refreshed (blue) branding from **v6+** — see the [header](https://design-system.service.gov.uk/components/header/) and [service navigation](https://design-system.service.gov.uk/components/service-navigation/) components.

## Layout conventions

- **GOV.UK header** (`govukHeader`) — crown and GOV.UK home link only. Do not put the service name or menu links in the header.
- **Service navigation** (`govukServiceNavigation`) — service name and primary nav (dashboard, design trail). Pass `navActive` from route handlers (`dashboard` | `trail`).
- Partials live in `src/server/common/templates/partials/`; the base layout is `govuk-layout.njk`.
- Macro paths are resolved from `node_modules/govuk-frontend/dist` (configured in `src/server/server.js`).

## Staying up to date

GOV.UK Frontend and the Design System change after model training cut-offs. Treat the upstream CHANGELOG as the source of truth for breaking changes and migration steps.

### Check script

```bash
npm run check:govuk-frontend
```

This compares the installed package to the latest on npm and lists CHANGELOG release headings between your version and latest. Exit code `1` means you should plan an upgrade; `0` means you match npm latest.

Use `--json` for machine-readable output (CI or agent workflows).

### Periodic review (recommended)

| Cadence | Action |
| -------- | ------ |
| Monthly or before a major demo | Run `npm run check:govuk-frontend` |
| When the check fails | Read [CHANGELOG.md](https://github.com/alphagov/govuk-frontend/blob/main/CHANGELOG.md) from your version to latest; upgrade with `npm install govuk-frontend@<version>` |
| After upgrading | Restart `npm start`, smoke-test `/` and `/trail`, scan custom templates for deprecated macro parameters |
| Major version (e.g. 5 → 6) | Log a decision record; update `config/project.json` `standards.govukFrontendVersion` and `DESIGN.md` |

Agents can run the **`gov-govuk-frontend`** skill for a guided review (check, CHANGELOG scan, layout/macro audit).

### What to watch in CHANGELOG

- Header / footer **rebrand** (blue branding default in v6; remove `govukRebrand` / `rebrand` flags).
- **Service navigation** — service name and nav moved out of the header (deprecated since 5.9).
- Template block renames (`header` → `govukHeader`, wrapping `<header class="govuk-template__header">`).
- Removed macro parameters and JavaScript API changes.

Record non-obvious upgrade choices in `docs/decisions/` (for example staying on a pinned minor until a flow is stable).

## Version pin

The dependency is pinned in `package.json`. Document the intended line in `config/project.json` → `standards.govukFrontendVersion` (e.g. `6.x`) so bootstrap placeholders stay accurate.
