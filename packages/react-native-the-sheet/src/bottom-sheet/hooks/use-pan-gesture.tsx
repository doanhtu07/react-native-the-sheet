import { useMemo, useRef } from 'react'
import { Gesture } from 'react-native-gesture-handler'
import {
  scrollTo,
  useAnimatedReaction,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated'
import { runOnJS } from 'react-native-worklets'
import { useSyncedRef } from '../../hooks/use-synced-ref'
import { useSheetStackItem } from '../../sheet-stack'
import type { BottomSheetContextType } from '../types'

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
export const usePanGesture = (
  props: Omit<BottomSheetContextType, 'panGesture'>,
) => {
  const {
    sheetHeight,
    snapTranslateYs,
    translateY,
    scrollViewRef,
    isScrollViewReady,
    isTouchingScrollView,
    scrollY,
  } = props

  const { close } = useSheetStackItem()
  const closeRef = useSyncedRef(close)

  const isGestureActive = useSharedValue(false)

  const snapshotTranslateY = useSharedValue(0)
  const lastTranslationY = useSharedValue(0)

  const lockedScrollY = useSharedValue(0)
  const isScrollLocked = useSharedValue(false)

  const moveSheetIncrementalRef = useRef((deltaY: number) => {
    'worklet'
    let nextValue = translateY.value + deltaY
    translateY.value = Math.max(0, nextValue)
  })

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

  const panGesture = useMemo(() => {
    // Snapshot refs for worklet
    const closeRefCurrent = closeRef.current
    const moveSheetIncrementalRefCurrent = moveSheetIncrementalRef.current
    const lockScrollRefCurrent = lockScrollRef.current
    const unlockScrollRefCurrent = unlockScrollRef.current
    const cleanupGestureRefCurrent = cleanupGestureRef.current

    return Gesture.Pan()
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

        const isSheetAtRest = translateY.value <= 0
        const isScrollAtTop = scrollY.value <= 0

        if (
          !isSheetAtRest ||
          !isTouchingScrollView.value ||
          (isScrollAtTop && deltaY > 0)
        ) {
          lockScrollRefCurrent()
          moveSheetIncrementalRefCurrent(deltaY)
        } else {
          unlockScrollRefCurrent()
        }
      })
      .onEnd((event) => {
        'worklet'

        const isAtScrollTop = scrollY.value <= 0
        const isFlickedDown = event.velocityY > 500

        if (isFlickedDown && isAtScrollTop) {
          // Scroll super fast
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
        } else {
          // Snap back to rest state
          translateY.value = withSpring(closestSnap, {
            velocity: event.velocityY,
          })
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
    isTouchingScrollView,
    snapTranslateYs,
    sheetHeight,
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

      const isSheetAtRest = prepared.translateY <= 0

      if (isSheetAtRest) {
        unlockScroll()
      } else {
        lockScroll()
      }
    },
  )

  return panGesture
}
