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
  const { sheetHeight, snapTranslateYs, translateY } = useBottomSheet()
  const theme = useColorScheme()

  const isDark = theme === 'dark'
  const backgroundColor = isDark ? '#48484A' : '#E0E0E0'

  const prevTranslateY = useSharedValue(0)

  const panGesture = Gesture.Pan()
    .onStart(() => {
      prevTranslateY.value = translateY.value
    })
    .onUpdate((event) => {
      // We update the RELATIVE displacement
      const nextValue = event.translationY + prevTranslateY.value
      translateY.value = Math.max(0, nextValue)
    })
    .onEnd((event) => {
      const isFlickedDown = event.velocityY > 500

      if (isFlickedDown) {
        // Scroll super fast
        runOnJS(close)()
        return
      }

      const curTranslateY = translateY.value

      // Snap translate ys always have at least one value (0 = fully open)
      // Snap translate ys are sorted in descending order (largest value = closest to fully closed)
      const snaps = snapTranslateYs.value

      let closestSnap = snaps[0]!
      let minDistance = Math.abs(curTranslateY - snaps[0]!)

      for (let i = 1; i < snaps.length; i++) {
        const curSnap = snaps[i]!
        const distance = Math.abs(curTranslateY - curSnap)

        if (distance < minDistance) {
          minDistance = distance
          closestSnap = curSnap
        }
      }

      const maxSnap = snaps[0]!
      const maxSnapPlusHalf = maxSnap + (sheetHeight.value - maxSnap) * 0.5

      if (curTranslateY > maxSnapPlusHalf) {
        // If the bottom sheet is close to closed position, snap more than halfway
        runOnJS(close)()
      } else {
        // Snap back to rest state
        translateY.value = withSpring(closestSnap, {
          velocity: event.velocityY,
        })
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
