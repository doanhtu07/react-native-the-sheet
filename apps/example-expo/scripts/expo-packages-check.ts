import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { intersects } from 'semver'

const SDK_VERSION = process.argv[2]

if (!SDK_VERSION) {
  console.error('Error: SDK version is required.')
  console.error('Usage: pnpx tsx scripts/expo-packages-check.ts <version>')
  console.error('Example: pnpx tsx scripts/expo-packages-check.ts 55')
  process.exit(1)
}

interface NativeModule {
  npmPackage: string
  versionRange: string
}

type StatusKind = 'ok' | 'loose' | 'outdated' | 'missing'

interface PackageStatus {
  package: string
  expected: string
  actual: string
  status: StatusKind
}

interface SdkInfo {
  sdkKey: string
  reactNativeVersion: string
  expoPackages: Record<string, string>
}

// MARK: Fetching

async function fetchVersions() {
  const res = await fetch('https://api.expo.dev/v2/versions/latest')
  const { data } = (await res.json()) as { data: Record<string, unknown> }
  return data
}

async function fetchNativeModules() {
  const res = await fetch(
    `https://api.expo.dev/v2/sdks/${SDK_VERSION}.0.0/native-modules`,
  )
  const { data } = (await res.json()) as { data: Record<string, unknown> }
  return data
}

// MARK: Parsing

function resolveSdkEntry(versions: Record<string, unknown>) {
  const sdkVersions = versions.sdkVersions as Record<string, unknown>
  const sdkKey = Object.keys(sdkVersions).find((k) =>
    k.startsWith(`${SDK_VERSION}.`),
  )

  if (!sdkKey) {
    console.error(`SDK version ${SDK_VERSION} not found in versions API`)
    process.exit(1)
  }

  return { sdkKey, sdkEntry: sdkVersions[sdkKey] as Record<string, unknown> }
}

function normalizePackages(
  raw: Record<string, unknown>,
): Record<string, string> {
  const result: Record<string, string> = {}

  // Packages from relatedPackages
  for (const [key, value] of Object.entries(raw)) {
    if (typeof value === 'string') {
      result[key] = value
    }
  }

  // Packages from nativeModules
  for (const value of Object.values(raw)) {
    if (typeof value === 'object' && value !== null && 'npmPackage' in value) {
      const mod = value as NativeModule
      result[mod.npmPackage] = mod.versionRange
    }
  }

  return result
}

function buildSdkInfo(
  versions: Record<string, unknown>,
  nativeModules: Record<string, unknown>,
): SdkInfo {
  const { sdkKey, sdkEntry } = resolveSdkEntry(versions)

  return {
    sdkKey,
    reactNativeVersion: sdkEntry.facebookReactNativeVersion as string,
    expoPackages: normalizePackages({
      ...(sdkEntry.relatedPackages as Record<string, unknown>),
      ...nativeModules,
    }),
  }
}

// MARK: Comparison

function getInstalledVersions(): Record<string, string> {
  const pkg = JSON.parse(
    readFileSync(resolve(process.cwd(), 'package.json'), 'utf-8'),
  )
  return { ...pkg.dependencies, ...pkg.devDependencies }
}

function getStatus(actual: string, expected: string): StatusKind {
  if (actual === expected) return 'ok'
  if (intersects(actual, expected)) return 'loose'
  return 'outdated'
}

function comparePackages(
  expoPackages: Record<string, string>,
  installed: Record<string, string>,
): PackageStatus[] {
  const tracked = Object.entries(expoPackages)
    .filter(([pkg]) => pkg in installed)
    .map(([pkg, expected]) => ({
      package: pkg,
      expected,
      actual: installed[pkg],
      status: getStatus(installed[pkg], expected),
    }))

  const untracked = Object.keys(installed)
    .filter((pkg) => pkg !== 'expo' && !(pkg in expoPackages))
    .map((pkg) => ({
      package: pkg,
      expected: '(not tracked)',
      actual: installed[pkg],
      status: 'missing' as PackageStatus['status'],
    }))

  return [...tracked, ...untracked].sort((a, b) => {
    const order = { outdated: 0, missing: 1, loose: 2, ok: 3 }
    return order[a.status] - order[b.status]
  })
}

// MARK: Reporting

function printReport(
  results: PackageStatus[],
  sdkKey: string,
  reactNativeVersion: string,
) {
  const outdated = results.filter((r) => r.status === 'outdated')
  const missing = results.filter((r) => r.status === 'missing')
  const loose = results.filter((r) => r.status === 'loose')
  const ok = results.filter((r) => r.status === 'ok')

  console.log(`\nExpo SDK ${sdkKey} — React Native ${reactNativeVersion}\n`)

  if (missing.length) {
    console.log('\n⚠️  Not tracked by Expo API:')
    for (const r of missing) {
      console.log(`  ${r.package} @ ${r.actual}`)
    }
  }

  if (outdated.length) {
    console.log('❌ Outdated:')
    for (const r of outdated) {
      console.log(`  ${r.package}`)
      console.log(`    installed: ${r.actual}`)
      console.log(`    expected:  ${r.expected}`)
    }
  }

  if (loose.length) {
    console.log('\n🟡 Compatible but not exact:')
    for (const r of loose) {
      console.log(`  ${r.package} @ ${r.actual} | expected: ${r.expected}`)
    }
  }

  console.log(
    `\n✅ Up to date: ${ok.length} package${ok.length === 1 ? '' : 's'}`,
  )
  if (ok.length) {
    console.log(ok.map((r) => `  ${r.package} @ ${r.actual}`).join('\n'))
  }
}

// MARK: Main

async function main() {
  const [versions, nativeModules] = await Promise.all([
    fetchVersions(),
    fetchNativeModules(),
  ])

  const { sdkKey, reactNativeVersion, expoPackages } = buildSdkInfo(
    versions,
    nativeModules,
  )

  const installed = getInstalledVersions()
  const results = comparePackages(expoPackages, installed)
  printReport(results, sdkKey, reactNativeVersion)
}

main().catch(console.error)
