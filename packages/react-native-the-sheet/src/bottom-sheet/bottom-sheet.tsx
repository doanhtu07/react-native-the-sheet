import {
  StyleSheet,
  useColorScheme,
  useWindowDimensions,
  type LayoutChangeEvent,
} from 'react-native'
import type { BottomSheetContextType, BottomSheetProps } from './types'
import Animated, {
  useAnimatedRef,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated'
import { createContext, useContext, useMemo } from 'react'
import { useBridgedValue } from '../hooks/use-bridged-value'
import { usePanGesture } from './hooks/use-pan-gesture'
import { useSyncedSharedValue } from '../hooks/use-synced-shared-value'

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

  const normalizedSnaps = useBridgedValue(
    useMemo(() => {
      if (!snapPoints || snapPoints.length === 0) return []

      return snapPoints
        .map((point) => {
          if (typeof point === 'number') return point
          const percentage = Number.parseFloat(point as string) / 100
          return screenHeight * percentage
        })
        .filter((point) => point > 0 && point <= screenHeight)
        .sort((a, b) => a - b)
    }, [screenHeight, snapPoints]),
  )

  // Convert snap points to translate ys (relative distance from fully open position)
  // Naturally, snapTranslateYs is sorted in descending order (largest value = closest to fully closed)
  const snapTranslateYs = useDerivedValue(() => {
    const snaps = normalizedSnaps.value
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
  const translateY = useSyncedSharedValue(0, () => {
    'worklet'
    return snapTranslateYs.value[0]!
  })

  const animatedStyle = useAnimatedStyle(() => {
    'worklet'

    return {
      height: normalizedSnaps.value.at(-1),
      transform: [{ translateY: translateY.value }],
    }
  })

  const onLayout = (event: LayoutChangeEvent) => {
    'worklet'
    sheetHeight.value = event.nativeEvent.layout.height
  }

  // MARK: Bottom sheet context

  const scrollViewRef = useAnimatedRef<Animated.ScrollView>()
  const scrollY = useSharedValue(0)
  const isTouchingScrollView = useSharedValue<boolean>(false)

  const excludePanGestureContext = useMemo<
    Omit<BottomSheetContextType, 'panGesture'>
  >(() => {
    return {
      sheetHeight,
      snapTranslateYs,
      translateY,

      scrollViewRef,
      scrollY,
      isTouchingScrollView,
    }
  }, [
    isTouchingScrollView,
    scrollViewRef,
    scrollY,
    sheetHeight,
    snapTranslateYs,
    translateY,
  ])

  const panGesture = usePanGesture(excludePanGestureContext)

  const contextValue = useMemo<BottomSheetContextType>(() => {
    return {
      ...excludePanGestureContext,
      panGesture,
    }
  }, [excludePanGestureContext, panGesture])

  // MARK: Renderers

  return (
    <BottomSheetContext.Provider value={contextValue}>
      <Animated.View
        onLayout={onLayout}
        style={[
          styles.root,
          { backgroundColor },
          propStyles?.root,
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
