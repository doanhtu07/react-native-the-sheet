import type { ComponentProps, PropsWithChildren } from 'react'
import type { LayoutChangeEvent } from 'react-native'
import type Animated from 'react-native-reanimated'
import type { SharedValue } from 'react-native-reanimated'

export type HeightBudgetContextType = {
  maxHeight: number
  staticHeights: SharedValue<Record<string, number>>
}

export type HeightBudgetProviderProps = PropsWithChildren & {
  maxHeight: number
}

type AnimatedViewProps = ComponentProps<typeof Animated.View>

export type HeightClaimProps = Omit<AnimatedViewProps, 'onLayout'> & {
  onLayout?: (e: LayoutChangeEvent) => void
}

export type HeightFillProps = AnimatedViewProps
