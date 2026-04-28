import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated'
import type { BottomSheetFooterProps } from './types'
import { StyleSheet, type LayoutChangeEvent } from 'react-native'
import { Fragment } from 'react'
import { useBottomSheet } from './bottom-sheet-provider'

export const BottomSheetFooter = ({
  styles: propStyles,
  children,
}: BottomSheetFooterProps) => {
  const { sheetVisibleHeight, translateY } = useBottomSheet()

  const footerHeight = useSharedValue(0)

  const onLayout = (event: LayoutChangeEvent) => {
    'worklet'
    footerHeight.value = event.nativeEvent.layout.height
  }

  // MARK: Renderers

  const rootAnimatedStyle = useAnimatedStyle(() => {
    let totalOffset = 0

    // Offset footer by the same amount as we drag the sheet down (not up)
    if (translateY.value > 0) {
      totalOffset = -translateY.value
    }

    // If sheet visible height is too low, we start moving footer down together with the sheet
    // to avoid footer floating outside the sheet
    if (sheetVisibleHeight.value <= footerHeight.value) {
      totalOffset += footerHeight.value - sheetVisibleHeight.value
    }

    return {
      transform: [{ translateY: totalOffset }],
    }
  })

  const placeholderAnimatedStyle = useAnimatedStyle(() => {
    return {
      height: footerHeight.value,
    }
  })

  return (
    <Fragment>
      {/* Actual footer */}
      <Animated.View
        style={[styles.root, propStyles?.root, rootAnimatedStyle]}
        onLayout={onLayout}
      >
        {children}
      </Animated.View>

      {/* Placeholder view to keep content above footer */}
      <Animated.View style={placeholderAnimatedStyle} collapsable={false} />
    </Fragment>
  )
}

// MARK: Styles

const styles = StyleSheet.create({
  root: {
    bottom: 0,
    position: 'absolute',
    width: '100%',
  },
})
