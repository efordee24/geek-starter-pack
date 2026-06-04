# Agent instructions

GOV.UK-style frontend for a {{SERVICE_NAME}} at {{DEPARTMENT_FULL_NAME}} ({{DEPARTMENT_NAME}}). Audience: {{AUDIENCE}} — {{AUDIENCE_NOTE}}.

This file is the tool-agnostic entry point. Cursor reads it as a fallback; Codex and other AGENTS.md-aware agents read it natively. Claude Code reads `CLAUDE.md`; Cursor primarily reads `.cursor/rules/`. The substance lives in `docs/standards/` so all tools share one source.

Principles:
- Reuse and compose before adding components, styles or tokens.
- Accessibility is the default, target WCAG {{WCAG_TARGET}}.
- State design intent in reasoning, not just implementation.
- Record non-obvious decisions in `docs/decisions/` as they are made.

Detailed standards: see `docs/standards/{project,templates,styling,javascript,content}.md`.
Skills: `.claude/skills/`. Sub-agents (Claude Code): `.claude/agents/`.
