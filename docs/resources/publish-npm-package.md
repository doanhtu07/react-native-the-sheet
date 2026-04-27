# Publish NPM Package

## Review and update docs

- docs/apis
- docs/core
- docs/getting-started

## Publish locally

1. `npm login`

2. `pnpm changeset` + `pnpm changeset version` (Optional)

3. `pnpm changeset publish`

4. `git tag` + `git push --tags`

## Publish through Github Actions

1. Go to the NPM package > Settings

2. Setup Trusted Publisher

## Manage tags

- `git tag --list`: List all tags
- `git tag -a <tag-name> <commit-hash> -m "<tag-message>"`: Create a new tag based on a specific commit
- `git push origin <tag-name>`: Push the tag to the remote repository
