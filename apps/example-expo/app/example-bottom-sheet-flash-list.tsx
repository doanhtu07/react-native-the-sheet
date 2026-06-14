import { ThemedText } from '@/components/themed-text'
import { ListRenderItem } from '@shopify/flash-list'
import { useMemo, useState } from 'react'
import { Button, StyleSheet, View } from 'react-native'
import {
  Backdrop,
  BottomSheet,
  BottomSheetHandle,
  BottomSheetPresenter,
  BottomSheetProvider,
  BottomSheetView,
  SheetStackItem,
} from '@the-sheet/the-sheet'
import { BottomSheetFlashList } from '@the-sheet/the-sheet/flash-list-v1'
import { Portal } from '@the-sheet/universe-portal'

export default function ExampleBottomSheetFlashList() {
  const [isOpenA, setIsOpenA] = useState(false)
  const [isOpenB, setIsOpenB] = useState(false)

  // When using dynamic sizing, it's important to set a max height
  // to prevent content taking up the entire screen
  const maxHeight = 500

  const data = useMemo(() => {
    return Array.from({ length: 50 }).map((_, index) => ({
      id: index.toString(),
      text: `Item ${index + 1}`,
    }))
  }, [])

  // MARK: Renderers

  const renderItem: ListRenderItem<{ id: string; text: string }> = ({
    item,
  }) => {
    return (
      <View style={styles.item}>
        <ThemedText>{item.text}</ThemedText>
      </View>
    )
  }

  return (
    <View style={styles.root}>
      <ThemedText style={styles.header}>
        Example Bottom Sheet Flash List
      </ThemedText>

      <Button
        title="Open Sheet A (Dynamic sizing + Wrapped with BottomSheetView)"
        onPress={() => setIsOpenA(true)}
      />

      <Button
        title="Open Sheet B (Snap points + Wrapped with BottomSheetView)"
        onPress={() => setIsOpenB(true)}
      />

      <Portal hostName="root">
        <SheetStackItem
          isOpen={isOpenA}
          close={() => setIsOpenA(false)}
          waitForFullyExit
          testID="sheetA"
        >
          <Backdrop />

          <BottomSheetPresenter>
            <BottomSheetProvider>
              <BottomSheet fill styles={{ root: { maxHeight } }}>
                <BottomSheetHandle />

                <BottomSheetView fill>
                  <ThemedText>Sheet A</ThemedText>

                  <Button
                    title="Close Sheet A"
                    onPress={() => setIsOpenA(false)}
                  />

                  <BottomSheetFlashList
                    fill
                    data={data}
                    renderItem={renderItem}
                    estimatedItemSize={50}
                  />
                </BottomSheetView>
              </BottomSheet>
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
          <Backdrop />

          <BottomSheetPresenter>
            <BottomSheetProvider snapPoints={['25%', '50%']}>
              <BottomSheet>
                <BottomSheetHandle />

                <BottomSheetView fill>
                  <ThemedText>Sheet B</ThemedText>

                  <Button
                    title="Close Sheet B"
                    onPress={() => setIsOpenB(false)}
                  />

                  <BottomSheetFlashList
                    fill
                    data={data}
                    renderItem={renderItem}
                    estimatedItemSize={50}
                  />
                </BottomSheetView>
              </BottomSheet>
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
  item: {
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    padding: 16,
  },
  root: {
    flex: 1,
    gap: 8,
    padding: 16,
  },
})
