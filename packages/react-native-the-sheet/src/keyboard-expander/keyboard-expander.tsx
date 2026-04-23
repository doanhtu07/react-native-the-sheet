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
import type { KeyboardExpanderProps } from './types'

const KEYBOARD_EXPANDER_ANIMATION_DURATION = 600
const KEYBOARD_EXPANDER_ANIMATION_EASING = Easing.out(Easing.exp)

export function KeyboardExpander({
  keyboardOffset,
}: Readonly<KeyboardExpanderProps>) {
  const { height: windowHeight } = useWindowDimensions()

  const keyboardVisible = useSharedValue(Keyboard.isVisible())
  const keyboardHeight = useSharedValue(0)

  const inputOverlap = useSharedValue<number | null>(null)
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
        const inputHandle = TextInput.State.currentlyFocusedInput()

        if (!inputHandle) {
          inputOverlap.value = null
          return
        }

        inputHandle.measureInWindow((_x, y, _width, height) => {
          const inputBottom = y + height
          const keyboardTop = windowHeight - keyboardHeightValue

          // Only expand if the input would be obscured by the keyboard
          inputOverlap.value = inputBottom - keyboardTop
        })
      }, 100)
    },
    [inputOverlap, windowHeight],
  )

  const animatedHeight = useDerivedValue(() => {
    const targetHeight =
      inputOverlap.value !== null && inputOverlap.value > 0
        ? inputOverlap.value + (keyboardOffset || 0)
        : 0

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
          inputOverlap.value = null
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
          inputOverlap.value = null
        },
      )

      return () => {
        keyboardWillShowListener.remove()
        keyboardWillHideListener.remove()
      }
    }

    return () => {}
  }, [checkShouldExpand, inputOverlap, keyboardHeight, keyboardVisible])

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
