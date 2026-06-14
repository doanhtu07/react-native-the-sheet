import type { GestureResponderEvent, LayoutChangeEvent } from 'react-native'
import type { BottomSheetScrollViewProps } from '../types'
import { useAnimatedScrollHandler } from 'react-native-reanimated'
import { runOnJS } from 'react-native-worklets'
import { useBottomSheet } from '../bottom-sheet-provider'
import { useCallback, useEffect, useRef } from 'react'

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

  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null)

  const setScrollViewInteracting = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }

    isScrollViewInteracting.value = true
  }, [isScrollViewInteracting])

  const unsetScrollViewInteracting = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      isScrollViewInteracting.value = false
    }, UNSET_SCROLLING_DELAY)
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
    setScrollViewInteracting()
  }

  const onTouchEnd = (event: GestureResponderEvent) => {
    propOnTouchEnd?.(event)
    unsetScrollViewInteracting()
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
      runOnJS(setScrollViewInteracting)()
    },
    onEndDrag: (event, context) => {
      'worklet'
      propOnEndDrag?.(event, context)
      runOnJS(unsetScrollViewInteracting)()
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

  // MARK: Effects

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }
  }, [])

  // MARK: Return

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
