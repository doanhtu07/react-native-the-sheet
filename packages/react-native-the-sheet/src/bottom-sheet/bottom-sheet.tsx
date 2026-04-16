import { View } from 'react-native'
import type { BottomSheetProps } from './types'

export function BottomSheet({ children }: Readonly<BottomSheetProps>) {
  return <View>{children}</View>
}
