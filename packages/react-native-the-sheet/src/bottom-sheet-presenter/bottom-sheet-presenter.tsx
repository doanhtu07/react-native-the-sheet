import { useEffect, useRef } from 'react'
import { StyleSheet, useWindowDimensions } from 'react-native'
import type { BottomSheetPresenterProps } from './types'
import { useSheetStackItem } from '../sheet-stack'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated'
import { runOnJS } from 'react-native-worklets'

export function BottomSheetPresenter({
  styles: propStyles,
  testID,
  children,
}: Readonly<BottomSheetPresenterProps>) {
  const { isHidden, isCurrentlyInStack, onFullyExit } = useSheetStackItem()

  const { height: screenHeight } = useWindowDimensions()

  const onFullyExitRef = useRef(onFullyExit)
  onFullyExitRef.current = onFullyExit

  const allowPresent = isCurrentlyInStack && !isHidden

  /**
   * translateY = tracks the offset of the bottom sheet presenter from the bottom of the screen
   * - = 0: Bottom sheet presenter is fully visible
   * - > 0: Bottom sheet presenter is going below the bottom of the screen
   */
  const translateY = useSharedValue(screenHeight)

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    }
  })

  // MARK: Effects

  useEffect(() => {
    if (allowPresent) {
      translateY.value = screenHeight
    }

    // Snapshot refs for worklet
    const onFullyExitRefCurrent = onFullyExitRef.current

    translateY.value = withSpring(
      allowPresent ? 0 : screenHeight,
      {
        overshootClamping: true,
        damping: 20,
        stiffness: 200,
        mass: 1,
      },
      (finished) => {
        if (finished && !allowPresent) {
          runOnJS(onFullyExitRefCurrent)()
        }
      },
    )
  }, [allowPresent, screenHeight, translateY])

  // MARK: Renderers

  return (
    <Animated.View
      style={[
        styles.root,
        propStyles?.root,
        { height: screenHeight },
        animatedStyle,
      ]}
      testID={testID}
    >
      {children}
    </Animated.View>
  )
}

// MARK: Styles

const styles = StyleSheet.create({
  root: {
    width: '100%',
    justifyContent: 'flex-end',
    pointerEvents: 'box-none',
  },
})
