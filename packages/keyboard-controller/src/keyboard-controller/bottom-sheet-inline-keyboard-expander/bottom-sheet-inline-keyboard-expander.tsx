import { useEffect } from 'react'
import { Platform, StyleSheet } from 'react-native'
import Animated, { useAnimatedStyle } from 'react-native-reanimated'
import {
  AndroidSoftInputModes,
  KeyboardController,
} from 'react-native-keyboard-controller'
import {
  useBottomSheetKeyboardExpand,
  useSheetKeyboard,
} from '@the-sheet/the-sheet'
import type { BottomSheetInlineKeyboardExpanderProps } from './types'

export function BottomSheetInlineKeyboardExpander({
  isInputFocused,
  keyboardOffset = 0,
}: Readonly<BottomSheetInlineKeyboardExpanderProps>) {
  const { androidWindowSoftInputMode, defaultAndroidWindowSoftInputMode } =
    useSheetKeyboard()

  const { currentHeight } = useBottomSheetKeyboardExpand({
    isInputFocused,
    keyboardOffset,
  })

  // MARK: Effects

  // Effect: Force Android to adjustNothing while mounted
  // Under adjustPan the OS re-pans on every layout change and cancels
  // the expansion visually, so the expander must own the offset alone.
  useEffect(() => {
    if (Platform.OS !== 'android') {
      return
    }

    androidWindowSoftInputMode.value = 'adjustNothing'
    KeyboardController.setInputMode(
      AndroidSoftInputModes.SOFT_INPUT_ADJUST_NOTHING,
    )

    return () => {
      androidWindowSoftInputMode.value = defaultAndroidWindowSoftInputMode
      KeyboardController.setDefaultMode()
    }
  }, [androidWindowSoftInputMode, defaultAndroidWindowSoftInputMode])

  // MARK: Preparation

  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: currentHeight.value,
    }
  })

  // MARK: Renderers

  return <Animated.View style={[styles.root, animatedStyle]} />
}

// MARK: Styles

const styles = StyleSheet.create({
  root: {},
})
