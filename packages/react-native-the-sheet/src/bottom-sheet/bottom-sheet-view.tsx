import Animated from 'react-native-reanimated'
import type { BottomSheetViewProps } from './types'
import { GestureDetector } from 'react-native-gesture-handler'
import { usePanGesture } from './hooks/use-pan-gesture'

export function BottomSheetView({
  styles: propStyles,
  children,
}: Readonly<BottomSheetViewProps>) {
  const panGesture = usePanGesture()

  // MARK: Renderers

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={propStyles?.root}>{children}</Animated.View>
    </GestureDetector>
  )
}
