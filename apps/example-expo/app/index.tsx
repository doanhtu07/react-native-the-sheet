import { useRouter } from 'expo-router'
import { useEffect } from 'react'
import { Button, ScrollView, StyleSheet, Text } from 'react-native'
import { multiply } from 'react-native-embedded-stack-navigator'

export default function Index() {
  const router = useRouter()

  // MARK: Effects

  useEffect(() => {
    console.info(`app/index.tsx - multiply():`, multiply(2, 3))
  }, [])

  // MARK: Renderers

  return (
    <ScrollView contentContainerStyle={styles.root}>
      <Text style={styles.header}>Navigator</Text>

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

      <Text style={styles.header}>Portal</Text>

      <Button
        title="Go to Example Portal"
        onPress={() => {
          router.push('/example-portal')
        }}
      />

      <Text style={styles.header}>Sheet Stack</Text>

      <Button
        title="Go to Example Sheet Stack"
        onPress={() => {
          router.push('/example-sheet-stack')
        }}
      />

      <Text style={styles.header}>Bottom Sheet Presenter</Text>

      <Button
        title="Go to Example Bottom Sheet Presenter"
        onPress={() => {
          router.push('/example-bottom-sheet-presenter')
        }}
      />

      <Button
        title="Go to Example Bottom Sheet Presenter (Multiple)"
        onPress={() => {
          router.push('/example-bottom-sheet-presenter-multiple')
        }}
      />

      <Text style={styles.header}>Bottom sheet</Text>

      <Button
        title="Go to Example Bottom Sheet (Dynamic Sizing)"
        onPress={() => {
          router.push('/example-bottom-sheet-dynamic-sizing')
        }}
      />

      <Button
        title="Go to Example Bottom Sheet (Snap Points)"
        onPress={() => {
          router.push('/example-bottom-sheet-snap-points')
        }}
      />

      <Button
        title="Go to Example Bottom Sheet View"
        onPress={() => {
          router.push('/example-bottom-sheet-view')
        }}
      />

      <Button
        title="Go to Example Bottom Sheet Scroll View"
        onPress={() => {
          router.push('/example-bottom-sheet-scroll-view')
        }}
      />

      <Button
        title="Go to Example Bottom Sheet Flat List"
        onPress={() => {
          router.push('/example-bottom-sheet-flat-list')
        }}
      />
    </ScrollView>
  )
}

// MARK: Styles

const styles = StyleSheet.create({
  root: {
    flex: 1,
    padding: 16,
    gap: 8,
  },
  header: {
    fontSize: 20,
    fontWeight: '500',
  },
})
