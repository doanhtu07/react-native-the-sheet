import { useRouter } from 'expo-router'
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native'

export default function Index() {
  const router = useRouter()

  // MARK: Renderers

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={styles.contentContainer}
    >
      {/* MARK: Navigator */}

      <Text style={styles.header}>Navigator</Text>

      <Button
        title="Example Navigator Slide"
        onPress={() => {
          router.push('/example-navigator-slide')
        }}
      />

      <Button
        title="Example Navigator Fade"
        onPress={() => {
          router.push('/example-navigator-fade')
        }}
      />

      <Button
        title="Example Navigator None"
        onPress={() => {
          router.push('/example-navigator-none')
        }}
      />

      <View style={styles.divider} />

      {/* MARK: Portal */}

      <Text style={styles.header}>Portal</Text>

      <Button
        title="Example Portal"
        onPress={() => {
          router.push('/example-portal')
        }}
      />

      <View style={styles.divider} />

      {/* MARK: Sheet Stack */}

      <Text style={styles.header}>Sheet Stack</Text>

      <Button
        title="Example Sheet Stack"
        onPress={() => {
          router.push('/example-sheet-stack')
        }}
      />

      {/* MARK: Bottom Sheet Presenter */}

      <Text style={styles.header}>Bottom Sheet Presenter</Text>

      <Button
        title="Example Bottom Sheet Presenter"
        onPress={() => {
          router.push('/example-bottom-sheet-presenter')
        }}
      />

      <Button
        title="Example Bottom Sheet Presenter (Multiple)"
        onPress={() => {
          router.push('/example-bottom-sheet-presenter-multiple')
        }}
      />

      <Button
        title="Example Bottom Sheet Presenter (Center Sheet)"
        onPress={() => {
          router.push('/example-bottom-sheet-presenter-center-sheet')
        }}
      />

      <Button
        title="Example Bottom Sheet Presenter (Reshow + PutOnTop)"
        onPress={() => {
          router.push('/example-bottom-sheet-presenter-reshow-putontop')
        }}
      />

      {/* MARK: Bottom Sheet */}

      <Text style={styles.header}>Bottom Sheet</Text>

      <Button
        title="Example Bottom Sheet (Dynamic Sizing)"
        onPress={() => {
          router.push('/example-bottom-sheet-dynamic-sizing')
        }}
      />

      <Button
        title="Example Bottom Sheet (Snap Points)"
        onPress={() => {
          router.push('/example-bottom-sheet-snap-points')
        }}
      />

      <Button
        title="Example Bottom Sheet (Float Mode)"
        onPress={() => {
          router.push('/example-bottom-sheet-float-mode')
        }}
      />

      <Button
        title="Example Bottom Sheet (Overdrag Mode)"
        onPress={() => {
          router.push('/example-bottom-sheet-overdrag-mode')
        }}
      />

      <Button
        title="Example Bottom Sheet (Disable Drag)"
        onPress={() => {
          router.push('/example-bottom-sheet-disable-drag')
        }}
      />

      {/* MARK: Bottom Sheet View Types */}

      <Text style={styles.header}>Bottom Sheet View Types</Text>

      <Button
        title="Example Bottom Sheet View"
        onPress={() => {
          router.push('/example-bottom-sheet-view')
        }}
      />

      <Button
        title="Example Bottom Sheet Scroll View"
        onPress={() => {
          router.push('/example-bottom-sheet-scroll-view')
        }}
      />

      <Button
        title="Example Bottom Sheet Flat List"
        onPress={() => {
          router.push('/example-bottom-sheet-flat-list')
        }}
      />

      <Button
        title="Example Bottom Sheet Virtualized List"
        onPress={() => {
          router.push('/example-bottom-sheet-virtualized-list')
        }}
      />

      <Button
        title="Example Bottom Sheet Section List"
        onPress={() => {
          router.push('/example-bottom-sheet-section-list')
        }}
      />

      <Button
        title="Example Bottom Sheet Flash List"
        onPress={() => {
          router.push('/example-bottom-sheet-flash-list')
        }}
      />

      <Button
        title="Example Bottom Sheet Footer"
        onPress={() => {
          router.push('/example-bottom-sheet-footer')
        }}
      />

      {/* MARK: Height Budget Pattern */}

      <Text style={styles.header}>Height Budget Pattern</Text>

      <Button
        title="Example Height Budget Scroll View"
        onPress={() => {
          router.push('/example-height-budget-scroll-view')
        }}
      />

      {/* MARK: Bottom Sheet + Navigator */}

      <Text style={styles.header}>Bottom Sheet + Navigator</Text>

      <Button
        title="Example Bottom Sheet + Navigator"
        onPress={() => {
          router.push('/example-bottom-sheet-with-navigator')
        }}
      />

      {/* MARK: Bottom Sheet + Keyboard */}

      <Text style={styles.header}>Bottom Sheet + Keyboard</Text>

      <Button
        title="Example Bottom Sheet + Keyboard"
        onPress={() => {
          router.push('/example-bottom-sheet-with-keyboard')
        }}
      />

      {/* MARK: Watcher Pattern */}

      <Text style={styles.header}>Watcher Pattern</Text>

      <Button
        title="Example Above Bottom Sheet View"
        onPress={() => {
          router.push('/example-above-bottom-sheet-view')
        }}
      />

      <Button
        title="Example Backdrop Opacity"
        onPress={() => {
          router.push('/example-backdrop-opacity')
        }}
      />

      {/* MARK: Templates */}

      <Text style={styles.header}>Templates</Text>

      <Button
        title="Example Bottom Sheet Templates"
        onPress={() => {
          router.push('/example-bottom-sheet-templates')
        }}
      />

      {/* MARK: YouTube */}

      <Text style={styles.header}>YouTube Clone</Text>

      <Button
        title="Example YouTube Clone"
        onPress={() => {
          router.push('/example-youtube-clone')
        }}
      />

      <View style={styles.divider} />

      {/* MARK: Dynamic Tray */}

      <Text style={styles.header}>Dynamic Tray</Text>
      <Text selectable>https://benji.org/family-values</Text>

      <Button
        title="Example Dynamic Tray"
        onPress={() => {
          router.push('/example-simple-dynamic-tray')
        }}
      />
    </ScrollView>
  )
}

// MARK: Styles

const styles = StyleSheet.create({
  contentContainer: {
    gap: 8,
    padding: 16,
    paddingBottom: 64,
  },
  divider: {
    backgroundColor: 'lightgray',
    height: 1,
    marginVertical: 12,
  },
  header: {
    fontSize: 20,
    fontWeight: '500',
  },
  root: {
    flex: 1,
  },
})
