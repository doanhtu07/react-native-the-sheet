import { createContext, useContext, useEffect, useMemo } from 'react'
import { StyleSheet, useWindowDimensions } from 'react-native'
import type {
  BottomSheetPresenterContextType,
  BottomSheetPresenterProps,
} from './types'
import { useSheetStackItem } from '../sheet-stack'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated'
import { runOnJS } from 'react-native-worklets'
import { useSyncedRef } from '../hooks/use-synced-ref'

const BottomSheetPresenterContext = createContext<
  BottomSheetPresenterContextType | undefined
>(undefined)

export function BottomSheetPresenter({
  styles: propStyles,
  testID,
  children,
}: Readonly<BottomSheetPresenterProps>) {
  const { isHidden, isCurrentlyInStack, onFullyExit } = useSheetStackItem()
  const { height: screenHeight } = useWindowDimensions()
  const onFullyExitRef = useSyncedRef(onFullyExit)

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

  // MARK: Bottom sheet presenter context

  const contextValue = useMemo<BottomSheetPresenterContextType>(() => {
    return {
      translateY,
    }
  }, [translateY])

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
        'worklet'
        if (finished && !allowPresent) {
          runOnJS(onFullyExitRefCurrent)()
        }
      },
    )
  }, [allowPresent, onFullyExitRef, screenHeight, translateY])

  // MARK: Renderers

  return (
    <BottomSheetPresenterContext.Provider value={contextValue}>
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
    </BottomSheetPresenterContext.Provider>
  )
}

// MARK: Hooks

export const useBottomSheetPresenter = () => {
  const context = useContext(BottomSheetPresenterContext)

  if (!context) {
    throw new Error(
      'useBottomSheetPresenter must be used within a BottomSheetPresenter',
    )
  }

  return context
}

// MARK: Styles

const styles = StyleSheet.create({
  root: {
    justifyContent: 'flex-end',
    pointerEvents: 'box-none',
    width: '100%',
  },
})
