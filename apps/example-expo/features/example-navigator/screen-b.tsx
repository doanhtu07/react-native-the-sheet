import { Button, StyleSheet, View } from 'react-native'
import { RouteParamList } from './types'
import { useEmbeddedStackNavigation } from '@the-sheet/embedded-stack-navigator'
import { ThemedText } from '@/components/themed-text'

export function ScreenB() {
  const navigation = useEmbeddedStackNavigation<RouteParamList>()

  return (
    <View style={styles.root}>
      <ThemedText>Screen B</ThemedText>
      <Button title="Back" onPress={() => navigation.pop()} />
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
})
