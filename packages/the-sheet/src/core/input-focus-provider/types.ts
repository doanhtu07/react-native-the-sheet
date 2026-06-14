import type { PropsWithChildren } from 'react'
import type { SharedValue } from 'react-native-reanimated'

export type InputFocusContextType = {
  isInputFocused: SharedValue<boolean>
  onFocus: () => void
  onBlur: () => void
}

export type InputFocusProviderProps = PropsWithChildren
