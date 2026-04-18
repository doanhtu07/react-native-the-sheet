import Animated, {
  useAnimatedScrollHandler,
  type AnimatedRef,
} from 'react-native-reanimated'
import { useBottomSheet } from './bottom-sheet'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import type { BottomSheetFlatListProps } from './types'
import { StyleSheet, type LayoutChangeEvent } from 'react-native'

export function BottomSheetFlatList<T>({
  onLayout: propOnLayout,
  fill,
  styles: propStyles,
  ...rest
}: Readonly<BottomSheetFlatListProps<T>>) {
  const {
    scrollViewRef,
    isScrollViewReady,
    isTouchingScrollView,
    scrollY,
    panGesture,
  } = useBottomSheet()

  const onLayout = (event: LayoutChangeEvent) => {
    'worklet'

    if (propOnLayout) {
      const resolvedOnLayout =
        typeof propOnLayout === 'function' ? propOnLayout : propOnLayout.value

      resolvedOnLayout?.(event)
    }

    isScrollViewReady.value = true
  }

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      'worklet'
      scrollY.value = event.contentOffset.y
    },
    onBeginDrag: () => {
      'worklet'
      isTouchingScrollView.value = true
    },
    onEndDrag: () => {
      'worklet'
      isTouchingScrollView.value = false
    },
  })

  return (
    <GestureDetector
      gesture={Gesture.Simultaneous(panGesture, Gesture.Native())}
    >
      <Animated.FlatList
        {...rest}
        ref={scrollViewRef as AnimatedRef<Animated.FlatList>}
        style={[styles.root, fill && styles.fill, propStyles?.root]}
        bounces={false} // iOS bounce ruins the scrollY <= 0 check
        onLayout={onLayout}
        onScroll={onScroll}
      />
    </GestureDetector>
  )
}

const styles = StyleSheet.create({
  root: {},
  fill: {
    flex: 1,
  },
})
