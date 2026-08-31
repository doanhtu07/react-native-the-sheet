import { ThemedText } from '@/components/themed-text'
import React, { Fragment, useState } from 'react'
import { Button, StyleSheet, View } from 'react-native'
import { useAnimatedStyle } from 'react-native-reanimated'
import {
  Backdrop,
  BottomSheet,
  BottomSheetHandle,
  BottomSheetPresenter,
  BottomSheetProvider,
  BottomSheetView,
  SheetStackItem,
  useBottomSheetRegistryDangerously,
} from '@the-sheet/the-sheet'
import { Portal } from '@the-sheet/universe-portal'

export default function ExampleBackdropOpacity() {
  const bottomSheetRegistry = useBottomSheetRegistryDangerously()
  const sheets = bottomSheetRegistry?.sheets

  const bottomSheetId = 'sheetA'
  const sheetA = sheets?.[bottomSheetId]
  const { sheetVisibleRatio } = sheetA || {}

  const [isOpenA, setIsOpenA] = useState(false)

  const animatedBackdropStyle = useAnimatedStyle(() => {
    const maxOpacity = 0.5

    const opacity = Math.min(
      maxOpacity,
      maxOpacity * (sheetVisibleRatio?.value || 0),
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
          <ThemedText key={index}>Item {index + 1}</ThemedText>
        ))}
      </Fragment>
    )
  }

  return (
    <View style={styles.root}>
      <ThemedText style={styles.header}>Example Backdrop Opacity</ThemedText>

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
