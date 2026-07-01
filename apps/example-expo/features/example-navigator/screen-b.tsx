import { Button, StyleSheet, View } from 'react-native'
import { RouteParamList } from './types'
import { useEmbeddedStackNavigation } from '@the-sheet/embedded-stack-navigator'
import { ThemedText } from '@/components/themed-text'
import { useState } from 'react'

type Props = {
  fill?: boolean
}

export function ScreenB({ fill = false }: Readonly<Props>) {
  const navigation = useEmbeddedStackNavigation<RouteParamList>()

  const [items, setItems] = useState<number[]>([])

  const spawnItem = () => {
    setItems((prevItems) => [...prevItems, prevItems.length + 1])
  }

  const removeItem = () => {
    setItems((prevItems) => prevItems.slice(0, -1))
  }

  // MARK: Renderers

  return (
    <View style={[styles.root, fill && styles.fill]}>
      <ThemedText>Screen B</ThemedText>

      <Button
        title="Go to Screen C"
        onPress={() =>
          navigation.navigate({ name: 'ScreenC', params: undefined })
        }
      />

      <Button title="Back" onPress={() => navigation.pop()} />

      <Button title="Spawn Item" onPress={spawnItem} />

      <Button title="Remove Item" onPress={removeItem} />

      {items.map((item) => (
        <View key={item} style={styles.item}>
          <ThemedText>Item {item}</ThemedText>
        </View>
      ))}
    </View>
  )
}

// MARK: Styles

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  item: {
    backgroundColor: 'lightgray',
    borderRadius: 4,
    marginVertical: 4,
    padding: 8,
  },
  root: {
    alignItems: 'center',
    justifyContent: 'center',
  },
})
