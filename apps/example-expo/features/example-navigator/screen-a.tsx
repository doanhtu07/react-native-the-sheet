import { Button, StyleSheet, View } from 'react-native'
import { RouteParamList } from './types'
import { useEmbeddedStackNavigation } from '@the-sheet/embedded-stack-navigator'
import { ThemedText } from '@/components/themed-text'

export function ScreenA() {
  const navigation = useEmbeddedStackNavigation<RouteParamList>()

  return (
    <View style={styles.root}>
      <ThemedText>Screen A</ThemedText>

      <Button
        title="Go to Screen B"
        onPress={() =>
          navigation.navigate({ name: 'ScreenB', params: undefined })
        }
      />
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
