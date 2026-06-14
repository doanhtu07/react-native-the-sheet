import Animated, {
  runOnJS,
  scrollTo,
  useAnimatedReaction,
  type ScrollHandler,
} from 'react-native-reanimated'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import { useMemo } from 'react'
import {
  useBottomSheet,
  useBottomSheetPanGesture,
  useBottomSheetScrollViewUtils,
} from '@the-sheet/the-sheet'
import type { BottomSheetFlashListScrollComponentProps } from './types'

export function BottomSheetFlashListScrollComponent({
  getPanGesture: propGetPanGesture,

  onLayout: propOnLayout,
  onContentSizeChange: propOnContentSizeChange,
  onTouchStart: propOnTouchStart,
  onTouchEnd: propOnTouchEnd,

  onScroll: propOnScroll,
  onBeginDrag: propOnBeginDrag,
  onEndDrag: propOnEndDrag,
  onMomentumBegin: propOnMomentumBegin,
  onMomentumEnd: propOnMomentumEnd,

  flashListOnScroll,
  flashListOnBeginDrag,
  flashListOnEndDrag,
  flashListOnMomentumBegin,
  flashListOnMomentumEnd,

  ...rest
}: Readonly<BottomSheetFlashListScrollComponentProps>) {
  const { scrollViewRef, scrollY, lockedScrollY, isScrollLocked } =
    useBottomSheet()

  const getPanGesture = useBottomSheetPanGesture()

  const propOnScrollWrapper: ScrollHandler = (event, ctx) => {
    'worklet'
    propOnScroll?.(event, ctx)
    if (flashListOnScroll)
      runOnJS(flashListOnScroll)({ nativeEvent: event } as any)
  }

  const propOnBeginDragWrapper: ScrollHandler = (event, ctx) => {
    'worklet'
    propOnBeginDrag?.(event, ctx)
    if (flashListOnBeginDrag)
      runOnJS(flashListOnBeginDrag)({ nativeEvent: event } as any)
  }

  const propOnEndDragWrapper: ScrollHandler = (event, ctx) => {
    'worklet'
    propOnEndDrag?.(event, ctx)
    if (flashListOnEndDrag)
      runOnJS(flashListOnEndDrag)({ nativeEvent: event } as any)
  }

  const propOnMomentumBeginWrapper: ScrollHandler = (event, ctx) => {
    'worklet'
    propOnMomentumBegin?.(event, ctx)
    if (flashListOnMomentumBegin)
      runOnJS(flashListOnMomentumBegin)({ nativeEvent: event } as any)
  }

  const propOnMomentumEndWrapper: ScrollHandler = (event, ctx) => {
    'worklet'
    propOnMomentumEnd?.(event, ctx)
    if (flashListOnMomentumEnd)
      runOnJS(flashListOnMomentumEnd)({ nativeEvent: event } as any)
  }

  const {
    unsetScrollViewInteracting,
    onLayout,
    onContentSizeChange,
    onTouchStart,
    onTouchEnd,
    onScroll,
  } = useBottomSheetScrollViewUtils({
    onLayout: propOnLayout,
    onContentSizeChange: propOnContentSizeChange,
    onTouchStart: propOnTouchStart,
    onTouchEnd: propOnTouchEnd,
    onScroll: propOnScrollWrapper,
    onBeginDrag: propOnBeginDragWrapper,
    onEndDrag: propOnEndDragWrapper,
    onMomentumBegin: propOnMomentumBeginWrapper,
    onMomentumEnd: propOnMomentumEndWrapper,
  })

  const panGesture = useMemo(() => {
    const corePanGesture = propGetPanGesture?.() || getPanGesture()

    return corePanGesture.onFinalize(() => {
      'worklet'
      runOnJS(unsetScrollViewInteracting)()
    })
  }, [getPanGesture, propGetPanGesture, unsetScrollViewInteracting])

  // MARK: Effects

  useAnimatedReaction(
    () => ({
      isScrollLocked: isScrollLocked.value,
      lockedScrollY: lockedScrollY.value,
      scrollY: scrollY.value,
    }),
    (prepared) => {
      // If we are locked but the current scroll doesn't match the target
      // might be due to momentum)
      // force it back immediately
      if (
        prepared.isScrollLocked &&
        prepared.scrollY !== prepared.lockedScrollY
      ) {
        scrollTo(scrollViewRef, 0, prepared.lockedScrollY, false)
      }
    },
  )

  // MARK: Renderers

  return (
    <GestureDetector
      gesture={Gesture.Simultaneous(panGesture, Gesture.Native())}
    >
      <Animated.ScrollView
        {...rest}
        ref={scrollViewRef}
        bounces={false} // iOS bounce ruins the scrollY <= 0 check
        onLayout={onLayout}
        onContentSizeChange={onContentSizeChange}
        onScroll={onScroll}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      />
    </GestureDetector>
  )
}
