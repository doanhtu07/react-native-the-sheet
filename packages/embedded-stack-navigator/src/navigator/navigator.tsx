import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Animated, StyleSheet, View } from 'react-native'
import { EmbeddedStackScreen } from './stack-screen'
import type {
  EmbeddedStackNavigationApi,
  EmbeddedStackNavigatorProps,
  EmbeddedStackRoute,
  ScreenRenderer,
} from './types'
import { FADE_DURATION_MS, SLIDE_DURATION_MS } from './config'
import { EmbeddedStackNavigationContext } from './context'

export const EmbeddedStackNavigator = function <
  Screens extends Record<string, ScreenRenderer>,
  ParamList extends Record<keyof Screens, unknown>,
  InitialRouteName extends keyof Screens = keyof Screens,
>({
  initialRouteName,
  initialParams,
  screens,
  transitionType = 'slide',
}: EmbeddedStackNavigatorProps<Screens, ParamList, InitialRouteName>) {
  const isMountedRef = useRef(false)
  const fadeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [stack, setStack] = useState<EmbeddedStackRoute[]>([
    {
      key: `${String(initialRouteName)}_${Date.now()}`,
      name: String(initialRouteName),
      params: initialParams,
      isFocused: true,
      canGoBack: false,
    },
  ])

  const [removingScreenName, setRemovingScreenName] = useState<string | null>(
    null,
  )

  const [rootWidth, setRootWidth] = useState(0)
  const translateX = useRef(new Animated.Value(0))

  // MARK: Transition methods

  const jumpTo = useCallback((toValue: number) => {
    translateX.current.setValue(toValue)
  }, [])

  const slideTo = useCallback(
    (toValue: number, newStack: EmbeddedStackRoute[]) => {
      Animated.timing(translateX.current, {
        toValue,
        duration: SLIDE_DURATION_MS,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished && isMountedRef.current) {
          setStack(newStack)
        }
      })
    },
    [],
  )

  const fadeTo = useCallback((newStack: EmbeddedStackRoute[]) => {
    fadeTimeoutRef.current = setTimeout(() => {
      if (!isMountedRef.current) return
      setStack(newStack)
      setRemovingScreenName(null)
    }, FADE_DURATION_MS)
  }, [])

  // MARK: Navigation methods

  const navigate = useCallback(
    function navigate<ScreenName extends keyof ParamList>(input: {
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
          slideTo(-rootWidth * (newStack.length - 1), newStack)

          // If screen already exists in stack, we keep previous stack, so the animation could finish smoothly
          // Then, after animation finishes, the new stack will be set (see slideTo callback)
          if (existingIdx !== -1) {
            return prev
          }
        } else {
          fadeTo(newStack)
        }

        return newStack
      })
    },
    [transitionType, slideTo, rootWidth, fadeTo],
  )

  const push = useCallback(
    function push<ScreenName extends keyof ParamList>(input: {
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
          slideTo(-rootWidth * (newStack.length - 1), newStack)
        } else {
          fadeTo(newStack)
        }

        return newStack
      })
    },
    [transitionType, slideTo, rootWidth, fadeTo],
  )

  const pop = useCallback(() => {
    setStack((prev) => {
      if (prev.length <= 1) return prev

      const newStack = prev.slice(0, -1)

      if (transitionType === 'slide') {
        slideTo(-rootWidth * (prev.length - 2), newStack)
      } else {
        setRemovingScreenName(prev.at(-1)?.name || null)
        fadeTo(newStack)
      }

      return prev // Keep previous stack until animation finishes
    })
  }, [transitionType, slideTo, rootWidth, fadeTo])

  const pushBefore = useCallback(
    function pushBefore<ScreenName extends keyof ParamList>(input: {
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
          jumpTo(-rootWidth * (stackWithNewScreen.length - 1))
        }

        // Step 3: Schedule animation to the newly inserted screen
        setTimeout(pop, 0)

        return stackWithNewScreen
      })
    },
    [transitionType, pop, jumpTo, rootWidth],
  )

  const replace = useCallback(
    function replace<ScreenName extends keyof ParamList>(input: {
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
          slideTo(-rootWidth * (newStack.length - 1), newStack)
        } else {
          fadeTo(newStack)
        }

        return newStack
      })
    },
    [transitionType, slideTo, rootWidth, fadeTo],
  )

  const reset = useCallback(function reset<
    ScreenName extends keyof ParamList,
  >(input: { name: ScreenName; params: ParamList[ScreenName] }) {
    const { name, params } = input

    const route = {
      key: `${String(name)}_${Date.now()}`,
      name: String(name),
      params,
      isFocused: false,
      canGoBack: false,
    }

    setStack([route])
    translateX.current.setValue(0)
  }, [])

  const navigation = useMemo(
    () => ({ push, pushBefore, pop, replace, reset, navigate }),
    [navigate, pop, push, pushBefore, replace, reset],
  )

  // MARK: Effects

  useEffect(() => {
    isMountedRef.current = true
    const translateXCurrent = translateX.current

    return () => {
      isMountedRef.current = false

      if (fadeTimeoutRef.current) {
        clearTimeout(fadeTimeoutRef.current)
      }

      translateXCurrent.removeAllListeners()
    }
  }, [])

  // MARK: Renderers

  return (
    <EmbeddedStackNavigationContext.Provider
      value={navigation as EmbeddedStackNavigationApi}
    >
      <View
        style={styles.root}
        onLayout={(e) => setRootWidth(e.nativeEvent.layout.width)}
      >
        <Animated.View
          style={[
            styles.animatedContainer,
            {
              width:
                transitionType === 'slide'
                  ? rootWidth * stack.length
                  : rootWidth,
              transform: [{ translateX: translateX.current }],
            },
          ]}
        >
          {stack.map((route, idx) => (
            <EmbeddedStackScreen
              key={route.key}
              screens={screens}
              transitionType={transitionType}
              //
              route={route}
              idx={idx}
              stackLength={stack.length}
              rootWidth={rootWidth}
              removingScreenName={removingScreenName}
            />
          ))}
        </Animated.View>
      </View>
    </EmbeddedStackNavigationContext.Provider>
  )
}

// MARK: Styles

const styles = StyleSheet.create({
  animatedContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  root: {
    flex: 1,
    overflow: 'hidden',
    width: '100%',
  },
})
