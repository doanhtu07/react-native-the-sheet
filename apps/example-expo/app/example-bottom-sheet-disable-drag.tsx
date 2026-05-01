import { ThemedText } from '@/components/text'
import { Fragment, useState } from 'react'
import { Button, StyleSheet, View } from 'react-native'
import {
  Backdrop,
  BottomSheet,
  BottomSheetHandle,
  BottomSheetPresenter,
  BottomSheetProvider,
  BottomSheetScrollView,
  BottomSheetView,
  SheetStackItem,
} from 'react-native-the-sheet'
import { Portal } from 'react-native-universe-portal'

export default function ExampleBottomSheetDisableDrag() {
  const [isOpen, setIsOpen] = useState(false)
  const [disableDrag, setDisableDrag] = useState(false)
  const [disableClose, setDisableClose] = useState(false)

  const close = () => {
    if (disableClose) return
    setIsOpen(false)
  }

  const renderContent = () => {
    return (
      <Fragment>
        {Array.from({ length: 50 }).map((_, index) => (
          <ThemedText key={index}>Item {index + 1}</ThemedText>
        ))}
      </Fragment>
    )
  }

  return (
    <View style={styles.root}>
      <ThemedText style={styles.header}>
        Example Bottom Sheet (Disable Drag)
      </ThemedText>

      <Button
        title={disableDrag ? 'Enable Drag' : 'Disable Drag'}
        onPress={() => setDisableDrag(!disableDrag)}
      />

      <Button
        title={disableClose ? 'Enable Close' : 'Disable Close'}
        onPress={() => setDisableClose(!disableClose)}
      />

      <Button title="Open Sheet" onPress={() => setIsOpen(true)} />

      <Portal hostName="root">
        <SheetStackItem
          isOpen={isOpen}
          close={close}
          waitForFullyExit
          testID="sheet"
        >
          <Backdrop />

          <BottomSheetPresenter>
            <BottomSheetProvider
              snapPoints={['60%']}
              disableDrag={disableDrag || disableClose}
            >
              <BottomSheet>
                <BottomSheetHandle />

                <BottomSheetView fill>
                  <ThemedText>
                    Disable Drag: {disableDrag ? 'true' : 'false'}
                  </ThemedText>

                  <ThemedText>
                    Disable Close: {disableClose ? 'true' : 'false'}
                  </ThemedText>

                  <ThemedText style={styles.instructions}>
                    {disableDrag || disableClose
                      ? 'Drag is disabled. You cannot drag the sheet.'
                      : 'Drag is enabled. You can drag the sheet normally.'}
                  </ThemedText>

                  <Button title="Close Sheet" onPress={close} />

                  {disableClose && (
                    <Button
                      title="Enable Close (to close)"
                      onPress={() => setDisableClose(false)}
                    />
                  )}

                  <BottomSheetScrollView fill>
                    {renderContent()}
                  </BottomSheetScrollView>
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
  instructions: {
    marginVertical: 8,
  },
  root: {
    flex: 1,
    gap: 8,
    padding: 16,
  },
})
