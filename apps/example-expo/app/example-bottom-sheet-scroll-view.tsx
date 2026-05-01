import { ThemedText } from '@/components/text'
import { DynamicSizingSheetA } from '@/features/example-bottom-sheet-scroll-view/dynamic-sizing-sheet-a'
import { NestedScrollSheetC } from '@/features/example-bottom-sheet-scroll-view/nested-scroll-sheet-c'
import { SnapPointsSheetB } from '@/features/example-bottom-sheet-scroll-view/snap-points-sheet-b'
import { StyleSheet, View } from 'react-native'

export default function ExampleBottomSheetScrollView() {
  return (
    <View style={styles.root}>
      <ThemedText style={styles.header}>
        Example Bottom Sheet Scroll View
      </ThemedText>

      <DynamicSizingSheetA />
      <SnapPointsSheetB />
      <NestedScrollSheetC />
    </View>
  )
}

// MARK: Styles

const styles = StyleSheet.create({
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
