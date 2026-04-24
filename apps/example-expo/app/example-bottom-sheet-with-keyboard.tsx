import { Fragment, useState } from 'react'
import { Button, StyleSheet, Text, View } from 'react-native'
import { TextInput } from 'react-native-gesture-handler'
import {
  Backdrop,
  BottomSheet,
  BottomSheetHandle,
  BottomSheetPresenter,
  BottomSheetScrollView,
  BottomSheetKeyboardExpander,
  SheetStackItem,
} from 'react-native-the-sheet'
import { Portal } from 'react-native-universe-portal'

export default function ExampleBottomSheetWithKeyboard() {
  const [isOpenA, setIsOpenA] = useState(false)

  // MARK: Renderers

  const renderContent = () => {
    return (
      <Fragment>
        {Array.from({ length: 20 }).map((_, index) => (
          <Text key={index}>Item {index + 1}</Text>
        ))}
      </Fragment>
    )
  }

  return (
    <View style={styles.root}>
      <Text style={styles.header}>Example Bottom Sheet With Keyboard</Text>

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
            <BottomSheet snapPoints={[400, 800]}>
              <BottomSheetHandle />

              <BottomSheetScrollView>
                <Text>Sheet A</Text>

                <Button
                  title="Close Sheet A"
                  onPress={() => setIsOpenA(false)}
                />

                <TextInput
                  style={styles.input}
                  placeholder="Type something..."
                  placeholderTextColor="#999"
                />

                {renderContent()}
              </BottomSheetScrollView>
            </BottomSheet>

            <BottomSheetKeyboardExpander keyboardOffset={20} />
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
  input: {
    borderColor: '#ccc',
    borderRadius: 8,
    borderWidth: 1,
    color: '#000',
    fontSize: 16,
    height: 44,
    paddingHorizontal: 12,
  },
  root: {
    flex: 1,
    gap: 8,
    padding: 16,
  },
})
