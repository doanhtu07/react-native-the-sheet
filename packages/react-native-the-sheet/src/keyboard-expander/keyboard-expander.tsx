import { useCallback, useEffect, useRef } from 'react'
import {
  Keyboard,
  Platform,
  StyleSheet,
  TextInput,
  useWindowDimensions,
} from 'react-native'
import Animated, {
  Easing,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated'

const KEYBOARD_EXPANDER_ANIMATION_DURATION = 600
const KEYBOARD_EXPANDER_ANIMATION_EASING = Easing.out(Easing.exp)

export function KeyboardExpander() {
  const { height: screenHeight } = useWindowDimensions()

  const keyboardVisible = useSharedValue(Keyboard.isVisible())
  const keyboardHeight = useSharedValue(0)

  const shouldExpand = useSharedValue(false)
  const checkShouldExpandTimeout = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  )

  const checkShouldExpand = useCallback(
    (keyboardHeightValue: number) => {
      if (checkShouldExpandTimeout.current) {
        clearTimeout(checkShouldExpandTimeout.current)
      }

      // Delay slightly to ensure layout has settled before measuring
      checkShouldExpandTimeout.current = setTimeout(() => {
        const handle = TextInput.State.currentlyFocusedInput()

        if (!handle) {
          shouldExpand.value = false
          return
        }

        handle.measureInWindow((_x, y, _width, height) => {
          const inputBottom = y + height
          const keyboardTop = screenHeight - keyboardHeightValue

          // Only expand if the input would be obscured by the keyboard
          shouldExpand.value = inputBottom > keyboardTop
        })
      }, 100)
    },
    [screenHeight, shouldExpand],
  )

  const animatedHeight = useDerivedValue(() => {
    const targetHeight = shouldExpand.value ? keyboardHeight.value : 0

    if (Platform.OS === 'android') {
      if (keyboardVisible.value) {
        // Delay the animation on Android to avoid squeezing content
        // before the keyboard has fully settled
        return withDelay(
          KEYBOARD_EXPANDER_ANIMATION_DURATION / 2,
          withTiming(targetHeight, {
            duration: KEYBOARD_EXPANDER_ANIMATION_DURATION / 2,
            easing: KEYBOARD_EXPANDER_ANIMATION_EASING,
          }),
        )
      }

      return withTiming(targetHeight, {
        duration: KEYBOARD_EXPANDER_ANIMATION_DURATION / 2,
        easing: KEYBOARD_EXPANDER_ANIMATION_EASING,
      })
    }

    return withTiming(targetHeight, {
      duration: KEYBOARD_EXPANDER_ANIMATION_DURATION,
      easing: KEYBOARD_EXPANDER_ANIMATION_EASING,
    })
  })

  // MARK: Effects

  useEffect(() => {
    return () => {
      if (checkShouldExpandTimeout.current) {
        clearTimeout(checkShouldExpandTimeout.current)
      }
    }
  }, [])

  useEffect(() => {
    if (Platform.OS === 'android') {
      const keyboardDidShowListener = Keyboard.addListener(
        'keyboardDidShow',
        (e) => {
          keyboardHeight.value = e.endCoordinates.height
          keyboardVisible.value = true
          checkShouldExpand(e.endCoordinates.height)
        },
      )

      const keyboardDidHideListener = Keyboard.addListener(
        'keyboardDidHide',
        () => {
          keyboardHeight.value = 0
          keyboardVisible.value = false
          shouldExpand.value = false
        },
      )

      return () => {
        keyboardDidShowListener.remove()
        keyboardDidHideListener.remove()
      }
    }

    // keyboardWillShow as well as keyboardWillHide are generally not available on Android since there is no native corresponding event.
    if (Platform.OS === 'ios') {
      const keyboardWillShowListener = Keyboard.addListener(
        'keyboardWillShow',
        (e) => {
          keyboardHeight.value = e.endCoordinates.height
          keyboardVisible.value = true
          checkShouldExpand(e.endCoordinates.height)
        },
      )

      const keyboardWillHideListener = Keyboard.addListener(
        'keyboardWillHide',
        () => {
          keyboardHeight.value = 0
          keyboardVisible.value = false
          shouldExpand.value = false
        },
      )

      return () => {
        keyboardWillShowListener.remove()
        keyboardWillHideListener.remove()
      }
    }

    return () => {}
  }, [
    checkShouldExpand,
    keyboardHeight,
    keyboardVisible,
    screenHeight,
    shouldExpand,
  ])

  // MARK: Renderers

  const animatedStyle = useAnimatedStyle(() => ({
    height: animatedHeight.value,
  }))

  return <Animated.View style={[styles.root, animatedStyle]} />
}

// MARK: Styles

const styles = StyleSheet.create({
  root: {},
})
