import type { GestureResponderEvent, LayoutChangeEvent } from 'react-native'
import { useBottomSheet } from '../bottom-sheet'
import type { BottomSheetScrollViewProps } from '../types'
import {
  cancelAnimation,
  useAnimatedScrollHandler,
  withDelay,
  withTiming,
} from 'react-native-reanimated'

const UNSET_SCROLLING_DELAY = 200

type Props = Pick<
  BottomSheetScrollViewProps,
  'onLayout' | 'onTouchStart' | 'onTouchEnd'
>

export const useScrollViewUtils = ({
  onLayout: propOnLayout,
  onTouchStart: propOnTouchStart,
  onTouchEnd: propOnTouchEnd,
}: Props) => {
  const { isScrollViewReady, isScrolling, scrollY } = useBottomSheet()

  const onLayout = (event: LayoutChangeEvent) => {
    'worklet'

    if (propOnLayout) {
      const resolvedOnLayout =
        typeof propOnLayout === 'function' ? propOnLayout : propOnLayout.value

      resolvedOnLayout?.(event)
    }

    isScrollViewReady.value = true
  }

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

  const onTouchStart = (event: GestureResponderEvent) => {
    'worklet'

    if (propOnTouchStart) {
      const resolvedOnTouchStart =
        typeof propOnTouchStart === 'function'
          ? propOnTouchStart
          : propOnTouchStart.value

      resolvedOnTouchStart?.(event)
    }

    setScrolling()
  }

  const onTouchEnd = (event: GestureResponderEvent) => {
    'worklet'

    if (propOnTouchEnd) {
      const resolvedOnTouchEnd =
        typeof propOnTouchEnd === 'function'
          ? propOnTouchEnd
          : propOnTouchEnd.value

      resolvedOnTouchEnd?.(event)
    }

    unsetScrolling()
  }

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      'worklet'
      scrollY.value = event.contentOffset.y
    },
    onBeginDrag: () => {
      'worklet'
      setScrolling()
    },
    onEndDrag: () => {
      'worklet'
      unsetScrolling()
    },
    onMomentumBegin: () => {
      'worklet'
      setScrolling()
    },
    onMomentumEnd: () => {
      'worklet'
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
