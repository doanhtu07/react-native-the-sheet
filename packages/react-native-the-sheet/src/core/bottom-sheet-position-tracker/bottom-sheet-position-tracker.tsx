import { useAnimatedReaction } from 'react-native-reanimated'
import type { BottomSheetPositionTrackerProps } from './types'
import { useBottomSheet } from '../bottom-sheet'

export function BottomSheetPositionTracker({
  trackBottomSheetVisibleHeight,
  trackBottomSheetVisibleRatio,
}: Readonly<BottomSheetPositionTrackerProps>) {
  const { sheetVisibleHeight, sheetVisibleRatio } = useBottomSheet()

  useAnimatedReaction(
    () => {
      return sheetVisibleHeight.value
    },
    (current, previous) => {
      if (current !== previous && trackBottomSheetVisibleHeight) {
        trackBottomSheetVisibleHeight.value = current
      }
    },
  )

  useAnimatedReaction(
    () => {
      return sheetVisibleRatio.value
    },
    (current, previous) => {
      if (current !== previous && trackBottomSheetVisibleRatio) {
        trackBottomSheetVisibleRatio.value = current
      }
    },
  )

  return null
}
