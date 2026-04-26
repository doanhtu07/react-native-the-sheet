# react-native-the-sheet

[![Reanimated v4 version](https://img.shields.io/github/package-json/v/doanhtu07/react-native-the-sheet/main?filename=packages/react-native-the-sheet/package.json&label=Reanimated%20v4&style=flat-square)](https://github.com/doanhtu07/react-native-the-sheet) [![Reanimated v3 version](https://img.shields.io/github/package-json/v/doanhtu07/react-native-the-sheet/v1?filename=packages/react-native-the-sheet/package.json&label=Reanimated%20v3&style=flat-square)](https://github.com/doanhtu07/react-native-the-sheet/tree/v1) [![license](https://img.shields.io/npm/l/@gorhom/bottom-sheet?style=flat-square)]()

This is the sheet for React Native! - excluding Web

A modular bottom sheet library built on top of:

- React Native Reanimated
- React Native Gesture Handler
- React Native Safe Area Context

You can DIY many aspects using the building blocks and hooks we have

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

- Embedded Stack Navigator: https://www.npmjs.com/package/react-native-embedded-stack-navigator/v/2.0.8
- Universe Portal: https://www.npmjs.com/package/react-native-universe-portal/v/2.0.8
- The Sheet: https://www.npmjs.com/package/react-native-the-sheet/v/2.0.8

## Installation

First, you need to determine which version of React Native Reanimated you are using

- Choose the right version of our library based on `Compatibility` section below

For example, if you are using Reanimated v4, you would install v2 of our library like this:

```bash
npm install react-native-the-sheet@2.0.8
```

Required peer dependencies:

- `react-native-reanimated`
- `react-native-gesture-handler`
- `react-native-safe-area-context`

---

`react-native-universe-portal`: Install if you need portal features and don't have a library of your own yet

- What are React Portals? https://www.w3schools.com/react/react_portals.asp

---

`react-native-embedded-stack-navigator`: Install if you want a pure React navigator to work within the bottom sheet

---

While the library is stable enough for use, it is currently in a rapid experimentation phase regarding its API

- I recommend pinning a specific version for your projects

## Components

Components supported by our library:

- [Component List](./docs/components/component-list/component-list.md)
- [Component Props](./docs/components/component-props.md)

## Examples

- Check out full examples and test cases: [Example Expo App](./apps/example-expo)

### Wrap your app with necessary providers

NOTE: Ignore portals if you don't use them

```tsx
import { Stack } from 'expo-router'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import {
  SheetStackProvider,
  SheetKeyboardProvider,
} from 'react-native-the-sheet'
import { PortalHost, PortalProvider } from 'react-native-universe-portal'

export default function App() {
  return (
    <SafeAreaProvider>
      <SheetKeyboardProvider>
        <SheetStackProvider debug>
          <PortalProvider>
            <GestureHandlerRootView>
              <Stack />
              <PortalHost name="root" debug />
            </GestureHandlerRootView>
          </PortalProvider>
        </SheetStackProvider>
      </SheetKeyboardProvider>
    </SafeAreaProvider>
  )
}
```

### Use only components you need for your use case

```tsx
import { Fragment, useState } from 'react'
import { Button, StyleSheet, Text, View } from 'react-native'
import {
  Backdrop,
  BottomSheet,
  BottomSheetHandle,
  BottomSheetPresenter,
  BottomSheetView,
  SheetStackItem,
} from 'react-native-the-sheet'
import { Portal } from 'react-native-universe-portal'

export default function ExampleBottomSheetView() {
  const [isOpenA, setIsOpenA] = useState(false)

  const renderContent = () => {
    return (
      <Fragment>
        {Array.from({ length: 20 }).map((_, index) => (
          <Text key={index}>Item {index + 1}</Text>
        ))}
      </Fragment>
    )
  }

  return (
    <View style={styles.root}>
      <Text style={styles.header}>Example Bottom Sheet View</Text>

      <Button title="Open Sheet A" onPress={() => setIsOpenA(true)} />

      <Portal hostName="root">
        <SheetStackItem
          isOpen={isOpenA}
          close={() => setIsOpenA(false)}
          waitForFullyExit
          testID="sheetA"
        >
          <Backdrop />

          <BottomSheetPresenter>
            <BottomSheet>
              <BottomSheetHandle />

              <BottomSheetView>
                <Text>Sheet A</Text>
                <Button
                  title="Close Sheet A"
                  onPress={() => setIsOpenA(false)}
                />
                {renderContent()}
              </BottomSheetView>
            </BottomSheet>
          </BottomSheetPresenter>
        </SheetStackItem>
      </Portal>
    </View>
  )
}

// Styles

const styles = StyleSheet.create({
  header: {
    fontSize: 20,
    fontWeight: '500',
  },
  root: {
    flex: 1,
    gap: 8,
    padding: 16,
  },
})
```

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

`react-native-safe-area-context`

- Anything is fine as long as it has:
  - `SafeAreaProvider` component
  - `useSafeAreaInsets` hook
  - `useSafeAreaFrame` hook

---

`typescript`

- Anything is fine as long as it works with React Native

## Roadmaps

I don't plan to support Web for a couple of reasons:

1. Bottom sheets on web are usually not the right UX choice
2. Web leans towards popups/modals which can be implemented much simpler with CSS and libraries like https://motion.dev

---

- [Chapter 1: The Village](./roadmaps/01-the-village.md)
- [Chapter 2: The Road](./roadmaps/02-the-road.md)

## Inspiration

Thank you to all the open source projects that inspired this project:

- https://github.com/gorhom/react-native-bottom-sheet

## Contributing

- Check out notes on contributing: [CONTRIBUTING.md](./CONTRIBUTING.md)

## Resources

- [Create React Native Module](./docs/resources/create-react-native-module.md)
- [React Native Module Codegen](./docs/resources/react-native-module-codegen.md)
- [Expo Android Notes](./docs/resources/expo-android-notes.md)
- [Publish NPM Package](./docs/resources/publish-npm-package.md)
