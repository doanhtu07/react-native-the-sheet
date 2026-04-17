import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated'
import type { BottomSheetScrollViewProps } from './types'
import { useBottomSheet } from './bottom-sheet'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'

export function BottomSheetScrollView({
  styles: propStyles,
  children,
}: Readonly<BottomSheetScrollViewProps>) {
  const { translateY } = useBottomSheet()

  const scrollY = useSharedValue(0)
  const prevTranslateY = useSharedValue(0)

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y
    },
  })

  const panGesture = Gesture.Pan()
    .onStart(() => {
      // Save the starting translateY
      prevTranslateY.value = translateY.value
    })
    .onUpdate((event) => {
      const { translationY } = event

      // CASE A: The sheet is already dragged down (translateY > 0)
      // We want to "rescue" the sheet back to 0 before scrolling.
      if (translateY.value > 0 || (scrollY.value <= 0 && translationY > 0)) {
        const nextValue = prevTranslateY.value + translationY

        // Strict limit: Don't go negative
        translateY.value = Math.max(0, nextValue)
      }

      // If translateY is > 0, we effectively "absorb" the gesture
      // so the ScrollView doesn't move.
    })
    .onEnd((_event) => {
      // Use your existing Snapping Logic
      // if (translateY.value > sheetHeight.value * 0.5 || event.velocityY > 500) {
      //   translateY.value = withSpring(
      //     sheetHeight.value,
      //     { velocity: event.velocityY },
      //     (finished) => {
      //       if (finished) runOnJS(onRequestClose)()
      //     },
      //   )
      // } else {
      //   translateY.value = withSpring(0, { velocity: event.velocityY })
      // }
    })

  // MARK: Renderers

  return (
    <GestureDetector
      gesture={Gesture.Simultaneous(panGesture, Gesture.Native())}
    >
      <Animated.ScrollView
        style={propStyles?.root}
        onScroll={onScroll}
        bounces={false} // iOS bounce ruins the scrollY <= 0 check
      >
        {children}
      </Animated.ScrollView>
    </GestureDetector>
  )
}
