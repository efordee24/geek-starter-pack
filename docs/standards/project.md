# Project context

This is a GOV.UK-style frontend for a **{{SERVICE_NAME}}** built for **{{DEPARTMENT_FULL_NAME}} ({{DEPARTMENT_NAME}})**.

Audience: **{{AUDIENCE}}** — {{AUDIENCE_NOTE}}.

## What this means for design decisions

- Reuse and compose before you add. Every new component, style or token is something the whole team now has to learn and maintain — reach for an existing GOV.UK Design System pattern or an existing app pattern first, and only add when you can say why the existing set can't carry the intent.
- Accessibility is the default state of a thing, not a later pass. Target WCAG {{WCAG_TARGET}}.
- State the design *intent* in your reasoning, not just the implementation, so a reviewer can judge whether the decision was right — not just whether the code runs.
- When you make a non-obvious design or technical decision, record it (see `docs/decisions/`). This is enforced lightly by the decisions rule and carried out by the `gov-decision-log` skill.

## Designing for this audience

For an **internal** audience, assume domain knowledge and prioritise task completion: technical terms and departmental acronyms are fine, hand-holding is not, and speed (keyboard use, batch actions, sensible defaults) matters more than onboarding. For a **public** audience, do the opposite — plain language, no assumed knowledge, generous guidance. The `content` standard adapts to whichever is set here.

## Stack

Node.js + Hapi, Nunjucks templating, GOV.UK Frontend {{GOVUK_FRONTEND_VERSION}}, GOV.UK Design System components. Tooling conventions live in the `javascript`, `templates` and `styling` standards.
