import { Fragment, useState } from 'react'
import { Button, StyleSheet, Text, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import {
  Backdrop,
  BottomSheet,
  BottomSheetHandle,
  BottomSheetPresenter,
  BottomSheetScrollView,
  SheetStackItem,
} from 'react-native-the-sheet'
import { Portal } from 'react-native-universe-portal'

export default function ExampleBottomSheetScrollView() {
  const [isOpenA, setIsOpenA] = useState(false)
  const [isOpenB, setIsOpenB] = useState(false)
  const [isOpenC, setIsOpenC] = useState(false)

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
    <View style={styles.root}>
      <Text style={styles.header}>Example Bottom Sheet Scroll View</Text>

      <Button
        title="Open Sheet A (Dynamic sizing)"
        onPress={() => setIsOpenA(true)}
      />

      <Button
        title="Open Sheet B (Snap points)"
        onPress={() => setIsOpenB(true)}
      />

      <Button
        title="Open Sheet C (Nested scroll views)"
        onPress={() => setIsOpenC(true)}
      />

      {/* MARK: Dynamic sizing */}

      <Portal hostName="root">
        <SheetStackItem
          isOpen={isOpenA}
          close={() => setIsOpenA(false)}
          waitForFullyExit
          testID="sheetA"
        >
          <Backdrop />

          <BottomSheetPresenter>
            <BottomSheet>
              <BottomSheetHandle />

              <BottomSheetScrollView>
                <Text>Sheet A</Text>
                <Button
                  title="Close Sheet A"
                  onPress={() => setIsOpenA(false)}
                />
                {renderContent()}
              </BottomSheetScrollView>
            </BottomSheet>
          </BottomSheetPresenter>
        </SheetStackItem>
      </Portal>

      {/* MARK: Snap points */}

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

      {/* MARK: Nested scroll views */}

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

                <ScrollView style={styles.nestedScrollView}>
                  {renderContent()}
                </ScrollView>

                {renderContent()}
              </BottomSheetScrollView>
            </BottomSheet>
          </BottomSheetPresenter>
        </SheetStackItem>
      </Portal>
    </View>
  )
}

// MARK: Styles

const styles = StyleSheet.create({
  root: {
    flex: 1,
    padding: 16,
    gap: 8,
  },
  header: {
    fontSize: 20,
    fontWeight: '500',
  },
  nestedScrollView: {
    height: 200,
    backgroundColor: '#dbeafe',
  },
})
