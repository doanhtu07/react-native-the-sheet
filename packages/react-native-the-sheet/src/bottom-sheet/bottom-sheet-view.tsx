import Animated from 'react-native-reanimated'
import type { BottomSheetViewProps } from './types'
import { GestureDetector } from 'react-native-gesture-handler'
import { useBottomSheet } from './bottom-sheet'
import { StyleSheet } from 'react-native'

export function BottomSheetView({
  fill,
  styles: propStyles,
  children,
}: Readonly<BottomSheetViewProps>) {
  const { panGesture } = useBottomSheet()

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View
        style={[styles.root, fill && styles.fill, propStyles?.root]}
      >
        {children}
      </Animated.View>
    </GestureDetector>
  )
}

const styles = StyleSheet.create({
  root: {},
  fill: {
    flex: 1,
  },
})
