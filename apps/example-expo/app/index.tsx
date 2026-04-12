import { StyleSheet, Text, View } from 'react-native'
import { useEffect } from 'react'
import { multiply } from 'react-native-embedded-stack-navigator'

export default function Index() {
  useEffect(() => {
    console.log('=== TEST, multiply(): ', multiply(2, 3))
  }, [])

  return (
    <View style={styles.root}>
      <Text>Edit app/index.tsx to edit this screen.</Text>
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
