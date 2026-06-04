import { readFileSync, existsSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { parseFrontmatter } from './frontmatter.mjs'

const root = process.cwd()
const prototypesDir = join(root, 'prototypes')

export const listPrototypeVersions = () => {
  if (!existsSync(prototypesDir)) return []
  const versions = readdirSync(prototypesDir, { withFileTypes: true })
    .filter((d) => d.isDirectory() && /^v\d+$/i.test(d.name))
    .map((d) => {
      const versionPath = join(prototypesDir, d.name, 'VERSION.md')
      if (!existsSync(versionPath)) {
        return {
          version: d.name,
          description: '',
          created: '',
          author: '',
          status: 'active',
          routesPrefix: `/${d.name}`
        }
      }
      const { meta } = parseFrontmatter(readFileSync(versionPath, 'utf8'))
      return {
        version: meta.version ?? d.name,
        description: meta.description ?? '',
        created: meta.created ?? '',
        author: meta.author ?? '',
        status: meta.status ?? 'active',
        routesPrefix: meta.routesPrefix ?? `/${d.name}`
      }
    })
  return versions.sort((a, b) => {
    const na = Number(/^v(\d+)$/i.exec(a.version)?.[1] ?? 0)
    const nb = Number(/^v(\d+)$/i.exec(b.version)?.[1] ?? 0)
    return na - nb
  })
}

export const listTrailFiles = (subdir) => {
  const dir = join(root, 'docs', subdir)
  if (!existsSync(dir)) return []
  return readdirSync(dir)
    .filter((f) => f.endsWith('.md') && f !== 'README.md')
    .map((filename) => {
      const content = readFileSync(join(dir, filename), 'utf8')
      const { meta } = parseFrontmatter(content)
      return {
        filename,
        repoPath: `docs/${subdir}/${filename}`,
        id: meta.id ?? filename.replace(/\.md$/, ''),
        title: meta.title ?? filename,
        date: meta.date ?? '',
        author: meta.author ?? '',
        status: meta.status ?? '',
        prototype: meta.prototype ?? '',
        type: meta.type ?? ''
      }
    })
    .sort((a, b) => (b.date || b.id).localeCompare(a.date || a.id))
}
