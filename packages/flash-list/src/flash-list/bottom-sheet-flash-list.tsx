import Animated, { useAnimatedStyle } from 'react-native-reanimated'
import { StyleSheet } from 'react-native'
import { forwardRef, useCallback, useRef, type Ref } from 'react'
import { useToSharedValue } from '@the-sheet/the-sheet'
import {
  type ContentStyle,
  type FlashListProps,
  FlashList,
} from '@shopify/flash-list'
import type { BottomSheetFlashListProps } from './types'
import { BottomSheetFlashListScrollComponent } from './private/bottom-sheet-flash-list-scroll-component'

export const AnimatedFlashList = Animated.createAnimatedComponent(
  FlashList,
) as unknown as typeof FlashList

function BottomSheetFlashListInner<T>(
  {
    fill: propFill = false,
    isActive: propIsActive = true,
    getPanGesture: propGetPanGesture,

    onLayout: propOnLayout,
    onContentSizeChange: propOnContentSizeChange,
    onTouchStart: propOnTouchStart,
    onTouchEnd: propOnTouchEnd,

    onScroll: propOnScroll,
    onBeginDrag: propOnBeginDrag,
    onEndDrag: propOnEndDrag,
    onMomentumBegin: propOnMomentumBegin,
    onMomentumEnd: propOnMomentumEnd,

    style,
    contentContainerStyle,

    ...rest
  }: Readonly<BottomSheetFlashListProps<T>>,

  ref: Ref<FlashList<T>>,
) {
  const fill = useToSharedValue(propFill)
  const nativeRef = useRef<FlashList<T> | null>(null)

  const callbackRef = useCallback(
    (node: FlashList<T> | null) => {
      nativeRef.current = node
      if (typeof ref === 'function') ref(node)
      else if (ref) ref.current = node
    },
    [ref],
  )

  // MARK: Preparation

  const animatedStyle = useAnimatedStyle(() => {
    return {
      ...(fill.value ? styles.fill : undefined),
    }
  })

  // MARK: Renderers

  return (
    <Animated.View style={[styles.root, style, animatedStyle]}>
      <AnimatedFlashList
        {...(rest as FlashListProps<unknown>)}
        ref={callbackRef as Ref<FlashList<unknown>>}
        contentContainerStyle={contentContainerStyle as ContentStyle}
        bounces={false} // iOS bounce ruins the scrollY <= 0 check
        renderScrollComponent={(flashListProps) => (
          <BottomSheetFlashListScrollComponent
            {...flashListProps}
            isActive={propIsActive}
            getPanGesture={propGetPanGesture}
            onLayout={(event) => {
              propOnLayout?.(event)
              flashListProps.onLayout?.(event)
            }}
            onContentSizeChange={(w, h) => {
              propOnContentSizeChange?.(w, h)
              flashListProps.onContentSizeChange?.(w, h)
            }}
            onTouchStart={(event) => {
              propOnTouchStart?.(event)
              flashListProps.onTouchStart?.(event)
            }}
            onTouchEnd={(event) => {
              propOnTouchEnd?.(event)
              flashListProps.onTouchEnd?.(event)
            }}
            onScroll={propOnScroll}
            onBeginDrag={propOnBeginDrag}
            onEndDrag={propOnEndDrag}
            onMomentumBegin={propOnMomentumBegin}
            onMomentumEnd={propOnMomentumEnd}
            flashListOnScroll={flashListProps.onScroll}
            flashListOnBeginDrag={flashListProps.onScrollBeginDrag}
            flashListOnEndDrag={flashListProps.onScrollEndDrag}
            flashListOnMomentumBegin={flashListProps.onMomentumScrollBegin}
            flashListOnMomentumEnd={flashListProps.onMomentumScrollEnd}
          />
        )}
      />
    </Animated.View>
  )
}

export const BottomSheetFlashList = forwardRef(BottomSheetFlashListInner) as <
  T,
>(
  props: BottomSheetFlashListProps<T> & {
    ref?: Ref<FlashList<T>>
  },
) => ReturnType<typeof BottomSheetFlashListInner>

// MARK: Styles

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  root: {},
})
