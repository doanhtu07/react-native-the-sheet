import { BottomSheetTemplate } from '@/components/bottom-sheet-template/bottom-sheet-template'
import { ThemedText } from '@/components/themed-text'
import { Fragment, useState } from 'react'
import { View, Pressable, Button, StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function StaticTemplate() {
  const { bottom } = useSafeAreaInsets()

  const [isOpen, setIsOpen] = useState(false)

  const renderHeaderCenter = () => {
    return <ThemedText style={styles.headerTitle}>My Sheet</ThemedText>
  }

  const renderContent = () => {
    return (
      <View style={styles.content}>
        <ThemedText style={styles.title}>
          Bottom Sheet Static Template
        </ThemedText>

        <ThemedText style={styles.description}>
          This is an example of using the reusable bottom sheet template
          component with header, content, and action areas.
        </ThemedText>

        {Array.from({ length: 10 }).map((_, index) => (
          <ThemedText key={index} style={styles.item}>
            Item {index + 1}
          </ThemedText>
        ))}
      </View>
    )
  }

  const renderActions = () => {
    return (
      <View style={[styles.actionsContainer, { paddingBottom: bottom }]}>
        <Pressable style={styles.actionButton} onPress={() => setIsOpen(false)}>
          <ThemedText style={styles.actionButtonText}>Cancel</ThemedText>
        </Pressable>

        <Pressable style={styles.actionButton} onPress={() => setIsOpen(false)}>
          <ThemedText style={styles.actionButtonText}>Confirm</ThemedText>
        </Pressable>
      </View>
    )
  }

  return (
    <Fragment>
      <Button
        title="Open Static Template Sheet"
        onPress={() => setIsOpen(true)}
      />

      <BottomSheetTemplate
        isOpen={isOpen}
        close={() => setIsOpen(false)}
        headerCenter={renderHeaderCenter()}
        showClose
        content={renderContent()}
        actions={renderActions()}
      />
    </Fragment>
  )
}

// MARK: Styles

const styles = StyleSheet.create({
  actionButton: {
    flex: 1,
    paddingVertical: 12,
  },
  actionButtonText: {
    fontSize: 16,
    textAlign: 'center',
  },
  actionsContainer: {
    flexDirection: 'row',
    width: '100%',
  },
  content: {
    padding: 16,
  },
  description: {
    fontSize: 14,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  item: {
    fontSize: 14,
    paddingVertical: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
})
