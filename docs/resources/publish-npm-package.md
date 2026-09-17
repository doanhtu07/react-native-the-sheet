# Publish NPM Package

We publish the `@the-sheet/*` libraries two ways from a single `v<version>` tag:

1. **npm registry** (`registry.npmjs.org`) — install by name + semver, e.g.
   `npm i @the-sheet/the-sheet@^1.0.0`. Preferred.
2. **Per-package tarballs** attached to the GitHub Release — install by URL, e.g.
   `npm i https://github.com/doanhtu07/react-native-the-sheet/releases/download/v<version>/the-sheet-the-sheet-<version>.tgz`.
   Kept as a fallback for consumers who want a pinned artifact without any
   registry interaction.

Nothing compiled (`lib/`) is ever committed to a branch — both artifacts are
built in CI from the tagged source.

## Lockstep versioning

All packages in the `fixed` group share one version (see `.changeset/config.json`):

- `@the-sheet/the-sheet`
- `@the-sheet/embedded-stack-navigator`
- `@the-sheet/universe-portal`
- `@the-sheet/flash-list`
- `@the-sheet/flash-list-v2`

A single `v<version>` tag therefore covers the whole set.

## Release channels

The tag name alone decides the channel — CI derives everything else from it:

| Channel | For  | Tag              | npm dist-tag | GitHub Release |
| ------- | ---- | ---------------- | ------------ | -------------- |
| `alpha` | QA   | `v1.2.0-alpha.0` | `alpha`      | Pre-release    |
| `beta`  | UAT  | `v1.2.0-beta.0`  | `beta`       | Pre-release    |
| stable  | Prod | `v1.2.0`         | `latest`     | Latest release |

Both artifacts are produced on every channel: packages go to npm under the
channel's dist-tag, and tarballs are attached to the Release. Only a stable tag
ever moves `latest`, so a consumer on `^1.0.0` never picks up a QA or UAT build.

The workflow checks out the tag ref, so it is **branch-agnostic** — branch off
wherever you like, cut prereleases there, and tag from that branch.

Pushing a tag is the normal trigger and CI does the rest.

## One-time setup: npm trusted publishing

CI publishes via [OIDC trusted publishing](https://docs.npmjs.com/trusted-publishers) —
no long-lived npm token is stored in the repo. Each package needs its own
trusted publisher (npm only trusts the exact package + workflow pair), so repeat
this once per package (`the-sheet`, `embedded-stack-navigator`,
`universe-portal`, `flash-list`, `flash-list-v2`):

1. Go to `npmjs.com/package/@the-sheet/<pkg>` > Settings > **Trusted Publishers**.
2. Add a GitHub Actions publisher:
   - Organization/user: `doanhtu07`
   - Repository: `react-native-the-sheet`
   - Workflow filename: `release.yaml`
   - Allow **`npm publish`** (direct publishing) for this workflow. Newer
     configurations default to staged publishing only, which this workflow does
     not use.
3. The workflow already requests `id-token: write`, so nothing else is needed —
   the next tag push publishes without any secret.

This is already configured for all five existing packages (every past release
went out through this workflow, which carries no token — only OIDC could have
authenticated it). Only repeat the steps above for a newly added package.

If trusted publishing is not an option, fall back to a token: create a granular
access token with publish rights on the `@the-sheet` scope, add it as an
`NPM_TOKEN` repo secret, and set `NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}` on
the workflow's publish step.

## Release flow (stable)

1. **Add a changeset** describing the change and the bump level:

   ```sh
   pnpm changeset
   ```

2. **Stamp the new version** across the fixed group (also updates changelogs):

   ```sh
   pnpm release:version   # = changeset version
   ```

3. **Commit** the version bump:

   ```sh
   git add -A && git commit -m "release: v<version>"
   ```

4. **Tag and push** — this is the trigger:

   ```sh
   pnpm release:tag
   ```

   `release:tag` reads the shared version, creates an annotated `v<version>`
   tag, and pushes it. It refuses to run on a dirty tree or if the tag already
   exists.

5. **CI takes over.** Pushing the `v*` tag runs `.github/workflows/release.yaml`,
   which installs, builds every package tier by tier, then:
   - **publishes** each package to npm, and
   - **packs** each into a stable-named tarball and creates the GitHub Release
     with a peer-dependency summary in the notes.

   Publishing uses OIDC — no personal token is needed to _release_ once the
   trusted publishers above are configured.

## Release flow (alpha → QA, beta → UAT)

Changesets' **pre mode** produces the `-alpha.N` / `-beta.N` versions. The state
lives in `.changeset/pre.json`, which must be committed — that file is what keeps
the channel active on the branch you're working from.

### Cutting an alpha (QA)

```sh
git switch -c release/1.2.0            # any branch works; CI follows the tag
pnpm changeset                          # add changeset(s) as usual
pnpm changeset pre enter alpha          # writes .changeset/pre.json
pnpm release:version                    # → 1.2.0-alpha.0
git add -A && git commit -m "release: v1.2.0-alpha.0"
pnpm release:tag                        # tags v1.2.0-alpha.0 and pushes
```

Every subsequent `pnpm release:version` on that branch bumps the counter
(`alpha.0` → `alpha.1` → …). Repeat commit + `release:tag` for each QA drop; no
need to add a new changeset unless the code actually changed.

### Promoting to beta (UAT)

```sh
pnpm changeset pre exit                 # leave the alpha channel
pnpm changeset pre enter beta           # enter the beta channel
pnpm release:version                    # → 1.2.0-beta.0
git add -A && git commit -m "release: v1.2.0-beta.0"
pnpm release:tag
```

### Promoting to stable (production)

```sh
pnpm changeset pre exit                 # deletes .changeset/pre.json
pnpm release:version                    # → 1.2.0
git add -A && git commit -m "release: v1.2.0"
pnpm release:tag                        # tags v1.2.0 → dist-tag `latest`
```

Then merge the release branch back so `main` carries the consumed changesets and
the updated changelogs.

**Gotchas**

- While `.changeset/pre.json` exists, _every_ `changeset version` on that branch
  produces a prerelease. Cutting a hotfix means doing it from a branch without
  that file.
- `pnpm release:tag` refuses a dirty tree and refuses to clobber an existing tag
  — commit the bump first, and re-run `release:version` if you need a new counter.
- `pnpm release:tag` also rejects any version that isn't `X.Y.Z`, `X.Y.Z-alpha.N`
  or `X.Y.Z-beta.N`, so a bad prerelease shape fails locally rather than after
  the tag is pushed.
- Don't hand-edit the version to skip a channel; let `changeset version` derive it.

## Consuming a released package

### Option 1 — npm registry (recommended)

```sh
# Production — a semver range only ever resolves to a stable version
npm i @the-sheet/the-sheet@^1.0.0

# QA — newest alpha
npm i @the-sheet/the-sheet@alpha

# UAT — newest beta
npm i @the-sheet/the-sheet@beta

# Pin an exact prerelease instead of tracking the channel
npm i @the-sheet/the-sheet@1.2.0-beta.0
```

`@alpha` / `@beta` resolve to whatever that channel points at _right now_ and
are written into `package.json` as an exact version, so a reinstall is
reproducible but won't pick up the next drop — re-run the install to move up.

### Option 2 — Release tarball (pinned artifact)

Install a single package straight from the Release asset (never the monorepo):

```sh
npm i https://github.com/doanhtu07/react-native-the-sheet/releases/download/v1.2.0/the-sheet-the-sheet-1.2.0.tgz
```

Prerelease tags work the same way — the version appears in both the tag and the
filename:

```sh
npm i https://github.com/doanhtu07/react-native-the-sheet/releases/download/v1.2.0-alpha.0/the-sheet-the-sheet-1.2.0-alpha.0.tgz
```

Assets keep the name `pnpm pack` generates, so a downloaded tarball identifies
its own package and version — no renaming needed:

```
the-sheet-the-sheet-<version>.tgz
the-sheet-embedded-stack-navigator-<version>.tgz
the-sheet-universe-portal-<version>.tgz
the-sheet-flash-list-<version>.tgz
the-sheet-flash-list-v2-<version>.tgz
```

Note there is no `v` prefix on the version in the **filename** (npm's
convention), only in the **tag**.

#### Installing a tarball from disk (`file:`)

If you've downloaded the asset (or built one locally with `pnpm pack`), install
it by path instead of URL — useful for testing a QA build against the exact
artifact CI will attach:

```sh
# Download once, then install from disk
curl -L -O \
  https://github.com/doanhtu07/react-native-the-sheet/releases/download/v1.2.0-alpha.0/the-sheet-the-sheet-1.2.0-alpha.0.tgz

npm i file:./the-sheet-the-sheet-1.2.0-alpha.0.tgz
```

Or in `package.json`:

```json
{
  "dependencies": {
    "@the-sheet/the-sheet": "file:./vendor/the-sheet-the-sheet-1.2.0-alpha.0.tgz"
  }
}
```

The path is relative to the consuming `package.json`. A `file:` tarball is
resolved by its contents, not a version range, so **replacing the file does not
reinstall it** — delete the package from `node_modules` and reinstall to pick up
a new build. Because the version is in the filename, each drop lands as a
distinct file, so pointing at the new one is enough.

Either way, remember to install each package's peer dependencies (listed in the
release notes).

## Manage tags

- `git tag --list`: List all tags
- `git tag -a <tag-name> <commit-hash> -m "<tag-message>"`: Create a new tag based on a specific commit
- `git push origin <tag-name>`: Push the tag to the remote repository (triggers the release action for `v*` tags)
- `git push origin :refs/tags/<tag-name>`: Delete a remote tag

Prune local branches and tags with:

- `git fetch --prune --prune-tags origin`

> **Note:** tags from before this setup used the `react-native-the-sheet@x.y.z`
> style. New releases use the lockstep `v<version>` style described above.
