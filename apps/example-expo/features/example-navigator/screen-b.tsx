import { Button, StyleSheet, Text, View } from 'react-native'
import { RouteParamList } from './types'
import { useEmbeddedStackNavigation } from 'react-native-embedded-stack-navigator'

export function ScreenB() {
  const navigation = useEmbeddedStackNavigation<RouteParamList>()

  return (
    <View style={styles.root}>
      <Text>Screen B</Text>
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
