import { useMemo, useState } from 'react'
import { Button, ListRenderItem, StyleSheet, Text, View } from 'react-native'
import {
  Backdrop,
  BottomSheet,
  BottomSheetFlatList,
  BottomSheetHandle,
  BottomSheetPresenter,
  BottomSheetView,
  SheetStackItem,
} from 'react-native-the-sheet'
import { Portal } from 'react-native-universe-portal'

export default function ExampleBottomSheetFlatList() {
  const [isOpenA, setIsOpenA] = useState(false)

  // When using dynamic sizing, it's important to set a max height
  // to prevent content taking up the entire screen
  const maxHeight = 500

  const data = useMemo(() => {
    return Array.from({ length: 100 }).map((_, index) => ({
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
        <Text>{item.text}</Text>
      </View>
    )
  }

  return (
    <View style={styles.root}>
      <Text style={styles.header}>Example Bottom Sheet Flat List</Text>

      <Button
        title="Open Sheet A (Dynamic sizing)"
        onPress={() => setIsOpenA(true)}
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
            <BottomSheet styles={{ root: { maxHeight } }}>
              <BottomSheetHandle />

              <BottomSheetView>
                <Text>Sheet A</Text>

                <Button
                  title="Close Sheet A"
                  onPress={() => setIsOpenA(false)}
                />

                <BottomSheetFlatList data={data} renderItem={renderItem} />
              </BottomSheetView>
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
  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
})
