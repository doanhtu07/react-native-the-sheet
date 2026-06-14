import type { PropsWithChildren } from 'react'
import type { StyleProp, ViewStyle } from 'react-native'
import type { SharedValue } from 'react-native-reanimated'

export type BottomSheetPresenterContextType = {
  translateY: SharedValue<number>
}

export type BottomSheetPresenterProps = PropsWithChildren & {
  styles?: {
    root?: StyleProp<ViewStyle>
  }

  testID?: string
}
