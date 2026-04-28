import { Fragment, useRef, useState } from 'react'
import { Button, StyleSheet, Text, View } from 'react-native'
import {
  Backdrop,
  BottomSheet,
  BottomSheetHandle,
  BottomSheetApi,
  BottomSheetPresenter,
  SheetStackItem,
  BottomSheetProvider,
} from 'react-native-the-sheet'
import { Portal } from 'react-native-universe-portal'

export default function ExampleBottomSheetSnapPoints() {
  const [isOpenA, setIsOpenA] = useState(false)

  const botRefA = useRef<BottomSheetApi>(null)

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
      <Text style={styles.header}>Example Bottom Sheet (Snap Points)</Text>

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
              <BottomSheet ref={botRefA}>
                <BottomSheetHandle />

                <Text>Sheet A</Text>
                <Button
                  title="Close Sheet A"
                  onPress={() => setIsOpenA(false)}
                />

                <Button
                  title="Snap to 50%"
                  onPress={() => botRefA.current?.snapToPosition('50%')}
                />

                <Button
                  title="Snap to 70%"
                  onPress={() => botRefA.current?.snapToPosition('70%')}
                />

                {renderContent()}
              </BottomSheet>
            </BottomSheetProvider>
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
