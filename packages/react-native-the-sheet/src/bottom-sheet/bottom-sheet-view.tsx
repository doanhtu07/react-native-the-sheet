import Animated from 'react-native-reanimated'
import type { BottomSheetViewProps } from './types'
import { GestureDetector } from 'react-native-gesture-handler'
import { useBottomSheet } from './bottom-sheet'

export function BottomSheetView({
  styles: propStyles,
  children,
}: Readonly<BottomSheetViewProps>) {
  const { panGesture } = useBottomSheet()

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={propStyles?.root}>{children}</Animated.View>
    </GestureDetector>
  )
}
