# react-native-the-sheet

[![Reanimated v3 version](https://img.shields.io/github/package-json/v/doanhtu07/react-native-the-sheet/main?filename=packages/react-native-the-sheet/package.json&label=Reanimated%20v3&style=flat-square)](https://github.com/doanhtu07/react-native-the-sheet) [![Reanimated v2 version](https://img.shields.io/github/package-json/v/doanhtu07/react-native-the-sheet/v1?filename=packages/react-native-the-sheet/package.json&label=Reanimated%20v2&style=flat-square)](https://github.com/doanhtu07/react-native-the-sheet/tree/v1) [![license](https://img.shields.io/npm/l/@gorhom/bottom-sheet?style=flat-square)]()

This is the sheet for React Native! - excluding Web

A modular bottom sheet library built on top of React Native Reanimated and React Native Gesture Handler

You can DIY some certain aspects using the building blocks and hooks we have

<table>
  <tr>
    <td width="50%">
      <video src="https://github.com/user-attachments/assets/9201cc74-8e23-427d-a076-36c0bb299a3c" controls width="100%"></video>
    </td>
    <td width="50%">
      <video src="https://github.com/user-attachments/assets/9b6ae67f-4171-44db-a620-56f90c5cd632" controls width="100%"></video>
    </td>
  </tr>
</table>

## NPM packages

- Embedded Stack Navigator: https://www.npmjs.com/package/react-native-embedded-stack-navigator
- Universe Portal: https://www.npmjs.com/package/react-native-universe-portal
- The Sheet: https://www.npmjs.com/package/react-native-the-sheet

## Components

Components supported by our library:

- [Component List](./docs/components/component-list.md)

## Compatibility

| Sheet version         | Reanimated version | React Native Worklets version | React Native version | React version           | Expo SDK version     |
| --------------------- | ------------------ | ----------------------------- | -------------------- | ----------------------- | -------------------- |
| 2.x.x (branch `main`) | 4.x.x              | 0.4.x - 0.8.x                 | 0.78 - 0.85          | Depends on React Native | Manages React Native |
| 1.x.x (branch `v1`)   | 3.x.x              | N/A                           | 0.63 - 0.81          | Depends on React Native | Manages React Native |

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

## Roadmaps

I don't plan to support Web for a couple of reasons:

1. Bottom sheets on web are usually not the right UX choice
2. Web leans towards popups/modals which can be implemented much simpler with CSS and libraries like https://motion.dev

---

- [Chapter 1: The Village](./roadmaps/01-the-village.md)

## Inspiration

Thank you to all the open source projects that inspired this project:

- https://github.com/gorhom/react-native-bottom-sheet

## Contributing

- Check out notes on contributing: [CONTRIBUTING.md](./CONTRIBUTING.md)

## Resources

- [Create React Native Module](./docs/resources/create-react-native-module.md)
- [React Native Module Codegen](./docs/resources/react-native-module-codegen.md)
- [Expo Android Notes](./docs/resources/expo-android-notes.md)
