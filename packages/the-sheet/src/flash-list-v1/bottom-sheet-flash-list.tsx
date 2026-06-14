import Animated, {
  useAnimatedStyle,
  type AnimatedProps,
} from 'react-native-reanimated'
import { StyleSheet } from 'react-native'
import { useToSharedValue } from '../core/hooks'
import { type FlashListProps, FlashList } from 'flash-list-v1'
import type { BottomSheetFlashListProps } from './types'
import { BottomSheetFlashListScrollComponent } from './private/bottom-sheet-flash-list-scroll-component'

export const AnimatedFlashList = Animated.createAnimatedComponent(FlashList)

export function BottomSheetFlashList<T>({
  fill: propFill = false,
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
}: Readonly<BottomSheetFlashListProps<T>>) {
  const fill = useToSharedValue(propFill)

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
        {...(rest as AnimatedProps<FlashListProps<unknown>>)}
        contentContainerStyle={contentContainerStyle}
        bounces={false} // iOS bounce ruins the scrollY <= 0 check
        renderScrollComponent={(flashListProps) => (
          <BottomSheetFlashListScrollComponent
            {...flashListProps}
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

// MARK: Styles

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  root: {},
})
