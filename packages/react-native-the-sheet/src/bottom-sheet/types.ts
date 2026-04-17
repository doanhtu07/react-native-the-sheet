import type { PropsWithChildren } from 'react'
import type { StyleProp, ViewStyle } from 'react-native'
import type { PanGesture } from 'react-native-gesture-handler'
import type Animated from 'react-native-reanimated'
import type { AnimatedRef, SharedValue } from 'react-native-reanimated'

// MARK: Bottom sheet handle

export type BottomSheetHandleProps = {
  styles?: {
    root?: StyleProp<ViewStyle>
    indicator?: StyleProp<ViewStyle>
  }
}

// MARK: Bottom sheet

/** Percentage is compared to the screen height */
type SnapPoint = number | `${number}%`

export type BottomSheetContextType = {
  sheetHeight: SharedValue<number>
  snapTranslateYs: SharedValue<number[]>
  translateY: SharedValue<number>

  scrollViewRef: AnimatedRef<Animated.ScrollView>
  scrollY: SharedValue<number>
  isTouchingScrollView: SharedValue<boolean>

  panGesture: PanGesture
}

export type BottomSheetProps = PropsWithChildren & {
  snapPoints?: SnapPoint[]
  styles?: {
    root?: StyleProp<ViewStyle>
  }
}

// MARK: Bottom sheet scroll view

export type BottomSheetScrollViewProps = PropsWithChildren & {
  styles?: {
    root?: StyleProp<ViewStyle>
  }
}

// MARK: Bottom sheet view

export type BottomSheetViewProps = PropsWithChildren & {
  styles?: {
    root?: StyleProp<ViewStyle>
  }
}
