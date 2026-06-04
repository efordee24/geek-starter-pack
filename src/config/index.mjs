import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const root = process.cwd()
const configPath = join(root, 'config', 'project.json')

export const loadProjectConfig = () => {
  if (!existsSync(configPath)) {
    return {
      department: { name: 'Department', fullName: 'Department' },
      service: { name: 'Prototype', audience: 'internal', audienceNote: '' },
      standards: { govukFrontendVersion: '5.x', wcagTarget: '2.2 AA' }
    }
  }
  return JSON.parse(readFileSync(configPath, 'utf8'))
}
