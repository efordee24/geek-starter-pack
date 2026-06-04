---
name: gov-govuk-frontend
description: Check and upgrade GOV.UK Frontend against npm and the upstream CHANGELOG; audit header, service navigation and layout macros for Design System compliance. Use when the user asks to update GOV.UK components, refresh the blue header, stay current with govuk-frontend, or run a periodic dependency review.
---

# GOV.UK Frontend freshness

Keeps prototypes aligned with [GOV.UK Design System](https://design-system.service.gov.uk/) and [govuk-frontend](https://github.com/alphagov/govuk-frontend). Full pack conventions: `docs/standards/govuk-frontend.md`.

## Quick check

```bash
npm run check:govuk-frontend
```

- Exit **0** — installed version matches npm latest.
- Exit **1** — newer version available; read CHANGELOG migration sections before upgrading.
- Exit **2** — could not read installed or npm version (run `npm install` first).

Use `node scripts/check-govuk-frontend.mjs --json` when reporting results to the user or CI.

## Upgrade workflow

1. Run the check script and note `installed` vs `latest`.
2. Open [CHANGELOG.md](https://github.com/alphagov/govuk-frontend/blob/main/CHANGELOG.md) from the installed version through latest — focus on **breaking changes** and header/footer/service navigation.
3. Upgrade: `npm install govuk-frontend@<version>` (match `package.json` range policy).
4. Verify layout still uses:
   - `govukHeader` for crown/home only
   - `govukServiceNavigation` for service name and nav (`src/server/common/templates/partials/site-header.njk`)
   - No `govukRebrand` / `rebrand` flags (removed in v6)
   - `theme-color` `#1d70b8` on rebranded pages
5. Restart `npm start`; hit `/`, `/trail`, and any active `/vN/` routes.
6. Update `config/project.json` → `standards.govukFrontendVersion` and `DESIGN.md` if the major line changes.
7. Log a decision record if the upgrade involved a non-obvious trade-off (`gov-decision-log` skill).

## Layout audit checklist

- [ ] Service name is **not** inside `govukHeader` (use service navigation).
- [ ] Primary nav links are in **service navigation**, not header navigation (removed in v6).
- [ ] Single `<header class="govuk-template__header">` wraps header + service navigation.
- [ ] Nunjucks loads macros from `node_modules/govuk-frontend/dist`.
- [ ] Static assets served from `/govuk/` (CSS, JS, favicons under `/govuk/images/`).

## Periodic review

Suggest running the check **monthly** or before stakeholder demos. In CI, call `npm run check:govuk-frontend` on a schedule (optional; exit 1 is informational unless the team wants to fail builds on drift).
