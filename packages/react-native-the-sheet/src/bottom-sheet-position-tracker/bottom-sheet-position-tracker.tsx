import { useAnimatedReaction, useSharedValue } from 'react-native-reanimated'
import type { BottomSheetPositionTrackerProps } from './types'
import { useBottomSheet } from '../bottom-sheet'
import { useBottomSheetPresenter } from '../bottom-sheet-presenter'
import { useBridgedValue } from '../hooks/use-bridged-value'

export function useBottomSheetPositionTracker() {
  const { translateY: bottomSheetPresenterTranslateY } =
    useBottomSheetPresenter()

  const {
    overdragSnapMode: propOverdragSnapMode,
    sheetHeight,
    translateY: bottomSheetTranslateY,
  } = useBottomSheet()

  const bottomSheetVisibleHeight = useSharedValue(0)
  const overdragSnapMode = useBridgedValue(propOverdragSnapMode)

  useAnimatedReaction(
    () => {
      return {
        bottomSheetPresenterTranslateY: bottomSheetPresenterTranslateY.value,
        bottomSheetTranslateY: bottomSheetTranslateY.value,
        sheetHeight: sheetHeight.value,
        overdragSnapMode: overdragSnapMode.value,
      }
    },
    (prepared) => {
      const total = prepared.sheetHeight
      const pY = prepared.bottomSheetPresenterTranslateY

      const bY = prepared.overdragSnapMode
        ? // Clamp negative translateY since bottom sheet height already absorbs it
          Math.max(0, prepared.bottomSheetTranslateY)
        : prepared.bottomSheetTranslateY

      bottomSheetVisibleHeight.value = total - (pY + bY)
    },
  )

  return { bottomSheetVisibleHeight }
}

export function BottomSheetPositionTracker({
  trackBottomSheetVisibleHeight,
}: Readonly<BottomSheetPositionTrackerProps>) {
  const { bottomSheetVisibleHeight: visibleHeight } =
    useBottomSheetPositionTracker()

  useAnimatedReaction(
    () => {
      return visibleHeight.value
    },
    (current, previous) => {
      if (current !== previous && trackBottomSheetVisibleHeight) {
        trackBottomSheetVisibleHeight.value = current
      }
    },
  )

  return null
}
