#!/usr/bin/env node
// Cut a new versioned prototype (single-server model).
// Usage: node scaffold.mjs [<version-label>] ["<short description>"]
// Creates prototypes/<vN>/VERSION.md and src/server/versions/<vN>/ routes.

import { execSync } from 'node:child_process'
import { mkdirSync, writeFileSync, existsSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const root = process.cwd()
const PROTOTYPES_DIR = join(root, 'prototypes')
const VERSIONS_DIR = join(root, 'src', 'server', 'versions')

const args = process.argv.slice(2)
let version = args[0]
const description = args[1] ?? ''

const nextVersion = () => {
  if (!existsSync(PROTOTYPES_DIR)) return 'v1'
  const ns = readdirSync(PROTOTYPES_DIR)
    .map((d) => /^v(\d+)$/i.exec(d))
    .filter(Boolean)
    .map((m) => Number(m[1]))
  return `v${(ns.length ? Math.max(...ns) : 0) + 1}`
}
if (!version) version = nextVersion()

const metaDir = join(PROTOTYPES_DIR, version)
const codeDir = join(VERSIONS_DIR, version)

if (existsSync(metaDir) || existsSync(codeDir)) {
  console.error(`Prototype ${version} already exists — refusing to overwrite.`)
  process.exit(1)
}

const gitValue = (cmd, fallback) => {
  try {
    return execSync(cmd, { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim()
  } catch {
    return fallback
  }
}
const author = gitValue('git config user.name', 'unknown')
const date = new Date().toISOString()

mkdirSync(metaDir, { recursive: true })

writeFileSync(
  join(metaDir, 'VERSION.md'),
  `---
version: ${version}
description: ${description}
author: ${author}
created: ${date}
status: active
routesPrefix: /${version}
---

# Prototype ${version}

${description || 'No description provided.'}

Routes: \`/${version}/\` on the shared app (see dashboard at \`/\`).

Decisions: \`node .claude/skills/gov-prototype-scaffold/scripts/new-adr.mjs "<title>" --prototype ${version}\`

Reviews: \`node .claude/skills/gov-prototype-scaffold/scripts/new-review.mjs "<title>" --type design --prototype ${version}\`
`
)

const startDir = join(codeDir, 'start')
mkdirSync(startDir, { recursive: true })

writeFileSync(
  join(codeDir, 'index.js'),
  `import { getStart } from './start/controller.js'

export default {
  name: 'prototype-${version}',
  register: async (server) => {
    server.route({
      method: 'GET',
      path: '/',
      handler: getStart
    })
  }
}
`
)

writeFileSync(
  join(startDir, 'controller.js'),
  `import { baseViewContext } from '../../../common/helpers/view-context.mjs'

export const getStart = (request, h) => {
  return h.view('versions/${version}/start/start.njk', baseViewContext({
    pageTitle: 'Prototype ${version}',
    version: '${version}'
  }))
}
`
)

writeFileSync(
  join(startDir, 'start.njk'),
  `{% extends "common/templates/layouts/govuk-layout.njk" %}

{% block content %}
  <h1 class="govuk-heading-xl">Prototype {{ version }}</h1>
  <p class="govuk-body-l">Start building flows in <code>src/server/versions/{{ version }}/</code>.</p>
  <p class="govuk-body">
    <a class="govuk-link" href="/">Dashboard</a>
    ·
    <a class="govuk-link" href="/trail">Design trail</a>
  </p>
{% endblock %}
`
)

console.log(`Created prototypes/${version}/VERSION.md`)
console.log(`Created src/server/versions/${version}/ (routes at /${version}/)`)
console.log(`Restart npm start if the server is already running.`)
