# Templates (Nunjucks)

Generic GOV.UK macro usage is assumed knowledge — this covers only how *this* project differs from defaults.

- Import GOV.UK macros at the top of each template, one per line, e.g. `{% from "govuk/components/input/macro.njk" import govukInput %}`. Macro paths track GOV.UK Frontend {{GOVUK_FRONTEND_VERSION}}; if a macro path looks wrong, check the installed version rather than guessing.
- 2-space indentation, no tabs.
- Separate data from presentation. Define reusable Nunjucks filters (e.g. `toMonth`, `toMoney`) rather than formatting inline.
- Return validation errors through `govukErrorSummary` plus a per-field error item on each affected field — never a bare message.

## File layout for a new page or feature

Create a folder at `src/server/<feature-name>/` containing:
- `index.js` — plugin registration and route definitions
- `controller.js` — GET/POST route handlers
- `<feature-name>.njk` — the template
- optional `<feature-name>-api.js` for API calls, `<feature-name>-schema.js` for validation

Register the plugin in `src/server/router.js`. Shared components go in `src/server/common/components/<name>/`; layouts in `src/server/common/templates/layouts/`; partials in `src/server/common/templates/partials/`.
