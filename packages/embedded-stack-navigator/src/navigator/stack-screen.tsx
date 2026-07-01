import { type FC, useEffect, useMemo } from 'react'
import { StyleSheet } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated'
import type { EmbeddedStackScreenProps } from './types'
import { FADE_DURATION_MS } from './config'
import { EmbeddedStackRouteContext } from './context'
import { runOnJS } from 'react-native-worklets'

export const EmbeddedStackScreen: FC<EmbeddedStackScreenProps> = ({
  screens,
  transitionType,
  fill,
  route,
  idx,
  stackLength,
  navigatorWidth,
  removingFadeScreenName,
  onFadeComplete,
  onHeightChange,
}) => {
  const isFadeRemoving = removingFadeScreenName === route.name
  const isFocused = idx === stackLength - 1 && !isFadeRemoving
  const canGoBack = idx > 0

  const routeContext = useMemo(
    () => ({ ...route, isFocused, canGoBack }),
    [route, isFocused, canGoBack],
  )

  const opacity = useSharedValue(0)

  // MARK: Effects

  // Effect: Handle fade animation
  useEffect(() => {
    if (transitionType !== 'fade') return

    const target = isFocused ? 1 : 0

    opacity.value = withTiming(
      target,
      { duration: FADE_DURATION_MS },
      (finished) => {
        if (finished && isFadeRemoving) {
          runOnJS(onFadeComplete)()
        }
      },
    )
  }, [isFadeRemoving, isFocused, onFadeComplete, opacity, transitionType])

  // MARK: Preparation

  const slideStyle = useAnimatedStyle(() => {
    return {
      ...styles.slideScreen,
      ...(fill && styles.screenFill),
      left: idx * navigatorWidth,
      width: navigatorWidth,
    }
  })

  const fadeStyle = useAnimatedStyle(() => {
    return {
      ...styles.fadeScreen,
      ...(fill && styles.screenFill),
      opacity: opacity.value,
      pointerEvents: isFocused ? 'auto' : 'none',
    }
  })

  const noneStyle = useAnimatedStyle(() => {
    return {
      ...styles.noneScreen,
      ...(fill && styles.screenFill),
      opacity: isFocused ? 1 : 0,
      pointerEvents: isFocused ? 'auto' : 'none',
    }
  })

  // MARK: Renderers

  const renderScreen = screens[route.name]

  return (
    <EmbeddedStackRouteContext.Provider value={routeContext}>
      <Animated.View
        style={[
          styles.root,
          fill && styles.fill,
          transitionType === 'slide' ? slideStyle : undefined,
          transitionType === 'fade' ? fadeStyle : undefined,
          transitionType === 'none' ? noneStyle : undefined,
        ]}
        onLayout={(e) => {
          if (!fill) {
            onHeightChange(route, e.nativeEvent.layout.height)
          }
        }}
      >
        {renderScreen?.()}
      </Animated.View>
    </EmbeddedStackRouteContext.Provider>
  )
}

// MARK: Styles

const styles = StyleSheet.create({
  fadeScreen: {
    left: 0,
    position: 'absolute',
    right: 0,
    width: '100%',
  },
  fill: {
    flex: 1,
  },
  noneScreen: {
    left: 0,
    position: 'absolute',
    right: 0,
    width: '100%',
  },
  root: {},
  screenFill: {
    height: '100%',
  },
  slideScreen: {
    position: 'absolute',
    width: '100%',
  },
})
