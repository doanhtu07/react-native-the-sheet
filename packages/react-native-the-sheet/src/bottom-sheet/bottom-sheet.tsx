import {
  StyleSheet,
  useColorScheme,
  useWindowDimensions,
  type LayoutChangeEvent,
} from 'react-native'
import type { BottomSheetContextType, BottomSheetProps } from './types'
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated'
import { createContext, useContext, useMemo } from 'react'

const BottomSheetContext = createContext<BottomSheetContextType | undefined>(
  undefined,
)

export function BottomSheet({
  snapPoints,
  styles: propStyles,
  children,
}: Readonly<BottomSheetProps>) {
  const theme = useColorScheme()
  const { height: screenHeight } = useWindowDimensions()

  const isDark = theme === 'dark'
  const backgroundColor = isDark ? '#1C1C1E' : '#FFFFFF'

  const sheetHeight = useSharedValue(0)

  // Normalize snap points into numbers
  const staticNormalizedSnaps = useMemo(() => {
    if (!snapPoints || snapPoints.length === 0) return []

    return snapPoints
      .map((point) => {
        if (typeof point === 'number') return point
        const percentage = Number.parseFloat(point as string) / 100
        return screenHeight * percentage
      })
      .filter((point) => point > 0 && point <= screenHeight)
      .sort((a, b) => a - b)
  }, [screenHeight, snapPoints])

  // Add naturally grown sheet height to snap points if applicable
  const allSnapPoints = useDerivedValue(() => {
    if (
      sheetHeight.value === 0 ||
      staticNormalizedSnaps.includes(sheetHeight.value)
    ) {
      return staticNormalizedSnaps
    }

    const snaps = [...staticNormalizedSnaps, sheetHeight.value]
    return snaps.sort((a, b) => a - b)
  })

  // Convert snap points to translate ys (relative distance from fully open position)
  // Naturally, snapTranslateYs is sorted in descending order (largest value = closest to fully closed)
  const snapTranslateYs = useDerivedValue(() => {
    const snaps = allSnapPoints.value
    if (snaps.length === 0) return [0]

    // We have established snapPoints is not empty
    const maxSnapPoint = snaps.at(-1)!

    return snaps.map((point) => maxSnapPoint - point)
  })

  /**
   * translateY = tracks relative position of bottom sheet to its rest point
   * - = 0: Bottom sheet is fully visible inside bottom sheet presenter
   * - > 0: Bottom sheet is being dragged down from rest point
   * - < 0: Bottom sheet is being dragged up from rest point
   */
  const translateY = useSharedValue(snapTranslateYs.value[0]!)

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }))

  const onLayout = (event: LayoutChangeEvent) => {
    sheetHeight.value = event.nativeEvent.layout.height
  }

  // MARK: Bottom sheet context

  const contextValue = useMemo<BottomSheetContextType>(() => {
    return { sheetHeight, snapTranslateYs, translateY }
  }, [sheetHeight, snapTranslateYs, translateY])

  // MARK: Renderers

  return (
    <BottomSheetContext.Provider value={contextValue}>
      <Animated.View
        onLayout={onLayout}
        style={[
          styles.root,
          { backgroundColor },
          propStyles?.root,
          {
            height:
              staticNormalizedSnaps.length > 0
                ? staticNormalizedSnaps.at(-1)! // Force bottom sheet to have this height
                : undefined, // If no snap points, let bottom sheet grow naturally
          },
          animatedStyle,
        ]}
      >
        {children}
      </Animated.View>
    </BottomSheetContext.Provider>
  )
}

// MARK: Hooks

export const useBottomSheet = () => {
  const context = useContext(BottomSheetContext)

  if (!context) {
    throw new Error('useBottomSheet must be used within a BottomSheet')
  }

  return context
}

// MARK: Styles

const styles = StyleSheet.create({
  root: {
    width: '100%',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
})
