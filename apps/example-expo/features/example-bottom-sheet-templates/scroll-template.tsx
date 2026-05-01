import { Fragment, useState } from 'react'
import { Button, Pressable, StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { ThemedText } from '@/components/text'
import {
  BottomSheetScrollView,
  HeightClaim,
  HeightFill,
  useTrueSafeArea,
} from 'react-native-the-sheet'
import { BottomSheetTemplate } from '@/components/bottom-sheet-template/bottom-sheet-template'

export default function ScrollTemplate() {
  const { top, bottom } = useSafeAreaInsets()
  const { windowHeight } = useTrueSafeArea()

  const [isOpen, setIsOpen] = useState(false)

  const renderHeaderCenter = () => {
    return <ThemedText style={styles.headerTitle}>My Sheet</ThemedText>
  }

  const renderContent = () => {
    return (
      <View>
        <HeightClaim>
          <View style={styles.topContent}>
            <ThemedText style={styles.title}>
              Bottom Sheet Scroll Template
            </ThemedText>

            <ThemedText style={styles.description}>
              This is an example of using the reusable bottom sheet template
              component with header, content, and action areas.
            </ThemedText>
          </View>
        </HeightClaim>

        <HeightFill>
          <BottomSheetScrollView contentContainerStyle={styles.scrollContent}>
            {Array.from({ length: 100 }).map((_, index) => (
              <ThemedText key={index} style={styles.item}>
                Item {index + 1}
              </ThemedText>
            ))}
          </BottomSheetScrollView>
        </HeightFill>
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
        title="Open Scroll Template Sheet"
        onPress={() => setIsOpen(true)}
      />

      <BottomSheetTemplate
        isOpen={isOpen}
        close={() => setIsOpen(false)}
        maxHeight={windowHeight - top}
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
  scrollContent: {
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  topContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
})
