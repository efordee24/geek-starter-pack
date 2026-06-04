#!/usr/bin/env node
// Sync identity lines from config/project.json into project.mdc and docs/standards/project.md.
// Optionally refresh CLAUDE.md / AGENTS.md when bootstrap placeholders are already consumed.
// Use after reconfigure.

import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const root = process.cwd()
const cfg = JSON.parse(readFileSync(join(root, 'config', 'project.json'), 'utf8'))

const d = cfg.department
const s = cfg.service
const st = cfg.standards

const identityMdc = `Building a GOV.UK-style frontend for a ${s.name} at ${d.fullName} (${d.name}). Audience: ${s.audience} — ${s.audienceNote}.

Product and service context: @PRODUCT.md
GDS design constraints for this service: @DESIGN.md

Non-negotiables:
- Reuse and compose before adding new components, styles or tokens. Justify any addition.
- Accessibility is the default, not a later pass. Target WCAG ${st.wcagTarget}.
- State design intent in your reasoning, not just the implementation.
- Record non-obvious design/technical decisions in \`docs/decisions/\` (see the decisions rule).

Full context: @docs/standards/project.md`

const projectMdIntro = `This is a GOV.UK-style frontend for a **${s.name}** built for **${d.fullName} (${d.name})**.

Audience: **${s.audience}** — ${s.audienceNote}.

Product and service context: see \`PRODUCT.md\` at the repo root.
GDS design constraints for this service: see \`DESIGN.md\` at the repo root.`

const hasPlaceholders = (text) => /\{\{[A-Z_]+\}\}/.test(text)

const ensureContextRefs = (text, block) =>
  text.includes('PRODUCT.md') ? text : text.replace(block, `${block}\n\nService context: @PRODUCT.md\nDesign constraints: @DESIGN.md`)

const updateProjectMdc = () => {
  const path = join(root, '.cursor', 'rules', 'project.mdc')
  if (!existsSync(path)) return
  const text = readFileSync(path, 'utf8')
  const frontEnd = text.match(/^---\n[\s\S]*?\n---\n/)
  if (!frontEnd) return
  if (hasPlaceholders(text)) {
    let body = text.slice(frontEnd[0].length)
    if (!body.includes('PRODUCT.md')) {
      body = body.replace(
        /(Audience:.*?\n\n)/,
        `$1Product and service context: @PRODUCT.md\nGDS design constraints for this service: @DESIGN.md\n\n`
      )
      writeFileSync(path, frontEnd[0] + body, 'utf8')
      console.log('annotated .cursor/rules/project.mdc (placeholders kept for bootstrap)')
    }
    return
  }
  writeFileSync(path, frontEnd[0] + identityMdc + '\n', 'utf8')
  console.log('synced .cursor/rules/project.mdc')
}

const updateProjectMd = () => {
  const path = join(root, 'docs', 'standards', 'project.md')
  if (!existsSync(path)) return
  let text = readFileSync(path, 'utf8')
  if (hasPlaceholders(text)) {
    if (!text.includes('PRODUCT.md')) {
      text = text.replace(
        /(Audience:.*?\n\n)/,
        `$1Product and service context: see \`PRODUCT.md\` at the repo root.\nGDS design constraints for this service: see \`DESIGN.md\` at the repo root.\n\n`
      )
      writeFileSync(path, text, 'utf8')
      console.log('annotated docs/standards/project.md (placeholders kept for bootstrap)')
    }
    return
  }
  const restMatch = text.match(/\n## What this means for design decisions[\s\S]*/)
  const rest = restMatch ? restMatch[0] : '\n\n## What this means for design decisions\n\n(See project standards.)'
  writeFileSync(path, `# Project context\n\n${projectMdIntro}${rest}`, 'utf8')
  console.log('synced docs/standards/project.md')
}

const updateClaude = () => {
  const path = join(root, 'CLAUDE.md')
  if (!existsSync(path)) return
  let text = readFileSync(path, 'utf8')
  if (hasPlaceholders(text)) {
    text = ensureContextRefs(
      text,
      'Non-negotiables: reuse before adding; accessibility is the default (WCAG {{WCAG_TARGET}}); state design intent in reasoning; record non-obvious decisions in `docs/decisions/` via the `gov-decision-log` skill, proactively as they\'re made.'
    )
    if (!text.includes('gov-prototype-setup')) {
      text = text.replace(
        '## Skills and sub-agents\n\n- Scaffolding',
        '## Skills and sub-agents\n\n- **Set up or reconfigure this pack** → use the `gov-prototype-setup` skill.\n- Scaffolding'
      )
    }
    writeFileSync(path, text, 'utf8')
    console.log('annotated CLAUDE.md (placeholders kept for bootstrap)')
    return
  }
  const tailMatch = text.match(/(@docs\/standards\/[\s\S]*)$/)
  if (!tailMatch) return
  let tail = tailMatch[1]
  if (!tail.includes('gov-prototype-setup')) {
    tail = tail.replace(
      '## Skills and sub-agents\n\n- Scaffolding',
      '## Skills and sub-agents\n\n- **Set up or reconfigure this pack** → use the `gov-prototype-setup` skill.\n- Scaffolding'
    )
  }
  const block = `# ${d.name} GOV.UK prototype

GOV.UK-style frontend for a ${s.name} at ${d.fullName}. Audience: ${s.audience}.

Non-negotiables: reuse before adding; accessibility is the default (WCAG ${st.wcagTarget}); state design intent in reasoning; record non-obvious decisions in \`docs/decisions/\` via the \`gov-decision-log\` skill, proactively as they're made.

Service context: @PRODUCT.md
Design constraints: @DESIGN.md

These imports load at launch. Full standards:

`
  writeFileSync(path, block + tail.trim() + '\n', 'utf8')
  console.log('synced CLAUDE.md')
}

const updateAgents = () => {
  const path = join(root, 'AGENTS.md')
  if (!existsSync(path)) return
  let text = readFileSync(path, 'utf8')
  const identityRendered = `GOV.UK-style frontend for a ${s.name} at ${d.fullName} (${d.name}). Audience: ${s.audience} — ${s.audienceNote}.`

  if (hasPlaceholders(text)) {
    if (!text.includes('PRODUCT.md')) {
      text = text.replace(
        /^(# Agent instructions\n\nGOV\.UK-style frontend[^\n]+\n\n)/m,
        `$1Service context: @PRODUCT.md\nDesign constraints: @DESIGN.md\n\n`
      )
    }
    if (!text.includes('gov-prototype-setup')) {
      text = text.replace(
        'Skills: `.claude/skills/`',
        'Skills: `.claude/skills/` (start with `gov-prototype-setup` to configure the pack)'
      )
    }
    writeFileSync(path, text, 'utf8')
    console.log('annotated AGENTS.md (placeholders kept for bootstrap)')
    return
  }

  text = text.replace(
    /^# Agent instructions\n\nGOV\.UK-style frontend[^\n]+\n\n/,
    `# Agent instructions\n\n${identityRendered}\n\nService context: @PRODUCT.md\nDesign constraints: @DESIGN.md\n\n`
  )
  if (!text.includes('gov-prototype-setup')) {
    text = text.replace(
      'Skills: `.claude/skills/`',
      'Skills: `.claude/skills/` (start with `gov-prototype-setup` to configure the pack)'
    )
  }
  writeFileSync(path, text, 'utf8')
  console.log('synced AGENTS.md')
}

updateProjectMdc()
updateProjectMd()
updateClaude()
updateAgents()
