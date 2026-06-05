#!/usr/bin/env node
// Create a collision-safe review report in docs/reviews/.
// Usage: new-review.mjs "<title>" --type accessibility|design [--prototype <version>]
//
// Filename: YYYY-MM-DD-HHMM-<slug>-<shortid>.md (local time for HHMM)

import { execSync } from 'node:child_process'
import { mkdirSync, writeFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const REVIEWS_DIR = join(process.cwd(), 'docs', 'reviews')
const VALID_TYPES = ['accessibility', 'design']

const args = process.argv.slice(2)
const title = args.find((a) => !a.startsWith('--'))
if (!title) {
  console.error('Usage: new-review.mjs "<title>" --type accessibility|design [--prototype <version>]')
  process.exit(1)
}

const getFlag = (name) => {
  const i = args.indexOf(`--${name}`)
  return i !== -1 ? args[i + 1] : undefined
}

const type = getFlag('type')
if (!type || !VALID_TYPES.includes(type)) {
  console.error(`--type is required (${VALID_TYPES.join(' or ')})`)
  process.exit(1)
}

const prototype = getFlag('prototype') ?? ''

const gitValue = (cmd, fallback) => {
  try {
    return execSync(cmd, { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim()
  } catch {
    return fallback
  }
}

const author = gitValue('git config user.name', 'unknown')
const now = new Date()
const date = [
  now.getFullYear(),
  String(now.getMonth() + 1).padStart(2, '0'),
  String(now.getDate()).padStart(2, '0')
].join('-')
const hhmm = String(now.getHours()).padStart(2, '0') + String(now.getMinutes()).padStart(2, '0')
const timestamp = now.toISOString()

const slug = title
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '')
  .slice(0, 40)

const shortid = Math.random().toString(36).slice(2, 6)
const id = `${date}-${hhmm}-${slug}-${shortid}`
const filename = `${id}.md`

mkdirSync(REVIEWS_DIR, { recursive: true })
const path = join(REVIEWS_DIR, filename)
if (existsSync(path)) {
  console.error(`Refusing to overwrite existing ${filename}`)
  process.exit(1)
}

const findingsSection = type === 'accessibility'
  ? `| # | Severity | Persona(s) | Location | Issue | Fix |
| - | -------- | ---------- | -------- | ----- | --- |
| 1 | Blocker / Should fix / Consider | — | — | — | — |`
  : `| # | Severity | Lens | Finding | Fix |
| - | -------- | ---- | ------- | --- |
| 1 | Blocker / Should fix / Consider | Requirements / Research / GDS / Best practice | — | — |`

const body = `---
id: ${id}
title: ${title}
date: ${timestamp}
author: ${author}
type: ${type}
prototype: ${prototype}
status: draft
---

# ${title}

## Summary

2–3 sentences: overall verdict and whether anything blocks progress.

## Scope

- **Prototype:** ${prototype || 'not specified'}
- **Reviewed:** (flows, screens, frames, or routes)
- **Evidence:** (files, Figma nodes, requirements links)

## Findings

${findingsSection}
`

writeFileSync(path, body)
console.log(`Created docs/reviews/${filename}`)
