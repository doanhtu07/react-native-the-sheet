import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { useSharedValue, runOnJS, withSpring } from 'react-native-reanimated'
import type {
  EmbeddedStackNavigationApi,
  EmbeddedStackNavigatorProps,
  EmbeddedStackRoute,
  ScreenRenderer,
} from './types'
import { SPRING_CONFIG } from './config'
import { EmbeddedStackNavigationContext } from './context'
import { EmbeddedStackContainer } from './stack-container'

export const EmbeddedStackNavigator = function <
  Screens extends Record<string, ScreenRenderer>,
  ParamList extends Record<keyof Screens, unknown>,
  InitialRouteName extends keyof Screens = keyof Screens,
>({
  initialRouteName,
  initialParams,
  screens,
  transitionType = 'slide',
  animateDynamicHeight = true,
  fill = false,
  styles: propStyles,
}: EmbeddedStackNavigatorProps<Screens, ParamList, InitialRouteName>) {
  const isMounted = useSharedValue(false)

  const [stack, setStack] = useState<EmbeddedStackRoute[]>([
    {
      key: `${String(initialRouteName)}_${Date.now()}`,
      name: String(initialRouteName),
      params: initialParams,
      isFocused: true,
      canGoBack: false,
    },
  ])

  const [navigatorWidth, setNavigatorWidth] = useState(0)

  // MARK: Slide

  const slideTranslateX = useSharedValue(0)

  // MARK: Fade

  const pendingFadeStackRef = useRef<EmbeddedStackRoute[] | null>(null)

  const [removingFadeScreenName, setRemovingFadeScreenName] = useState<
    string | null
  >(null)

  // MARK: Dynamic height

  // route.key -> height
  const [dynamicRouteHeights, setDynamicRouteHeights] = useState<
    Record<string, number>
  >({})

  const currentDynamicRouteHeight = useSharedValue(0)

  // MARK: Transition methods

  const jumpTo = useCallback(
    (toValue: number) => {
      slideTranslateX.value = toValue
    },
    [slideTranslateX],
  )

  const slideTo = useCallback(
    (toValue: number, newStack: EmbeddedStackRoute[]) => {
      slideTranslateX.value = withSpring(toValue, SPRING_CONFIG, (finished) => {
        if (finished && isMounted.value) {
          runOnJS(setStack)(newStack)
        }
      })
    },
    [isMounted, slideTranslateX],
  )

  const fadeTo = useCallback((newStack: EmbeddedStackRoute[]) => {
    pendingFadeStackRef.current = newStack
  }, [])

  const onFadeComplete = useCallback(() => {
    const pending = pendingFadeStackRef.current
    if (!pending) return

    pendingFadeStackRef.current = null
    setStack(pending)
    setRemovingFadeScreenName(null)
  }, [])

  // MARK: Navigation methods

  const navigate = useCallback(
    function navigateCore<ScreenName extends keyof ParamList>(input: {
      name: ScreenName
      params: ParamList[ScreenName]
    }) {
      const { name, params } = input

      setStack((prev) => {
        const existingIdx = prev.findIndex((route) => route.name === name)
        let newStack: EmbeddedStackRoute[]

        if (existingIdx === -1) {
          // Not found - push new route
          newStack = [
            ...prev,
            {
              key: `${String(name)}_${Date.now()}`,
              name: String(name),
              params,
              isFocused: false,
              canGoBack: false,
            },
          ]
        } else {
          // Found it - remove the route and all routes after + push new instance with updated params
          newStack = [
            ...prev.slice(0, existingIdx),
            {
              key: `${String(name)}_${Date.now()}`,
              name: String(name),
              params,
              isFocused: false,
              canGoBack: false,
            },
          ]
        }

        if (transitionType === 'slide') {
          slideTo(-navigatorWidth * (newStack.length - 1), newStack)

          // If screen already exists in stack, we keep previous stack, so the animation could finish smoothly
          // Then, after animation finishes, the new stack will be set (see slideTo callback)
          if (existingIdx !== -1) {
            return prev
          }
        }

        return newStack
      })
    },
    [transitionType, slideTo, navigatorWidth],
  )

  const push = useCallback(
    function pushCore<ScreenName extends keyof ParamList>(input: {
      name: ScreenName
      params: ParamList[ScreenName]
    }) {
      const { name, params } = input

      setStack((prev) => {
        const route = {
          key: `${String(name)}_${Date.now()}`,
          name: String(name),
          params,
          isFocused: false,
          canGoBack: false,
        }

        const newStack = [...prev, route]

        if (transitionType === 'slide') {
          slideTo(-navigatorWidth * (newStack.length - 1), newStack)
        }

        return newStack
      })
    },
    [transitionType, slideTo, navigatorWidth],
  )

  const pop = useCallback(() => {
    setStack((prev) => {
      if (prev.length <= 1) return prev

      const newStack = prev.slice(0, -1)

      if (transitionType === 'slide') {
        slideTo(-navigatorWidth * (prev.length - 2), newStack)
      } else if (transitionType === 'fade') {
        setRemovingFadeScreenName(prev.at(-1)?.name || null)
        fadeTo(newStack)
      } else if (transitionType === 'none') {
        return newStack
      }

      return prev // Keep previous stack until animation finishes
    })
  }, [transitionType, slideTo, navigatorWidth, fadeTo])

  const pushBefore = useCallback(
    function pushBeforeCore<ScreenName extends keyof ParamList>(input: {
      name: ScreenName
      params: ParamList[ScreenName]
    }) {
      const { name, params } = input

      setStack((prev) => {
        // Step 1: Create new stack with new screen inserted before current
        const newScreenRoute = {
          key: `${String(name)}_${Date.now()}`,
          name: String(name),
          params,
          isFocused: false,
          canGoBack: false,
        }

        const stackWithNewScreen = [...prev]
        stackWithNewScreen.splice(-1, 0, newScreenRoute)

        // Step 2: Jump to current screen (last position in new stack)
        if (transitionType === 'slide') {
          jumpTo(-navigatorWidth * (stackWithNewScreen.length - 1))
        }

        // Step 3: Schedule animation to the newly inserted screen
        setTimeout(pop, 0)

        return stackWithNewScreen
      })
    },
    [transitionType, pop, jumpTo, navigatorWidth],
  )

  const replace = useCallback(
    function replaceCore<ScreenName extends keyof ParamList>(input: {
      name: ScreenName
      params: ParamList[ScreenName]
    }) {
      const { name, params } = input

      setStack((prev) => {
        const route = {
          key: `${String(name)}_${Date.now()}`,
          name: String(name),
          params,
          isFocused: false,
          canGoBack: false,
        }
        const newStack = [...prev.slice(0, -1), route]

        if (transitionType === 'slide') {
          slideTo(-navigatorWidth * (newStack.length - 1), newStack)
        }

        return newStack
      })
    },
    [transitionType, slideTo, navigatorWidth],
  )

  const reset = useCallback(
    function resetCore<ScreenName extends keyof ParamList>(input: {
      name: ScreenName
      params: ParamList[ScreenName]
    }) {
      const { name, params } = input

      const route = {
        key: `${String(name)}_${Date.now()}`,
        name: String(name),
        params,
        isFocused: false,
        canGoBack: false,
      }

      setStack([route])
      slideTranslateX.value = 0
    },
    [slideTranslateX],
  )

  const navigation = useMemo(
    () => ({ push, pushBefore, pop, replace, reset, navigate }),
    [navigate, pop, push, pushBefore, replace, reset],
  )

  // MARK: Effects

  useEffect(() => {
    isMounted.value = true

    return () => {
      isMounted.value = false
      pendingFadeStackRef.current = null
    }
  }, [isMounted])

  // MARK: Renderers

  return (
    <EmbeddedStackNavigationContext.Provider
      value={navigation as EmbeddedStackNavigationApi}
    >
      <View
        style={[styles.root, propStyles?.root, fill && styles.fill]}
        onLayout={(e) => setNavigatorWidth(e.nativeEvent.layout.width)}
      >
        <EmbeddedStackContainer
          screens={screens}
          transitionType={transitionType}
          animateDynamicHeight={animateDynamicHeight}
          fill={fill}
          //
          stack={stack}
          //
          navigatorWidth={navigatorWidth}
          //
          slideTranslateX={slideTranslateX}
          //
          removingFadeScreenName={removingFadeScreenName}
          onFadeComplete={onFadeComplete}
          //
          dynamicRouteHeights={dynamicRouteHeights}
          setDynamicRouteHeights={setDynamicRouteHeights}
          currentDynamicRouteHeight={currentDynamicRouteHeight}
        />
      </View>
    </EmbeddedStackNavigationContext.Provider>
  )
}

// MARK: Styles

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  root: {
    overflow: 'hidden',
    width: '100%',
  },
})
