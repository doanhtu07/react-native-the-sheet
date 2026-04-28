import { useCallback, useEffect, useRef } from 'react'
import { Platform, StyleSheet, TextInput } from 'react-native'
import Animated, {
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
import { runOnJS, runOnUI } from 'react-native-worklets'
import {
  ANDROID_WINDOW_SOFT_INPUT_MODES,
  useSheetKeyboard,
} from '../sheet-keyboard-provider'
import { useInputFocus } from '../input-focus-provider'
import { useBottomSheet } from '../bottom-sheet/bottom-sheet-provider'
import {
  KEYBOARD_EXPANDER_ANIMATION_DURATION,
  KEYBOARD_EXPANDER_ANIMATION_EASING,
} from './private/constants'

export function BottomSheetKeyboardExpander({
  keyboardOffset,
}: Readonly<BottomSheetKeyboardExpanderProps>) {
  const { sheetHeight, sheetVisibleHeight } = useBottomSheet()

  const {
    keyboardVisible,
    keyboardFinalHeight,
    androidWindowSoftInputMode,
    isAndroidKeyboardResizeMode,
  } = useSheetKeyboard()

  const { isEdgeToEdge, safeAreaHeight, trueTop, trueBottom } =
    useTrueSafeArea()

  const sheetHiddenHeight = useDerivedValue(() => {
    return sheetHeight.value - sheetVisibleHeight.value
  })

  const { isInputFocused } = useInputFocus()

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

      if (!isInputFocused.value || isAndroidKeyboardResizeMode.value) {
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
            let inputBottom = initialInputBottom.value

            const keyboardTop =
              Platform.OS === 'android' && isEdgeToEdge
                ? safeAreaHeight - trueTop - trueBottom - keyboardHeightValue
                : safeAreaHeight - keyboardHeightValue

            // On Android + adjustPan, Android does not take into account translateY
            // Our bottom sheet uses translateY, which is a render-time transformation ONLY
            if (
              Platform.OS === 'android' &&
              androidWindowSoftInputMode.value ===
                ANDROID_WINDOW_SOFT_INPUT_MODES.adjustPan
            ) {
              let androidRefuseAdjustPan = false

              if (inputBottom - sheetHiddenHeight.value <= keyboardTop) {
                androidRefuseAdjustPan = true
              }

              if (!androidRefuseAdjustPan) {
                inputOverlap.value = 0
                return
              }
            }

            // Only expand if the input would be obscured by the keyboard
            inputOverlap.value = inputBottom - keyboardTop
          }

          runOnUI(handleMeasurement)()
        })
      }, delay)
    },
    [
      androidWindowSoftInputMode,
      cleanupInput,
      clearCheckShouldExpandTimeout,
      initialInputBottom,
      inputOverlap,
      isAndroidKeyboardResizeMode,
      isCheckShouldExpandTimeoutSet,
      isEdgeToEdge,
      isInputFocused,
      safeAreaHeight,
      sheetHiddenHeight,
      trueBottom,
      trueTop,
    ],
  )

  const animatedHeight = useDerivedValue(() => {
    const targetHeight =
      inputOverlap.value === null
        ? 0
        : inputOverlap.value + (keyboardOffset || 0)

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
  useAnimatedReaction(
    () => {
      return isInputFocused.value
    },
    (prepared, previous) => {
      if (prepared === previous) {
        return
      }

      if (!prepared) {
        runOnJS(clearCheckShouldExpandTimeout)()
        runOnJS(cleanupInput)()
      }
    },
  )

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

      // Keyboard is showing, check against current keyboard height
      if (prepared.keyboardVisible && prepared.keyboardFinalHeight !== 0) {
        runOnJS(checkShouldExpand)(prepared.keyboardFinalHeight)
      }

      // Keyboard is hiding, reset everything
      if (!prepared.keyboardVisible && prepared.keyboardFinalHeight === 0) {
        runOnJS(cleanupInput)()
      }
    },
  )

  // Effect: Detect Android adjustResize keyboard behavior
  useAnimatedReaction(
    () => {
      return {
        androidWindowSoftInputMode: androidWindowSoftInputMode.value,
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

  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: animatedHeight.value,
    }
  })

  return <Animated.View style={[styles.root, animatedStyle]} />
}

// MARK: Styles

const styles = StyleSheet.create({
  root: {},
})
