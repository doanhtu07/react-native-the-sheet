import type { StyleProp, ViewStyle } from 'react-native'
import type { AnimatedProp } from '../types'
import type { AnimatedStyle } from 'react-native-reanimated'

export type BackdropProps = {
  disabled?: AnimatedProp<boolean>

  styles?: {
    root?: StyleProp<AnimatedStyle<ViewStyle>>
  }

  testID?: string
}
