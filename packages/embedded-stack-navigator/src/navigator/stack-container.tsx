import { useCallback, type FC } from 'react'
import type { EmbeddedScreenContainerProps, EmbeddedStackRoute } from './types'
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated'
import { StyleSheet, type ViewStyle } from 'react-native'
import { EmbeddedStackScreen } from './stack-screen'
import { SPRING_CONFIG } from './config'

export const EmbeddedStackContainer: FC<EmbeddedScreenContainerProps> = ({
  screens,
  transitionType,
  animateDynamicHeight,
  fill,
  stack,
  navigatorWidth,
  slideTranslateX,
  removingFadeScreenName,
  onFadeComplete,
  dynamicRouteHeights,
  setDynamicRouteHeights,
  currentDynamicRouteHeight,
}) => {
  const onHeightChange = useCallback(
    (route: EmbeddedStackRoute, height: number) => {
      setDynamicRouteHeights((prev) => {
        if (prev[route.key] === height) return prev
        return { ...prev, [route.key]: height }
      })
    },
    [setDynamicRouteHeights],
  )

  // MARK: Preparation

  const animatedContainerStyle = useAnimatedStyle(() => {
    let style: ViewStyle = {
      transform: [{ translateX: slideTranslateX.value }],
    }

    if (!fill) {
      const currentRoute = stack.at(-1)

      const currentHeight =
        currentRoute && dynamicRouteHeights[currentRoute.key]
          ? dynamicRouteHeights[currentRoute.key]!
          : 0

      if (currentHeight !== 0) {
        if (animateDynamicHeight) {
          currentDynamicRouteHeight.value = withSpring(
            currentHeight,
            SPRING_CONFIG,
          )
        } else {
          currentDynamicRouteHeight.value = currentHeight
        }

        style = {
          ...style,
          height: currentDynamicRouteHeight.value,
        }
      }
    }

    return style
  })

  // MARK: Renderers

  return (
    <Animated.View
      style={[
        styles.container,
        fill && styles.fill,
        {
          width: navigatorWidth,
        },
        animatedContainerStyle,
      ]}
    >
      {stack.map((route, idx) => (
        <EmbeddedStackScreen
          key={route.key}
          screens={screens}
          transitionType={transitionType}
          fill={fill}
          //
          route={route}
          idx={idx}
          stackLength={stack.length}
          //
          navigatorWidth={navigatorWidth}
          //
          removingFadeScreenName={removingFadeScreenName}
          onFadeComplete={onFadeComplete}
          //
          onHeightChange={onHeightChange}
        />
      ))}
    </Animated.View>
  )
}

// MARK: Styles

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  fill: {
    flex: 1,
  },
})
