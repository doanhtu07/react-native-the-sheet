import { ThemedText } from '@/components/themed-text'
import { Button, StyleSheet, View } from 'react-native'
import {
  BottomSheetScrollView,
  HeightClaim,
  HeightFill,
} from '@the-sheet/the-sheet'
import {
  useEmbeddedStackNavigation,
  useEmbeddedStackRoute,
} from '@the-sheet/embedded-stack-navigator'
import { RouteParamList } from './types'

export function ScreenA() {
  const route = useEmbeddedStackRoute()
  const navigation = useEmbeddedStackNavigation<RouteParamList>()

  return (
    <View style={styles.root}>
      <HeightClaim isActive={route.isFocused}>
        <ThemedText>
          Screen A (ScrollView + HeightClaim) - isActive=
          {String(route.isFocused)}
        </ThemedText>

        <Button
          title="Go to Screen B"
          onPress={() =>
            navigation.navigate({ name: 'ScreenB', params: undefined })
          }
        />

        <View style={styles.spacer} />
      </HeightClaim>

      <HeightFill>
        <BottomSheetScrollView isActive={route.isFocused}>
          {Array.from({ length: 20 }).map((_, i) => (
            <ThemedText key={i}>Item {i + 1}</ThemedText>
          ))}
        </BottomSheetScrollView>
      </HeightFill>
    </View>
  )
}

// MARK: Styles

const styles = StyleSheet.create({
  root: {},
  spacer: {
    height: 8,
  },
})
