# Quick Start Kit

## Installation

First, you need to determine which version of React Native Reanimated you are using (Refer to [Compatibility](./compatibility.md) for more details)

Then, you can install the corresponding version of our library

For example, if you are using Reanimated v3, you would install v1 of our library like this:

```bash
npm install react-native-the-sheet@1.0.9
```

Required peer dependencies:

- `react-native-reanimated`
- `react-native-gesture-handler`
- `react-native-safe-area-context`

### Optional dependencies

`react-native-universe-portal`: Install if you need portal features and don't have a library of your own yet

- What are React Portals? https://www.w3schools.com/react/react_portals.asp

---

`react-native-embedded-stack-navigator`: Install if you want a pure React navigator to work within the bottom sheet

### 🧪 Experimental

While the library is stable enough for use, it is currently in a rapid experimentation phase regarding its API

- I recommend pinning a specific version for your projects

## Sample code snippet

- Check out full examples and test cases: [Example Expo App](../../apps/example-expo)

### Wrap your app with necessary providers

NOTE: Ignore portals if you don't use them

```tsx
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
      <SheetKeyboardProvider
        androidWindowSoftInputMode={/* Your app's Android window soft input mode */}
      >
        <SheetStackProvider debug>
          <PortalProvider>
            <BottomSheetRegistryProvider>
              <GestureHandlerRootView>
                {/* Your app content */}
                <PortalHost name="root" debug />
              </GestureHandlerRootView>
            </BottomSheetRegistryProvider>
          </PortalProvider>
        </SheetStackProvider>
      </SheetKeyboardProvider>
    </SafeAreaProvider>
  )
}
```

### Use only components you need for your use case

In this sample, we create a simple bottom sheet with:

- Dynamic sizing
- Backdrop
- Handle
- Static content that is aware of pan gesture (using `BottomSheetView`)

When you drag the handle or the content, the sheet will follow your finger

```tsx
import { Fragment, useState } from 'react'
import { Button, StyleSheet, Text, View } from 'react-native'
import {
  Backdrop,
  BottomSheet,
  BottomSheetHandle,
  BottomSheetPresenter,
  BottomSheetProvider,
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
            <BottomSheetProvider snapPoints={[200, 500]}>
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
            </BottomSheetProvider>
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
