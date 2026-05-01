import { ThemedText } from '@/components/text'
import { Fragment, useState } from 'react'
import { Button, StyleSheet, View } from 'react-native'
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

export default function ExampleBottomSheetFloatMode() {
  const [isOpenA, setIsOpenA] = useState(false)
  const [isOpenB, setIsOpenB] = useState(false)

  const renderContent = () => {
    return (
      <Fragment>
        {Array.from({ length: 20 }).map((_, index) => (
          <ThemedText key={index}>Item {index + 1}</ThemedText>
        ))}
      </Fragment>
    )
  }

  return (
    <View style={styles.root}>
      <ThemedText style={styles.header}>
        Example Bottom Sheet (Float Mode)
      </ThemedText>

      <Button
        title="Open Sheet A (Dynamic sizing)"
        onPress={() => setIsOpenA(true)}
      />

      <Button
        title="Open Sheet B (Snap points)"
        onPress={() => setIsOpenB(true)}
      />

      <Portal hostName="root">
        <SheetStackItem
          isOpen={isOpenA}
          close={() => setIsOpenA(false)}
          waitForFullyExit
          testID="sheetA"
        >
          <Backdrop />

          <BottomSheetPresenter>
            <BottomSheetProvider enableFloat>
              <BottomSheet styles={{ root: { height: '70%' } }}>
                <BottomSheetHandle />

                <BottomSheetView>
                  <ThemedText>Sheet A</ThemedText>

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

      <Portal hostName="root">
        <SheetStackItem
          isOpen={isOpenB}
          close={() => setIsOpenB(false)}
          waitForFullyExit
          testID="sheetB"
        >
          <Backdrop />

          <BottomSheetPresenter>
            <BottomSheetProvider snapPoints={['20%', '70%']} enableFloat>
              <BottomSheet>
                <BottomSheetHandle />

                <BottomSheetView>
                  <ThemedText>Sheet B</ThemedText>

                  <Button
                    title="Close Sheet B"
                    onPress={() => setIsOpenB(false)}
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
