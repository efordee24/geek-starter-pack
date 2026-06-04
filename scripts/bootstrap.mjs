#!/usr/bin/env node
// Render config/project.json into the rule files.
// Run once after cloning: `node scripts/bootstrap.mjs`
// To set up a different department, edit config/project.json and re-clone (or
// edit the rendered files by hand — bootstrap replaces placeholders, which are
// consumed on first run).

import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const root = process.cwd()
const cfg = JSON.parse(readFileSync(join(root, 'config', 'project.json'), 'utf8'))

const map = {
  '{{DEPARTMENT_NAME}}': cfg.department.name,
  '{{DEPARTMENT_FULL_NAME}}': cfg.department.fullName,
  '{{SERVICE_NAME}}': cfg.service.name,
  '{{AUDIENCE}}': cfg.service.audience,
  '{{AUDIENCE_NOTE}}': cfg.service.audienceNote,
  '{{GOVUK_FRONTEND_VERSION}}': cfg.standards.govukFrontendVersion,
  '{{STYLE_GUIDE_URL}}': cfg.standards.styleGuideUrl,
  '{{WCAG_TARGET}}': cfg.standards.wcagTarget
}

const targets = [
  'CLAUDE.md',
  'AGENTS.md',
  ...readdirSync(join(root, 'docs', 'standards')).map((f) => join('docs', 'standards', f)),
  ...readdirSync(join(root, '.cursor', 'rules')).map((f) => join('.cursor', 'rules', f))
]

let touched = 0
let remaining = 0
for (const rel of targets) {
  const path = join(root, rel)
  if (!existsSync(path)) continue
  let text = readFileSync(path, 'utf8')
  let changed = false
  for (const [token, value] of Object.entries(map)) {
    if (text.includes(token)) {
      text = text.split(token).join(value)
      changed = true
    }
  }
  if (changed) {
    writeFileSync(path, text)
    touched++
    console.log(`rendered ${rel}`)
  }
  if (/\{\{[A-Z_]+\}\}/.test(text)) remaining++
}

console.log(`\nDone. Rendered ${touched} file(s) for ${cfg.department.name}.`)
if (remaining) {
  console.log(`Note: ${remaining} file(s) still contain placeholders — check config/project.json covers them.`)
}
