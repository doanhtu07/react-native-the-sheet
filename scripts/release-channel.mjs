// Shared release-channel resolution.
//
// Single source of truth for "which channel does this version ship on", used by
// `release:tag`. Mirrors the "Resolve release channel"
// step in .github/workflows/release.yaml — keep the two in sync.
//
//   X.Y.Z-alpha.N → QA   (npm dist-tag `alpha`, GitHub pre-release)
//   X.Y.Z-beta.N  → UAT  (npm dist-tag `beta`,  GitHub pre-release)
//   X.Y.Z         → prod (npm dist-tag `latest`, full GitHub release)

import { readFileSync } from 'node:fs'

// The packages share one version (changeset `fixed` group), so any one of them
// is authoritative.
const VERSION_SOURCE = '../packages/the-sheet/package.json'

// Every package that ships, in dependency order (`the-sheet` first —
// `flash-list` and `flash-list-v2` depend on it via workspace:*). Release
// assets keep the name `pnpm pack` gives them —
// `the-sheet-<pkg>-<version>.tgz` — so a downloaded tarball is
// self-identifying and needs no renaming.
export const PACKAGES = [
  'packages/the-sheet',
  'packages/embedded-stack-navigator',
  'packages/universe-portal',
  'packages/flash-list',
  'packages/flash-list-v2',
]

const CHANNEL = /^\d+\.\d+\.\d+(?:-(alpha|beta)\.\d+)?$/

export const readVersion = () =>
  JSON.parse(readFileSync(new URL(VERSION_SOURCE, import.meta.url), 'utf8'))
    .version

/**
 * Validate a version and derive its release channel.
 * Exits the process with a helpful message on an unsupported shape.
 */
export function resolveChannel(version) {
  const match = CHANNEL.exec(version)
  if (!match) {
    console.error(
      `Version ${version} is not a releasable version.\n` +
        'Expected X.Y.Z, X.Y.Z-alpha.N (QA), or X.Y.Z-beta.N (UAT).\n' +
        'Use `changeset pre enter alpha|beta` + `pnpm release:version` to derive it.',
    )
    process.exit(1)
  }
  const channel = match[1] ?? 'latest'
  return {
    version,
    tag: `v${version}`,
    channel,
    prerelease: channel !== 'latest',
    environment: { alpha: 'QA', beta: 'UAT', latest: 'production' }[channel],
  }
}
