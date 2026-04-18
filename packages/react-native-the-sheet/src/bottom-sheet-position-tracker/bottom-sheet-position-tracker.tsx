import { useAnimatedReaction, useSharedValue } from 'react-native-reanimated'
import type { BottomSheetPositionTrackerProps } from './types'
import { useBottomSheet } from '../bottom-sheet'
import { useBottomSheetPresenter } from '../bottom-sheet-presenter'

export function useBottomSheetPositionTracker() {
  const { translateY: bottomSheetPresenterTranslateY } =
    useBottomSheetPresenter()

  const { sheetHeight, translateY: bottomSheetTranslateY } = useBottomSheet()

  const bottomSheetVisibleHeight = useSharedValue(0)

  useAnimatedReaction(
    () => {
      return {
        bottomSheetPresenterTranslateY: bottomSheetPresenterTranslateY.value,
        bottomSheetTranslateY: bottomSheetTranslateY.value,
        sheetHeight: sheetHeight.value,
      }
    },
    (prepared) => {
      const total = prepared.sheetHeight
      const pY = prepared.bottomSheetPresenterTranslateY
      const bY = prepared.bottomSheetTranslateY

      bottomSheetVisibleHeight.value = total - (pY + bY)
    },
  )

  return { bottomSheetVisibleHeight }
}

export function BottomSheetPositionTracker({
  bottomSheetVisibleHeight,
}: Readonly<BottomSheetPositionTrackerProps>) {
  const { bottomSheetVisibleHeight: visibleHeight } =
    useBottomSheetPositionTracker()

  useAnimatedReaction(
    () => {
      return visibleHeight.value
    },
    (current, previous) => {
      if (current !== previous && bottomSheetVisibleHeight) {
        bottomSheetVisibleHeight.value = current
      }
    },
  )

  return null
}
