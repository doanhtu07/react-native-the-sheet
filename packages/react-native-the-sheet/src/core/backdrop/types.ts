import type { StyleProp, ViewStyle } from 'react-native'
import type { AnimatedProp } from '../types'

export type BackdropProps = {
  disabled?: AnimatedProp<boolean>

  styles?: {
    root?: StyleProp<ViewStyle>
  }

  testID?: string
}
