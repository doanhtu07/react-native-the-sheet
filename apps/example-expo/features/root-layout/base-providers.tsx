import { Stack } from 'expo-router'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import {
  SheetKeyboardProvider,
  SheetStackProvider,
  BottomSheetRegistryProvider,
  AnimatedProp,
  ANDROID_WINDOW_SOFT_INPUT_MODES,
} from 'react-native-the-sheet'
import { PortalProvider, PortalHost } from 'react-native-universe-portal'

type Props = {
  androidWindowSoftInputMode: AnimatedProp<
    keyof typeof ANDROID_WINDOW_SOFT_INPUT_MODES
  >
}

export const BaseProviders = ({ androidWindowSoftInputMode }: Props) => {
  return (
    <SafeAreaProvider>
      <SheetKeyboardProvider
        androidWindowSoftInputMode={androidWindowSoftInputMode}
      >
        <SheetStackProvider debug>
          <PortalProvider>
            <BottomSheetRegistryProvider>
              <GestureHandlerRootView>
                <Stack />
                <PortalHost name="root" debug />
              </GestureHandlerRootView>
            </BottomSheetRegistryProvider>
          </PortalProvider>
        </SheetStackProvider>
      </SheetKeyboardProvider>
    </SafeAreaProvider>
  )
}
