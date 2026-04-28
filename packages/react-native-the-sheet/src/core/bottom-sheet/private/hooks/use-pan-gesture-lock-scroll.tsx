import { scrollTo, useAnimatedReaction } from 'react-native-reanimated'
import { isApproxEqual } from '../../../../private/utils/approximately-equal'
import { TRANSLATE_Y_REST_THRESHOLD } from '../constants'
import { useBottomSheet } from '../../bottom-sheet-provider'

export const usePanGestureLockScroll = () => {
  const {
    translateY,
    scrollViewRef,
    isScrollViewReady,
    scrollY,
    isPanGestureActive,
    lockedScrollY,
    isScrollLocked,
  } = useBottomSheet()

  const lockScroll = () => {
    'worklet'

    if (isScrollViewReady.value) {
      if (!isScrollLocked.value) {
        lockedScrollY.value = scrollY.value
        isScrollLocked.value = true
      }

      scrollTo(scrollViewRef, 0, lockedScrollY.value, false)
    }
  }

  const unlockScroll = () => {
    'worklet'
    isScrollLocked.value = false
  }

  // MARK: Effects

  // Effect: Lock scroll more aggressively when sheet is not at rest
  useAnimatedReaction(
    () => {
      return {
        translateY: translateY.value,
      }
    },
    (prepared) => {
      'worklet'

      // If gesture is active, we already handle scroll locking
      if (isPanGestureActive.value) {
        return
      }

      const isSheetAtRest = isApproxEqual(
        prepared.translateY,
        0,
        TRANSLATE_Y_REST_THRESHOLD,
      )

      if (isSheetAtRest) {
        unlockScroll()
      } else {
        lockScroll()
      }
    },
  )
}
