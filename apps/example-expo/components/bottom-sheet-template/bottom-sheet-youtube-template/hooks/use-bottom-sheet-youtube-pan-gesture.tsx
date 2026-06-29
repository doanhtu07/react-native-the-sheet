import { useCallback } from 'react'
import { Gesture } from 'react-native-gesture-handler'
import { runOnJS, useSharedValue, withSpring } from 'react-native-reanimated'
import {
  FLICK_VELOCITY_THRESHOLD,
  isApproxEqual,
  MICRO_FLICK_VELOCITY_THRESHOLD,
  SCROLL_Y_TOP_THRESHOLD,
  SPRING_CONFIG,
  TRANSLATE_Y_REST_THRESHOLD,
  useBottomSheetRegistryDangerously,
  useSyncedRef,
} from '@the-sheet/the-sheet'

type Props = {
  close: () => void
  sheetId: string
}

export const useBottomSheetYoutubePanGesture = ({ close, sheetId }: Props) => {
  const bottomSheetRegistry = useBottomSheetRegistryDangerously()
  const sheets = bottomSheetRegistry?.sheets

  const commentSheet = sheets?.[sheetId] || {}
  const isCommentSheetAvailable = !!sheets?.[sheetId]

  const {
    enableFloat,
    enableOverdrag,
    disableDrag,
    sheetHeight,
    snapTranslateYs,
    translateY,
    isTranslateYAnimating,
    isScrollViewInteracting,
    scrollY,
    scrollViewHeight,
    scrollViewContentHeight,
    isPanGestureActive,
  } = commentSheet

  const closeRef = useSyncedRef(close)

  const snapshotTranslateY = useSharedValue(0)
  const lastTranslationY = useSharedValue(0)

  const cleanupGesture = () => {
    'worklet'

    if (!isCommentSheetAvailable) {
      return
    }

    isPanGestureActive.value = false
  }

  const cleanupGestureRef = useSyncedRef(cleanupGesture)

  // MARK: Pan gesture

  const getPanGesture = useCallback(() => {
    // Snapshot refs for worklet
    const closeRefCurrent = closeRef.current
    const cleanupGestureRefCurrent = cleanupGestureRef.current

    if (!isCommentSheetAvailable) {
      return Gesture.Pan()
    }

    return Gesture.Pan()
      .maxPointers(1)
      .onStart(() => {
        'worklet'

        isPanGestureActive.value = true

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

        const isScrollAtBottom =
          scrollY.value >=
          scrollViewContentHeight.value - scrollViewHeight.value

        // If we are moving UP fast (velocityY < -MICRO_FLICK_VELOCITY_THRESHOLD)
        // and we are already at or above the rest point,
        // FORCE translateY to 0 and let the ScrollView handle everything
        if (
          event.velocityY < -MICRO_FLICK_VELOCITY_THRESHOLD &&
          isScrollViewInteracting.value &&
          isSheetAtRest
        ) {
          translateY.value = 0
          return
        }

        const isSheetLowerThanFirstSnap =
          translateY.value > snapTranslateYs.value[0]!

        const noScrollMode =
          !isScrollViewInteracting.value &&
          (!isSheetAtRest || enableOverdrag.value)

        const scrollMode =
          isScrollViewInteracting.value &&
          ((isScrollAtTop && deltaY > 0) || // If scroll view at top and we are panning down to close
            (isScrollAtTop && deltaY <= 0 && isSheetLowerThanFirstSnap) || // If scroll view is at top and we are panning up to open (lower than first snap)
            (isScrollAtTop && isScrollAtBottom)) // If scroll view is both at top and bottom (content smaller than scroll view)

        if (!disableDrag.value && (noScrollMode || scrollMode)) {
          let nextValue = translateY.value + deltaY

          // If we ARE scrolling, prevent the sheet from going into the overdrag zone
          if (isScrollViewInteracting.value && nextValue < 0) {
            nextValue = 0
          }

          translateY.value = enableOverdrag.value
            ? nextValue
            : Math.max(0, nextValue) // Prevent overdrag if enableOverdrag is disabled
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

        // If the bottom sheet is close to closed position, snap more than halfway
        if (curTranslateY > maxSnapPlusHalf) {
          runOnJS(closeRefCurrent)()
          return
        }

        // Snap back to rest state
        if (!enableFloat.value) {
          isTranslateYAnimating.value = true

          translateY.value = withSpring(
            closestSnap,
            SPRING_CONFIG,
            (finished) => {
              if (finished) {
                isTranslateYAnimating.value = false
              }
            },
          )
        }

        // Cleanup
        cleanupGestureRefCurrent()
      })
  }, [
    closeRef,
    cleanupGestureRef,
    isCommentSheetAvailable,
    isPanGestureActive,
    snapshotTranslateY,
    translateY,
    lastTranslationY,
    scrollY,
    scrollViewContentHeight,
    scrollViewHeight,
    isScrollViewInteracting,
    snapTranslateYs,
    enableOverdrag,
    disableDrag,
    sheetHeight,
    enableFloat,
    isTranslateYAnimating,
  ])

  return getPanGesture
}
