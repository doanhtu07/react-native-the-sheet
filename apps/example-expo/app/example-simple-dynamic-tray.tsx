import { ThemedText } from '@/components/themed-text'
import { useCallback, useMemo, useState } from 'react'
import { Button, StyleSheet, useColorScheme, View } from 'react-native'
import {
  Backdrop,
  BottomSheet,
  BottomSheetPresenter,
  BottomSheetProvider,
  BottomSheetView,
  SheetStackItem,
} from '@the-sheet/the-sheet'
import { Portal } from '@the-sheet/universe-portal'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { ScreenA } from '@/features/example-navigator/screen-a'
import { ScreenB } from '@/features/example-navigator/screen-b'
import { RouteParamList } from '@/features/example-navigator/types'
import {
  EmbeddedStackNavigator,
  ScreenRenderer,
} from '@the-sheet/embedded-stack-navigator'
import { ScreenC } from '@/features/example-navigator/screen-c'

export default function ExampleSimpleDynamicTray() {
  const theme = useColorScheme()
  const safeAreaInsets = useSafeAreaInsets()

  const isDark = theme === 'dark'
  const backgroundColor = isDark ? '#1C1C1E' : '#FFFFFF'

  const [isOpenA, setIsOpenA] = useState(false)

  // MARK: Renderers

  const renderScreenA = useCallback(() => <ScreenA />, [])

  const renderScreenB = useCallback(() => <ScreenB />, [])

  const renderScreenC = useCallback(() => <ScreenC />, [])

  const screens = useMemo(() => {
    return {
      ScreenA: renderScreenA,
      ScreenB: renderScreenB,
      ScreenC: renderScreenC,
    } satisfies Record<keyof RouteParamList, ScreenRenderer>
  }, [renderScreenA, renderScreenB, renderScreenC])

  return (
    <View style={styles.root}>
      <ThemedText style={styles.header}>Example Simple Dynamic Tray</ThemedText>

      <Button title="Open Sheet A" onPress={() => setIsOpenA(true)} />

      <Portal hostName="root">
        <SheetStackItem
          isOpen={isOpenA}
          close={() => setIsOpenA(false)}
          waitForFullyExit
          testID="sheetA"
        >
          <Backdrop />

          <BottomSheetPresenter>
            <BottomSheetProvider disableDrag>
              <BottomSheet
                styles={{
                  root: [
                    styles.trayContainer,
                    {
                      paddingBottom: safeAreaInsets.bottom,
                      paddingTop: safeAreaInsets.top,
                    },
                  ],
                }}
              >
                <BottomSheetView
                  styles={{ root: [styles.tray, { backgroundColor }] }}
                >
                  <ThemedText>Sheet A</ThemedText>

                  <Button
                    title="Close Sheet A"
                    onPress={() => setIsOpenA(false)}
                  />

                  <EmbeddedStackNavigator<
                    typeof screens,
                    RouteParamList,
                    'ScreenA'
                  >
                    initialRouteName={'ScreenA'}
                    initialParams={undefined}
                    screens={screens}
                    transitionType="fade"
                    animateDynamicHeight={true}
                  />
                </BottomSheetView>
              </BottomSheet>
            </BottomSheetProvider>
          </BottomSheetPresenter>
        </SheetStackItem>
      </Portal>
    </View>
  )
}

// MARK: Styles

const styles = StyleSheet.create({
  header: {
    fontSize: 20,
    fontWeight: '500',
  },
  root: {
    flex: 1,
    gap: 8,
    padding: 16,
  },
  tray: {
    borderRadius: 20,
    padding: 20,
  },
  trayContainer: {
    backgroundColor: 'transparent',
    paddingHorizontal: 12,
    pointerEvents: 'box-none',
  },
})
