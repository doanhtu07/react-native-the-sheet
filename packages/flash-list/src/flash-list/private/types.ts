import type { ComponentProps } from 'react'
import type {
  GestureResponderEvent,
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native'
import type { PanGesture } from 'react-native-gesture-handler'
import type { ScrollHandler } from 'react-native-reanimated'
import type { AnimatedProp } from '@the-sheet/the-sheet'
import type Animated from 'react-native-reanimated'

type AnimatedScrollViewProps = ComponentProps<typeof Animated.ScrollView>

export type BottomSheetFlashListScrollComponentProps = Omit<
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

  flashListOnScroll?: (e: NativeSyntheticEvent<NativeScrollEvent>) => void
  flashListOnBeginDrag?: (e: NativeSyntheticEvent<NativeScrollEvent>) => void
  flashListOnEndDrag?: (e: NativeSyntheticEvent<NativeScrollEvent>) => void
  flashListOnMomentumBegin?: (
    e: NativeSyntheticEvent<NativeScrollEvent>,
  ) => void
  flashListOnMomentumEnd?: (e: NativeSyntheticEvent<NativeScrollEvent>) => void
}
