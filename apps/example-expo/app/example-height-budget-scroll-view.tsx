import { ThemedText } from '@/components/themed-text'
import { DynamicSizingSheetA } from '@/features/example-height-budget-scroll-view/dynamic-sizing-sheet-a'
import { HeightBudgetSheetB } from '@/features/example-height-budget-scroll-view/height-budget-sheet-b/height-budget-sheet-b'
import { StyleSheet, View } from 'react-native'

export default function ExampleHeightBudgetScrollView() {
  return (
    <View style={styles.root}>
      <ThemedText style={styles.header}>
        Example Height Budget Scroll View
      </ThemedText>

      <DynamicSizingSheetA />
      <HeightBudgetSheetB />
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
