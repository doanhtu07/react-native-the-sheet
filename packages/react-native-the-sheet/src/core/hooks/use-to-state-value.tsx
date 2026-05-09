import { useState } from 'react'
import {
  runOnJS,
  useAnimatedReaction,
  type SharedValue,
} from 'react-native-reanimated'

export const useToStateValue = <T,>(value: SharedValue<T>, defaultValue: T) => {
  const [state, setState] = useState<T>(defaultValue)

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
