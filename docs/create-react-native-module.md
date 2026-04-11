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

- Remove `nodeLinker: hoisted` from `pnpm-workspace.yaml` if you are using pnpm
  - `pnpx create-react-native-library@latest PACKAGE_NAME` command will accidentally add this back every single time

## Fix Eslint file

- Use `@react-native/eslint-config/flat`
