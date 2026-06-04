#!/usr/bin/env node
// Load PRODUCT.md and DESIGN.md for agent sessions.
// Usage: node scripts/load-context.mjs

import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const root = process.cwd()

const read = (name) => {
  const path = join(root, name)
  if (!existsSync(path)) return { path, exists: false, content: '', length: 0 }
  const content = readFileSync(path, 'utf8')
  return { path, exists: true, content, length: content.length }
}

let config = null
const configPath = join(root, 'config', 'project.json')
if (existsSync(configPath)) {
  try {
    config = JSON.parse(readFileSync(configPath, 'utf8'))
  } catch {
    config = null
  }
}

const product = read('PRODUCT.md')
const design = read('DESIGN.md')

const templateOnly = (text) => !text || /\[TODO\]/i.test(text) || text.length < 300

console.log(JSON.stringify({
  contextDir: root,
  config,
  product: {
    ...product,
    configured: product.exists && !templateOnly(product.content)
  },
  design: {
    ...design,
    configured: design.exists && !templateOnly(design.content)
  },
  needsSetup: templateOnly(product.content) || /\{\{[A-Z_]+\}\}/.test(
    existsSync(join(root, '.cursor', 'rules', 'project.mdc'))
      ? readFileSync(join(root, '.cursor', 'rules', 'project.mdc'), 'utf8')
      : ''
  )
}, null, 2))
