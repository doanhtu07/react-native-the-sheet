import { Stack } from 'expo-router'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import {
  SheetKeyboardProvider,
  SheetStackProvider,
  BottomSheetRegistryProvider,
  BottomSheetPresenterRegistryProvider,
  type AndroidWindowSoftInputMode,
} from '@the-sheet/the-sheet'
import { PortalProvider, PortalHost } from '@the-sheet/universe-portal'

type Props = {
  defaultSoftInputMode: AndroidWindowSoftInputMode
}

export const BaseProviders = ({ defaultSoftInputMode }: Props) => {
  return (
    <SafeAreaProvider>
      <SheetKeyboardProvider
        defaultAndroidWindowSoftInputMode={defaultSoftInputMode}
      >
        <SheetStackProvider debug>
          <PortalProvider>
            <BottomSheetPresenterRegistryProvider>
              <BottomSheetRegistryProvider>
                <GestureHandlerRootView>
                  <Stack />
                  <PortalHost name="root" debug />
                </GestureHandlerRootView>
              </BottomSheetRegistryProvider>
            </BottomSheetPresenterRegistryProvider>
          </PortalProvider>
        </SheetStackProvider>
      </SheetKeyboardProvider>
    </SafeAreaProvider>
  )
}
