import type { GestureResponderEvent, LayoutChangeEvent } from 'react-native'
import type { BottomSheetScrollViewProps } from '../types'
import {
  cancelAnimation,
  runOnUI,
  useAnimatedScrollHandler,
  withDelay,
  withTiming,
} from 'react-native-reanimated'
import { useBottomSheet } from '../bottom-sheet-provider'
import { useCallback } from 'react'

const UNSET_SCROLLING_DELAY = 200

type Props = Pick<
  BottomSheetScrollViewProps,
  | 'onLayout'
  | 'onContentSizeChange'
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
  onContentSizeChange: propOnContentSizeChange,
  onTouchStart: propOnTouchStart,
  onTouchEnd: propOnTouchEnd,
  onScroll: propOnScroll,
  onBeginDrag: propOnBeginDrag,
  onEndDrag: propOnEndDrag,
  onMomentumBegin: propOnMomentumBegin,
  onMomentumEnd: propOnMomentumEnd,
}: Props) => {
  const {
    isScrollViewReady,
    isScrollViewInteracting,
    scrollY,
    scrollViewHeight,
    scrollViewContentHeight,
  } = useBottomSheet()

  const setScrollViewInteracting = useCallback(() => {
    'worklet'
    cancelAnimation(isScrollViewInteracting)
    isScrollViewInteracting.value = 1
  }, [isScrollViewInteracting])

  const unsetScrollViewInteracting = useCallback(() => {
    'worklet'
    isScrollViewInteracting.value = withDelay(
      UNSET_SCROLLING_DELAY,
      withTiming(0, { duration: 0 }),
    )
  }, [isScrollViewInteracting])

  const onLayout = (event: LayoutChangeEvent) => {
    propOnLayout?.(event)
    isScrollViewReady.value = true
    scrollViewHeight.value = event.nativeEvent.layout.height
  }

  const onContentSizeChange = (w: number, h: number) => {
    propOnContentSizeChange?.(w, h)
    scrollViewContentHeight.value = h
  }

  const onTouchStart = (event: GestureResponderEvent) => {
    propOnTouchStart?.(event)
    runOnUI(setScrollViewInteracting)()
  }

  const onTouchEnd = (event: GestureResponderEvent) => {
    propOnTouchEnd?.(event)
    runOnUI(unsetScrollViewInteracting)()
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
      setScrollViewInteracting()
    },
    onEndDrag: (event, context) => {
      'worklet'
      propOnEndDrag?.(event, context)
      unsetScrollViewInteracting()
    },
    onMomentumBegin: (event, context) => {
      'worklet'
      propOnMomentumBegin?.(event, context)
    },
    onMomentumEnd: (event, context) => {
      'worklet'
      propOnMomentumEnd?.(event, context)
    },
  })

  return {
    setScrollViewInteracting,
    unsetScrollViewInteracting,

    onLayout,
    onContentSizeChange,
    onTouchStart,
    onTouchEnd,
    onScroll,
  }
}
