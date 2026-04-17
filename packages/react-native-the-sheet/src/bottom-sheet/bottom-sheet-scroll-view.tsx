import Animated, { useAnimatedScrollHandler } from 'react-native-reanimated'
import type { BottomSheetScrollViewProps } from './types'
import { useBottomSheet } from './bottom-sheet'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'

export function BottomSheetScrollView({
  styles: propStyles,
  children,
}: Readonly<BottomSheetScrollViewProps>) {
  const { scrollViewRef, scrollY, isTouchingScrollView, panGesture } =
    useBottomSheet()

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y
    },
    onBeginDrag: () => {
      isTouchingScrollView.value = true
    },
    onEndDrag: () => {
      isTouchingScrollView.value = false
    },
  })

  return (
    <GestureDetector
      gesture={Gesture.Simultaneous(panGesture, Gesture.Native())}
    >
      <Animated.ScrollView
        ref={scrollViewRef}
        style={propStyles?.root}
        bounces={false} // iOS bounce ruins the scrollY <= 0 check
        onScroll={onScroll}
      >
        {children}
      </Animated.ScrollView>
    </GestureDetector>
  )
}
