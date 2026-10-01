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

  /*
    Effect: Force Android to adjustNothing while mounted.
    
    Unlike the sibling BottomSheetKeyboardExpander (outside BottomSheet,
    repositions the whole sheet as a rigid block, so the OS keeps its
    sticky pan — verified with keyboardOffset={300} under adjustPan),
    this expander lives INSIDE the same container as the input (e.g. chat
    composer).
    
    Its growth changes content height within the focused view's
    own subtree, so under adjustPan the OS re-runs minimal-pan and shrinks
    its pan by the same amount, cancelling the lift (input jammed at the
    keyboard top, Send/footer behind the keyboard — verified on emulator).
    
    Under adjustNothing the OS never pans, so the expander solely owns
    target = inputOverlap + keyboardOffset.
  */
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
