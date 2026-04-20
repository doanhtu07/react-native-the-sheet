import { Stack } from 'expo-router'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { SheetStackProvider } from 'react-native-the-sheet'
import { PortalHost, PortalProvider } from 'react-native-universe-portal'

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <SheetStackProvider debug>
        <PortalProvider>
          <GestureHandlerRootView>
            <Stack />
            <PortalHost name="root" debug />
          </GestureHandlerRootView>
        </PortalProvider>
      </SheetStackProvider>
    </SafeAreaProvider>
  )
}
