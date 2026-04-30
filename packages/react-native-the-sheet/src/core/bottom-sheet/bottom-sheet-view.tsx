import Animated, { useAnimatedStyle } from 'react-native-reanimated'
import type { BottomSheetViewProps } from './types'
import { GestureDetector } from 'react-native-gesture-handler'
import { StyleSheet } from 'react-native'
import { useMemo } from 'react'
import { useBottomSheetPanGesture } from './hooks/use-bottom-sheet-pan-gesture'
import { useToSharedValue } from '../private/hooks/use-to-shared-value'

export function BottomSheetView({
  fill: propFill = false,
  styles: propStyles,
  children,
}: Readonly<BottomSheetViewProps>) {
  const getPanGesture = useBottomSheetPanGesture()

  const fill = useToSharedValue(propFill)

  const panGesture = useMemo(() => {
    return getPanGesture()
  }, [getPanGesture])

  const animatedStyle = useAnimatedStyle(() => {
    return {
      ...(fill.value ? styles.fill : undefined),
    }
  })

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[styles.root, propStyles?.root, animatedStyle]}>
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
