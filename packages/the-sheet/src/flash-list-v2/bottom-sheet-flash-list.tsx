import Animated, {
  useAnimatedReaction,
  useAnimatedStyle,
  type AnimatedProps,
  scrollTo,
  runOnJS,
} from 'react-native-reanimated'
import { StyleSheet } from 'react-native'
import { useToSharedValue } from '../core/hooks'
import { type FlashListProps, FlashList } from 'flash-list-v2'
import type { BottomSheetFlashListProps } from './types'
import {
  useBottomSheet,
  useBottomSheetPanGesture,
  useBottomSheetScrollViewUtils,
} from '../core/bottom-sheet'
import { useMemo } from 'react'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'

export const AnimatedFlashList = Animated.createAnimatedComponent(FlashList)

export function BottomSheetFlashList<T>({
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

  ...rest
}: Readonly<BottomSheetFlashListProps<T>>) {
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
    <Animated.View style={[styles.root, style, animatedStyle]}>
      <GestureDetector
        gesture={Gesture.Simultaneous(panGesture, Gesture.Native())}
      >
        <AnimatedFlashList
          {...(rest as AnimatedProps<FlashListProps<unknown>>)}
          ref={scrollViewRef}
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

// MARK: Styles

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  root: {},
})
