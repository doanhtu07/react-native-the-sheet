import { ThemedText } from '@/components/themed-text'
import { useCallback, useRef } from 'react'
import {
  Alert,
  Button,
  FlatList,
  StyleSheet,
  View,
  type ListRenderItem,
} from 'react-native'
import { BottomSheetFlatList } from '@the-sheet/the-sheet'
import {
  useEmbeddedStackNavigation,
  useEmbeddedStackRoute,
} from '@the-sheet/embedded-stack-navigator'
import { RouteParamList } from './types'

type DataItem = { key: string; title: string }

export function ScreenA() {
  const route = useEmbeddedStackRoute()
  const navigation = useEmbeddedStackNavigation<RouteParamList>()
  const flatListRef = useRef<FlatList>(null)

  const data: DataItem[] = Array.from({ length: 50 }, (_, i) => ({
    key: String(i),
    title: `Item ${i + 1}`,
  }))

  // MARK: Renderers

  const renderItem: ListRenderItem<DataItem> = useCallback(
    ({ item }) => <ThemedText>{item.title}</ThemedText>,
    [],
  )

  return (
    <View style={styles.root}>
      <ThemedText>
        Screen A (FlatList) - isActive={String(route.isFocused)}
      </ThemedText>

      <Button
        title="Go to Screen B"
        onPress={() =>
          navigation.navigate({ name: 'ScreenB', params: undefined })
        }
      />

      <Button
        title="Scroll to offset 200"
        onPress={() => {
          if (flatListRef.current?.scrollToOffset) {
            flatListRef.current.scrollToOffset({
              offset: 200,
              animated: true,
            })
          } else {
            Alert.alert('scrollToOffset not available')
          }
        }}
      />

      <BottomSheetFlatList
        ref={flatListRef}
        isActive={route.isFocused}
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.key}
      />
    </View>
  )
}

// MARK: Styles

const styles = StyleSheet.create({
  root: { flex: 1, gap: 8 },
})
