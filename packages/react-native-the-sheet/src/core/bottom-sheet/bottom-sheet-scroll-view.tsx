import Animated, { type AnimatedRef } from 'react-native-reanimated'
import type { BottomSheetScrollViewProps } from './types'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import { StyleSheet } from 'react-native'
import { useMemo } from 'react'
import { useBottomSheetScrollViewUtils } from './hooks/use-bottom-sheet-scroll-view-utils'
import { useBottomSheetPanGesture } from './hooks/use-bottom-sheet-pan-gesture'
import { useBottomSheet } from './bottom-sheet-provider'

export function BottomSheetScrollView({
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

  children,
  ...rest
}: Readonly<BottomSheetScrollViewProps>) {
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
      <Animated.ScrollView
        {...rest}
        ref={scrollViewRef as AnimatedRef<Animated.ScrollView>}
        style={[styles.root, fill && styles.fill, style]}
        contentContainerStyle={contentContainerStyle}
        bounces={false} // iOS bounce ruins the scrollY <= 0 check
        onLayout={onLayout}
        onScroll={onScroll}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {children}
      </Animated.ScrollView>
    </GestureDetector>
  )
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  root: {},
})
