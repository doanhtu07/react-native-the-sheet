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
  HeightBudgetProvider,
  HeightClaim,
  SheetStackItem,
} from '@the-sheet/the-sheet'
import { Portal } from '@the-sheet/universe-portal'
import { ScreenA } from './screen-a'
import { ScreenB } from './screen-b'
import { RouteParamList } from './types'

export function HeightBudgetSheetB() {
  const [isOpenB, setIsOpenB] = useState(false)

  const maxHeight = 600

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
        title="Open Sheet B (HeightBudget + isActive)"
        onPress={() => setIsOpenB(true)}
      />

      <Portal hostName="root">
        <SheetStackItem
          isOpen={isOpenB}
          close={() => setIsOpenB(false)}
          waitForFullyExit
          testID="sheetB"
        >
          <Backdrop />

          <BottomSheetPresenter>
            <BottomSheetProvider>
              <BottomSheet styles={{ root: { maxHeight } }}>
                <HeightBudgetProvider maxHeight={maxHeight}>
                  <HeightClaim>
                    <BottomSheetHandle />
                  </HeightClaim>

                  <BottomSheetView>
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
                </HeightBudgetProvider>
              </BottomSheet>
            </BottomSheetProvider>
          </BottomSheetPresenter>
        </SheetStackItem>
      </Portal>
    </Fragment>
  )
}
