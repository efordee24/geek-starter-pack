# Styling (SCSS)

Core principle: maximise reuse, minimise new styles. A consistent prototype that reuses existing styling beats a pixel-perfect one that adds bespoke CSS.

Follow this order, and don't skip a step:

1. **Reuse an existing app style.** Always check first.
2. **Use a GOV.UK Design System style.** Search `node_modules/govuk-frontend` for something applicable.
3. **Add a new style — last resort only.** Requires explicit user approval before you write it. Prefix every custom class with `app-`.

Rules:
- Never rewrite or duplicate an existing style.
- Extract and reuse hardcoded values (colours, dimensions) rather than repeating literals.
- 2-space indentation, no tabs.

If you find yourself wanting a new style, say so and explain why the existing app and GOV.UK styles can't express it, then wait for approval. That conversation is usually worth recording as a decision.
