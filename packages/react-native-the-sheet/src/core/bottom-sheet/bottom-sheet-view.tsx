import Animated from 'react-native-reanimated'
import type { BottomSheetViewProps } from './types'
import { GestureDetector } from 'react-native-gesture-handler'
import { StyleSheet } from 'react-native'
import { useMemo } from 'react'
import { useBottomSheetPanGesture } from './hooks/use-bottom-sheet-pan-gesture'

export function BottomSheetView({
  fill,
  styles: propStyles,
  children,
}: Readonly<BottomSheetViewProps>) {
  const getPanGesture = useBottomSheetPanGesture()

  const panGesture = useMemo(() => {
    return getPanGesture()
  }, [getPanGesture])

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
  fill: {
    flex: 1,
  },
  root: {},
})
