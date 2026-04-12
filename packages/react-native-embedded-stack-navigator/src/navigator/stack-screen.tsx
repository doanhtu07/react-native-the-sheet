import { type FC, useEffect, useMemo, useRef } from 'react'
import {
  Animated,
  type StyleProp,
  StyleSheet,
  type ViewStyle,
} from 'react-native'
import { type MiniStackRoute, MiniStackRouteContext } from './context'
import type { ScreenRenderer, TransitionType } from './types'
import { FADE_DURATION_MS } from './config'

type Props = {
  screens: Record<string, ScreenRenderer>
  transitionType: TransitionType

  route: MiniStackRoute
  idx: number
  stackLength: number
  rootWidth: number
  removingScreenName: string | null
}

export const StackScreen: FC<Props> = ({
  screens,
  transitionType,
  route,
  idx,
  stackLength,
  rootWidth,
  removingScreenName,
}) => {
  const renderScreen = screens[route.name]

  const isRemoving = removingScreenName === route.name
  const isFocused = idx === stackLength - 1 && !isRemoving
  const canGoBack = idx > 0

  const routeContext = useMemo(
    () => ({ ...route, isFocused, canGoBack }),
    [route, isFocused, canGoBack],
  )

  const opacity = useRef(new Animated.Value(0)).current

  const screenStyle = useMemo<
    Animated.WithAnimatedValue<StyleProp<ViewStyle>>
  >(() => {
    if (transitionType === 'slide') {
      // Slide mode: screens are in a row and we translate the row
      return [styles.root, { width: rootWidth }]
    } else {
      // Fade mode: stack screens on top of each other
      return [
        styles.root,
        styles.fadeScreen,
        {
          opacity,
          pointerEvents: isFocused ? 'auto' : 'none',
        },
      ]
    }
  }, [transitionType, rootWidth, opacity, isFocused])

  // MARK: Effects

  useEffect(
    () => {
      return () => {
        opacity.removeAllListeners()
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  useEffect(() => {
    if (transitionType === 'fade') {
      Animated.timing(opacity, {
        toValue: isFocused ? 1 : 0,
        duration: FADE_DURATION_MS,
        useNativeDriver: true,
      }).start()
    }
  }, [transitionType, opacity, isFocused])

  // MARK: Renderers

  return (
    <Animated.View style={screenStyle}>
      <MiniStackRouteContext.Provider value={routeContext}>
        {renderScreen?.()}
      </MiniStackRouteContext.Provider>
    </Animated.View>
  )
}

// MARK: Styles

const styles = StyleSheet.create({
  fadeScreen: {
    bottom: 0,
    height: '100%',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    width: '100%',
  },
  root: {
    flex: 1,
  },
})
