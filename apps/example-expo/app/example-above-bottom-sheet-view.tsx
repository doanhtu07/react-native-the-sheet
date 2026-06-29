import { ThemedText } from '@/components/themed-text'
import React, { Fragment, useState } from 'react'
import { Button, StyleSheet, View } from 'react-native'
import Animated, { useAnimatedStyle } from 'react-native-reanimated'
import {
  BottomSheet,
  BottomSheetHandle,
  BottomSheetPresenter,
  BottomSheetProvider,
  BottomSheetView,
  SheetStackItem,
  useBottomSheetRegistryDangerously,
} from '@the-sheet/the-sheet'
import { Portal } from '@the-sheet/universe-portal'

export default function ExampleAboveBottomSheetView() {
  const bottomSheetRegistry = useBottomSheetRegistryDangerously()
  const sheets = bottomSheetRegistry?.sheets

  const bottomSheetId = 'sheetA'
  const sheetA = sheets?.[bottomSheetId]

  const [isOpenA, setIsOpenA] = useState(false)

  const animatedSpacerStyle = useAnimatedStyle(() => {
    return {
      paddingBottom: sheetA?.sheetVisibleHeight.value || 0,
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
      <ThemedText style={styles.header}>
        Example Above Bottom Sheet View
      </ThemedText>

      <Button title="Open Sheet A" onPress={() => setIsOpenA(true)} />

      <Animated.View style={[styles.topView, animatedSpacerStyle]}>
        <View style={styles.redSpan} />
      </Animated.View>

      <Portal hostName="root">
        <SheetStackItem
          isOpen={isOpenA}
          close={() => setIsOpenA(false)}
          waitForFullyExit
          testID="sheetA"
        >
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
  redSpan: {
    backgroundColor: 'red',
    borderRadius: 16,
    height: '100%',
    width: '100%',
  },
  root: {
    flex: 1,
    gap: 8,
    padding: 16,
  },
  topView: {
    flex: 1,
  },
})
