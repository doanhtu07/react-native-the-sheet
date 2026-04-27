import type { ComponentProps, PropsWithChildren } from 'react'
import type {
  GestureResponderEvent,
  LayoutChangeEvent,
  StyleProp,
  ViewStyle,
} from 'react-native'
import type { PanGesture } from 'react-native-gesture-handler'
import type Animated from 'react-native-reanimated'
import type {
  AnimatedRef,
  ScrollHandler,
  SharedValue,
} from 'react-native-reanimated'

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
  enableOverdrag: SharedValue<boolean>

  sheetHeight: SharedValue<number>
  sheetVisibleHeight: SharedValue<number>
  sheetVisibleRatio: SharedValue<number>
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

export type BottomSheetScrollViewProps = Omit<
  AnimatedScrollViewProps,
  | 'onLayout'
  | 'onTouchStart'
  | 'onTouchEnd'
  | 'onScroll'
  | 'onBeginDrag'
  | 'onEndDrag'
  | 'onMomentumBegin'
  | 'onMomentumEnd'
> & {
  fill?: boolean

  onLayout?: (e: LayoutChangeEvent) => void
  onTouchStart?: (e: GestureResponderEvent) => void
  onTouchEnd?: (e: GestureResponderEvent) => void

  onScroll?: ScrollHandler
  onBeginDrag?: ScrollHandler
  onEndDrag?: ScrollHandler
  onMomentumBegin?: ScrollHandler
  onMomentumEnd?: ScrollHandler
}

// MARK: Bottom sheet flatlist

type AnimatedFlatListProps<T> = ComponentProps<typeof Animated.FlatList<T>>

export type BottomSheetFlatListProps<T> = Omit<
  AnimatedFlatListProps<T>,
  | 'onLayout'
  | 'onTouchStart'
  | 'onTouchEnd'
  | 'onScroll'
  | 'onBeginDrag'
  | 'onEndDrag'
  | 'onMomentumBegin'
  | 'onMomentumEnd'
> & {
  fill?: boolean

  onLayout?: (e: LayoutChangeEvent) => void
  onTouchStart?: (e: GestureResponderEvent) => void
  onTouchEnd?: (e: GestureResponderEvent) => void

  onScroll?: ScrollHandler
  onBeginDrag?: ScrollHandler
  onEndDrag?: ScrollHandler
  onMomentumBegin?: ScrollHandler
  onMomentumEnd?: ScrollHandler
}

// MARK: Bottom sheet footer

export type BottomSheetFooterProps = PropsWithChildren & {
  styles?: {
    root?: StyleProp<ViewStyle>
  }
}
