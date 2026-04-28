import { ScreenA } from '@/features/example-navigator/screen-a'
import { ScreenB } from '@/features/example-navigator/screen-b'
import { RouteParamList } from '@/features/example-navigator/types'
import { useCallback, useMemo, useState } from 'react'
import { Button, StyleSheet, Text, View } from 'react-native'
import {
  EmbeddedStackNavigator,
  ScreenRenderer,
} from 'react-native-embedded-stack-navigator'
import {
  Backdrop,
  BottomSheet,
  BottomSheetHandle,
  BottomSheetPresenter,
  BottomSheetProvider,
  BottomSheetView,
  SheetStackItem,
} from 'react-native-the-sheet'
import { Portal } from 'react-native-universe-portal'

export default function ExampleBottomSheetPresenter() {
  const [isOpenA, setIsOpenA] = useState(false)

  // MARK: Renderers

  const renderScreenA = useCallback(() => <ScreenA />, [])

  const renderScreenB = useCallback(() => <ScreenB />, [])

  const screens = useMemo(() => {
    return {
      ScreenA: renderScreenA,
      ScreenB: renderScreenB,
    } satisfies Record<keyof RouteParamList, ScreenRenderer>
  }, [renderScreenA, renderScreenB])

  return (
    <View style={styles.root}>
      <Text style={styles.header}>Example Bottom Sheet With Navigator</Text>

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
            <BottomSheetProvider>
              <BottomSheet fill styles={{ root: { maxHeight: '75%' } }}>
                <BottomSheetHandle />

                <BottomSheetView fill>
                  <Text>Sheet A</Text>
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
})
