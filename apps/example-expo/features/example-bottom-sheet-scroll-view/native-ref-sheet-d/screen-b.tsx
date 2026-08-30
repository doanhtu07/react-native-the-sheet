import { ThemedText } from '@/components/themed-text'
import { useRef } from 'react'
import { Alert, Button, ScrollView, StyleSheet, View } from 'react-native'
import { BottomSheetScrollView } from '@the-sheet/the-sheet'
import {
  useEmbeddedStackNavigation,
  useEmbeddedStackRoute,
} from '@the-sheet/embedded-stack-navigator'
import { RouteParamList } from './types'

export function ScreenB() {
  const route = useEmbeddedStackRoute()
  const navigation = useEmbeddedStackNavigation<RouteParamList>()
  const scrollViewRef = useRef<ScrollView>(null)

  // MARK: Renderers

  return (
    <View style={styles.root}>
      <ThemedText>
        Screen B (ScrollView) - isActive={String(route.isFocused)}
      </ThemedText>

      <Button
        title="Go to Screen A"
        onPress={() =>
          navigation.navigate({ name: 'ScreenA', params: undefined })
        }
      />

      <Button title="Back" onPress={() => navigation.pop()} />

      <Button
        title="Scroll to offset 150"
        onPress={() => {
          if (scrollViewRef.current?.scrollTo) {
            scrollViewRef.current.scrollTo({
              y: 150,
              animated: true,
            })
          } else {
            Alert.alert('scrollTo not available')
          }
        }}
      />

      <BottomSheetScrollView ref={scrollViewRef} isActive={route.isFocused}>
        {Array.from({ length: 100 }).map((_, i) => (
          <ThemedText key={i}>Item {i + 1}</ThemedText>
        ))}
      </BottomSheetScrollView>
    </View>
  )
}

// MARK: Styles

const styles = StyleSheet.create({
  root: { flex: 1, gap: 8 },
})
