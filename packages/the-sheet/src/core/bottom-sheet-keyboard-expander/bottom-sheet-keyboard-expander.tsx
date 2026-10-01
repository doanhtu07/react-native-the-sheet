import { StyleSheet } from 'react-native'
import Animated, {
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated'
import type { BottomSheetKeyboardExpanderProps } from './types'
import { useInputFocus } from '../input-focus-provider'
import { useBottomSheet } from '../bottom-sheet/bottom-sheet-provider'
import { useBottomSheetKeyboardExpand } from './hooks/use-bottom-sheet-keyboard-expand'

export function BottomSheetKeyboardExpander({
  keyboardOffset = 0,
}: Readonly<BottomSheetKeyboardExpanderProps>) {
  const {
    keyboardExpanderTargetHeight,
    keyboardExpanderCurrentHeight,
    keyboardExpanderHeightRatio,
  } = useBottomSheet()

  const { isInputFocused } = useInputFocus()

  const { targetHeight, currentHeight } = useBottomSheetKeyboardExpand({
    isInputFocused,
    keyboardOffset,
  })

  const lastNonZeroTargetHeight = useSharedValue(0)

  // MARK: Effects

  // Effect: Report target height back to bottom sheet context
  useAnimatedReaction(
    () => {
      return targetHeight.value
    },
    (prepared) => {
      keyboardExpanderTargetHeight.value = prepared
    },
  )

  // Effect: Report current height back to bottom sheet context
  useAnimatedReaction(
    () => {
      return currentHeight.value
    },
    (prepared) => {
      keyboardExpanderCurrentHeight.value = prepared
    },
  )

  // Effect: Update height ratio
  useAnimatedReaction(
    () => {
      return {
        keyboardExpanderCurrentHeight: keyboardExpanderCurrentHeight.value,
        keyboardExpanderTargetHeight: keyboardExpanderTargetHeight.value,
      }
    },
    (prepared) => {
      if (prepared.keyboardExpanderTargetHeight > 0) {
        lastNonZeroTargetHeight.value = prepared.keyboardExpanderTargetHeight
      }

      keyboardExpanderHeightRatio.value =
        prepared.keyboardExpanderCurrentHeight / lastNonZeroTargetHeight.value
    },
  )

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
