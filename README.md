# react-native-the-sheet

This is the sheet for React Native

## Roadmap

- [x] Embedded stack navigator

- [x] Portal
  - Support for isolated host

- [x] Sheet stack provider
  - Actions: push, pop, remove

- [x] Sheet stack item
  - Behavior: push, switch, replace
  - z-index based on index in provider stack
  - Always open at 100%, no animation at all

- [x] Backdrop

- [x] Bottom sheet presenter
  - Open: Always slide from 0% to 100%
    - This solves the problem of bottom sheet dynamic sizing
  - Close: Always slide from 100% to 0%
    - Can signal sheet stack item to unmount when close animation finishes

- [ ] Bottom sheet
  - Snap points
  - Free movement
  - Hide, present, snap to index, move to position
  - Plan:
    - Blank sheet
    - Handle
    - Drag freely

## Compatibility

| Sheet version          | Reanimated version | React Native Worklets version | React Native version | React version           | Expo SDK version     |
| ---------------------- | ------------------ | ----------------------------- | -------------------- | ----------------------- | -------------------- |
| 2.x.x (branch `main`)  | 4.x.x              | 0.4.x - 0.8.x                 | 0.78 - 0.85          | Depends on React Native | Manages React Native |
| 1.x.x (branch `1.x.x`) | 3.x.x              | N/A                           | 0.63 - 0.81          | Depends on React Native | Manages React Native |

### Core dependencies

- `react-native-reanimated`
  - Defines our package major version => Other dependencies (React, React Native, ...) must be compatible with it
  - Check v4 compatibility table: https://docs.swmansion.com/react-native-reanimated/docs/4.x/guides/compatibility/
  - Check v3 compatibility table: https://docs.swmansion.com/react-native-reanimated/docs/3.x/guides/compatibility/

- `react-native`
  - Defines React version
  - Check React Native compatibility through its package.json
    - Example: https://github.com/facebook/react-native/blob/v0.85.0/package.json

- `expo`
  - Manages React Native version and some other dependencies (including Reanimated)
  - Check compatibility table: https://docs.expo.dev/versions/latest/
  - Note: You can use `apps/example-expo/scripts/expo-packages-check.ts` to check the packages Expo manages
    - Go to `apps/example-expo`
    - Run `pnpm epc <expo-sdk-version>` (e.g. `pnpm epc 55`)

- `typescript`
  - Anything is fine as long as it works with React Native
  - But in our monorepo, we should maintain the same version across all apps + packages to avoid any issues with types

### Contributing notes

When contributing to this project, please ensure the versions of these core dependencies are consistent across all packages

## Resources

- [Create React Native Module](./docs/create-react-native-module.md)
- [React Native Module Codegen](./docs/react-native-module-codegen.md)
