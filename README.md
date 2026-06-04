# GDS prototype starter pack

A clonable starting point for building GOV.UK-style service prototypes with AI coding agents. It works in both **Cursor** and **Claude Code**, and splits its guidance across the three primitives by what each is actually for:

- **Rules** — passive, always-loaded or path-scoped project conventions (how this project works). Carries the department-specific bits.
- **Skills** — triggered procedures (scaffold a versioned prototype, record a decision). Portable across departments.
- **Sub-agents** — delegated specialist roles (content design, accessibility, conformance review, ideation). Portable across departments.

The design idea: the **department-specific layer is tiny and isolated** (one config file plus `docs/standards/project.md`), so the skills and sub-agents are reusable as-is by any department. Clone, set your config, go.

## Setup

```bash
# 1. Clone (or fork) this pack as the start of your service repo
git clone <this-pack> my-service && cd my-service

# 2. Set your department/service details
#    edit config/project.json

# 3. Render the config into the rules
node scripts/bootstrap.mjs

# 4. Start your own history
rm -rf .git && git init && git add -A && git commit -m "Initial prototype from starter pack"
git remote add origin <your-remote> && git push -u origin main
```

That's it — open the folder in Cursor or Claude Code and the rules load automatically.

## How each tool picks this up

**Claude Code** reads `CLAUDE.md` at launch, which imports the standards in `docs/standards/`. Skills in `.claude/skills/` and sub-agents in `.claude/agents/` load on demand when relevant.

**Cursor** reads `.cursor/rules/*.mdc`. Each rule is path-scoped with `globs` so it only loads when you're in matching files (e.g. styling rules load on `.scss` files), which keeps the context lean. The always-on `project.mdc` and `decisions.mdc` load every time. `AGENTS.md` is also read as a fallback.

One honest cross-tool note: **sub-agents are a Claude Code feature.** In Cursor the same specialists aren't auto-invoked from these files — you'd trigger the equivalent review or content work by prompting directly, or adapt them into Cursor's own agent setup. Rules and the standards work identically in both.

## What's where

```
config/project.json          Department/service settings — the only thing you edit
CLAUDE.md, AGENTS.md         Entry points (Claude Code / cross-tool)
.cursor/rules/*.mdc          Cursor rules, path-scoped via globs
docs/standards/*.md          Canonical conventions, shared by both tools
docs/decisions/              The design-decision trail (see its README)
.claude/skills/
  gov-prototype-scaffold/    Init versioned prototypes + create decision records (bundles scripts)
  gov-decision-log/          How to capture decisions well
.claude/agents/
  gov-content-designer       GDS copy
  gov-accessibility-reviewer Persona-based WCAG 2.2 AA review
  gov-design-reviewer        Conformance vs requirements, research, GDS (reads Figma + prototype)
  gov-design-ideator         Explore solutions from research + Figma
scripts/bootstrap.mjs        Renders config into the rules
```

## Daily use

- **Start a prototype version:** ask the agent to scaffold one, or run
  `node .claude/skills/gov-prototype-scaffold/scripts/scaffold.mjs v1 "first cut"`.
- **Record a decision:** ask the agent to "log this decision", or run
  `node .claude/skills/gov-prototype-scaffold/scripts/new-adr.mjs "<title>"`. Decisions are recorded proactively as they're made — see `docs/decisions/README.md` for how the decentralised trail works.
- **Review:** ask for an accessibility review or a design/conformance review before handover; both pull requirements and research via MCP where connected.
- **Ideate:** ask the design ideator for alternative approaches early, grounded in research and existing Figma frames.

## MCP connectors

The reviewer and ideator read from Figma (designs) and a research/requirements source, and decisions can optionally be mirrored to a docs store. Connect these in your tool's connector settings; the connector names you intend to use are noted in `config/project.json` for reference. If a connector isn't available, the agents fall back to what's in the repo and say so.

## Switching departments

This pack is department-agnostic except for `config/project.json` and the rendered identity lines. To set up another department, clone the pack fresh, edit the config, and run bootstrap again.
