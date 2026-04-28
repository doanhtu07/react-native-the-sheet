import {
  StyleSheet,
  useColorScheme,
  type LayoutChangeEvent,
} from 'react-native'
import type { BottomSheetApi, BottomSheetProps } from './types'
import Animated, {
  useAnimatedReaction,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated'
import { forwardRef, useImperativeHandle } from 'react'
import { useToSharedValue } from '../../private/hooks/use-to-shared-value'
import { useBottomSheetPresenter } from '../bottom-sheet-presenter'
import { SPRING_CONFIG } from '../../private/constants'
import { useTrueSafeArea } from '../hooks'
import { usePanGestureLockScroll } from './private/hooks/use-pan-gesture-lock-scroll'
import { useBottomSheet } from './bottom-sheet-provider'

export const BottomSheet = forwardRef<BottomSheetApi, BottomSheetProps>(
  function BottomSheetCore(
    { fill: propFill = false, styles: propStyles, children },
    ref,
  ) {
    // MARK: Artifacts

    const theme = useColorScheme()
    const { safeAreaHeight } = useTrueSafeArea()

    const { translateY: bottomSheetPresenterTranslateY } =
      useBottomSheetPresenter()

    const {
      enableOverdrag,
      sheetHeight,
      sheetVisibleHeight,
      sheetVisibleRatio,
      normalizedSnaps,
      snapTranslateYs,
      translateY,
    } = useBottomSheet()

    const isDark = theme === 'dark'
    const backgroundColor = isDark ? '#1C1C1E' : '#FFFFFF'

    const fill = useToSharedValue(propFill)

    const onLayout = (event: LayoutChangeEvent) => {
      'worklet'
      sheetHeight.value = event.nativeEvent.layout.height
    }

    // MARK: Effects

    // Effect: Expose API
    useImperativeHandle(ref, () => ({
      snapToIndex: (index) => {
        'worklet'

        const targets = snapTranslateYs.value

        if (index >= 0 && index < targets.length) {
          const targetY = targets[index]!
          translateY.value = withSpring(targetY, SPRING_CONFIG)
        } else {
          console.warn(
            `react-native-the-sheet - src/bottom-sheet/bottom-sheet.tsx - Index ${index} out of bounds`,
          )
        }
      },

      snapToPosition: (position) => {
        'worklet'

        const snaps = normalizedSnaps.value

        const normalizedPosition =
          typeof position === 'number'
            ? position
            : (Number.parseFloat(position) / 100) * safeAreaHeight

        if (snaps.length > 0) {
          // Basis: The largest snap point is our translateY = 0
          const maxSnapPoint = snaps.at(-1)!
          const targetTranslateY = maxSnapPoint - normalizedPosition
          translateY.value = withSpring(targetTranslateY, SPRING_CONFIG)
        } else {
          // Fallback: If dynamic/no snaps, we use the measured sheetHeight
          const targetTranslateY = sheetHeight.value - normalizedPosition
          translateY.value = withSpring(targetTranslateY, SPRING_CONFIG)
        }
      },
    }))

    // Effect: Track sheet visible height and ratio
    useAnimatedReaction(
      () => {
        return {
          bottomSheetPresenterTranslateY: bottomSheetPresenterTranslateY.value,
          bottomSheetTranslateY: translateY.value,
          sheetHeight: sheetHeight.value,
          enableOverdrag: enableOverdrag.value,
        }
      },
      (prepared) => {
        const total = prepared.sheetHeight
        const pY = prepared.bottomSheetPresenterTranslateY

        const bY = prepared.enableOverdrag
          ? // Clamp negative translateY since bottom sheet height already absorbs it
            Math.max(0, prepared.bottomSheetTranslateY)
          : prepared.bottomSheetTranslateY

        sheetVisibleHeight.value = total - (pY + bY)
        sheetVisibleRatio.value = sheetVisibleHeight.value / total
      },
    )

    // Effect: Lock scroll
    usePanGestureLockScroll()

    // MARK: Preparation

    const animatedStyle = useAnimatedStyle(() => {
      'worklet'

      const maxSnap = normalizedSnaps.value.at(-1)

      // Snap points defined

      if (maxSnap) {
        const overDrag = Math.min(0, translateY.value) // overDrag should be negative
        const clampedTranslateY = Math.max(0, translateY.value) // exclude overDrag from translateY

        const finalTranslateY = clampedTranslateY

        return {
          height: maxSnap - overDrag,
          transform: [{ translateY: finalTranslateY }],
        }
      }

      // Dynamic sizing

      const finalTranslateY = translateY.value

      return {
        ...(fill.value ? { flex: 1 } : undefined),
        transform: [{ translateY: finalTranslateY }],
      }
    })

    // MARK: Renderers

    return (
      <Animated.View
        onLayout={onLayout}
        style={[
          styles.root,
          { backgroundColor },
          propStyles?.root,
          animatedStyle,
        ]}
      >
        {children}
      </Animated.View>
    )
  },
)

// MARK: Styles

const styles = StyleSheet.create({
  root: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    width: '100%',
  },
})
