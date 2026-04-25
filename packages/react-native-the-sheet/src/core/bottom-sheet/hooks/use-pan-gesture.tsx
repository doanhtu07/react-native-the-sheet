import { useCallback } from 'react'
import { Gesture } from 'react-native-gesture-handler'
import {
  runOnJS,
  scrollTo,
  useAnimatedReaction,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated'
import { useSyncedRef } from '../../../private/hooks/use-synced-ref'
import { useSheetStackItem } from '../../sheet-stack'
import type { BottomSheetContextType } from '../types'
import { useBridgedValue } from '../../../private/hooks/use-bridged-value'
import { isApproxEqual } from '../../../private/utils/approximately-equal'
import { SPRING_CONFIG } from '../../../private/constants'

const TRANSLATE_Y_REST_THRESHOLD = 1
const SCROLL_Y_TOP_THRESHOLD = 1
const MICRO_FLICK_VELOCITY_THRESHOLD = 100
const FLICK_VELOCITY_THRESHOLD = 500

type Props = {
  excludePanGestureContext: Omit<BottomSheetContextType, 'getPanGesture'>
  enableFloat: boolean
  disableDrag: boolean
}

/**
  # Mental model

  Two explicit exclusive modes:

  - Scrolling: Gesture starts on scroll view
  - Panning: Gesture starts outside scroll view

  ## Scrolling

  - Bottom sheet not at rest:
    - Lock scroll view
    - Move sheet

  - Bottom sheet at rest:
    - Pan down + Scroll at top: 
      - Lock scroll view
      - Move sheet
    - Else: Scroll

  ## Panning

  - Bottom sheet not at rest:
    - Lock scroll view
    - Move sheet

  - Bottom sheet at rest:
    - Lock scroll view
    - Move sheet
 */
export const usePanGesture = ({
  excludePanGestureContext,
  enableFloat: propEnableFloat,
  disableDrag: propDisableDrag,
}: Props) => {
  const {
    enableOverdrag: propEnableOverdrag,
    sheetHeight,
    snapTranslateYs,
    translateY,
    scrollViewRef,
    isScrollViewReady,
    isScrolling,
    scrollY,
  } = excludePanGestureContext

  const { close } = useSheetStackItem()
  const closeRef = useSyncedRef(close)

  const enableFloat = useBridgedValue(propEnableFloat)
  const enableOverdrag = useBridgedValue(propEnableOverdrag)
  const disableDrag = useBridgedValue(propDisableDrag)

  const isGestureActive = useSharedValue(false)

  const snapshotTranslateY = useSharedValue(0)
  const lastTranslationY = useSharedValue(0)

  const lockedScrollY = useSharedValue(0)
  const isScrollLocked = useSharedValue(false)

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
  const lockScrollRef = useSyncedRef(lockScroll)

  const unlockScroll = () => {
    'worklet'
    isScrollLocked.value = false
  }
  const unlockScrollRef = useSyncedRef(unlockScroll)

  const cleanupGesture = () => {
    'worklet'
    isGestureActive.value = false
    unlockScroll()
  }
  const cleanupGestureRef = useSyncedRef(cleanupGesture)

  // MARK: Pan gesture

  const getPanGesture = useCallback(() => {
    // Snapshot refs for worklet
    const closeRefCurrent = closeRef.current
    const lockScrollRefCurrent = lockScrollRef.current
    const unlockScrollRefCurrent = unlockScrollRef.current
    const cleanupGestureRefCurrent = cleanupGestureRef.current

    return Gesture.Pan()
      .maxPointers(1)
      .onStart(() => {
        'worklet'

        isGestureActive.value = true

        // Capture stuff at the moment pan gesture starts
        snapshotTranslateY.value = translateY.value

        lastTranslationY.value = 0
      })
      .onUpdate((event) => {
        'worklet'

        const deltaY = event.translationY - lastTranslationY.value
        lastTranslationY.value = event.translationY

        const isSheetAtRest = isApproxEqual(
          translateY.value,
          0,
          TRANSLATE_Y_REST_THRESHOLD,
        )

        const isScrollAtTop = scrollY.value <= SCROLL_Y_TOP_THRESHOLD

        // If we are moving UP fast (velocityY < -MICRO_FLICK_VELOCITY_THRESHOLD)
        // and we are already at or above the rest point,
        // FORCE translateY to 0 and let the ScrollView handle everything
        if (
          event.velocityY < -MICRO_FLICK_VELOCITY_THRESHOLD &&
          isScrolling.value > 0 &&
          isSheetAtRest
        ) {
          translateY.value = 0
          unlockScrollRefCurrent()
          return
        }

        if (
          !disableDrag.value &&
          (!isSheetAtRest || // Sheet not at rest
            isScrolling.value === 0 || // No scroll mode
            (isScrolling.value > 0 && isScrollAtTop && deltaY > 0)) // Scroll mode + Pan down
        ) {
          lockScrollRefCurrent()

          let nextValue = translateY.value + deltaY

          // If we ARE scrolling, prevent the sheet from going into the overdrag zone
          if (isScrolling.value > 0 && nextValue < 0) {
            nextValue = 0
          }

          translateY.value = enableOverdrag.value
            ? nextValue
            : Math.max(0, nextValue) // Prevent overdrag if enableOverdrag is disabled
        } else {
          unlockScrollRefCurrent()
        }
      })
      .onEnd((event) => {
        'worklet'

        const isAtScrollTop = scrollY.value <= SCROLL_Y_TOP_THRESHOLD
        const isFlickedDown = event.velocityY > FLICK_VELOCITY_THRESHOLD

        if (isFlickedDown && isAtScrollTop) {
          // Pan down super fast
          runOnJS(closeRefCurrent)()
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
          runOnJS(closeRefCurrent)()
        } else if (!enableFloat.value) {
          // Snap back to rest state
          translateY.value = withSpring(closestSnap, SPRING_CONFIG)
        }

        // Cleanup
        cleanupGestureRefCurrent()
      })
  }, [
    closeRef,
    lockScrollRef,
    unlockScrollRef,
    cleanupGestureRef,
    isGestureActive,
    snapshotTranslateY,
    translateY,
    lastTranslationY,
    scrollY,
    isScrolling,
    disableDrag,
    enableOverdrag,
    snapTranslateYs,
    sheetHeight,
    enableFloat,
  ])

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
      if (isGestureActive.value) {
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

  return getPanGesture
}
