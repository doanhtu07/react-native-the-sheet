import Animated, {
  useAnimatedStyle,
  type AnimatedRef,
} from 'react-native-reanimated'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import type { BottomSheetFlatListProps } from './types'
import { StyleSheet } from 'react-native'
import { useMemo } from 'react'
import { useBottomSheetScrollViewUtils } from './hooks/use-bottom-sheet-scroll-view-utils'
import { useBottomSheetPanGesture } from './hooks/use-bottom-sheet-pan-gesture'
import { useBottomSheet } from './bottom-sheet-provider'
import { useToSharedValue } from '../hooks/use-to-shared-value'

export function BottomSheetFlatList<T>({
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
}: Readonly<BottomSheetFlatListProps<T>>) {
  const { scrollViewRef } = useBottomSheet()

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
      unsetScrollViewInteracting()
    })
  }, [getPanGesture, propGetPanGesture, unsetScrollViewInteracting])

  const animatedStyle = useAnimatedStyle(() => {
    return {
      ...(fill.value ? styles.fill : undefined),
    }
  })

  return (
    <GestureDetector
      gesture={Gesture.Simultaneous(panGesture, Gesture.Native())}
    >
      <Animated.FlatList
        {...rest}
        ref={scrollViewRef as AnimatedRef<Animated.FlatList>}
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

// MARK: Styles

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  root: {},
})
