# {{DEPARTMENT_NAME}} GOV.UK prototype

GOV.UK-style frontend for a {{SERVICE_NAME}} at {{DEPARTMENT_FULL_NAME}}. Audience: {{AUDIENCE}}.

Non-negotiables: reuse before adding; accessibility is the default (WCAG {{WCAG_TARGET}}); state design intent in reasoning; record non-obvious decisions in `docs/decisions/` via the `gov-decision-log` skill, proactively as they're made.

These imports load at launch. Full standards:

@docs/standards/project.md
@docs/standards/templates.md
@docs/standards/styling.md
@docs/standards/javascript.md
@docs/standards/content.md

## Skills and sub-agents

- Scaffolding a new prototype or cutting a new version → use the `gov-prototype-scaffold` skill.
- Recording a design decision → use the `gov-decision-log` skill.
- Writing or refining user-facing copy → delegate to the `gov-content-designer` sub-agent.
- Accessibility review → `gov-accessibility-reviewer` sub-agent.
- Conformance review against GDS, requirements and research → `gov-design-reviewer` sub-agent.
- Ideating solutions from Figma and research → `gov-design-ideator` sub-agent.
