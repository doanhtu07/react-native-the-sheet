import { Stack } from 'expo-router'
import { SheetStackProvider } from 'react-native-the-sheet'
import { PortalHost, PortalProvider } from 'react-native-universe-portal'

export default function RootLayout() {
  return (
    <SheetStackProvider debug>
      <PortalProvider>
        <Stack />
        <PortalHost name="root" debug />
      </PortalProvider>
    </SheetStackProvider>
  )
}
