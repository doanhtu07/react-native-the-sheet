import Animated, {
  useAnimatedScrollHandler,
  type AnimatedRef,
} from 'react-native-reanimated'
import { useBottomSheet } from './bottom-sheet'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import type { BottomSheetFlatListProps } from './types'

export function BottomSheetFlatList<T>({
  styles: propStyles,
  ...rest
}: Readonly<BottomSheetFlatListProps<T>>) {
  const { scrollViewRef, scrollY, isTouchingScrollView, panGesture } =
    useBottomSheet()

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
        style={propStyles?.root}
        bounces={false} // iOS bounce ruins the scrollY <= 0 check
        onScroll={onScroll}
      />
    </GestureDetector>
  )
}
