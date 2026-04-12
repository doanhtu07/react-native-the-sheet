import { ScreenA } from '@/features/example-navigator/screen-a'
import { ScreenB } from '@/features/example-navigator/screen-b'
import { RouteParamList } from '@/features/example-navigator/types'
import { useCallback, useMemo } from 'react'
import { StyleSheet, View } from 'react-native'
import {
  MiniStackNavigator,
  ScreenRenderer,
} from 'react-native-embedded-stack-navigator'

export default function ExampleNavigatorSlide() {
  const renderScreenA = useCallback(() => <ScreenA />, [])

  const renderScreenB = useCallback(() => <ScreenB />, [])

  const screens = useMemo(() => {
    return {
      ScreenA: renderScreenA,
      ScreenB: renderScreenB,
    } satisfies Record<keyof RouteParamList, ScreenRenderer>
  }, [renderScreenA, renderScreenB])

  return (
    <View style={styles.root}>
      <MiniStackNavigator<typeof screens, RouteParamList, 'ScreenA'>
        initialRouteName={'ScreenA'}
        initialParams={undefined}
        screens={screens}
        transitionType="slide"
      />
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
})
