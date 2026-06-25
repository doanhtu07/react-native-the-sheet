import { ThemedText } from '@/components/themed-text'
import { useRef, useState } from 'react'
import { Button, StyleSheet, View } from 'react-native'
import {
  Backdrop,
  BottomSheetPresenter,
  BottomSheetPresenterApi,
  SheetStackItem,
  SheetStackItemApi,
} from '@the-sheet/the-sheet'
import { Portal } from '@the-sheet/universe-portal'

export default function ExampleBottomSheetPresenterReshowPutOnTop() {
  const [isOpenA, setIsOpenA] = useState(false)
  const [isOpenB, setIsOpenB] = useState(false)
  const [isOpenC, setIsOpenC] = useState(false)

  const itemARef = useRef<SheetStackItemApi>(null)
  const presenterARef = useRef<BottomSheetPresenterApi>(null)

  const reshowA = () => {
    itemARef.current?.putOnTop()
    presenterARef.current?.reshow()
  }

  // MARK: Renderers

  return (
    <View style={styles.root}>
      <ThemedText style={styles.header}>
        Example Bottom Sheet Presenter (Reshow + PutOnTop)
      </ThemedText>

      <Button title="Open Sheet A" onPress={() => setIsOpenA(true)} />

      <Portal hostName="root">
        <SheetStackItem
          ref={itemARef}
          isOpen={isOpenA}
          close={() => setIsOpenA(false)}
          waitForFullyExit
          testID="sheetA"
        >
          <Backdrop />

          <BottomSheetPresenter ref={presenterARef} testID="sheetAPresenter">
            <View style={styles.boxA}>
              <ThemedText>Sheet A</ThemedText>
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
          waitForFullyExit
          testID="sheetB"
        >
          <Backdrop />

          <BottomSheetPresenter testID="sheetBPresenter">
            <View style={styles.boxB}>
              <ThemedText>Sheet B</ThemedText>
              <Button title="Close Sheet B" onPress={() => setIsOpenB(false)} />
              <Button title="Open Sheet C" onPress={() => setIsOpenC(true)} />
              <Button title="Reshow Sheet A" onPress={reshowA} />
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
          <Backdrop />

          <BottomSheetPresenter testID="sheetCPresenter">
            <View style={styles.boxC}>
              <ThemedText>Sheet C</ThemedText>
              <Button title="Close Sheet C" onPress={() => setIsOpenC(false)} />
              <Button title="Reshow Sheet A" onPress={reshowA} />
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
    height: 500,
    width: '100%',
  },
  boxB: {
    backgroundColor: '#AB0845',
    height: 400,
    width: '100%',
  },
  boxC: {
    backgroundColor: '#FFB800',
    height: 300,
    width: '100%',
  },
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
