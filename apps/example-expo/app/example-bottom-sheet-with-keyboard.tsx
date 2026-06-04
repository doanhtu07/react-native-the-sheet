import { ThemedText } from '@/components/themed-text'
import { ManagedTextInput } from '@/features/example-bottom-sheet-with-keyboard/managed-text-input'
import { Fragment, useState } from 'react'
import { Button, Keyboard, StyleSheet, View } from 'react-native'
import { TextInput } from 'react-native-gesture-handler'
import {
  BottomSheet,
  BottomSheetHandle,
  BottomSheetPresenter,
  BottomSheetScrollView,
  BottomSheetKeyboardExpander,
  SheetStackItem,
  InputFocusProvider,
  BottomSheetProvider,
} from 'react-native-the-sheet'
import { Portal } from 'react-native-universe-portal'

export default function ExampleBottomSheetWithKeyboard() {
  const [isOpenA, setIsOpenA] = useState(false)
  const [isOpenB, setIsOpenB] = useState(false)
  const [isOpenC, setIsOpenC] = useState(false)

  // MARK: Renderers

  const renderContent = (length: number) => {
    return (
      <Fragment>
        {Array.from({ length }).map((_, index) => (
          <ThemedText key={index}>Item {index + 1}</ThemedText>
        ))}
      </Fragment>
    )
  }

  return (
    <View style={styles.root}>
      <ThemedText style={styles.header}>
        Example Bottom Sheet With Keyboard
      </ThemedText>

      <Button
        title="Open Sheet A (Android refuses pan)"
        onPress={() => setIsOpenA(true)}
      />

      <Button
        title="Open Sheet B (Android will pan)"
        onPress={() => setIsOpenB(true)}
      />

      <Button
        title="Open Sheet C (Input inside scroll view)"
        onPress={() => setIsOpenC(true)}
      />

      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder="Type something..."
          placeholderTextColor="#999"
        />

        <Button title="Done" onPress={() => Keyboard.dismiss()} />
      </View>

      <Portal hostName="root">
        <SheetStackItem
          isOpen={isOpenA}
          close={() => setIsOpenA(false)}
          waitForFullyExit
          testID="sheetA"
        >
          <BottomSheetPresenter>
            <BottomSheetProvider snapPoints={[400, 800]}>
              <InputFocusProvider>
                <BottomSheet>
                  <BottomSheetHandle />

                  <BottomSheetScrollView>
                    <ThemedText>Sheet A</ThemedText>

                    <Button
                      title="Close Sheet A"
                      onPress={() => setIsOpenA(false)}
                    />

                    <ManagedTextInput
                      style={styles.input}
                      placeholder="Type something..."
                      placeholderTextColor="#999"
                    />

                    {renderContent(5)}
                  </BottomSheetScrollView>
                </BottomSheet>

                <BottomSheetKeyboardExpander keyboardOffset={20} />
              </InputFocusProvider>
            </BottomSheetProvider>
          </BottomSheetPresenter>
        </SheetStackItem>
      </Portal>

      <Portal hostName="root">
        <SheetStackItem
          isOpen={isOpenB}
          close={() => setIsOpenB(false)}
          waitForFullyExit
          testID="sheetB"
        >
          <BottomSheetPresenter>
            <BottomSheetProvider snapPoints={[400]}>
              <InputFocusProvider>
                <BottomSheet>
                  <BottomSheetHandle />

                  <BottomSheetScrollView>
                    <ThemedText>Sheet B</ThemedText>

                    <Button
                      title="Close Sheet B"
                      onPress={() => setIsOpenB(false)}
                    />

                    <ManagedTextInput
                      style={styles.input}
                      placeholder="Type something..."
                      placeholderTextColor="#999"
                    />

                    {renderContent(5)}
                  </BottomSheetScrollView>
                </BottomSheet>

                <BottomSheetKeyboardExpander keyboardOffset={20} />
              </InputFocusProvider>
            </BottomSheetProvider>
          </BottomSheetPresenter>
        </SheetStackItem>
      </Portal>

      <Portal hostName="root">
        <SheetStackItem
          isOpen={isOpenC}
          close={() => setIsOpenC(false)}
          waitForFullyExit
          testID="sheetC"
        >
          <BottomSheetPresenter>
            <BottomSheetProvider snapPoints={[400]}>
              <InputFocusProvider>
                <BottomSheet>
                  <BottomSheetHandle />

                  <BottomSheetScrollView>
                    <ThemedText>Sheet C</ThemedText>

                    <Button
                      title="Close Sheet C"
                      onPress={() => setIsOpenC(false)}
                    />

                    {renderContent(20)}

                    <ManagedTextInput
                      style={styles.input}
                      placeholder="Type something..."
                      placeholderTextColor="#999"
                    />

                    {renderContent(20)}
                  </BottomSheetScrollView>
                </BottomSheet>

                <BottomSheetKeyboardExpander keyboardOffset={20} />
              </InputFocusProvider>
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
  input: {
    borderColor: '#ccc',
    borderRadius: 8,
    borderWidth: 1,
    color: '#000',
    flex: 1,
    fontSize: 16,
    height: 44,
    paddingHorizontal: 12,
  },
  inputWrapper: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  root: {
    flex: 1,
    gap: 8,
    padding: 16,
  },
})
