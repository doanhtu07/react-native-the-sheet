import { useState } from 'react'
import { Button, StyleSheet, Text, View } from 'react-native'
import {
  Backdrop,
  BottomSheetPresenter,
  SheetStackItem,
} from 'react-native-the-sheet'
import { Portal } from 'react-native-universe-portal'

export default function ExampleBottomSheetPresenterMultiple() {
  const [isOpenA, setIsOpenA] = useState(false)
  const [isOpenB, setIsOpenB] = useState(false)
  const [isOpenC, setIsOpenC] = useState(false)

  return (
    <View style={styles.root}>
      <Text style={styles.header}>
        Example Bottom Sheet Presenter (Multiple)
      </Text>

      <Button title="Open Sheet A" onPress={() => setIsOpenA(true)} />

      <Portal hostName="root">
        <SheetStackItem
          isOpen={isOpenA}
          close={() => setIsOpenA(false)}
          waitForFullyExit
          testID="sheetA"
        >
          <Backdrop />

          <BottomSheetPresenter testID="sheetAPresenter">
            <View style={styles.boxA}>
              <Text>Sheet A</Text>
              <Button title="Close Sheet A" onPress={() => setIsOpenA(false)} />
              <Button title="Open Sheet B" onPress={() => setIsOpenB(true)} />
            </View>
          </BottomSheetPresenter>
        </SheetStackItem>
      </Portal>

      <Portal hostName="root">
        <SheetStackItem
          isOpen={isOpenB}
          close={() => setIsOpenB(false)}
          pushBehavior="switch"
          waitForFullyExit
          testID="sheetB"
        >
          <BottomSheetPresenter testID="sheetBPresenter">
            <View style={styles.boxB}>
              <Text>Sheet B</Text>
              <Button title="Close Sheet B" onPress={() => setIsOpenB(false)} />
              <Button title="Open Sheet C" onPress={() => setIsOpenC(true)} />
            </View>
          </BottomSheetPresenter>
        </SheetStackItem>
      </Portal>

      <Portal hostName="root">
        <SheetStackItem
          isOpen={isOpenC}
          close={() => setIsOpenC(false)}
          waitForFullyExit
          testID="sheetC"
        >
          <BottomSheetPresenter testID="sheetCPresenter">
            <View style={styles.boxC}>
              <Text>Sheet C</Text>
              <Button title="Close Sheet C" onPress={() => setIsOpenC(false)} />
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
    height: 500,
  },
  boxB: {
    backgroundColor: '#AB0845',
    width: '100%',
    height: 400,
  },
  boxC: {
    backgroundColor: '#FFB800',
    width: '100%',
    height: 300,
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
