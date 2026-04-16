import type { StyleProp, ViewStyle } from 'react-native'

export type BackdropProps = {
  styles?: {
    root?: StyleProp<ViewStyle>
  }

  testID?: string
}
