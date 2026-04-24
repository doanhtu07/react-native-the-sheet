import { StatusBar, useWindowDimensions } from 'react-native'
import {
  useSafeAreaFrame,
  useSafeAreaInsets,
} from 'react-native-safe-area-context'
import { isApproxEqual } from '../private/utils/approximately-equal'
import { useMemo } from 'react'

export const useTrueSafeArea = () => {
  const safeAreaInsets = useSafeAreaInsets()
  const safeAreaFrame = useSafeAreaFrame()
  const windowDimensions = useWindowDimensions()

  const isEdgeToEdge = isApproxEqual(
    safeAreaFrame.height,
    windowDimensions.height,
  )

  const trueTop = isEdgeToEdge
    ? safeAreaInsets.top
    : safeAreaInsets.top || StatusBar.currentHeight || 0

  const trueBottom = isEdgeToEdge
    ? safeAreaInsets.bottom
    : safeAreaInsets.bottom ||
      windowDimensions.height - safeAreaFrame.height - trueTop

  return useMemo(
    () => ({
      isEdgeToEdge,
      safeAreaWidth: safeAreaFrame.width,
      safeAreaHeight: safeAreaFrame.height,
      windowWidth: windowDimensions.width,
      windowHeight: windowDimensions.height,
      trueTop,
      trueBottom,
    }),
    [
      isEdgeToEdge,
      safeAreaFrame.height,
      safeAreaFrame.width,
      trueBottom,
      trueTop,
      windowDimensions.height,
      windowDimensions.width,
    ],
  )
}
