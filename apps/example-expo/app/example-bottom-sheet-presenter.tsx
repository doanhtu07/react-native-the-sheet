import { useState } from 'react'
import { Button, StyleSheet, Text, View } from 'react-native'
import {
  Backdrop,
  BottomSheetPresenter,
  SheetStackItem,
} from 'react-native-the-sheet'
import { Portal } from 'react-native-universe-portal'

export default function ExampleBottomSheetPresenter() {
  const [isOpenA, setIsOpenA] = useState(false)

  return (
    <View style={styles.root}>
      <Text style={styles.header}>Example Bottom Sheet Presenter</Text>

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
            <View style={styles.boxA}>
              <Text>Sheet A</Text>
              <Button title="Close Sheet A" onPress={() => setIsOpenA(false)} />

              <Text>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </Text>
              <Text>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </Text>
              <Text>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </Text>
              <Text>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </Text>
              <Text>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </Text>
              <Text>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </Text>
            </View>
          </BottomSheetPresenter>
        </SheetStackItem>
      </Portal>
    </View>
  )
}

// MARK: Styles

const styles = StyleSheet.create({
  boxA: {
    backgroundColor: '#6A0572',
    width: '100%',
  },
  root: {
    flex: 1,
    padding: 16,
    gap: 8,
  },
  header: {
    fontSize: 20,
    fontWeight: '500',
  },
})
