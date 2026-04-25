import { createContext, useContext, useEffect, useMemo } from 'react'
import { StyleSheet } from 'react-native'
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
import { useSyncedRef } from '../../private/hooks/use-synced-ref'
import { SPRING_CONFIG } from '../../private/constants'
import { useTrueSafeArea } from '../hooks'

const BottomSheetPresenterContext = createContext<
  BottomSheetPresenterContextType | undefined
>(undefined)

export function BottomSheetPresenter({
  styles: propStyles,
  testID,
  children,
}: Readonly<BottomSheetPresenterProps>) {
  const { isHidden, isCurrentlyInStack, onFullyExit } = useSheetStackItem()
  const { safeAreaHeight } = useTrueSafeArea()
  const onFullyExitRef = useSyncedRef(onFullyExit)

  const allowPresent = isCurrentlyInStack && !isHidden

  /**
   * translateY = tracks the offset of the bottom sheet presenter from the bottom of the screen
   * - = 0: Bottom sheet presenter is fully visible
   * - > 0: Bottom sheet presenter is going below the bottom of the screen
   */
  const translateY = useSharedValue(safeAreaHeight)

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
      translateY.value = safeAreaHeight
    }

    // Snapshot refs for worklet
    const onFullyExitRefCurrent = onFullyExitRef.current

    translateY.value = withSpring(
      allowPresent ? 0 : safeAreaHeight,
      SPRING_CONFIG,
      (finished) => {
        'worklet'
        if (finished && !allowPresent) {
          runOnJS(onFullyExitRefCurrent)()
        }
      },
    )
  }, [allowPresent, onFullyExitRef, safeAreaHeight, translateY])

  // MARK: Renderers

  return (
    <BottomSheetPresenterContext.Provider value={contextValue}>
      <Animated.View
        style={[
          styles.root,
          propStyles?.root,
          { height: safeAreaHeight },
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
