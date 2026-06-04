# Review reports

Saved outputs from accessibility and design/conformance reviews. Each file is one review run — findings, severity, and recommendations — so the team can compare over time and share evidence before handover.

## Filename pattern

`YYYY-MM-DD-HHMM-<slug>-<shortid>.md`

- **Date and time** (`HHMM` in local time) sort chronologically and distinguish multiple reviews on the same day.
- **Slug** comes from the review title.
- **Shortid** avoids collisions if two people review at the same minute.

Example: `2026-06-04-1430-pre-handover-accessibility-v1-k7m2.md`

There is no committed index; the directory listing is the index.

## Creating a report

Reviews should always be written to this folder, not only returned in chat.

```bash
# Accessibility review
node .claude/skills/gov-prototype-scaffold/scripts/new-review.mjs "Pre-handover accessibility review" --type accessibility --prototype v1

# Design / conformance review
node .claude/skills/gov-prototype-scaffold/scripts/new-review.mjs "Upload flow conformance review" --type design --prototype v1
```

The script creates a draft template. Fill in Summary, Scope, and Findings from the review (replace placeholder sections). Set `status: final` in frontmatter when the review is complete.

Or ask for an accessibility or design review — the reviewer agents create and populate the file as part of the run.

## Frontmatter

| Field | Meaning |
|-------|---------|
| `id` | Same as filename without `.md` |
| `title` | Short name of the review |
| `date` | ISO timestamp when the report was created |
| `author` | From git config |
| `type` | `accessibility` or `design` |
| `prototype` | Version label, if applicable |
| `status` | `draft` while writing; `final` when complete |

## Re-running a review

Create a **new** file each time — do not overwrite a past report. Later runs on the same day get a different `HHMM` or shortid.
