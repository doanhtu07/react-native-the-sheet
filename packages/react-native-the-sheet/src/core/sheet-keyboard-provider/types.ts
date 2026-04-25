import type { PropsWithChildren } from 'react'
import type { SharedValue } from 'react-native-reanimated'

export type SheetKeyboardProviderContextType = {
  keyboardVisible: SharedValue<boolean>
  keyboardFinalHeight: SharedValue<number>

  isAndroidKeyboardResizeMode: SharedValue<boolean | null>
}

export type SheetKeyboardProviderProps = PropsWithChildren
