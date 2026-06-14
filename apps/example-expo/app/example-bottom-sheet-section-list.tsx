import { ThemedText } from '@/components/themed-text'
import { ReactElement, useMemo, useState } from 'react'
import {
  Button,
  SectionListData,
  SectionListRenderItem,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import {
  Backdrop,
  BottomSheet,
  BottomSheetHandle,
  BottomSheetPresenter,
  BottomSheetProvider,
  BottomSheetView,
  BottomSheetSectionList,
  SheetStackItem,
} from '@the-sheet/the-sheet'
import { Portal } from '@the-sheet/universe-portal'

type Item = {
  id: string
  text: string
}

type Section = {
  title: string
  data: Item[]
}

export default function ExampleBottomSheetSectionList() {
  const [isOpenA, setIsOpenA] = useState(false)
  const [isOpenB, setIsOpenB] = useState(false)

  const maxHeight = 500

  const sections: Section[] = useMemo(() => {
    return [
      {
        title: 'Fruits',
        data: Array.from({ length: 10 }).map((_, i) => ({
          id: `fruit-${i}`,
          text: `Fruit ${i + 1}`,
        })),
      },
      {
        title: 'Vegetables',
        data: Array.from({ length: 10 }).map((_, i) => ({
          id: `veg-${i}`,
          text: `Vegetable ${i + 1}`,
        })),
      },
      {
        title: 'Drinks',
        data: Array.from({ length: 10 }).map((_, i) => ({
          id: `drink-${i}`,
          text: `Drink ${i + 1}`,
        })),
      },
    ]
  }, [])

  // MARK: Renderers

  const renderItem: SectionListRenderItem<Item, Section> = ({ item }) => {
    return (
      <View style={styles.item}>
        <ThemedText>{item.text}</ThemedText>
      </View>
    )
  }

  const renderSectionHeader: (info: {
    section: SectionListData<Item, Section>
  }) => ReactElement | null = ({ section }) => {
    return (
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{section.title}</Text>
      </View>
    )
  }

  return (
    <View style={styles.root}>
      <ThemedText style={styles.header}>
        Example Bottom Sheet Section List
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

                  <BottomSheetSectionList
                    fill
                    sections={sections}
                    renderItem={renderItem}
                    renderSectionHeader={renderSectionHeader}
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

                  <BottomSheetSectionList
                    fill
                    sections={sections}
                    renderItem={renderItem}
                    renderSectionHeader={renderSectionHeader}
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
  sectionHeader: {
    backgroundColor: '#f2f2f2',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  sectionTitle: {
    fontWeight: '600',
  },
})
