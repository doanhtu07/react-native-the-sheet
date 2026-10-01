import { useCallback, useEffect, useMemo, useRef } from 'react'
import { Platform, TextInput } from 'react-native'
import {
  useAnimatedReaction,
  runOnJS,
  withDelay,
  withTiming,
  useSharedValue,
  runOnUI,
  useDerivedValue,
} from 'react-native-reanimated'
import {
  ANDROID_WINDOW_SOFT_INPUT_MODES,
  useSheetKeyboard,
} from '../../sheet-keyboard-provider'
import { isApproxEqual } from '../../utils'
import {
  KEYBOARD_EXPANDER_ANIMATION_DURATION,
  KEYBOARD_EXPANDER_ANIMATION_EASING,
} from '../constants'
import type { AnimatedProp } from '../../types'
import { useToSharedValue, useTrueSafeArea } from '../../hooks'
import { useBottomSheet } from '../../bottom-sheet'

type Props = {
  isInputFocused: AnimatedProp<boolean>
  keyboardOffset?: AnimatedProp<number>
}

export const useBottomSheetKeyboardExpand = ({
  isInputFocused: propIsInputFocused,
  keyboardOffset: propKeyboardOffset = 0,
}: Props) => {
  const { sheetHeight, sheetVisibleHeight } = useBottomSheet()

  const {
    keyboardVisible,
    keyboardFinalHeight,
    androidWindowSoftInputMode,
    isAndroidKeyboardResizeMode,
  } = useSheetKeyboard()

  const { isEdgeToEdge, safeAreaHeight, trueTop, trueBottom } =
    useTrueSafeArea()

  const isInputFocused = useToSharedValue(propIsInputFocused)
  const keyboardOffset = useToSharedValue(propKeyboardOffset)

  const sheetHiddenHeight = useDerivedValue(() => {
    return sheetHeight.value - sheetVisibleHeight.value
  })

  const checkShouldExpandTimeout = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  )

  const inputOverlap = useSharedValue<number | null>(null)
  const initialInputBottom = useSharedValue<number | null>(null)

  const targetHeight = useSharedValue(0)
  const currentHeight = useSharedValue(0)

  const clearCheckShouldExpandTimeout = useCallback(() => {
    if (checkShouldExpandTimeout.current) {
      clearTimeout(checkShouldExpandTimeout.current)
      checkShouldExpandTimeout.current = null
    }
  }, [])

  const cleanupInput = useCallback(() => {
    inputOverlap.value = null
    initialInputBottom.value = null
  }, [initialInputBottom, inputOverlap])

  const checkShouldExpand = useCallback(
    (keyboardHeightValue: number) => {
      clearCheckShouldExpandTimeout()

      const delay =
        Platform.OS === 'android'
          ? KEYBOARD_EXPANDER_ANIMATION_DURATION / 3
          : KEYBOARD_EXPANDER_ANIMATION_DURATION / 2 / 3

      // Delay slightly to ensure layout, input, and keyboard states have settled before measuring
      checkShouldExpandTimeout.current = setTimeout(() => {
        if (!isInputFocused.value || isAndroidKeyboardResizeMode.value) {
          cleanupInput()
          return
        }

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
      isEdgeToEdge,
      isInputFocused,
      safeAreaHeight,
      sheetHiddenHeight,
      trueBottom,
      trueTop,
    ],
  )

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
        runOnJS(clearCheckShouldExpandTimeout)()
        runOnJS(cleanupInput)()
      }
    },
  )

  // Effect: Update target height
  useAnimatedReaction(
    () => {
      return {
        inputOverlap: inputOverlap.value,
        keyboardOffset: keyboardOffset.value,
      }
    },
    (prepared) => {
      targetHeight.value =
        prepared.inputOverlap === null
          ? 0
          : prepared.inputOverlap + prepared.keyboardOffset
    },
  )

  // Effect: Update current height
  useAnimatedReaction(
    () => {
      return {
        targetHeight: targetHeight.value,
        keyboardVisible: keyboardVisible.value,
      }
    },
    (prepared) => {
      if (Platform.OS === 'android') {
        if (prepared.keyboardVisible) {
          // Delay the animation on Android to avoid squeezing content
          // before the keyboard has fully settled
          currentHeight.value = withDelay(
            KEYBOARD_EXPANDER_ANIMATION_DURATION / 2,
            withTiming(prepared.targetHeight, {
              duration: KEYBOARD_EXPANDER_ANIMATION_DURATION / 2,
              easing: KEYBOARD_EXPANDER_ANIMATION_EASING,
            }),
          )

          return
        }

        currentHeight.value = withTiming(prepared.targetHeight, {
          duration: KEYBOARD_EXPANDER_ANIMATION_DURATION / 2,
          easing: KEYBOARD_EXPANDER_ANIMATION_EASING,
        })

        return
      }

      currentHeight.value = withTiming(prepared.targetHeight, {
        duration: KEYBOARD_EXPANDER_ANIMATION_DURATION,
        easing: KEYBOARD_EXPANDER_ANIMATION_EASING,
      })
    },
  )

  // MARK: Return

  return useMemo(
    () => ({
      targetHeight,
      currentHeight,
    }),
    [currentHeight, targetHeight],
  )
}
