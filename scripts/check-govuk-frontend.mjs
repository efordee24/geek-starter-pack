#!/usr/bin/env node
// Compare installed govuk-frontend to npm latest and summarise CHANGELOG releases in between.
// Exit 0 when up to date, 1 when a newer version is available, 2 on fetch/read errors.

import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { execSync } from 'node:child_process'

const root = process.cwd()
const jsonOut = process.argv.includes('--json')
const CHANGELOG_URL =
  'https://raw.githubusercontent.com/alphagov/govuk-frontend/main/CHANGELOG.md'

const parseVersion = (value) => {
  const match = String(value)
    .replace(/^[\^~>=<v]+/, '')
    .match(/^(\d+)\.(\d+)\.(\d+)/)
  if (!match) return null
  return [Number(match[1]), Number(match[2]), Number(match[3])]
}

const compareVersions = (a, b) => {
  for (let i = 0; i < 3; i++) {
    if (a[i] !== b[i]) return a[i] - b[i]
  }
  return 0
}

const formatVersion = (parts) => parts.join('.')

const readInstalledVersion = () => {
  const pkgPath = join(root, 'node_modules', 'govuk-frontend', 'package.json')
  if (existsSync(pkgPath)) {
    return JSON.parse(readFileSync(pkgPath, 'utf8')).version
  }
  const rootPkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'))
  const range = rootPkg.dependencies?.['govuk-frontend'] ||
    rootPkg.devDependencies?.['govuk-frontend']
  if (!range) return null
  return range.replace(/^[\^~>=<]+/, '')
}

const readLatestFromNpm = () => {
  return execSync('npm view govuk-frontend version', {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe']
  }).trim()
}

const parseChangelogReleases = (markdown) => {
  const releases = []
  const heading = /^## \[(\d+\.\d+\.\d+)\]/gm
  let match
  const indices = []
  while ((match = heading.exec(markdown)) !== null) {
    indices.push({ version: match[1], index: match.index })
  }
  for (let i = 0; i < indices.length; i++) {
    const start = indices[i].index
    const end = indices[i + 1]?.index ?? markdown.length
    const body = markdown.slice(start, end).trim()
    const firstLineEnd = body.indexOf('\n')
    const summary = body
      .slice(firstLineEnd + 1)
      .split('\n')
      .find((line) => line.trim() && !line.startsWith('#'))
    releases.push({
      version: indices[i].version,
      parts: parseVersion(indices[i].version),
      summary: summary?.trim() ?? ''
    })
  }
  return releases
}

const main = async () => {
  const installedRaw = readInstalledVersion()
  const installed = parseVersion(installedRaw)
  if (!installed) {
    const msg = 'Could not determine installed govuk-frontend version (run npm install).'
    if (jsonOut) console.log(JSON.stringify({ ok: false, error: msg }))
    else console.error(msg)
    process.exit(2)
  }

  let latestRaw
  try {
    latestRaw = readLatestFromNpm()
  } catch {
    const msg = 'Could not read latest govuk-frontend version from npm.'
    if (jsonOut) console.log(JSON.stringify({ ok: false, error: msg }))
    else console.error(msg)
    process.exit(2)
  }

  const latest = parseVersion(latestRaw)
  const behind = compareVersions(installed, latest) < 0

  let changelogReleases = []
  let changelogError = null
  try {
    const res = await fetch(CHANGELOG_URL)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const markdown = await res.text()
    changelogReleases = parseChangelogReleases(markdown).filter((release) => {
      if (!release.parts) return false
      return (
        compareVersions(release.parts, installed) > 0 &&
        compareVersions(release.parts, latest) <= 0
      )
    })
  } catch (err) {
    changelogError = err.message
  }

  const result = {
    ok: !behind,
    installed: formatVersion(installed),
    latest: formatVersion(latest),
    behind,
    changelogUrl: 'https://github.com/alphagov/govuk-frontend/blob/main/CHANGELOG.md',
    designSystemHeaderUrl:
      'https://design-system.service.gov.uk/components/header/',
    releasesSinceInstalled: changelogReleases.map((r) => ({
      version: r.version,
      summary: r.summary
    })),
    changelogError
  }

  if (jsonOut) {
    console.log(JSON.stringify(result, null, 2))
  } else {
    console.log(`govuk-frontend installed: ${result.installed}`)
    console.log(`govuk-frontend latest (npm): ${result.latest}`)
    if (behind) {
      console.log('\nA newer version is available.')
      console.log(`  npm install govuk-frontend@${result.latest}`)
      console.log(`  Then read migration notes: ${result.changelogUrl}`)
    } else {
      console.log('\nInstalled version matches npm latest.')
    }
    if (changelogReleases.length) {
      console.log('\nReleases between installed and latest (from CHANGELOG):')
      for (const release of changelogReleases) {
        const hint = release.summary ? ` — ${release.summary}` : ''
        console.log(`  ${release.version}${hint}`)
      }
    }
    if (changelogError) {
      console.log(`\nCould not fetch CHANGELOG: ${changelogError}`)
    }
    console.log(`\nHeader component: ${result.designSystemHeaderUrl}`)
  }

  process.exit(behind ? 1 : 0)
}

main()
