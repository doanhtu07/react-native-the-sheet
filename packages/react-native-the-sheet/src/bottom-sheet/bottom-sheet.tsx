import {
  StyleSheet,
  useColorScheme,
  useWindowDimensions,
  type LayoutChangeEvent,
} from 'react-native'
import type {
  BottomSheetContextType,
  BottomSheetApi,
  BottomSheetProps,
} from './types'
import Animated, {
  useAnimatedReaction,
  useAnimatedRef,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated'
import {
  createContext,
  forwardRef,
  useContext,
  useImperativeHandle,
  useMemo,
} from 'react'
import { useBridgedValue } from '../hooks/use-bridged-value'
import { usePanGesture } from './hooks/use-pan-gesture'
import { useSyncedSharedValue } from '../hooks/use-synced-shared-value'
import { useBottomSheetPresenter } from '../bottom-sheet-presenter'
import { SPRING_CONFIG } from '../constants'

const BottomSheetContext = createContext<BottomSheetContextType | undefined>(
  undefined,
)

export const BottomSheet = forwardRef<BottomSheetApi, BottomSheetProps>(
  function BottomSheetCore(
    {
      snapPoints = [],
      enableFloat = false,
      enableOverdrag = false,
      disableDrag = false,
      fill = false,
      styles: propStyles,
      children,
    },
    ref,
  ) {
    // MARK: Catch exceptions

    if (enableOverdrag && snapPoints.length === 0) {
      throw new Error(
        'react-native-the-sheet - src/bottom-sheet/bottom-sheet.tsx - enableOverdrag cannot be enabled without snap points',
      )
    }

    // MARK: Artifacts

    const theme = useColorScheme()
    const { height: screenHeight } = useWindowDimensions()

    const { translateY: bottomSheetPresenterTranslateY } =
      useBottomSheetPresenter()

    const enableOverdragBridge = useBridgedValue(enableOverdrag)

    const isDark = theme === 'dark'
    const backgroundColor = isDark ? '#1C1C1E' : '#FFFFFF'

    const sheetHeight = useSharedValue(0)
    const sheetVisibleHeight = useSharedValue(0)
    const sheetVisibleRatio = useSharedValue(0)

    // Normalize snap points into numbers
    const normalizedSnaps = useBridgedValue(
      useMemo(() => {
        if (snapPoints.length === 0) return []

        return snapPoints
          .map((point) => {
            if (typeof point === 'number') return point
            const percentage = Number.parseFloat(point as string) / 100
            return screenHeight * percentage
          })
          .filter((point) => point > 0 && point <= screenHeight)
          .sort((a, b) => a - b)
      }, [screenHeight, snapPoints]),
    )

    // Convert snap points to translate ys (relative distance from fully open position)
    // Naturally, snapTranslateYs is sorted in descending order (largest value = closest to fully closed)
    const snapTranslateYs = useDerivedValue(() => {
      const snaps = normalizedSnaps.value
      if (snaps.length === 0) return [0]

      // We have established snaps is not empty
      const maxSnapPoint = snaps.at(-1)!

      return snaps.map((point) => maxSnapPoint - point)
    })

    /**
     * translateY = tracks relative position of bottom sheet to its rest point
     * - = 0: Bottom sheet is fully visible inside bottom sheet presenter
     * - > 0: Bottom sheet is being dragged down from rest point
     * - < 0: Bottom sheet is being dragged up from rest point
     */
    const translateY = useSyncedSharedValue(0, () => {
      'worklet'
      return snapTranslateYs.value[0]!
    })

    const onLayout = (event: LayoutChangeEvent) => {
      'worklet'
      sheetHeight.value = event.nativeEvent.layout.height
    }

    // MARK: Bottom sheet context

    const scrollViewRef = useAnimatedRef<
      Animated.ScrollView | Animated.FlatList<unknown>
    >()
    const isScrollViewReady = useSharedValue(false)
    const isScrolling = useSharedValue<0 | 1>(0)
    const scrollY = useSharedValue(0)

    const excludePanGestureContext = useMemo<
      Omit<BottomSheetContextType, 'getPanGesture'>
    >(() => {
      return {
        enableOverdrag,

        sheetHeight,
        sheetVisibleHeight,
        sheetVisibleRatio,
        snapTranslateYs,
        translateY,

        scrollViewRef,
        isScrollViewReady,
        isScrolling,
        scrollY,
      }
    }, [
      enableOverdrag,
      sheetHeight,
      sheetVisibleHeight,
      sheetVisibleRatio,
      snapTranslateYs,
      translateY,
      scrollViewRef,
      isScrollViewReady,
      isScrolling,
      scrollY,
    ])

    const getPanGesture = usePanGesture({
      excludePanGestureContext,
      enableFloat,
      disableDrag,
    })

    const contextValue = useMemo<BottomSheetContextType>(() => {
      return {
        ...excludePanGestureContext,
        getPanGesture,
      }
    }, [excludePanGestureContext, getPanGesture])

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
            : (Number.parseFloat(position) / 100) * screenHeight

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
          enableOverdrag: enableOverdragBridge.value,
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

    // MARK: Preparation

    const animatedStyle = useAnimatedStyle(() => {
      'worklet'

      const maxSnap = normalizedSnaps.value.at(-1)

      // Snap points defined

      if (maxSnap) {
        const overDrag = Math.min(0, translateY.value) // overDrag should be negative

        return {
          height: maxSnap - overDrag,
          transform: [{ translateY: Math.max(0, translateY.value) }],
        }
      }

      // Dynamic sizing

      return {
        transform: [{ translateY: translateY.value }],
      }
    })

    const applyFillStyle = fill && snapPoints.length === 0

    // MARK: Renderers

    return (
      <BottomSheetContext.Provider value={contextValue}>
        <Animated.View
          onLayout={onLayout}
          style={[
            styles.root,
            applyFillStyle && styles.fill,
            { backgroundColor },
            propStyles?.root,
            animatedStyle,
          ]}
        >
          {children}
        </Animated.View>
      </BottomSheetContext.Provider>
    )
  },
)

// MARK: Hooks

export const useBottomSheet = () => {
  const context = useContext(BottomSheetContext)

  if (!context) {
    throw new Error('useBottomSheet must be used within a BottomSheet')
  }

  return context
}

// MARK: Styles

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  root: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    width: '100%',
  },
})
