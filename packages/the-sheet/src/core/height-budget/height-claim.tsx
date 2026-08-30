import { useId, useCallback, useEffect } from 'react'
import type { LayoutChangeEvent } from 'react-native'
import Animated, { runOnUI, useAnimatedReaction } from 'react-native-reanimated'
import { useToSharedValue } from '../hooks'
import { useHeightBudget } from './height-budget-provider'
import type { HeightClaimProps } from './types'

export function HeightClaim({
  isActive: propIsActive = true,
  onLayout: propOnLayout,
  children,
  ...rest
}: HeightClaimProps) {
  const { staticHeights, activeClaimIds } = useHeightBudget()
  const id = useId()
  const isActive = useToSharedValue(propIsActive)

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

  const setActiveClaim = (active: boolean) => {
    'worklet'
    if (!id) return
    activeClaimIds.value = { ...activeClaimIds.value, [id]: active }
  }

  // MARK: Effects

  // Effect: Clean up active claim ids
  useEffect(() => {
    return () => {
      runOnUI(() => {
        'worklet'
        const next = { ...activeClaimIds.value }
        delete next[id]
        activeClaimIds.value = next
      })()
    }
  }, [id, activeClaimIds])

  // Effect: Clean up static heights
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

  // Effect: Update active claim ids when id is ready
  useEffect(
    () => {
      runOnUI(() => {
        'worklet'
        setActiveClaim(isActive.value)
      })()
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [id],
  )

  // Effect: Update active claim ids
  useAnimatedReaction(
    () => isActive.value,
    (active, prevActive) => {
      if (active === prevActive) return
      setActiveClaim(active)
    },
  )

  // MARK: Renderers

  return (
    <Animated.View {...rest} onLayout={onLayout}>
      {children}
    </Animated.View>
  )
}
