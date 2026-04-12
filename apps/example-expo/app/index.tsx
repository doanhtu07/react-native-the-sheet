import { useRouter } from 'expo-router'
import { useEffect } from 'react'
import { Button, StyleSheet, View } from 'react-native'
import { multiply } from 'react-native-embedded-stack-navigator'

export default function Index() {
  const router = useRouter()

  useEffect(() => {
    console.info(`app/index.tsx - multiply():`, multiply(2, 3))
  }, [])

  return (
    <View style={styles.root}>
      <Button
        title="Go to Example Navigator Fade"
        onPress={() => {
          router.push('/example-navigator-fade')
        }}
      />

      <Button
        title="Go to Example Navigator Slide"
        onPress={() => {
          router.push('/example-navigator-slide')
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
})
