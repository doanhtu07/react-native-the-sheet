import { useCallback, useEffect, useRef } from 'react'
import { Platform, StyleSheet, TextInput } from 'react-native'
import Animated, {
  Easing,
  runOnJS,
  runOnUI,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated'
import type { BottomSheetKeyboardExpanderProps } from './types'
import { useTrueSafeArea } from '../hooks'
import { isApproxEqual } from '../../private/utils/approximately-equal'
import { useSheetKeyboard } from '../sheet-keyboard-provider'
import { useInputFocus } from '../input-focus-provider'
import { useToStateValue } from '../../private/hooks/use-to-state-value'

const KEYBOARD_EXPANDER_ANIMATION_DURATION = 600
const KEYBOARD_EXPANDER_ANIMATION_EASING = Easing.out(Easing.exp)

export function BottomSheetKeyboardExpander({
  keyboardOffset,
}: Readonly<BottomSheetKeyboardExpanderProps>) {
  const { keyboardVisible, keyboardFinalHeight, isAndroidKeyboardResizeMode } =
    useSheetKeyboard()

  const { isEdgeToEdge, safeAreaHeight, trueTop, trueBottom } =
    useTrueSafeArea()

  const { isInputFocused } = useInputFocus()
  const isInputFocusedState = useToStateValue(isInputFocused)

  const inputOverlap = useSharedValue<number | null>(null)
  const initialInputBottom = useSharedValue<number | null>(null)

  const checkShouldExpandTimeout = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  )
  const isCheckShouldExpandTimeoutSet = useSharedValue(false)

  const clearCheckShouldExpandTimeout = useCallback(() => {
    if (checkShouldExpandTimeout.current) {
      clearTimeout(checkShouldExpandTimeout.current)
      checkShouldExpandTimeout.current = null
      isCheckShouldExpandTimeoutSet.value = false
    }
  }, [isCheckShouldExpandTimeoutSet])

  const cleanupInput = useCallback(() => {
    inputOverlap.value = null
    initialInputBottom.value = null
  }, [initialInputBottom, inputOverlap])

  const checkShouldExpand = useCallback(
    (keyboardHeightValue: number) => {
      clearCheckShouldExpandTimeout()

      if (!isInputFocusedState) {
        cleanupInput()
        return
      }

      const delay =
        Platform.OS === 'android'
          ? KEYBOARD_EXPANDER_ANIMATION_DURATION / 3
          : KEYBOARD_EXPANDER_ANIMATION_DURATION / 2 / 3

      // Delay slightly to ensure layout has settled before measuring
      checkShouldExpandTimeout.current = setTimeout(() => {
        isCheckShouldExpandTimeoutSet.value = true

        const inputHandle = TextInput.State.currentlyFocusedInput()

        if (!inputHandle) {
          cleanupInput()
          return
        }

        inputHandle.measureInWindow((_x, y, _width, height) => {
          const handleMeasurement = () => {
            'worklet'

            if (initialInputBottom.value === null) {
              initialInputBottom.value = y + height
            }

            // Use initial input bottom as the base
            // to have a good calculation against current keyboard height
            const inputBottom = initialInputBottom.value

            const keyboardTop =
              Platform.OS === 'android' && isEdgeToEdge
                ? safeAreaHeight - trueTop - trueBottom - keyboardHeightValue
                : safeAreaHeight - keyboardHeightValue

            // Only expand if the input would be obscured by the keyboard
            inputOverlap.value = inputBottom - keyboardTop
          }

          runOnUI(handleMeasurement)()
        })
      }, delay)
    },
    [
      cleanupInput,
      clearCheckShouldExpandTimeout,
      initialInputBottom,
      inputOverlap,
      isCheckShouldExpandTimeoutSet,
      isEdgeToEdge,
      isInputFocusedState,
      safeAreaHeight,
      trueBottom,
      trueTop,
    ],
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

  // Effect: Unmount
  useEffect(() => {
    return () => {
      clearCheckShouldExpandTimeout()
    }
  }, [clearCheckShouldExpandTimeout])

  // Effect: Listen to input focus changes
  useEffect(() => {
    if (!isInputFocusedState) {
      clearCheckShouldExpandTimeout()
      cleanupInput()
    }
  }, [cleanupInput, clearCheckShouldExpandTimeout, isInputFocusedState])

  // Effect: Listen to keyboard changes
  useAnimatedReaction(
    () => {
      return {
        keyboardVisible: keyboardVisible.value,
        keyboardFinalHeight: keyboardFinalHeight.value,
      }
    },
    (prepared, previous) => {
      if (
        prepared.keyboardVisible === previous?.keyboardVisible &&
        isApproxEqual(
          prepared.keyboardFinalHeight,
          previous?.keyboardFinalHeight ?? 0,
        )
      ) {
        // No meaningful change
        return
      }

      if (prepared.keyboardVisible && prepared.keyboardFinalHeight !== 0) {
        runOnJS(checkShouldExpand)(prepared.keyboardFinalHeight)
      }

      if (!prepared.keyboardVisible && prepared.keyboardFinalHeight === 0) {
        inputOverlap.value = null
        initialInputBottom.value = null
      }
    },
  )

  // Effect: Detect Android adjustResize keyboard behavior
  useAnimatedReaction(
    () => {
      return {
        isAndroidKeyboardResizeMode: isAndroidKeyboardResizeMode.value,
        isCheckShouldExpandTimeoutSet: isCheckShouldExpandTimeoutSet.value,
      }
    },
    (prepared) => {
      if (
        prepared.isAndroidKeyboardResizeMode &&
        prepared.isCheckShouldExpandTimeoutSet
      ) {
        runOnJS(clearCheckShouldExpandTimeout)()
      }
    },
  )

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
