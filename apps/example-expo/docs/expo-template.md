# expo-template

Template for simple Expo app

## Maintenance

- `pnpm outdated`: Check for outdated dependencies for client
  - `pnpm up --latest`: Update dependencies to latest versions for client
  - Or choose certain dependencies to update by specifying package names
- `pnpm install --resolution-only`: Check for outdated dependencies or potential version conflicts
- `pnpm why <package-name>`: Check why a certain package is installed and which other packages depend on it

## Upgrading Expo SDK + dependencies

https://docs.expo.dev/workflow/upgrading-expo-sdk-walkthrough/#upgrade-dependencies:

- `pnpx expo upgrade`: Upgrade the Expo SDK version and update all dependencies to compatible versions
  - Or `pnpm add expo@^55.0.0`
- `pnpx expo install --check`: Check for outdated Expo-related dependencies and suggest updates
- `pnpx expo install --fix`: Automatically update Expo-related dependencies to compatible versions
- `pnpx expo install <package-name>`: Install a package and automatically choose the correct version compatible with the Expo SDK version
  - For anything Expo/React Native related

Read more:

- Code: https://github.com/expo/expo
  - tools/src/Versions.ts
  - packages/expo-doctor/src/api/getNativeModuleVersionsAsync.ts
  - packages/expo/bundledNativeModules.json

- All Expo versions: https://api.expo.dev/v2/versions/latest
- Live Expo SDK package versions: https://api.expo.dev/v2/sdks/EXPO_SDK_VERSION.0.0/native-modules

## Package management

- When a package version is listed with `~` or no sign, high chance it means Expo is managing the version and you should not update it manually

- Use `pnpm epc <EXPO_SDK_VERSION>` to make sure
