import { Fragment, useState } from 'react'
import { Button, Text } from 'react-native'
import {
  Backdrop,
  BottomSheet,
  BottomSheetHandle,
  BottomSheetPresenter,
  BottomSheetScrollView,
  SheetStackItem,
} from 'react-native-the-sheet'
import { Portal } from 'react-native-universe-portal'

export function SnapPointsSheetB() {
  const [isOpenB, setIsOpenB] = useState(false)

  const renderContent = () => {
    return (
      <Fragment>
        {Array.from({ length: 20 }).map((_, index) => (
          <Text key={index}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </Text>
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
            <BottomSheet snapPoints={['25%', '50%']}>
              <BottomSheetHandle />

              <BottomSheetScrollView>
                <Text>Sheet B</Text>

                <Button
                  title="Close Sheet B"
                  onPress={() => setIsOpenB(false)}
                />

                {renderContent()}
              </BottomSheetScrollView>
            </BottomSheet>
          </BottomSheetPresenter>
        </SheetStackItem>
      </Portal>
    </Fragment>
  )
}
