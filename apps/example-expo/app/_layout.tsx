import { ANDROID_WINDOW_SOFT_INPUT_MODES } from '@the-sheet/the-sheet'
import { KeyboardProvider } from 'react-native-keyboard-controller'
import { BaseProviders } from '@/features/root-layout/base-providers'

export default function RootLayout() {
  // Need to rebuild (or at least restart) the app when toggling this
  const enableKeyboardProvider = false

  /*
    Must match android:windowSoftInputMode in AndroidManifest.xml.
    Screens can override it at runtime through useSheetKeyboard()
    (e.g. the chat example switches to adjustNothing while open).
  */
  const defaultSoftInputMode = ANDROID_WINDOW_SOFT_INPUT_MODES.adjustResize

  if (!enableKeyboardProvider) {
    return <BaseProviders defaultSoftInputMode={defaultSoftInputMode} />
  }

  return (
    <KeyboardProvider>
      <BaseProviders defaultSoftInputMode={defaultSoftInputMode} />
    </KeyboardProvider>
  )
}
