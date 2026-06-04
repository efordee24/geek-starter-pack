# Figma MCP — account and workspace

Agents must not create or edit Figma files in the wrong account, team, or project. Workspace targets are set during pack setup and stored in `config/project.json` (`figma`) and `DESIGN.md`.

## Before any Figma MCP write

1. Read `DESIGN.md` (Figma section) and `config/project.json` → `figma`.
2. Call the Figma MCP **`whoami`** tool.
3. Confirm the authenticated user matches `figma.verifiedAccount` (email or handle). If it differs, **stop** and ask the user to sign into the correct Figma account in the MCP connector, then run `whoami` again.
4. If `figma.planKey` is set, it must match one of the plans returned by `whoami`. If not, or if `whoami` lists multiple plans and config is empty, ask which team or organisation to use and record the `key` field (e.g. `team::1234567890`).
5. Before **`create_new_file`**: use `figma.planKey` and `figma.projectId` from config unless the user explicitly chooses another destination in this session. Do not default to the authenticated user’s **Drafts** folder when a team project is configured.
6. Before reading or updating an existing file: confirm the URL or `fileKey` matches `figma.primaryFileUrl` / `figma.primaryFileKey`, or that the user has pointed you at a different file for this task.

## During pack setup (`gov-prototype-setup`)

After the user connects the Figma MCP server:

1. Run **`whoami`** and show the user the authenticated identity (name, email if present).
2. Ask them to confirm it is the **correct account** for this department’s work.
3. If multiple plans (teams/orgs) appear, ask which one owns their design work. Record `planKey` and a human-readable `planName`.
4. Ask which **project** (folder) new design files should be created in. Prefer a project URL; extract `projectId` from formats such as:
   - `https://www.figma.com/files/project/:projectId`
   - `https://www.figma.com/files/team/:teamId/project/:projectId`
5. Capture the **primary design file** URL for this service (if it already exists). Extract `fileKey` from `https://www.figma.com/design/:fileKey/...`.
6. Write all of this into `config/project.json` → `figma` and `DESIGN.md`, then re-run `apply-setup` or update those fields in the confirmed setup payload.

## `config/project.json` figma fields

| Field | Purpose |
|-------|---------|
| `verifiedAccount` | Email or handle confirmed via `whoami` |
| `planKey` | `team::…` or `organization::…` from `whoami` |
| `planName` | Human-readable team or org name |
| `projectId` | Folder where new files should be created |
| `projectName` | Human-readable project name |
| `primaryFileUrl` | Canonical design file for this prototype |
| `primaryFileKey` | Parsed key for MCP calls |

`mcp.figma` remains the **connector name** in Cursor or Claude Code (e.g. `Figma`). It is not the team or file.

## If Figma is not configured yet

Say so explicitly. Do not call `create_new_file` until account and project are confirmed with the user and recorded in config.
