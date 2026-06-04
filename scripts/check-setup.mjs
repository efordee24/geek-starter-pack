#!/usr/bin/env node
// Verify prototype pack setup is complete.
// Exit 0 if OK, 1 if setup still needed. JSON on stdout when --json.

import { readFileSync, existsSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const root = process.cwd()
const jsonOut = process.argv.includes('--json')

const issues = []

const bootstrapTargets = () => {
  const list = ['CLAUDE.md', 'AGENTS.md']
  const standards = join(root, 'docs', 'standards')
  const rules = join(root, '.cursor', 'rules')
  if (existsSync(standards)) {
    for (const f of readdirSync(standards)) list.push(join('docs', 'standards', f))
  }
  if (existsSync(rules)) {
    for (const f of readdirSync(rules)) list.push(join('.cursor', 'rules', f))
  }
  return list
}

let placeholderFiles = 0
for (const rel of bootstrapTargets()) {
  const path = join(root, rel)
  if (!existsSync(path)) continue
  if (/\{\{[A-Z_]+\}\}/.test(readFileSync(path, 'utf8'))) placeholderFiles++
}
if (placeholderFiles) {
  issues.push(`${placeholderFiles} file(s) still contain {{PLACEHOLDERS}} — run setup or bootstrap`)
}

const productPath = join(root, 'PRODUCT.md')
if (!existsSync(productPath)) {
  issues.push('PRODUCT.md is missing')
} else {
  const product = readFileSync(productPath, 'utf8')
  if (/\[TODO\]/i.test(product) || product.length < 400) {
    issues.push('PRODUCT.md looks like an unconfigured template ([TODO] or too short)')
  }
}

const designPath = join(root, 'DESIGN.md')
if (!existsSync(designPath)) {
  issues.push('DESIGN.md is missing (recommended)')
} else {
  const design = readFileSync(designPath, 'utf8')
  if (/\[TODO\]/i.test(design) || design.length < 250) {
    issues.push('DESIGN.md looks like an unconfigured template ([TODO] or too short)')
  }
}

const ok = issues.length === 0
const result = { ok, issues }

if (jsonOut) {
  console.log(JSON.stringify(result, null, 2))
} else {
  if (ok) console.log('Setup check passed.')
  else {
    console.log('Setup check failed:')
    for (const i of issues) console.log(`  - ${i}`)
  }
}

process.exit(ok ? 0 : 1)
