import { useState } from 'react'
import { useAnimatedReaction, type SharedValue } from 'react-native-reanimated'
import { runOnJS } from 'react-native-worklets'

export function useToStateValue<T>(value: SharedValue<T>) {
  const [state, setState] = useState<T>(value.value)

  useAnimatedReaction(
    () => {
      return value.value
    },
    (prepared) => {
      runOnJS(setState)(prepared)
    },
  )

  return state
}
