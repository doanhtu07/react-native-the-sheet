import { Button, StyleSheet, Text, View } from 'react-native'
import { useMiniStackNavigation } from 'react-native-embedded-stack-navigator'
import { RouteParamList } from './types'

export function ScreenA() {
  const navigation = useMiniStackNavigation<RouteParamList>()

  return (
    <View style={styles.root}>
      <Text>Screen A</Text>

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
