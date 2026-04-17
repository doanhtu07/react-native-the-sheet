import {
  StyleSheet,
  useColorScheme,
  type LayoutChangeEvent,
} from 'react-native'
import type { BottomSheetContextType, BottomSheetProps } from './types'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated'
import { createContext, useContext, useMemo } from 'react'

const BottomSheetContext = createContext<BottomSheetContextType | undefined>(
  undefined,
)

export function BottomSheet({
  styles: propStyles,
  children,
}: Readonly<BottomSheetProps>) {
  const theme = useColorScheme()

  const isDark = theme === 'dark'
  const backgroundColor = isDark ? '#1C1C1E' : '#FFFFFF'

  /**
   * translateY = tracks relative position of bottom sheet to its rest point
   * - = 0: Bottom sheet is fully visible inside bottom sheet presenter
   * - > 0: Bottom sheet is being dragged down
   * - < 0: Bottom sheet is being dragged up cross rest point
   */
  const translateY = useSharedValue(0)

  const sheetHeight = useSharedValue(0)

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }))

  const onLayout = (event: LayoutChangeEvent) => {
    sheetHeight.value = event.nativeEvent.layout.height
  }

  // MARK: Bottom sheet context

  const contextValue = useMemo<BottomSheetContextType>(() => {
    return { sheetHeight, translateY }
  }, [sheetHeight, translateY])

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
