import React, { Fragment, useState } from 'react'
import { Button, StyleSheet, Text, View } from 'react-native'
import { useAnimatedStyle } from 'react-native-reanimated'
import {
  Backdrop,
  BottomSheet,
  BottomSheetHandle,
  BottomSheetPresenter,
  BottomSheetProvider,
  BottomSheetView,
  SheetStackItem,
  useBottomSheetRegistry,
} from 'react-native-the-sheet'
import { Portal } from 'react-native-universe-portal'

export default function ExampleBackdropOpacity() {
  const { sheets } = useBottomSheetRegistry()

  const bottomSheetId = 'sheetA'
  const sheetA = sheets[bottomSheetId]

  const [isOpenA, setIsOpenA] = useState(false)

  const animatedBackdropStyle = useAnimatedStyle(() => {
    const maxOpacity = 0.5

    const opacity = Math.min(
      maxOpacity,
      maxOpacity * (sheetA?.sheetVisibleRatio.value || 0),
    )

    return {
      opacity,
    }
  })

  // MARK: Renderers

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
      <Text style={styles.header}>Example Backdrop Opacity</Text>

      <Button title="Open Sheet A" onPress={() => setIsOpenA(true)} />

      <View style={styles.spacer} />

      <Portal hostName="root">
        <SheetStackItem
          isOpen={isOpenA}
          close={() => setIsOpenA(false)}
          waitForFullyExit
          testID="sheetA"
        >
          <Backdrop
            styles={{
              root: animatedBackdropStyle,
            }}
          />

          <BottomSheetPresenter>
            <BottomSheetProvider
              id={bottomSheetId}
              snapPoints={['60%']}
              enableOverdrag
            >
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
  spacer: {
    flex: 1,
  },
})
