import { ThemedText } from '@/components/text'
import { Fragment, useState } from 'react'
import { Button } from 'react-native'
import {
  Backdrop,
  BottomSheet,
  BottomSheetHandle,
  BottomSheetPresenter,
  BottomSheetProvider,
  BottomSheetScrollView,
  SheetStackItem,
} from 'react-native-the-sheet'
import { Portal } from 'react-native-universe-portal'

export function SnapPointsSheetB() {
  const [isOpenB, setIsOpenB] = useState(false)

  const renderContent = () => {
    return (
      <Fragment>
        {Array.from({ length: 50 }).map((_, index) => (
          <ThemedText key={index}>Item {index + 1}</ThemedText>
        ))}
      </Fragment>
    )
  }

  return (
    <Fragment>
      <Button
        title="Open Sheet B (Snap points)"
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
            <BottomSheetProvider snapPoints={['25%', '50%']}>
              <BottomSheet>
                <BottomSheetHandle />

                <BottomSheetScrollView>
                  <ThemedText>Sheet B</ThemedText>

                  <Button
                    title="Close Sheet B"
                    onPress={() => setIsOpenB(false)}
                  />

                  {renderContent()}
                </BottomSheetScrollView>
              </BottomSheet>
            </BottomSheetProvider>
          </BottomSheetPresenter>
        </SheetStackItem>
      </Portal>
    </Fragment>
  )
}
