import Animated, { type AnimatedRef } from 'react-native-reanimated'
import { useBottomSheet } from './bottom-sheet'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import type { BottomSheetFlatListProps } from './types'
import { StyleSheet } from 'react-native'
import { useMemo } from 'react'
import { useScrollViewUtils } from './hooks/use-scroll-view-utils'

export function BottomSheetFlatList<T>({
  onLayout: propOnLayout,
  onTouchStart: propOnTouchStart,
  onTouchEnd: propOnTouchEnd,
  fill,
  styles: propStyles,
  ...rest
}: Readonly<BottomSheetFlatListProps<T>>) {
  const { scrollViewRef, getPanGesture } = useBottomSheet()

  const panGesture = useMemo(() => {
    return getPanGesture()
  }, [getPanGesture])

  const { onLayout, onTouchStart, onTouchEnd, onScroll } = useScrollViewUtils({
    onLayout: propOnLayout,
    onTouchStart: propOnTouchStart,
    onTouchEnd: propOnTouchEnd,
  })

  return (
    <GestureDetector
      gesture={Gesture.Simultaneous(panGesture, Gesture.Native())}
    >
      <Animated.FlatList
        {...rest}
        ref={scrollViewRef as AnimatedRef<Animated.FlatList<unknown>>}
        style={[styles.root, fill && styles.fill, propStyles?.root]}
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
