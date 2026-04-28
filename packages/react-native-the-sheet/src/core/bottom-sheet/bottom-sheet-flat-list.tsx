import Animated, { type AnimatedRef } from 'react-native-reanimated'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import type { BottomSheetFlatListProps } from './types'
import { StyleSheet } from 'react-native'
import { useMemo } from 'react'
import { useBottomSheetScrollViewUtils } from './hooks/use-bottom-sheet-scroll-view-utils'
import { useBottomSheetPanGesture } from './hooks/use-bottom-sheet-pan-gesture'
import { useBottomSheet } from './bottom-sheet-provider'

export function BottomSheetFlatList<T>({
  fill,

  onLayout: propOnLayout,
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

  const panGesture = useMemo(() => {
    return getPanGesture()
  }, [getPanGesture])

  const { onLayout, onTouchStart, onTouchEnd, onScroll } =
    useBottomSheetScrollViewUtils({
      onLayout: propOnLayout,
      onTouchStart: propOnTouchStart,
      onTouchEnd: propOnTouchEnd,
      onScroll: propOnScroll,
      onBeginDrag: propOnBeginDrag,
      onEndDrag: propOnEndDrag,
      onMomentumBegin: propOnMomentumBegin,
      onMomentumEnd: propOnMomentumEnd,
    })

  return (
    <GestureDetector
      gesture={Gesture.Simultaneous(panGesture, Gesture.Native())}
    >
      <Animated.FlatList
        {...rest}
        ref={scrollViewRef as AnimatedRef<Animated.FlatList>}
        style={[styles.root, fill && styles.fill, style]}
        contentContainerStyle={contentContainerStyle}
        bounces={false} // iOS bounce ruins the scrollY <= 0 check
        onLayout={onLayout}
        onScroll={onScroll}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      />
    </GestureDetector>
  )
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  root: {},
})
