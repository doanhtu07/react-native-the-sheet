import { ScreenA } from '@/features/example-navigator/screen-a'
import { ScreenB } from '@/features/example-navigator/screen-b'
import { RouteParamList } from '@/features/example-navigator/types'
import { useCallback, useMemo } from 'react'
import { StyleSheet, View } from 'react-native'
import {
  EmbeddedStackNavigator,
  ScreenRenderer,
} from '@the-sheet/embedded-stack-navigator'
import { ScreenC } from '@/features/example-navigator/screen-c'

export default function ExampleNavigatorNone() {
  const renderScreenA = useCallback(() => <ScreenA />, [])

  const renderScreenB = useCallback(() => <ScreenB />, [])

  const renderScreenC = useCallback(() => <ScreenC />, [])

  const screens = useMemo(() => {
    return {
      ScreenA: renderScreenA,
      ScreenB: renderScreenB,
      ScreenC: renderScreenC,
    } satisfies Record<keyof RouteParamList, ScreenRenderer>
  }, [renderScreenA, renderScreenB, renderScreenC])

  return (
    <View style={styles.root}>
      <EmbeddedStackNavigator<typeof screens, RouteParamList, 'ScreenA'>
        initialRouteName={'ScreenA'}
        initialParams={undefined}
        screens={screens}
        transitionType="none"
        animateDynamicHeight={false}
        styles={{ root: styles.navigator }}
      />
    </View>
  )
}

// MARK: Styles

const styles = StyleSheet.create({
  navigator: {
    backgroundColor: 'red',
  },
  root: {
    flex: 1,
  },
})
