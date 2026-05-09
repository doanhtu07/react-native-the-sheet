import { ThemedText } from '@/components/themed-text'
import { useNavigation } from 'expo-router'
import { Pressable, StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

type Props = {
  setHeight: (height: number) => void
}

export const BottomNavbar = ({ setHeight }: Props) => {
  const navigation = useNavigation()
  const insets = useSafeAreaInsets()

  return (
    <View
      style={[styles.navbar, { paddingBottom: insets.bottom }]}
      onLayout={(event) => {
        const { height } = event.nativeEvent.layout
        setHeight(height)
      }}
    >
      <Pressable
        style={({ pressed }) => [
          styles.navButton,
          { opacity: pressed ? 0.6 : 1 },
        ]}
        onPress={() => {
          navigation.goBack()
        }}
      >
        <ThemedText style={styles.navText}>Home</ThemedText>
      </Pressable>

      <Pressable style={styles.navButton}>
        <ThemedText style={[styles.navText, styles.navTextFocus]}>
          Shorts
        </ThemedText>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  navButton: {
    alignItems: 'center',
    flex: 1,
  },
  navText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  navTextFocus: {
    fontWeight: '900',
  },
  navbar: {
    flexDirection: 'row',
    padding: 16,
  },
})
