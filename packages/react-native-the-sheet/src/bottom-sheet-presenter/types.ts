import type { PropsWithChildren } from 'react'
import type { StyleProp, ViewStyle } from 'react-native'

export type BottomSheetPresenterProps = PropsWithChildren & {
  styles?: {
    root?: StyleProp<ViewStyle>
  }

  testID?: string
}
