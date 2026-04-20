import type { ComponentProps, PropsWithChildren } from 'react'
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
  enableOverdrag: boolean

  sheetHeight: SharedValue<number>
  snapTranslateYs: SharedValue<number[]>
  translateY: SharedValue<number>

  scrollViewRef: AnimatedRef<Animated.ScrollView | Animated.FlatList>
  isScrollViewReady: SharedValue<boolean>
  isScrolling: SharedValue<0 | 1>
  scrollY: SharedValue<number>

  getPanGesture: () => PanGesture
}

export type BottomSheetProps = PropsWithChildren & {
  snapPoints?: SnapPoint[]
  enableFloat?: boolean
  enableOverdrag?: boolean
  disableDrag?: boolean

  fill?: boolean

  styles?: {
    root?: StyleProp<ViewStyle>
  }
}

export type BottomSheetApi = {
  snapToIndex: (index: number) => void
  snapToPosition: (position: SnapPoint) => void
}

// MARK: Bottom sheet view

export type BottomSheetViewProps = PropsWithChildren & {
  fill?: boolean
  styles?: {
    root?: StyleProp<ViewStyle>
  }
}

// MARK: Bottom sheet scroll view

type AnimatedScrollViewProps = ComponentProps<typeof Animated.ScrollView>

export type BottomSheetScrollViewProps = AnimatedScrollViewProps & {
  fill?: boolean
  styles?: {
    root?: StyleProp<ViewStyle>
  }
}

// MARK: Bottom sheet flatlist

type AnimatedFlatListProps<T> = ComponentProps<typeof Animated.FlatList<T>>

export type BottomSheetFlatListProps<T> = AnimatedFlatListProps<T> & {
  fill?: boolean
  styles?: {
    root?: StyleProp<ViewStyle>
  }
}
