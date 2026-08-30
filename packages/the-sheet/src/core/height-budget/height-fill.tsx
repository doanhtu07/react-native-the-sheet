import Animated, {
  useDerivedValue,
  useAnimatedStyle,
} from 'react-native-reanimated'
import { useHeightBudget } from './height-budget-provider'
import type { HeightFillProps } from './types'

export function HeightFill({ children, ...rest }: HeightFillProps) {
  const { maxHeight, staticHeights, activeClaimIds } = useHeightBudget()

  const remaining = useDerivedValue(() => {
    let consumed = 0

    for (const key in staticHeights.value) {
      if (activeClaimIds.value[key]) {
        consumed += staticHeights.value[key]!
      }
    }

    return maxHeight.value - consumed
  })

  // MARK: Preparation

  const animatedStyle = useAnimatedStyle(() => ({
    maxHeight: remaining.value,
  }))

  // MARK: Renderers

  return (
    <Animated.View {...rest} style={[rest.style, animatedStyle]}>
      {children}
    </Animated.View>
  )
}
