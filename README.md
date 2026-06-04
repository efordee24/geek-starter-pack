# GDS prototype starter pack

A clonable starting point for building GOV.UK-style service prototypes with AI coding agents. It works in both **Cursor** and **Claude Code**, and splits its guidance across the three primitives by what each is actually for:

- **Rules** — passive, always-loaded or path-scoped project conventions (how this project works). Carries the department-specific bits.
- **Skills** — triggered procedures (set up the pack, scaffold a versioned prototype, record a decision). Portable across departments.
- **Sub-agents** — delegated specialist roles (content design, accessibility, conformance review, ideation). Portable across departments.

The design idea: the **department-specific layer is tiny and isolated** (`config/project.json`, `PRODUCT.md`, `DESIGN.md`), so the skills and sub-agents are reusable as-is by any department. Clone, set up via chat, go.

## Setup

### 1. Clone (or fork)

```bash
git clone <this-pack> my-service && cd my-service
```

### 2. Configure via chat (recommended)

Open the folder in **Cursor** or **Claude Code** and say:

> Set up this prototype pack

The `gov-prototype-setup` skill walks you through department, service, audience, product context, GDS design constraints, and MCP connector names — then writes the files and runs bootstrap for you. You do not need to edit JSON or run scripts yourself.

### 3. Verify

```bash
node scripts/check-setup.mjs
```

Optional: `node scripts/load-context.mjs` prints `PRODUCT.md`, `DESIGN.md`, and config as JSON for agents.

### 4. Manual path (technical)

Edit `config/project.json`, fill in `PRODUCT.md` and `DESIGN.md`, then:

```bash
node scripts/bootstrap.mjs
node scripts/sync-context.mjs
node scripts/check-setup.mjs
```

To change settings later, run setup again in chat or edit the context files and `node scripts/sync-context.mjs`.

### 5. Start your own history (optional)

The agent can guide you through this; only run destructive steps if you intend to replace the pack’s git history:

```bash
rm -rf .git && git init && git add -A && git commit -m "Initial prototype from starter pack"
git remote add origin <your-remote> && git push -u origin main
```

### 6. MCP connectors

Connect these in your tool’s MCP settings. Names are stored in `config/project.json` for reference only — no credentials in the repo.

| Purpose | Typical connector | Config key |
|---------|-------------------|------------|
| Designs | Figma | `mcp.figma` |
| Requirements / research | Notion (or your research source) | `mcp.research` |
| Decision mirror (optional) | Notion / docs store | `mcp.docs` |

Reviewers and ideators use Figma and research connectors when available; they fall back to repo content (`PRODUCT.md`, `docs/decisions/`) and say so if a connector is missing.

## How each tool picks this up

**Claude Code** reads `CLAUDE.md` at launch, which imports the standards in `docs/standards/` plus `PRODUCT.md` and `DESIGN.md`. Skills in `.claude/skills/` and sub-agents in `.claude/agents/` load on demand when relevant.

**Cursor** reads `.cursor/rules/*.mdc`. Each rule is path-scoped with `globs` so it only loads when you're in matching files (e.g. styling rules load on `.scss` files), which keeps the context lean. The always-on `project.mdc` and `decisions.mdc` load every time. `AGENTS.md` is also read as a fallback.

One honest cross-tool note: **sub-agents are a Claude Code feature.** In Cursor the same specialists aren't auto-invoked from these files — you'd trigger the equivalent review or content work by prompting directly, or adapt them into Cursor's own agent setup. Rules and the standards work identically in both.

## What's where

```
config/project.json          Machine-readable settings for bootstrap
PRODUCT.md                   Service purpose, users, tone, research links
DESIGN.md                    GDS-first design constraints for this service
CLAUDE.md, AGENTS.md         Entry points (Claude Code / cross-tool)
.cursor/rules/*.mdc          Cursor rules, path-scoped via globs
docs/standards/*.md          Canonical conventions, shared by both tools
docs/decisions/              The design-decision trail (see its README)
docs/reviews/                Saved accessibility and design review reports
.claude/skills/
  gov-prototype-setup/       Chat-first pack configuration
  gov-prototype-scaffold/    Init versioned prototypes, decision records, review reports (bundles scripts)
  gov-decision-log/          How to capture decisions well
.claude/agents/
  gov-content-designer       GDS copy
  gov-accessibility-reviewer Persona-based WCAG 2.2 AA review
  gov-design-reviewer        Conformance vs requirements, research, GDS (reads Figma + prototype)
  gov-design-ideator         Explore solutions from research + Figma
scripts/
  bootstrap.mjs              Renders config placeholders into rules
  sync-context.mjs           Refreshes identity lines after reconfigure
  check-setup.mjs            Verifies setup is complete
  load-context.mjs           JSON bundle of context files for agents
```

## Daily use

- **Set up or reconfigure:** ask to set up this prototype pack, or use the `gov-prototype-setup` skill.
- **Start a prototype version:** ask the agent to scaffold one, or run
  `node .claude/skills/gov-prototype-scaffold/scripts/scaffold.mjs v1 "first cut"`.
- **Record a decision:** ask the agent to "log this decision", or run
  `node .claude/skills/gov-prototype-scaffold/scripts/new-adr.mjs "<title>"`. Decisions are recorded proactively as they're made — see `docs/decisions/README.md` for how the decentralised trail works.
- **Review:** ask for an accessibility review or a design/conformance review before handover; both pull requirements and research via MCP where connected and save a dated report in `docs/reviews/`.
- **Ideate:** ask the design ideator for alternative approaches early, grounded in research and existing Figma frames.

## Switching departments

Clone the pack fresh for another department, run setup in chat, and start a new git history. The pack stays department-agnostic except for config and context files.
