import { ThemedText } from '@/components/themed-text'
import { Fragment, useState } from 'react'
import { Button, StyleSheet, View } from 'react-native'
import {
  Backdrop,
  BottomSheet,
  BottomSheetFooter,
  BottomSheetHandle,
  BottomSheetPresenter,
  BottomSheetProvider,
  BottomSheetScrollView,
  BottomSheetView,
  SheetStackItem,
} from 'react-native-the-sheet'
import { Portal } from 'react-native-universe-portal'

export default function ExampleBottomSheetFooter() {
  const [isOpenA, setIsOpenA] = useState(false)
  const [isOpenB, setIsOpenB] = useState(false)

  // MARK: Renderers

  const renderContent = (length: number) => {
    return (
      <Fragment>
        {Array.from({ length }).map((_, index) => (
          <ThemedText key={index}>Item {index + 1}</ThemedText>
        ))}
      </Fragment>
    )
  }

  return (
    <View style={styles.root}>
      <ThemedText style={styles.header}>Example Bottom Sheet Footer</ThemedText>

      <Button title="Open Sheet A (View)" onPress={() => setIsOpenA(true)} />

      <Button
        title="Open Sheet B (Scroll view)"
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
            <BottomSheetProvider snapPoints={[300, 600]} enableOverdrag>
              <BottomSheet>
                <BottomSheetHandle />

                <BottomSheetView>
                  <ThemedText>Sheet A</ThemedText>

                  <Button
                    title="Close Sheet A"
                    onPress={() => setIsOpenA(false)}
                  />

                  {renderContent(20)}
                </BottomSheetView>

                <BottomSheetFooter styles={{ root: styles.footer }}>
                  <ThemedText style={styles.footerText}>Footer</ThemedText>
                </BottomSheetFooter>
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
            <BottomSheetProvider snapPoints={[200, 500]} enableOverdrag>
              <BottomSheet>
                <BottomSheetHandle />

                <BottomSheetScrollView>
                  <ThemedText>Sheet B</ThemedText>

                  <Button
                    title="Close Sheet B"
                    onPress={() => setIsOpenB(false)}
                  />

                  {renderContent(50)}
                </BottomSheetScrollView>

                <BottomSheetFooter styles={{ root: styles.footer }}>
                  <ThemedText style={styles.footerText}>Footer</ThemedText>
                </BottomSheetFooter>
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
  footer: {
    backgroundColor: '#f0f0f0',
    padding: 16,
  },
  footerText: {
    fontSize: 16,
    fontWeight: '500',
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
