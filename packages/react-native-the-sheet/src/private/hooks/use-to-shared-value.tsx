import { useEffect } from 'react'
import { useSharedValue } from 'react-native-reanimated'

export function useToSharedValue<T>(value: T) {
  const shared = useSharedValue<T>(value)

  useEffect(() => {
    shared.value = value
  }, [shared, value])

  return shared
}
