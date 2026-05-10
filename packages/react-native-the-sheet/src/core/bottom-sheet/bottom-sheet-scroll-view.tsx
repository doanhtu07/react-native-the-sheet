import Animated, {
  runOnJS,
  scrollTo,
  useAnimatedReaction,
  useAnimatedStyle,
  type AnimatedRef,
} from 'react-native-reanimated'
import type { BottomSheetScrollViewProps } from './types'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import { StyleSheet } from 'react-native'
import { useMemo } from 'react'
import { useBottomSheetScrollViewUtils } from './hooks/use-bottom-sheet-scroll-view-utils'
import { useBottomSheetPanGesture } from './hooks/use-bottom-sheet-pan-gesture'
import { useBottomSheet } from './bottom-sheet-provider'
import { useToSharedValue } from '../hooks/use-to-shared-value'

export function BottomSheetScrollView({
  fill: propFill = false,
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

  children,
  ...rest
}: Readonly<BottomSheetScrollViewProps>) {
  const { scrollViewRef, scrollY, lockedScrollY, isScrollLocked } =
    useBottomSheet()

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
      <Animated.ScrollView
        {...rest}
        ref={scrollViewRef as AnimatedRef<Animated.ScrollView>}
        style={[styles.root, style, animatedStyle]}
        contentContainerStyle={contentContainerStyle}
        bounces={false} // iOS bounce ruins the scrollY <= 0 check
        onLayout={onLayout}
        onContentSizeChange={onContentSizeChange}
        onScroll={onScroll}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {children}
      </Animated.ScrollView>
    </GestureDetector>
  )
}

// MARK: Styles

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  root: {},
})
