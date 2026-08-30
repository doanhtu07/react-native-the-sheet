import Animated, {
  useAnimatedStyle,
  type AnimatedProps,
} from 'react-native-reanimated'
import { runOnJS } from 'react-native-worklets'
import { StyleSheet } from 'react-native'
import {
  useToSharedValue,
  useBottomSheetPanGesture,
  useBottomSheetScrollViewUtils,
  useBottomSheetLockScroll,
  useBottomSheetCleanupScrollViewMetadata,
  useBottomSheetClaimScrollViewRef,
} from '@the-sheet/the-sheet'
import {
  type FlashListProps,
  type FlashListRef,
  FlashList,
} from '@shopify/flash-list'
import type { BottomSheetFlashListProps } from './types'
import {
  forwardRef,
  useCallback,
  useId,
  useMemo,
  useRef,
  type Ref,
} from 'react'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'

export const AnimatedFlashList = Animated.createAnimatedComponent(FlashList)

function BottomSheetFlashListInner<T>(
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
  }: Readonly<BottomSheetFlashListProps<T>>,

  ref: Ref<FlashListRef<T>>,
) {
  const id = useId()
  const nativeRef = useRef<FlashListRef<T> | null>(null)
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
    (node: FlashListRef<T> | null) => {
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
    <Animated.View style={[styles.root, style, animatedStyle]}>
      <GestureDetector
        gesture={Gesture.Simultaneous(panGesture, Gesture.Native())}
      >
        <AnimatedFlashList
          {...(rest as AnimatedProps<FlashListProps<unknown>>)}
          ref={callbackRef as Ref<FlashListRef<unknown>>}
          contentContainerStyle={contentContainerStyle}
          bounces={false} // iOS bounce ruins the scrollY <= 0 check
          onLayout={onLayout}
          onContentSizeChange={onContentSizeChange}
          onScroll={onScroll}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        />
      </GestureDetector>
    </Animated.View>
  )
}

export const BottomSheetFlashList = forwardRef(BottomSheetFlashListInner) as <
  T,
>(
  props: BottomSheetFlashListProps<T> & { ref?: Ref<FlashListRef<T>> },
) => ReturnType<typeof BottomSheetFlashListInner>

// MARK: Styles

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  root: {},
})
