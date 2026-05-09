import { StyleSheet, View } from 'react-native'
import { ThemedText } from '@/components/themed-text'
import StaticTemplate from '@/features/example-bottom-sheet-templates/static-template'
import ScrollTemplate from '@/features/example-bottom-sheet-templates/scroll-template'

export default function ExampleBottomSheetStaticTemplate() {
  return (
    <View style={styles.root}>
      <ThemedText style={styles.header}>
        Example Bottom Sheet Static Template
      </ThemedText>

      <StaticTemplate />
      <ScrollTemplate />
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
