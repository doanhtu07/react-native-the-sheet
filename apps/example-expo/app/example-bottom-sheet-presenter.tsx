import { ThemedText } from '@/components/themed-text'
import { useRef, useState } from 'react'
import { Button, StyleSheet, View } from 'react-native'
import {
  Backdrop,
  BottomSheetPresenter,
  SheetStackItem,
  SheetStackItemApi,
  useBottomSheetPresenterRegistryDangerously,
} from '@the-sheet/the-sheet'
import { Portal } from '@the-sheet/universe-portal'
import { useAnimatedReaction } from 'react-native-reanimated'

export default function ExampleBottomSheetPresenter() {
  const bottomSheetPresenterRegistry =
    useBottomSheetPresenterRegistryDangerously()
  const presenters = bottomSheetPresenterRegistry?.presenters

  const presenterId = 'presenterA'
  const presenterA = presenters?.[presenterId]

  const [isOpenA, setIsOpenA] = useState(true)

  const refA = useRef<SheetStackItemApi>(null)

  // MARK: Effects

  useAnimatedReaction(
    () => {
      return {
        presenterHeight: presenterA?.presenterHeight.value,
        presenterVisibleRatio: presenterA?.presenterVisibleRatio.value,
      }
    },
    (prepared) => {
      console.log('example-bottom-sheet-presenter', JSON.stringify(prepared))
    },
  )

  // MARK: Renderers

  return (
    <View style={styles.root}>
      <ThemedText style={styles.header}>
        Example Bottom Sheet Presenter
      </ThemedText>

      <Button title="Open Sheet A" onPress={() => setIsOpenA(true)} />

      <Button
        title="Show (Unhide) Sheet A"
        onPress={() => refA.current?.show()}
      />

      <Portal hostName="root">
        <SheetStackItem
          ref={refA}
          isOpen={isOpenA}
          close={() => setIsOpenA(false)}
          waitForFullyExit
          testID="sheetA"
        >
          <Backdrop />

          <BottomSheetPresenter id={presenterId}>
            <View style={styles.boxA}>
              <ThemedText>Sheet A</ThemedText>
              <Button title="Close Sheet A" onPress={() => setIsOpenA(false)} />

              <Button
                title="Hide Sheet A"
                onPress={() => refA.current?.hide()}
              />

              <ThemedText>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </ThemedText>

              <ThemedText>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </ThemedText>

              <ThemedText>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </ThemedText>

              <ThemedText>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </ThemedText>

              <ThemedText>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </ThemedText>

              <ThemedText>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </ThemedText>
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
