import type { FlashListProps } from '@shopify/flash-list'
import type { AnimatedProps, ScrollHandler } from 'react-native-reanimated'
import type { AnimatedProp } from '@the-sheet/the-sheet'
import type { PanGesture } from 'react-native-gesture-handler'
import type { GestureResponderEvent, LayoutChangeEvent } from 'react-native'

type AnimatedFlashListProps<T> = AnimatedProps<FlashListProps<T>>

export type BottomSheetFlashListProps<T> = Omit<
  AnimatedFlashListProps<T>,
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
  isActive?: AnimatedProp<boolean>
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
