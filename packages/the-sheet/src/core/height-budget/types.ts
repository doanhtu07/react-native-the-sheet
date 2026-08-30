import type { ComponentProps, PropsWithChildren } from 'react'
import type { LayoutChangeEvent } from 'react-native'
import type Animated from 'react-native-reanimated'
import type { SharedValue } from 'react-native-reanimated'
import type { AnimatedProp } from '../types'

export type HeightBudgetContextType = {
  maxHeight: SharedValue<number>
  staticHeights: SharedValue<Record<string, number>>
  activeClaimIds: SharedValue<Record<string, boolean>>
}

export type HeightBudgetProviderProps = PropsWithChildren & {
  maxHeight: AnimatedProp<number>
}

type AnimatedViewProps = ComponentProps<typeof Animated.View>

export type HeightClaimProps = Omit<AnimatedViewProps, 'onLayout'> & {
  isActive?: AnimatedProp<boolean>
  onLayout?: (e: LayoutChangeEvent) => void
}

export type HeightFillProps = AnimatedViewProps
