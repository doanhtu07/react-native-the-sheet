import { ANDROID_WINDOW_SOFT_INPUT_MODES } from '@the-sheet/the-sheet'
import { KeyboardProvider } from 'react-native-keyboard-controller'
import { BaseProviders } from '@/features/root-layout/base-providers'

export default function RootLayout() {
  // Need to rebuild (or at least restart) the app when toggling this
  const enableKeyboardProvider = false

  const androidWindowSoftInputMode =
    ANDROID_WINDOW_SOFT_INPUT_MODES.adjustResize

  if (!enableKeyboardProvider) {
    return (
      <BaseProviders androidWindowSoftInputMode={androidWindowSoftInputMode} />
    )
  }

  return (
    <KeyboardProvider>
      <BaseProviders androidWindowSoftInputMode={androidWindowSoftInputMode} />
    </KeyboardProvider>
  )
}
