import { useWindowDimensions } from 'react-native'
import {
  useSafeAreaFrame,
  useSafeAreaInsets,
} from 'react-native-safe-area-context'
import { isApproxEqual } from '../../private/utils/approximately-equal'
import { useMemo } from 'react'

export const useTrueSafeArea = () => {
  const insets = useSafeAreaInsets()
  const frame = useSafeAreaFrame()
  const window = useWindowDimensions()

  const safeAreaHeight = frame.height
  const safeAreaWidth = frame.width

  const windowHeight = window.height
  const windowWidth = window.width

  // Detect Edge-to-Edge purely by geometry
  const isEdgeToEdge =
    isApproxEqual(frame.height, window.height) &&
    isApproxEqual(frame.width, window.width)

  // Resolve insets:
  // If library insets are 0 (buggy/blind), we derive them from the frame's position
  // - frame.y = distance from top of window to top of app
  // - frame.x = distance from left of window to left of app

  const trueTop = insets.top || Math.max(0, frame.y)

  const trueBottom =
    insets.bottom || Math.max(0, window.height - frame.height - frame.y)

  const trueLeft = insets.left || Math.max(0, frame.x)

  const trueRight =
    insets.right || Math.max(0, window.width - frame.width - frame.x)

  return useMemo(
    () => ({
      isEdgeToEdge,

      trueTop,
      trueBottom,
      trueLeft,
      trueRight,

      safeAreaHeight,
      safeAreaWidth,

      windowHeight,
      windowWidth,
    }),
    [
      isEdgeToEdge,
      trueTop,
      trueBottom,
      trueLeft,
      trueRight,
      safeAreaHeight,
      safeAreaWidth,
      windowHeight,
      windowWidth,
    ],
  )
}
