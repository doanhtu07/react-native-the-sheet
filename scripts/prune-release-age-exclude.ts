import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'

const args = process.argv.slice(2)
const WRITE = args.includes('--write')
const minutesFlag = args.find((a) => a.startsWith('--min-age-minutes='))

const REGISTRY = 'https://registry.npmjs.org'
const MS_PER_MINUTE = 60_000

interface Entry {
  lineIndex: number
  name: string
  versions: string[]
  quote: string
}

type Verdict = 'keep' | 'drop' | 'unknown'

// MARK: Workspace

function findWorkspaceFile(): string {
  let dir = process.cwd()

  while (!existsSync(join(dir, 'pnpm-workspace.yaml'))) {
    const parent = dirname(dir)

    if (parent === dir) {
      console.error('Error: could not locate pnpm-workspace.yaml')
      process.exit(1)
    }

    dir = parent
  }

  return resolve(dir, 'pnpm-workspace.yaml')
}

function readMinAgeMinutes(): number {
  const value = minutesFlag?.split('=')[1]

  if (!value || !/^\d+$/.test(value)) {
    console.error('Error: --min-age-minutes=<n> is required (whole minutes).')
    console.error('Usage: pnpm prune-exclude --min-age-minutes=<n> [--write]')
    console.error('Example: pnpm prune-exclude --min-age-minutes=10080')
    process.exit(1)
  }

  return Number(value)
}

// MARK: Parsing

function parseEntries(lines: string[]): Entry[] {
  const start = lines.findIndex((l) =>
    l.startsWith('minimumReleaseAgeExclude:'),
  )
  if (start === -1) return []

  const entries: Entry[] = []

  for (let i = start + 1; i < lines.length; i++) {
    const line = lines[i]
    if (line.trim() === '') continue

    const match = line.match(/^\s+-\s+(['"]?)(.+?)\1\s*$/)
    if (!match) break

    const [, quote, spec] = match

    const at = spec.lastIndexOf('@')
    if (at <= 0) continue

    const versions = spec
      .slice(at + 1)
      .split('||')
      .map((v) => v.trim())

    entries.push({ lineIndex: i, name: spec.slice(0, at), versions, quote })
  }

  return entries
}

// MARK: Registry

const timeCache = new Map<string, Promise<Record<string, string> | null>>()

function fetchPublishTimes(name: string) {
  if (!timeCache.has(name)) {
    timeCache.set(
      name,
      fetch(`${REGISTRY}/${name.replace('/', '%2F')}`)
        .then(async (res) =>
          res.ok
            ? ((await res.json()) as { time: Record<string, string> }).time
            : null,
        )
        .catch(() => null),
    )
  }

  return timeCache.get(name)!
}

async function judge(
  name: string,
  version: string,
  minAgeMs: number,
): Promise<{ verdict: Verdict; reason: string }> {
  const times = await fetchPublishTimes(name)
  const published = times?.[version]
  if (!published) {
    return { verdict: 'unknown', reason: 'not found on registry' }
  }

  const ageMs = Date.now() - new Date(published).getTime()
  const days = (ageMs / (MS_PER_MINUTE * 60 * 24)).toFixed(1)
  return ageMs >= minAgeMs
    ? { verdict: 'drop', reason: `published ${days}d ago, past the window` }
    : { verdict: 'keep', reason: `published ${days}d ago, still in the window` }
}

// MARK: Rewriting

function renderLine(entry: Entry, versions: string[]) {
  const spec = `${entry.name}@${versions.join(' || ')}`
  return `  - ${entry.quote}${spec}${entry.quote}`
}

// MARK: Main

async function main() {
  const file = findWorkspaceFile()
  const original = readFileSync(file, 'utf-8')
  const lines = original.split('\n')
  const minAgeMinutes = readMinAgeMinutes()
  const minAgeMs = minAgeMinutes * MS_PER_MINUTE

  const entries = parseEntries(lines)
  if (!entries.length) {
    console.log('No minimumReleaseAgeExclude entries found.')
    return
  }

  console.log(
    `${file}\nminimumReleaseAge: ${minAgeMinutes} minutes (${(minAgeMinutes / 60).toFixed(1)}h)\n`,
  )

  const replacements = new Map<number, string | null>()

  for (const entry of entries) {
    const judged = await Promise.all(
      entry.versions.map((v) => judge(entry.name, v, minAgeMs)),
    )
    const kept = entry.versions.filter((_, i) => judged[i].verdict !== 'drop')

    entry.versions.forEach((v, i) => {
      const { verdict, reason } = judged[i]
      const mark = { drop: 'drop', keep: 'keep', unknown: 'keep?' }[verdict]
      console.log(`${mark.padEnd(5)} ${entry.name}@${v} (${reason})`)
    })

    if (kept.length === 0) replacements.set(entry.lineIndex, null)
    else if (kept.length !== entry.versions.length) {
      replacements.set(entry.lineIndex, renderLine(entry, kept))
    }
  }

  if (!replacements.size) {
    console.log('\nNothing to clean up.')
    return
  }

  const next = lines
    .map((line, i) => (replacements.has(i) ? replacements.get(i)! : line))
    .filter((line, i) => !(replacements.get(i) === null))
    .join('\n')

  if (!WRITE) {
    console.log(
      `\nDry run: ${replacements.size} line(s) would change. Re-run with --write to apply.`,
    )
    return
  }

  writeFileSync(file, next)
  console.log(`\nUpdated ${replacements.size} line(s) in ${file}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
