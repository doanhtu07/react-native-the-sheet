import { Gesture } from 'react-native-gesture-handler'
import { useSheetStackItem } from '../../sheet-stack'
import { useBottomSheet } from '../bottom-sheet'
import { useSharedValue, withSpring } from 'react-native-reanimated'
import { runOnJS } from 'react-native-worklets'

export const usePanGesture = () => {
  const { close } = useSheetStackItem()
  const { sheetHeight, snapTranslateYs, translateY } = useBottomSheet()

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

  return panGesture
}
