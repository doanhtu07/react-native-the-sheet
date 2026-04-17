import { StyleSheet, useColorScheme, View } from 'react-native'
import type { BottomSheetHandleProps } from './types'
import { useBottomSheet } from './bottom-sheet'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import { useSharedValue, withSpring } from 'react-native-reanimated'
import { useSheetStackItem } from '../sheet-stack'
import { runOnJS } from 'react-native-worklets'

export function BottomSheetHandle({
  styles: propStyles,
}: Readonly<BottomSheetHandleProps>) {
  const { close } = useSheetStackItem()
  const { sheetHeight, translateY } = useBottomSheet()
  const theme = useColorScheme()

  const isDark = theme === 'dark'
  const backgroundColor = isDark ? '#48484A' : '#E0E0E0'

  const cacheTranslateY = useSharedValue(0)

  const panGesture = Gesture.Pan()
    .onStart(() => {
      cacheTranslateY.value = translateY.value
    })
    .onUpdate((event) => {
      // We update the RELATIVE displacement
      const nextValue = event.translationY + cacheTranslateY.value
      translateY.value = Math.max(0, nextValue)
    })
    .onEnd((event) => {
      const isFlickedDown = event.velocityY > 500
      const isDraggedFarEnough = translateY.value > sheetHeight.value * 0.5

      if (isFlickedDown || isDraggedFarEnough) {
        runOnJS(close)()
      } else {
        // Snap back to rest state
        translateY.value = withSpring(0, { velocity: event.velocityY })
      }
    })

  // MARK: Renderers

  return (
    <GestureDetector gesture={panGesture}>
      <View style={[styles.root, propStyles?.root]}>
        <View
          style={[styles.indicator, { backgroundColor }, propStyles?.indicator]}
        />
      </View>
    </GestureDetector>
  )
}

// MARK: Styles

const styles = StyleSheet.create({
  root: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  indicator: {
    width: 36,
    height: 5,
    borderRadius: 9999,
  },
})
