#!/usr/bin/env node
// Cut a new versioned prototype.
// Usage: node scaffold.mjs [<version-label>] ["<short description>"]
// Defaults the label to the next vN by scanning prototypes/.

import { execSync } from 'node:child_process'
import { mkdirSync, writeFileSync, existsSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const PROTOTYPES_DIR = join(process.cwd(), 'prototypes')

const args = process.argv.slice(2)
let version = args[0]
const description = args[1] ?? ''

const nextVersion = () => {
  if (!existsSync(PROTOTYPES_DIR)) return 'v1'
  const ns = readdirSync(PROTOTYPES_DIR)
    .map((d) => /^v(\d+)$/.exec(d))
    .filter(Boolean)
    .map((m) => Number(m[1]))
  return `v${(ns.length ? Math.max(...ns) : 0) + 1}`
}
if (!version) version = nextVersion()

const dir = join(PROTOTYPES_DIR, version)
if (existsSync(dir)) {
  console.error(`Prototype ${version} already exists — refusing to overwrite.`)
  process.exit(1)
}

const subdirs = [
  'src/client/javascripts',
  'src/client/stylesheets',
  'src/server/common/components',
  'src/server/common/templates/layouts',
  'src/server/common/templates/partials',
  'src/server/common/helpers',
  'tests'
]
for (const s of subdirs) mkdirSync(join(dir, s), { recursive: true })

const gitValue = (cmd, fallback) => {
  try {
    return execSync(cmd, { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim()
  } catch {
    return fallback
  }
}
const author = gitValue('git config user.name', 'unknown')
const date = new Date().toISOString()

writeFileSync(
  join(dir, 'VERSION.md'),
  `---
version: ${version}
description: ${description}
author: ${author}
created: ${date}
---

# Prototype ${version}

${description || 'No description provided.'}

Decisions affecting this version are recorded in \`docs/decisions/\` with \`prototype: ${version}\` in their frontmatter. Create one with:

\`\`\`bash
node .claude/skills/gov-prototype-scaffold/scripts/new-adr.mjs "<title>" --prototype ${version}
\`\`\`
`
)

writeFileSync(join(dir, '.gitkeep'), '')
console.log(`Created prototypes/${version}/ (author: ${author})`)
