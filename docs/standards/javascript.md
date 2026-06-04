# JavaScript / TypeScript

These are the conventions that override sensible defaults — follow them even where your instinct differs. Full team guide: {{STYLE_GUIDE_URL}}

- ES modules (`import`/`export`), never CommonJS (`require`/`module.exports`).
- Named exports only — no default exports.
- No semicolons at end of statements.
- 2-space indentation, no tabs. 80-character line limit.
- `const` by default, `let` only when reassignment is needed, never `var`.
- Single quotes for strings; template literals for interpolation.
- Function declarations over arrow functions, except for callbacks. Parentheses always around arrow-function parameters.
- Lint with neostandard.
- JSDoc on functions and classes, pragmatically (where it earns its keep, not everywhere).

## Testing

- Vitest for all tests.
- Test files live in a top-level `tests/` directory, named `<module-name>.test.js`.

## Dependencies

Pin to exact versions in `package.json`. No range specifiers (`^`, `~`).
