import { Stack } from 'expo-router'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import {
  SheetStackProvider,
  SheetKeyboardProvider,
} from 'react-native-the-sheet'
import { PortalHost, PortalProvider } from 'react-native-universe-portal'
import { CustomHeaderForKeyboardProvider } from '@/features/root-layout/custom-header-for-keyboard-provider'
import { KeyboardProvider } from 'react-native-keyboard-controller'

export default function RootLayout() {
  // Need to rebuild (or at least restart) the app when toggling this
  const enableKeyboardProvider = false

  if (!enableKeyboardProvider) {
    return (
      <SafeAreaProvider>
        <SheetKeyboardProvider>
          <SheetStackProvider debug>
            <PortalProvider>
              <GestureHandlerRootView>
                <Stack />
                <PortalHost name="root" debug />
              </GestureHandlerRootView>
            </PortalProvider>
          </SheetStackProvider>
        </SheetKeyboardProvider>
      </SafeAreaProvider>
    )
  }

  return (
    <SafeAreaProvider>
      <KeyboardProvider>
        <SheetKeyboardProvider>
          <SheetStackProvider debug>
            <PortalProvider>
              <GestureHandlerRootView>
                <Stack
                  screenOptions={{
                    header: CustomHeaderForKeyboardProvider,
                  }}
                />

                <PortalHost name="root" debug />
              </GestureHandlerRootView>
            </PortalProvider>
          </SheetStackProvider>
        </SheetKeyboardProvider>
      </KeyboardProvider>
    </SafeAreaProvider>
  )
}
