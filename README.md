# react-native-the-sheet

This is the sheet for React Native

## Roadmaps

- [Roadmap: The Village](./roadmaps/01-the-village.md)

## Components

Components supported by our library:

- [Components List](./docs/components/components-list.md)

## Compatibility

| Sheet version          | Reanimated version | React Native Worklets version | React Native version | React version           | Expo SDK version     |
| ---------------------- | ------------------ | ----------------------------- | -------------------- | ----------------------- | -------------------- |
| 2.x.x (branch `main`)  | 4.x.x              | 0.4.x - 0.8.x                 | 0.78 - 0.85          | Depends on React Native | Manages React Native |
| 1.x.x (branch `1.x.x`) | 3.x.x              | N/A                           | 0.63 - 0.81          | Depends on React Native | Manages React Native |

### Core dependencies

If confused, check `apps/example-expo/package.json` to see the versions of the core dependencies we use in our example Expo app

---

`react-native-reanimated`

- Defines our package major version => Other dependencies (React, React Native, ...) must be compatible with it
- Check v4 compatibility table: https://docs.swmansion.com/react-native-reanimated/docs/4.x/guides/compatibility/
- Check v3 compatibility table: https://docs.swmansion.com/react-native-reanimated/docs/3.x/guides/compatibility/

---

`react-native-worklets`

- Follows React Native Reanimated compatibility

---

`react-native-gesture-handler`

- Follows React Native Reanimated compatibility

---

`react-native`

- Defines React version
- Check React Native compatibility through its package.json
  - Example: https://github.com/facebook/react-native/blob/v0.85.0/package.json

---

`react`

- Follows React Native compatibility

---

`expo`

- Manages React Native version and some other dependencies (including Reanimated)
- Check compatibility table: https://docs.expo.dev/versions/latest/

Note: You can use `apps/example-expo/scripts/expo-packages-check.ts` to check the packages Expo manages

- Go to `apps/example-expo`
- Run `pnpm epc <expo-sdk-version>` (e.g. `pnpm epc 55`)

---

`typescript`

- Anything is fine as long as it works with React Native

### Contributing notes

When contributing to this project, please ensure the versions of these core dependencies are consistent across all packages

## Resources

- [Create React Native Module](./docs/resources/create-react-native-module.md)
- [React Native Module Codegen](./docs/resources/react-native-module-codegen.md)
- [Expo Android Notes](./docs/resources/expo-android-notes.md)

# Inspiration

Thank you to all the open source projects that inspired this project:

- https://github.com/gorhom/react-native-bottom-sheet
