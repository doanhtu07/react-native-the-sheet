import type { ComponentProps, PropsWithChildren } from 'react'
import type {
  GestureResponderEvent,
  LayoutChangeEvent,
  StyleProp,
  ViewStyle,
} from 'react-native'
import type Animated from 'react-native-reanimated'
import type {
  AnimatedRef,
  ScrollHandler,
  SharedValue,
} from 'react-native-reanimated'
import type { AnimatedProp } from '../types'
import type { PanGesture } from 'react-native-gesture-handler'

// MARK: Bottom sheet handle

export type BottomSheetHandleProps = {
  getPanGesture?: () => PanGesture

  styles?: {
    root?: StyleProp<ViewStyle>
    indicator?: StyleProp<ViewStyle>
  }

  testID?: string
}

// MARK: Bottom sheet registry provider

export type BottomSheetRegistryContextType = {
  sheets: Record<string, BottomSheetContextType>
  registerSheet: (id: string, ctx: BottomSheetContextType) => void
  unregisterSheet: (id: string) => void
}

export type BottomSheetRegistryProviderProps = PropsWithChildren

// MARK: Bottom sheet provider

/** Percentage is compared to the screen height */
export type SnapPoint = number | `${number}%`

export type BottomSheetContextType = {
  enableFloat: SharedValue<boolean>
  enableOverdrag: SharedValue<boolean>
  disableDrag: SharedValue<boolean>

  sheetHeight: SharedValue<number>
  sheetVisibleHeight: SharedValue<number>
  sheetVisibleRatio: SharedValue<number>

  normalizedSnaps: SharedValue<number[]>
  snapTranslateYs: SharedValue<number[]>
  translateY: SharedValue<number>
  isTranslateYAnimating: SharedValue<boolean>

  scrollViewRef: AnimatedRef<Animated.ScrollView | Animated.FlatList>
  isScrollViewReady: SharedValue<boolean>
  isScrollViewInteracting: SharedValue<0 | 1>
  scrollY: SharedValue<number>
  scrollViewHeight: SharedValue<number>
  scrollViewContentHeight: SharedValue<number>

  isPanGestureActive: SharedValue<boolean>
  lockedScrollY: SharedValue<number>
  isScrollLocked: SharedValue<boolean>

  keyboardExpanderTargetHeight: SharedValue<number>
  keyboardExpanderCurrentHeight: SharedValue<number>
  keyboardExpanderHeightRatio: SharedValue<number>
}

export type BottomSheetProviderProps = PropsWithChildren & {
  id?: string
  snapPoints?: AnimatedProp<SnapPoint[]>
  enableFloat?: AnimatedProp<boolean>
  enableOverdrag?: AnimatedProp<boolean>
  disableDrag?: AnimatedProp<boolean>
}

// MARK: Bottom sheet

export type BottomSheetProps = PropsWithChildren & {
  fill?: AnimatedProp<boolean>

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
  fill?: AnimatedProp<boolean>
  getPanGesture?: () => PanGesture

  styles?: {
    root?: StyleProp<ViewStyle>
  }

  testID?: string
}

// MARK: Bottom sheet scroll view

type AnimatedScrollViewProps = ComponentProps<typeof Animated.ScrollView>

export type BottomSheetScrollViewProps = Omit<
  AnimatedScrollViewProps,
  | 'onLayout'
  | 'onContentSizeChange'
  | 'onTouchStart'
  | 'onTouchEnd'
  | 'onScroll'
  | 'onBeginDrag'
  | 'onEndDrag'
  | 'onMomentumBegin'
  | 'onMomentumEnd'
> & {
  fill?: AnimatedProp<boolean>
  getPanGesture?: () => PanGesture

  onLayout?: (e: LayoutChangeEvent) => void
  onContentSizeChange?: (w: number, h: number) => void
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
  | 'onContentSizeChange'
  | 'onTouchStart'
  | 'onTouchEnd'
  | 'onScroll'
  | 'onBeginDrag'
  | 'onEndDrag'
  | 'onMomentumBegin'
  | 'onMomentumEnd'
> & {
  fill?: AnimatedProp<boolean>
  getPanGesture?: () => PanGesture

  onLayout?: (e: LayoutChangeEvent) => void
  onContentSizeChange?: (w: number, h: number) => void
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
