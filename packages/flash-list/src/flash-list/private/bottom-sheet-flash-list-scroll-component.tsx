import Animated, { runOnJS, type ScrollHandler } from 'react-native-reanimated'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import { useCallback, useId, useMemo, useRef } from 'react'
import {
  useBottomSheetClaimScrollViewRef,
  useBottomSheetCleanupScrollViewMetadata,
  useBottomSheetLockScroll,
  useBottomSheetPanGesture,
  useBottomSheetScrollViewUtils,
  useToSharedValue,
} from '@the-sheet/the-sheet'
import type { BottomSheetFlashListScrollComponentProps } from './types'

export function BottomSheetFlashListScrollComponent({
  isActive: propIsActive = true,
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

  ref: flashListInternalRef,

  ...rest
}: Readonly<BottomSheetFlashListScrollComponentProps>) {
  const id = useId()
  const nativeRef = useRef<any>(null)
  const isActive = useToSharedValue(propIsActive)

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
    scrollViewId: id,
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

  // Callback ref: store node locally + forward FlashList's internal ref
  const callbackRef = useCallback(
    (node: any) => {
      nativeRef.current = node
      if (typeof flashListInternalRef === 'function') flashListInternalRef(node)
      else if (flashListInternalRef) flashListInternalRef.current = node
    },
    [flashListInternalRef],
  )

  // MARK: Effects

  // Effect: Clean up metadata when unmounting
  useBottomSheetCleanupScrollViewMetadata({ scrollViewId: id })

  // Effect: Claim scroll view ref
  useBottomSheetClaimScrollViewRef({
    scrollViewId: id,
    scrollViewNativeRef: nativeRef,
    isActive,
  })

  // Effect: Lock scrolling
  useBottomSheetLockScroll({ scrollViewId: id, isActive })

  // MARK: Renderers

  return (
    <GestureDetector
      gesture={Gesture.Simultaneous(panGesture, Gesture.Native())}
    >
      <Animated.ScrollView
        {...rest}
        ref={callbackRef}
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
