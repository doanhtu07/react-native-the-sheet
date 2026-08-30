import { Fragment, useCallback, useMemo, useState } from 'react'
import { Button } from 'react-native'
import {
  EmbeddedStackNavigator,
  ScreenRenderer,
} from '@the-sheet/embedded-stack-navigator'
import {
  Backdrop,
  BottomSheet,
  BottomSheetHandle,
  BottomSheetPresenter,
  BottomSheetProvider,
  BottomSheetView,
  SheetStackItem,
} from '@the-sheet/the-sheet'
import { Portal } from '@the-sheet/universe-portal'
import { ScreenA } from './screen-a'
import { ScreenB } from './screen-b'
import { RouteParamList } from './types'

export function NativeRefSheetD() {
  const [isOpenD, setIsOpenD] = useState(false)

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
    <Fragment>
      <Button
        title="Open Sheet D (Embedded navigator + isActive)"
        onPress={() => setIsOpenD(true)}
      />

      <Portal hostName="root">
        <SheetStackItem
          isOpen={isOpenD}
          close={() => setIsOpenD(false)}
          waitForFullyExit
          testID="sheetD"
        >
          <Backdrop />

          <BottomSheetPresenter>
            <BottomSheetProvider>
              <BottomSheet fill styles={{ root: { maxHeight: '75%' } }}>
                <BottomSheetHandle />

                <BottomSheetView fill>
                  <EmbeddedStackNavigator<
                    typeof screens,
                    RouteParamList,
                    'ScreenA'
                  >
                    initialRouteName={'ScreenA'}
                    initialParams={undefined}
                    screens={screens}
                    transitionType="fade"
                    fill
                  />
                </BottomSheetView>
              </BottomSheet>
            </BottomSheetProvider>
          </BottomSheetPresenter>
        </SheetStackItem>
      </Portal>
    </Fragment>
  )
}
