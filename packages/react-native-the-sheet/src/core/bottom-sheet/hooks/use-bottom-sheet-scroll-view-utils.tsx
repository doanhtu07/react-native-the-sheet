import type { GestureResponderEvent, LayoutChangeEvent } from 'react-native'
import type { BottomSheetScrollViewProps } from '../types'
import {
  cancelAnimation,
  useAnimatedScrollHandler,
  withDelay,
  withTiming,
} from 'react-native-reanimated'
import { runOnUI } from 'react-native-worklets'
import { useBottomSheet } from '../bottom-sheet-provider'

const UNSET_SCROLLING_DELAY = 200

type Props = Pick<
  BottomSheetScrollViewProps,
  | 'onLayout'
  | 'onTouchStart'
  | 'onTouchEnd'
  | 'onScroll'
  | 'onBeginDrag'
  | 'onEndDrag'
  | 'onMomentumBegin'
  | 'onMomentumEnd'
>

export const useBottomSheetScrollViewUtils = ({
  onLayout: propOnLayout,
  onTouchStart: propOnTouchStart,
  onTouchEnd: propOnTouchEnd,
  onScroll: propOnScroll,
  onBeginDrag: propOnBeginDrag,
  onEndDrag: propOnEndDrag,
  onMomentumBegin: propOnMomentumBegin,
  onMomentumEnd: propOnMomentumEnd,
}: Props) => {
  const { isScrollViewReady, isScrolling, scrollY } = useBottomSheet()

  const setScrolling = () => {
    'worklet'
    cancelAnimation(isScrolling)
    isScrolling.value = 1
  }

  const unsetScrolling = () => {
    'worklet'

    isScrolling.value = withDelay(
      UNSET_SCROLLING_DELAY,
      withTiming(0, { duration: 0 }),
    )
  }

  const onLayout = (event: LayoutChangeEvent) => {
    propOnLayout?.(event)

    runOnUI(() => {
      'worklet'
      isScrollViewReady.value = true
    })()
  }

  const onTouchStart = (event: GestureResponderEvent) => {
    propOnTouchStart?.(event)

    runOnUI(() => {
      'worklet'
      setScrolling()
    })()
  }

  const onTouchEnd = (event: GestureResponderEvent) => {
    propOnTouchEnd?.(event)

    runOnUI(() => {
      'worklet'
      unsetScrolling()
    })()
  }

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event, context) => {
      'worklet'
      propOnScroll?.(event, context)
      scrollY.value = event.contentOffset.y
    },
    onBeginDrag: (event, context) => {
      'worklet'
      propOnBeginDrag?.(event, context)
      setScrolling()
    },
    onEndDrag: (event, context) => {
      'worklet'
      propOnEndDrag?.(event, context)
      unsetScrolling()
    },
    onMomentumBegin: (event, context) => {
      'worklet'
      propOnMomentumBegin?.(event, context)
      setScrolling()
    },
    onMomentumEnd: (event, context) => {
      'worklet'
      propOnMomentumEnd?.(event, context)
      unsetScrolling()
    },
  })

  return {
    onLayout,
    onTouchStart,
    onTouchEnd,
    onScroll,
  }
}
