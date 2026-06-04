import { describe, it, expect } from 'vitest'
import { parseFrontmatter } from '../src/server/common/helpers/frontmatter.mjs'
import { listPrototypeVersions } from '../src/server/common/helpers/prototype-registry.mjs'

describe('parseFrontmatter', () => {
  it('parses yaml block', () => {
    const { meta } = parseFrontmatter(`---
title: Test
prototype: v1
---
body`)
    expect(meta.title).toBe('Test')
    expect(meta.prototype).toBe('v1')
  })
})

describe('listPrototypeVersions', () => {
  it('returns an array (empty until first scaffold)', () => {
    const versions = listPrototypeVersions()
    expect(Array.isArray(versions)).toBe(true)
  })
})
