import Hapi from '@hapi/hapi'
import Inert from '@hapi/inert'
import Vision from '@hapi/vision'
import Nunjucks from 'nunjucks'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { registerRoutes } from './router.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '../..')
const serverPath = join(__dirname)
const govukAssets = join(root, 'node_modules/govuk-frontend/dist/govuk')
const govukMacros = join(root, 'node_modules/govuk-frontend/dist')

export const createServer = async () => {
  const server = Hapi.server({
    port: Number(process.env.PORT) || 3000,
    host: process.env.HOST || 'localhost',
    routes: { files: { relativeTo: root } }
  })

  const nunjucksEnv = Nunjucks.configure([serverPath, govukMacros], {
    autoescape: true,
    noCache: process.env.NODE_ENV !== 'production',
    watch: false
  })

  await server.register([Inert, Vision])

  server.views({
    engines: {
      njk: {
        compile (template, options) {
          const filename = options.filename
          return (context) => {
            const rel = filename.startsWith(serverPath)
              ? filename.slice(serverPath.length + 1)
              : filename
            return nunjucksEnv.render(rel, context)
          }
        }
      }
    },
    relativeTo: serverPath,
    path: '.',
    isCached: process.env.NODE_ENV === 'production'
  })

  server.route({
    method: 'GET',
    path: '/govuk/{param*}',
    handler: {
      directory: {
        path: govukAssets,
        redirectToSlash: true
      }
    }
  })

  server.route({
    method: 'GET',
    path: '/public/{param*}',
    handler: {
      directory: {
        path: join(root, 'src/client'),
        redirectToSlash: true
      }
    }
  })

  await registerRoutes(server)
  return server
}
