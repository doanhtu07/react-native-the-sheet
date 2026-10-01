import type { PropsWithChildren } from 'react'
import type { DerivedValue, SharedValue } from 'react-native-reanimated'

export const ANDROID_WINDOW_SOFT_INPUT_MODES = {
  adjustResize: 'adjustResize',
  adjustPan: 'adjustPan',
  adjustNothing: 'adjustNothing',
} as const

export type AndroidWindowSoftInputMode =
  keyof typeof ANDROID_WINDOW_SOFT_INPUT_MODES

export type SheetKeyboardContextType = {
  keyboardVisible: SharedValue<boolean>
  keyboardFinalHeight: SharedValue<number>

  androidWindowSoftInputMode: SharedValue<AndroidWindowSoftInputMode>
  defaultAndroidWindowSoftInputMode: AndroidWindowSoftInputMode
  isVisuallyAndroidKeyboardResizeMode: SharedValue<boolean | null>
  isAndroidKeyboardResizeMode: DerivedValue<boolean>
}

export type SheetKeyboardProviderProps = PropsWithChildren & {
  defaultAndroidWindowSoftInputMode: AndroidWindowSoftInputMode
}
