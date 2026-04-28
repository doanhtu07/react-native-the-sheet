import {
  createContext,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
} from 'react'
import Animated, {
  useSharedValue,
  useDerivedValue,
  useAnimatedRef,
} from 'react-native-reanimated'
import { useSyncedSharedValue } from '../../private/hooks/use-synced-shared-value'
import { useToSharedValue } from '../../private/hooks/use-to-shared-value'
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
  snapPoints = [],
  enableFloat: propEnableFloat = false,
  enableOverdrag: propEnableOverdrag = false,
  disableDrag: propDisableDrag = false,
  children,
}: BottomSheetProviderProps) {
  // MARK: Catch exceptions

  if (propEnableOverdrag && snapPoints.length === 0) {
    throw new Error(
      'react-native-the-sheet - src/bottom-sheet/bottom-sheet-provider.tsx - enableOverdrag cannot be enabled without snap points',
    )
  }

  // MARK: Artifacts

  const { registerSheet, unregisterSheet } = useBottomSheetRegistry()

  const autoGenBottomSheetProviderId = useId()

  const { safeAreaHeight } = useTrueSafeArea()

  const enableFloat = useToSharedValue(propEnableFloat)
  const enableOverdrag = useToSharedValue(propEnableOverdrag)
  const disableDrag = useToSharedValue(propDisableDrag)

  const sheetHeight = useSharedValue(0)
  const sheetVisibleHeight = useSharedValue(0)
  const sheetVisibleRatio = useSharedValue(0)

  // Normalize snap points into numbers
  const normalizedSnaps = useToSharedValue(
    useMemo(() => {
      if (snapPoints.length === 0) return []

      const filteredSnapPoints = snapPoints
        .map((point) => {
          if (typeof point === 'number') return point
          const percentage = Number.parseFloat(point as string) / 100
          return safeAreaHeight * percentage
        })
        .filter((point) => point > 0 && point <= safeAreaHeight)
        .sort((a, b) => a - b)

      return filteredSnapPoints
    }, [safeAreaHeight, snapPoints]),
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

  // MARK: Bottom sheet context

  const scrollViewRef = useAnimatedRef<
    Animated.ScrollView | Animated.FlatList<unknown>
  >()
  const isScrollViewReady = useSharedValue(false)
  const isScrolling = useSharedValue<0 | 1>(0)
  const scrollY = useSharedValue(0)

  const isPanGestureActive = useSharedValue(false)
  const lockedScrollY = useSharedValue(0)
  const isScrollLocked = useSharedValue(false)

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

    scrollViewRef,
    isScrollViewReady,
    isScrolling,
    scrollY,

    isPanGestureActive,
    lockedScrollY,
    isScrollLocked,
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
