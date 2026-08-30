import Animated, {
  useAnimatedStyle,
  type AnimatedProps,
} from 'react-native-reanimated'
import type { BottomSheetVirtualizedListProps } from './types'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import {
  StyleSheet,
  VirtualizedList,
  type VirtualizedListProps,
} from 'react-native'
import {
  forwardRef,
  useCallback,
  useId,
  useMemo,
  useRef,
  type Ref,
} from 'react'
import { useBottomSheetScrollViewUtils } from './hooks/use-bottom-sheet-scroll-view-utils'
import { useBottomSheetPanGesture } from './hooks/use-bottom-sheet-pan-gesture'
import { useToSharedValue } from '../hooks/use-to-shared-value'
import { runOnJS } from 'react-native-worklets'
import type { AnimatedComponentType } from 'react-native-reanimated/lib/typescript/createAnimatedComponent'
import {
  useBottomSheetClaimScrollViewRef,
  useBottomSheetLockScroll,
  useBottomSheetCleanupScrollViewMetadata,
} from './hooks'

export const AnimatedVirtualizedList = Animated.createAnimatedComponent(
  VirtualizedList as any,
) as AnimatedComponentType<Readonly<VirtualizedListProps>, any>

function BottomSheetVirtualizedListInner(
  {
    fill: propFill = false,
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

    style,
    contentContainerStyle,

    ...rest
  }: Readonly<BottomSheetVirtualizedListProps>,

  ref: Ref<any>,
) {
  const id = useId()
  const nativeRef = useRef<any>(null)
  const isActive = useToSharedValue(propIsActive)

  const getPanGesture = useBottomSheetPanGesture()

  const fill = useToSharedValue(propFill)

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
    onScroll: propOnScroll,
    onBeginDrag: propOnBeginDrag,
    onEndDrag: propOnEndDrag,
    onMomentumBegin: propOnMomentumBegin,
    onMomentumEnd: propOnMomentumEnd,
  })

  const panGesture = useMemo(() => {
    const corePanGesture = propGetPanGesture?.() || getPanGesture()

    return corePanGesture.onFinalize(() => {
      'worklet'
      runOnJS(unsetScrollViewInteracting)()
    })
  }, [getPanGesture, propGetPanGesture, unsetScrollViewInteracting])

  // Callback ref: store node locally + forward to consumer
  const callbackRef = useCallback(
    (node: any) => {
      nativeRef.current = node
      if (typeof ref === 'function') ref(node)
      else if (ref) ref.current = node
    },
    [ref],
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

  // MARK: Preparation

  const animatedStyle = useAnimatedStyle(() => {
    return {
      ...(fill.value ? styles.fill : undefined),
    }
  })

  // MARK: Renderers

  return (
    <GestureDetector
      gesture={Gesture.Simultaneous(panGesture, Gesture.Native())}
    >
      <AnimatedVirtualizedList
        {...(rest as AnimatedProps<VirtualizedListProps>)}
        ref={callbackRef}
        style={[styles.root, style, animatedStyle]}
        contentContainerStyle={contentContainerStyle}
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

export const BottomSheetVirtualizedList = forwardRef(
  BottomSheetVirtualizedListInner,
) as (
  props: BottomSheetVirtualizedListProps & { ref?: Ref<any> },
) => ReturnType<typeof BottomSheetVirtualizedListInner>

// MARK: Styles

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  root: {},
})
