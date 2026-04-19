import React, { Fragment, useState } from 'react'
import { Button, StyleSheet, Text, View } from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated'
import {
  BottomSheet,
  BottomSheetHandle,
  BottomSheetPositionTracker,
  BottomSheetPresenter,
  BottomSheetView,
  SheetStackItem,
} from 'react-native-the-sheet'
import { Portal } from 'react-native-universe-portal'

export default function ExampleAboveBottomSheetView() {
  const [isOpenA, setIsOpenA] = useState(false)

  const bottomSheetVisibleHeight = useSharedValue(0)

  const animatedSpacerStyle = useAnimatedStyle(() => {
    return {
      paddingBottom: bottomSheetVisibleHeight.value,
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
      <Text style={styles.header}>Example Above Bottom Sheet View</Text>

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
            <BottomSheet snapPoints={['60%']} enableOverdrag>
              <BottomSheetPositionTracker
                trackBottomSheetVisibleHeight={bottomSheetVisibleHeight}
              />

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
