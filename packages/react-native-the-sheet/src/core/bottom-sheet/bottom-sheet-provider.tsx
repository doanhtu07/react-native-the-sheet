import { createContext, useContext, useEffect, useId, useRef } from 'react'
import Animated, {
  useSharedValue,
  useDerivedValue,
  useAnimatedRef,
} from 'react-native-reanimated'
import { useSyncedSharedValue } from '../hooks/use-synced-shared-value'
import { useToSharedValue } from '../hooks/use-to-shared-value'
import { useTrueSafeArea } from '../hooks'
import type { BottomSheetContextType, BottomSheetProviderProps } from './types'
import { useBottomSheetRegistry } from './bottom-sheet-registry-provider'

const BottomSheetContext = createContext<BottomSheetContextType | undefined>(
  undefined,
)

export const useBottomSheet = () => {
  const context = useContext(BottomSheetContext)

  if (!context) {
    throw new Error('useBottomSheet must be used within a BottomSheetProvider')
  }

  return context
}

export function BottomSheetProvider({
  id,
  snapPoints: propSnapPoints = [],
  enableFloat: propEnableFloat = false,
  enableOverdrag: propEnableOverdrag = false,
  disableDrag: propDisableDrag = false,
  children,
}: BottomSheetProviderProps) {
  const { registerSheet, unregisterSheet } = useBottomSheetRegistry()
  const autoGenBottomSheetProviderId = useId()
  const { safeAreaHeight: safeAreaHeightValue } = useTrueSafeArea()

  const safeAreaHeight = useToSharedValue(safeAreaHeightValue)

  const snapPoints = useToSharedValue(propSnapPoints)
  const enableFloat = useToSharedValue(propEnableFloat)
  const enableOverdrag = useToSharedValue(propEnableOverdrag)
  const disableDrag = useToSharedValue(propDisableDrag)

  const sheetHeight = useSharedValue(0)
  const sheetVisibleHeight = useSharedValue(0)
  const sheetVisibleRatio = useSharedValue(0)

  // Normalize snap points into numbers
  const normalizedSnaps = useDerivedValue(() => {
    if (snapPoints.value.length === 0) return []

    const sorted = snapPoints.value
      .map((point) => {
        if (typeof point === 'number') return point
        const percentage = Number.parseFloat(point as string) / 100
        return safeAreaHeight.value * percentage
      })
      .sort((a, b) => a - b)

    return sorted
  })

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

  const isTranslateYAnimating = useSharedValue(false)

  // MARK: Bottom sheet context

  const scrollViewRef = useAnimatedRef<
    Animated.ScrollView | Animated.FlatList<unknown>
  >()
  const isScrollViewReady = useSharedValue(false)
  const isScrollViewInteracting = useSharedValue(false)
  const scrollY = useSharedValue(0)
  const scrollViewHeight = useSharedValue(0)
  const scrollViewContentHeight = useSharedValue(0)

  const isPanGestureActive = useSharedValue(false)
  const lockedScrollY = useSharedValue(0)
  const isScrollLocked = useSharedValue(false)

  const keyboardExpanderTargetHeight = useSharedValue(0)
  const keyboardExpanderCurrentHeight = useSharedValue(0)
  const keyboardExpanderHeightRatio = useSharedValue(0)

  const contextValue = useRef<BottomSheetContextType>({
    enableFloat,
    enableOverdrag,
    disableDrag,

    sheetHeight,
    sheetVisibleHeight,
    sheetVisibleRatio,

    normalizedSnaps,
    snapTranslateYs,
    translateY,
    isTranslateYAnimating,

    scrollViewRef,
    isScrollViewReady,
    isScrollViewInteracting,
    scrollY,
    scrollViewHeight,
    scrollViewContentHeight,

    isPanGestureActive,
    lockedScrollY,
    isScrollLocked,

    keyboardExpanderTargetHeight,
    keyboardExpanderCurrentHeight,
    keyboardExpanderHeightRatio,
  })

  // MARK: Effects

  useEffect(() => {
    const bottomSheetProviderId = id || autoGenBottomSheetProviderId

    registerSheet(bottomSheetProviderId, contextValue.current)

    return () => {
      unregisterSheet(bottomSheetProviderId)
    }
  }, [id, registerSheet, unregisterSheet, autoGenBottomSheetProviderId])

  // MARK: Renderers

  return (
    <BottomSheetContext.Provider value={contextValue.current}>
      {children}
    </BottomSheetContext.Provider>
  )
}
