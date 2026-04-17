import type { PropsWithChildren } from 'react'
import type { StyleProp, ViewStyle } from 'react-native'
import type { SharedValue } from 'react-native-reanimated'

export type BottomSheetHandleProps = {
  styles?: {
    root?: StyleProp<ViewStyle>
    indicator?: StyleProp<ViewStyle>
  }
}

export type BottomSheetContextType = {
  sheetHeight: SharedValue<number>
  translateY: SharedValue<number>
}

export type BottomSheetProps = PropsWithChildren & {
  styles?: {
    root?: StyleProp<ViewStyle>
  }
}
