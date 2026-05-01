import { useEffect } from 'react'
import { isSharedValue, useSharedValue } from 'react-native-reanimated'
import type { AnimatedProp } from '../../types'

export function useToSharedValue<T>(value: AnimatedProp<T>) {
  const shared = useSharedValue<T>(
    isSharedValue<T>(value) ? null! : (value as T),
  )

  useEffect(() => {
    if (isSharedValue<T>(value)) {
      return
    }

    shared.value = value as T
  }, [shared, value])

  return isSharedValue<T>(value) ? value : shared
}
