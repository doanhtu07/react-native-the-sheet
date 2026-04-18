import { Fragment, useState } from 'react'
import { Button, StyleSheet, Text, View } from 'react-native'
import {
  Backdrop,
  BottomSheet,
  BottomSheetHandle,
  BottomSheetPresenter,
  SheetStackItem,
} from 'react-native-the-sheet'
import { Portal } from 'react-native-universe-portal'

export default function ExampleBottomSheetDynamicSizing() {
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
      <Text style={styles.header}>Example Bottom Sheet (Dynamic Sizing)</Text>

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

              <Text>Sheet A</Text>
              <Button title="Close Sheet A" onPress={() => setIsOpenA(false)} />
              {renderContent()}
            </BottomSheet>
          </BottomSheetPresenter>
        </SheetStackItem>
      </Portal>
    </View>
  )
}

// MARK: Styles

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
