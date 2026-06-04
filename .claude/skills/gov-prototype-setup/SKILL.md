---
name: gov-prototype-setup
description: Walk a non-technical user through configuring this GOV.UK prototype pack via chat — department, service, audience, product context, GDS design constraints, MCP connectors, and optional git onboarding. Use when the user says set up, configure, customise the pack, first time, onboard, or has just cloned the starter without running bootstrap.
---

# Prototype pack setup

Chat-first onboarding for this starter pack. Collect answers in conversation, confirm a summary, then write files with the bundled script. The user should not need to edit `config/project.json` or understand placeholders.

## Before you start

1. Run `node scripts/check-setup.mjs` (or read its JSON output) to see if setup is already complete.
2. If placeholders remain in rules (`{{SERVICE_NAME}}` etc.), this is **first-time setup** — use `apply-setup.mjs` then `bootstrap.mjs` (the script runs bootstrap for you).
3. If setup already ran, this is **reconfigure** — warn that `bootstrap.mjs` only replaces `{{TOKENS}}` once. Still run `apply-setup.mjs`, then `node scripts/sync-context.mjs` to refresh identity lines in `docs/standards/project.md` and `.cursor/rules/project.mdc`.

Optional structured context for agents:

```bash
node scripts/load-context.mjs
```

Use the full JSON in the session; do not pipe through `head`, `tail`, or `grep`.

## Interview (one topic at a time)

Ask plainly; do not dump all questions at once. Skip questions already answered in the thread.

| Phase | Ask about | Writes to |
|-------|-----------|-----------|
| Identity | Department short name, full name, service name | `config` + `PRODUCT.md` header |
| Audience | internal or public; who uses it; domain terms OK? | `config.service` + `PRODUCT.md` Users |
| Standards | WCAG target (default 2.2 AA), GOV.UK Frontend version (default 5.x), JS style guide URL | `config.standards` + `DESIGN.md` stack |
| Product | Service purpose, key tasks, tone, anti-references, requirements/research URLs | `PRODUCT.md` |
| Design | Patterns to prefer/avoid within GDS, any approved `app-` extensions | `DESIGN.md` |
| Figma workspace | Account, team/org, project for new files, primary design file URL | `config.figma` + `DESIGN.md` Figma section |
| Connectors | MCP server names for Figma, research, docs (names only, no secrets) | `config.mcp` |
| Finish | Show a short summary; get explicit confirmation before writing | all files |

Do not ask for custom colour palettes, marketing hero layouts, or brand registers — this pack is GDS-first (see `DESIGN.md` template).

## Apply the setup

Build a JSON payload matching this shape:

```json
{
  "config": {
    "department": { "name": "...", "fullName": "..." },
    "service": { "name": "...", "audience": "internal|public", "audienceNote": "..." },
    "standards": { "govukFrontendVersion": "5.x", "styleGuideUrl": "...", "wcagTarget": "2.2 AA" },
    "mcp": { "figma": "Figma", "research": "Notion", "docs": "Notion" },
    "figma": {
      "verifiedAccount": "",
      "planKey": "",
      "planName": "",
      "projectId": "",
      "projectName": "",
      "primaryFileUrl": "",
      "primaryFileKey": ""
    }
  },
  "productMarkdown": "# ... full PRODUCT.md body ...",
  "designMarkdown": "# ... full DESIGN.md body ..."
}
```

Write it to a temp file, then run:

```bash
node .claude/skills/gov-prototype-setup/scripts/apply-setup.mjs --file /path/to/payload.json
```

Or pipe stdin:

```bash
node .claude/skills/gov-prototype-setup/scripts/apply-setup.mjs < payload.json
```

The script writes `config/project.json`, `PRODUCT.md`, `DESIGN.md`, runs `scripts/bootstrap.mjs`, then `scripts/check-setup.mjs`.

If bootstrap did not change files (reconfigure), also run:

```bash
node scripts/sync-context.mjs
```

## Git onboarding (optional)

Explain from the README — only execute destructive git commands if the user explicitly agrees:

- Fresh history: `rm -rf .git && git init && git add -A && git commit -m "Initial prototype from starter pack"`
- Then add remote and push if they have one.

Never run `rm -rf .git` without explicit confirmation.

## MCP onboarding (checklist)

After files are written, walk through connector setup in the user's tool (Cursor or Claude Code).

Remind: connector names are references only; credentials stay in the tool, not in the repo.

### Figma (required verification)

Do not skip account and project checks. Full rules: `docs/standards/figma-mcp.md`.

1. Ask the user to connect the Figma MCP server named in `config.mcp.figma` (usually `Figma`).
2. Call the Figma MCP **`whoami`** tool.
3. Show the user the authenticated identity and ask: **Is this the correct Figma account for this service?** If not, they must re-authenticate in MCP settings and you run `whoami` again.
4. If `whoami` returns **multiple plans** (teams or organisations), list them and ask which owns this service’s design work. Record the chosen plan’s `key` as `figma.planKey` and a readable `figma.planName`.
5. Ask which **project** (folder) new design files should be created in. Prefer a project URL; extract `projectId` (see `figma-mcp.md`). Record `figma.projectName`.
6. Ask for the **primary design file** URL if one exists; extract `fileKey` into `figma.primaryFileKey`. If none yet, say `none yet` in `DESIGN.md` and leave keys empty.
7. Update `config/project.json` → `figma` and the Figma table in `DESIGN.md` with verified values. Re-run `apply-setup.mjs` with the updated payload, or patch those files and run `node scripts/sync-context.mjs` if bootstrap already ran.
8. Tell the user: agents will not create Figma files outside this project unless they explicitly ask in chat.

If Figma MCP is unavailable during setup, record what the user *intends* (account email, team name, project name, file URL) and note in `DESIGN.md` that `whoami` verification is still required before the first Figma write.

### Other connectors

| Purpose | Config key | User action |
|---------|------------|-------------|
| Requirements / research | `mcp.research` | Connect Notion or equivalent |
| Decision mirror (optional) | `mcp.docs` | Connect docs store if the team uses one |

## Closing

- Report `check-setup` result; if it fails, say what to fix. An empty `prototypes/` folder is **expected** — not a setup failure.
- Tell the user they can say "set up" again to reconfigure, or edit `PRODUCT.md` / `DESIGN.md` directly.

### First prototype version (after pack setup)

Pack setup does **not** create v1 or v2. Offer this as the natural next step:

1. Ask whether they want to create their **first prototype version** now (one sentence description).
2. If yes, follow **`gov-prototype-scaffold`** — run `scaffold.mjs` (defaults to `v1`), then tell them to run `npm start` and open `http://localhost:3000/` (dashboard) and `http://localhost:3000/v1/`.
3. If not yet, tell them the dashboard at `/` will show an empty state with the same instructions when they are ready.

Do not pre-scaffold v1/v2 during pack setup unless the user explicitly asks for a specific version label and description.
