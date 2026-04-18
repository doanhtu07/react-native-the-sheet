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
        <Text>{item.text}</Text>
      </View>
    )
  }

  return (
    <View style={styles.root}>
      <Text style={styles.header}>Example Bottom Sheet Flat List</Text>

      <View style={styles.note}>
        <Text style={styles.noteText}>
          When nesting BottomSheetScrollView / BottomSheetFlatList inside
          BottomSheetView, if you see issues with flex / overflow, try setting
          `fill` along the component hierarchy
        </Text>

        <Text style={styles.noteText}>
          Example: BottomSheet -- BottomSheetView -- BottomSheetFlatList
        </Text>

        <Text style={styles.noteText}>
          If that does not work, you should solve the the flex puzzle yourself
          by placing `flex: 1` to certain components.
        </Text>
      </View>

      <View style={styles.note}>
        <Text style={styles.noteText}>
          You should not use `fill` on BottomSheet when you are using snap
          points
        </Text>
      </View>

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
            <BottomSheet fill styles={{ root: { maxHeight } }}>
              <BottomSheetHandle />

              <BottomSheetView fill>
                <Text>Sheet A</Text>

                <Button
                  title="Close Sheet A"
                  onPress={() => setIsOpenA(false)}
                />

                <BottomSheetFlatList fill data={data} renderItem={renderItem} />
              </BottomSheetView>
            </BottomSheet>
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
            <BottomSheet snapPoints={['25%', '50%']}>
              <BottomSheetHandle />

              <BottomSheetView fill>
                <Text>Sheet B</Text>

                <Button
                  title="Close Sheet B"
                  onPress={() => setIsOpenB(false)}
                />

                <BottomSheetFlatList fill data={data} renderItem={renderItem} />
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
  note: {
    gap: 16,
    backgroundColor: '#EFF6FF',
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
    borderRadius: 4,
    padding: 12,
  },
  noteText: {
    color: '#1E40AF',
    lineHeight: 22,
    fontWeight: '500',
  },
})
