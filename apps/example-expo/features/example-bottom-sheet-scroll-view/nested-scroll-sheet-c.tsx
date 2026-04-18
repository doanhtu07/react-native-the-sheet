import { Fragment, useState } from 'react'
import { Button, StyleSheet, Text } from 'react-native'
import { ScrollView as GestureScrollView } from 'react-native-gesture-handler'
import {
  Backdrop,
  BottomSheet,
  BottomSheetHandle,
  BottomSheetPresenter,
  BottomSheetScrollView,
  SheetStackItem,
} from 'react-native-the-sheet'
import { Portal } from 'react-native-universe-portal'

export function NestedScrollSheetC() {
  const [isOpenC, setIsOpenC] = useState(false)

  const renderContent = () => {
    return (
      <Fragment>
        {Array.from({ length: 50 }).map((_, index) => (
          <Text key={index}>Item {index + 1}</Text>
        ))}
      </Fragment>
    )
  }

  return (
    <Fragment>
      <Button
        title="Open Sheet C (Nested scroll views)"
        onPress={() => setIsOpenC(true)}
      />

      <Portal hostName="root">
        <SheetStackItem
          isOpen={isOpenC}
          close={() => setIsOpenC(false)}
          waitForFullyExit
          testID="sheetC"
        >
          <Backdrop />

          <BottomSheetPresenter>
            <BottomSheet snapPoints={['50%', '75%']}>
              <BottomSheetHandle />

              <BottomSheetScrollView>
                <Text>Sheet C</Text>

                <Button
                  title="Close Sheet C"
                  onPress={() => setIsOpenC(false)}
                />

                <GestureScrollView style={styles.nestedScrollView}>
                  {renderContent()}
                </GestureScrollView>

                {renderContent()}
              </BottomSheetScrollView>
            </BottomSheet>
          </BottomSheetPresenter>
        </SheetStackItem>
      </Portal>
    </Fragment>
  )
}

// MARK: Styles

const styles = StyleSheet.create({
  nestedScrollView: {
    height: 200,
    backgroundColor: '#dbeafe',
  },
})
