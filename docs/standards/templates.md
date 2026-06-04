# Templates (Nunjucks)

Generic GOV.UK macro usage is assumed knowledge — this covers only how *this* project differs from defaults.

- Import GOV.UK macros at the top of each template, one per line, e.g. `{% from "govuk/components/input/macro.njk" import govukInput %}`. Macro paths track GOV.UK Frontend {{GOVUK_FRONTEND_VERSION}}; if a macro path looks wrong, check the installed version rather than guessing.
- 2-space indentation, no tabs.
- Separate data from presentation. Define reusable Nunjucks filters (e.g. `toMonth`, `toMoney`) rather than formatting inline.
- Return validation errors through `govukErrorSummary` plus a per-field error item on each affected field — never a bare message.
- Avoid `govuk-!-*` utility classes in Nunjucks templates — the `!` is parsed as an operator. Use spacing without bang utilities or `{% raw %}` for literal class names.
- Wrap inline `<script>` blocks that use JavaScript `in` in `{% raw %}...{% endraw %}` so Nunjucks does not parse them.

## File layout for a new page or feature

Create a folder at `src/server/versions/<version>/<feature-name>/` containing:

- `index.js` — plugin registration and route definitions (import from `src/server/versions/<version>/index.js` if needed)
- `controller.js` — GET/POST route handlers
- `<feature-name>.njk` — the template (view path `versions/<version>/<feature-name>/<feature-name>.njk`)
- optional `<feature-name>-api.js` for API calls, `<feature-name>-schema.js` for validation

Shared components go in `src/server/common/components/<name>/`; layouts in `src/server/common/templates/layouts/`; partials in `src/server/common/templates/partials/`.

Version plugins are auto-discovered from `src/server/versions/*/index.js` and mounted at `/<version>/`. See `docs/standards/prototypes.md`.
