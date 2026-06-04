#!/usr/bin/env node
// Create a collision-safe Architecture/Design Decision Record.
// Usage: node new-adr.mjs "<title>" [--prototype <version>] [--supersedes <id>]
//
// The decentralised trail relies on three things:
//   1. One immutable file per decision (git merges separate files cleanly).
//   2. A filename that won't collide across machines: date + slug + random shortid.
//   3. Supersession by reference, never by editing a past record.

import { execSync } from 'node:child_process'
import { mkdirSync, writeFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const DECISIONS_DIR = join(process.cwd(), 'docs', 'decisions')

const args = process.argv.slice(2)
const title = args.find((a) => !a.startsWith('--'))
if (!title) {
  console.error('Usage: new-adr.mjs "<title>" [--prototype <version>] [--supersedes <id>]')
  process.exit(1)
}

const getFlag = (name) => {
  const i = args.indexOf(`--${name}`)
  return i !== -1 ? args[i + 1] : undefined
}
const prototype = getFlag('prototype') ?? ''
const supersedes = getFlag('supersedes') ?? ''

const gitValue = (cmd, fallback) => {
  try {
    return execSync(cmd, { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim()
  } catch {
    return fallback
  }
}

const author = gitValue('git config user.name', 'unknown')
const now = new Date()
const date = now.toISOString().slice(0, 10)
const timestamp = now.toISOString()

const slug = title
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '')
  .slice(0, 50)

// 4-char base36 shortid: guards against two people committing on the same day.
const shortid = Math.random().toString(36).slice(2, 6)
const id = `${date}-${slug}-${shortid}`
const filename = `${id}.md`

mkdirSync(DECISIONS_DIR, { recursive: true })
const path = join(DECISIONS_DIR, filename)
if (existsSync(path)) {
  console.error(`Refusing to overwrite existing ${filename}`)
  process.exit(1)
}

const body = `---
id: ${id}
title: ${title}
date: ${timestamp}
author: ${author}
status: proposed
prototype: ${prototype}
supersedes: ${supersedes}
---

# ${title}

## Status

Proposed. (Set to "accepted" once agreed; mark "superseded by <id>" if replaced — do not delete.)

## Context

What prompted this decision? What is the problem, constraint or question? Pull in the relevant requirement or research finding if there is one.

## Decision

What did we decide, and what did we explicitly *not* choose? Name the options considered so the next person sees the road not taken.

## Consequences

What follows from this — the trade-offs accepted, the new constraints, the things to revisit later.
`

writeFileSync(path, body)
console.log(`Created docs/decisions/${filename}`)
