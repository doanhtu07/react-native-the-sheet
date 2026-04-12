import { Button, StyleSheet, Text, View } from 'react-native'
import { useMiniStackNavigation } from 'react-native-embedded-stack-navigator'
import { RouteParamList } from './types'

export function ScreenB() {
  const navigation = useMiniStackNavigation<RouteParamList>()

  return (
    <View style={styles.root}>
      <Text>Screen B</Text>
      <Button title="Back" onPress={() => navigation.pop()} />
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
