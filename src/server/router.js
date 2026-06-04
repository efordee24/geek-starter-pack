import { readdirSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const versionsDir = join(__dirname, 'versions')

const discoverVersionPlugins = async () => {
  if (!existsSync(versionsDir)) return []
  const dirs = readdirSync(versionsDir, { withFileTypes: true })
    .filter((d) => d.isDirectory() && /^v\d+$/i.test(d.name))
    .map((d) => d.name)
    .sort((a, b) => Number(a.slice(1)) - Number(b.slice(1)))

  const plugins = []
  for (const version of dirs) {
    const indexPath = join(versionsDir, version, 'index.js')
    if (!existsSync(indexPath)) continue
    const mod = await import(pathToFileURL(indexPath).href)
    plugins.push({ plugin: mod.default, routes: { prefix: `/${version}` } })
  }
  return plugins
}

export const registerRoutes = async (server) => {
  const dashboard = await import('./dashboard/index.js')
  const trail = await import('./trail/index.js')
  await server.register([dashboard.default, trail.default])
  const versionPlugins = await discoverVersionPlugins()
  if (versionPlugins.length) {
    await server.register(versionPlugins)
  }
}
