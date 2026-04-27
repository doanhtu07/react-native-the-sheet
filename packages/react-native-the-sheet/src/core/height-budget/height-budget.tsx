import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
} from 'react'
import type {
  HeightFillProps,
  HeightBudgetContextType,
  HeightBudgetProviderProps,
  HeightClaimProps,
} from './types'
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated'
import type { LayoutChangeEvent } from 'react-native'
import { runOnUI } from 'react-native-worklets'

const HeightBudgetContext = createContext<HeightBudgetContextType>(null!)

export const useHeightBudget = () => {
  const context = useContext(HeightBudgetContext)

  if (!context) {
    throw new Error(
      'useHeightBudget must be used within a HeightBudgetProvider',
    )
  }

  return context
}

export function HeightBudgetProvider({
  maxHeight,
  children,
}: HeightBudgetProviderProps) {
  const staticHeights = useSharedValue<Record<string, number>>({})

  const contextValue = useMemo<HeightBudgetContextType>(() => {
    return {
      maxHeight,
      staticHeights,
    }
  }, [maxHeight, staticHeights])

  return (
    <HeightBudgetContext.Provider value={contextValue}>
      {children}
    </HeightBudgetContext.Provider>
  )
}

export function HeightClaim({
  onLayout: propOnLayout,
  children,
  ...rest
}: HeightClaimProps) {
  const { staticHeights } = useHeightBudget()
  const id = useId()

  const onLayout = useCallback(
    (e: LayoutChangeEvent) => {
      const height = e.nativeEvent.layout.height

      propOnLayout?.(e)

      runOnUI(() => {
        'worklet'

        if (staticHeights.value[id] !== height) {
          staticHeights.value = { ...staticHeights.value, [id]: height }
        }
      })()
    },
    [id, propOnLayout, staticHeights],
  )

  // MARK: Effects

  useEffect(() => {
    return () => {
      runOnUI(() => {
        'worklet'
        const next = { ...staticHeights.value }
        delete next[id]
        staticHeights.value = next
      })()
    }
  }, [id, staticHeights])

  // MARK: Renderers

  return (
    <Animated.View {...rest} onLayout={onLayout}>
      {children}
    </Animated.View>
  )
}

export function HeightFill({ children, ...rest }: HeightFillProps) {
  const { maxHeight, staticHeights } = useHeightBudget()

  const remaining = useDerivedValue(() => {
    let consumed = 0

    for (const key in staticHeights.value) {
      consumed += staticHeights.value[key]!
    }

    return maxHeight.value - consumed
  })

  const animatedStyle = useAnimatedStyle(() => ({
    maxHeight: remaining.value,
  }))

  return (
    <Animated.View {...rest} style={[rest.style, animatedStyle]}>
      {children}
    </Animated.View>
  )
}
