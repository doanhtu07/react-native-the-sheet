import { useEffect } from 'react'
import {
  useAnimatedReaction,
  useSharedValue,
  type SharedValue,
} from 'react-native-reanimated'
import { runOnUI } from 'react-native-worklets'
import { useSyncedRef } from './use-synced-ref'

export function useSyncedSharedValue<T>(
  fallbackValue: T,
  prepare: () => T,
): SharedValue<T> {
  const prepareRef = useSyncedRef(prepare)
  const shared = useSharedValue(fallbackValue)

  // Effect: Sync initial value
  useEffect(() => {
    const prepareRefCurrent = prepareRef.current

    runOnUI(() => {
      'worklet'
      shared.value = prepareRefCurrent()
    })()
  }, [prepareRef, shared])

  // Effect: Sync ongoing changes
  useAnimatedReaction(prepare, (nextValue, prevValue) => {
    'worklet'
    if (prevValue === null || nextValue !== prevValue) {
      shared.value = nextValue
    }
  })

  return shared
}
