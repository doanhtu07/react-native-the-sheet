# Create React Native Module

pnpx create-react-native-library@latest PACKAGE_NAME

- `Turbo module`
- `Kotlin & Objective-C`
- `App with Expo CLI`
- [`Eslint with Prettier`, `Jest`]

## Remove all yarn related stuff

- If you are using npm or pnpm, search for `yarn` keyword
  - Remove all yarn related files and configurations
  - Incrementally add stuff later on if needed

## Remove all unnecessary stuff

Some of the stuff are bloated and not needed for a simple module

- We can always add them back later on if needed

Remove list:

- `.github`
- `.editorconfig`
- `workspaces` from `package.json`
- `prettier` from `package.json`

- Remove `nodeLinker: hoisted` from `pnpm-workspace.yaml` if you are using pnpm
  - `pnpx create-react-native-library@latest PACKAGE_NAME` command will accidentally add this back every single time

## Fix Eslint file

- Use `@react-native/eslint-config/flat`

## Install dependencies

- `pnpm add -D prettier`
