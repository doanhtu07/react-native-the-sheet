import { ThemedText } from '@/components/themed-text'
import { useState } from 'react'
import { Button, StyleSheet, View } from 'react-native'
import {
  Backdrop,
  BottomSheetPresenter,
  SheetStackItem,
} from 'react-native-the-sheet'
import { Portal } from 'react-native-universe-portal'

export default function ExampleBottomSheetPresenterCenterSheet() {
  const [isOpenA, setIsOpenA] = useState(false)

  return (
    <View style={styles.root}>
      <ThemedText style={styles.header}>
        Example Bottom Sheet Presenter (Center Sheet)
      </ThemedText>

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
            <View style={styles.boxWrapper}>
              <View style={styles.boxA}>
                <ThemedText>Sheet A</ThemedText>

                <Button
                  title="Close Sheet A"
                  onPress={() => setIsOpenA(false)}
                />

                <ThemedText>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </ThemedText>

                <ThemedText>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </ThemedText>

                <ThemedText>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </ThemedText>

                <ThemedText>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </ThemedText>

                <ThemedText>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </ThemedText>
              </View>
            </View>
          </BottomSheetPresenter>
        </SheetStackItem>
      </Portal>
    </View>
  )
}

// MARK: Styles

const styles = StyleSheet.create({
  boxA: {
    backgroundColor: '#6A0572',
    width: '100%',
  },
  boxWrapper: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
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
