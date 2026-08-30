import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
} from 'react'
import {
  useSharedValue,
  useDerivedValue,
  useAnimatedRef,
  makeMutable,
  useAnimatedReaction,
  runOnJS,
} from 'react-native-reanimated'
import { useSyncedSharedValue } from '../hooks/use-synced-shared-value'
import { useToSharedValue } from '../hooks/use-to-shared-value'
import { useTrueSafeArea } from '../hooks'
import type {
  BottomSheetContextType,
  BottomSheetProviderProps,
  ScrollViewMetadata,
} from './types'
import { useBottomSheetRegistryDangerously } from './bottom-sheet-registry-provider'

const BottomSheetContext = createContext<BottomSheetContextType | undefined>(
  undefined,
)

export const useBottomSheet = () => {
  const context = useContext(BottomSheetContext)

  if (!context) {
    throw new Error(
      '@the-sheet/the-sheet - src/core/bottom-sheet/bottom-sheet-provider.tsx - useBottomSheet must be used within a BottomSheetProvider',
    )
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
  const autoGenBottomSheetProviderId = useId()
  const { safeAreaHeight: safeAreaHeightValue } = useTrueSafeArea()

  const bottomSheetRegistry = useBottomSheetRegistryDangerously()
  const registerSheet = bottomSheetRegistry?.registerSheet
  const unregisterSheet = bottomSheetRegistry?.unregisterSheet

  const safeAreaHeight = useToSharedValue(safeAreaHeightValue)

  // MARK: Bottom sheet state

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

  // MARK: Scroll view state

  const activeScrollViewIds = useSharedValue<Record<string, true>>({})
  const scrollViewMetadataMap = useRef<Record<string, ScrollViewMetadata>>({})

  const getScrollViewMetadata = useCallback(
    (scrollViewId: string): ScrollViewMetadata => {
      if (!scrollViewMetadataMap.current[scrollViewId]) {
        scrollViewMetadataMap.current[scrollViewId] = {
          scrollY: makeMutable(0),
          scrollViewHeight: makeMutable(0),
          scrollViewContentHeight: makeMutable(0),
          hasLaidOut: makeMutable(false),
        }
      }

      return scrollViewMetadataMap.current[scrollViewId]!
    },
    [],
  )

  const cleanupScrollViewMetadata = useCallback((scrollViewId: string) => {
    delete scrollViewMetadataMap.current[scrollViewId]
  }, [])

  const scrollViewRef = useAnimatedRef<any>()
  const isScrollViewInteracting = useSharedValue(false)
  const isPanGestureActive = useSharedValue(false)
  const lockedScrollY = useSharedValue(0)
  const isScrollLocked = useSharedValue(false)

  // MARK: Keyboard expander state

  const keyboardExpanderTargetHeight = useSharedValue(0)
  const keyboardExpanderCurrentHeight = useSharedValue(0)
  const keyboardExpanderHeightRatio = useSharedValue(0)

  // MARK: Timeout for invalid activeScrollViewIds (when there are 2 active scroll views at the same time)

  const invalidActiveScrollViewIdsTimeoutRef = useRef<ReturnType<
    typeof setTimeout
  > | null>(null)

  const setInvalidActiveScrollViewIdsTimeout = useCallback(() => {
    if (invalidActiveScrollViewIdsTimeoutRef.current) {
      clearTimeout(invalidActiveScrollViewIdsTimeoutRef.current)
    }

    invalidActiveScrollViewIdsTimeoutRef.current = setTimeout(() => {
      invalidActiveScrollViewIdsTimeoutRef.current = null

      throw new Error(
        '@the-sheet/the-sheet - src/core/bottom-sheet/bottom-sheet-provider.tsx - There are 2 active scroll views at the same time. This is not allowed. Please make sure only one scroll view is active at a time.',
      )
    }, 3000)
  }, [])

  const clearInvalidActiveScrollViewIdsTimeout = useCallback(() => {
    if (invalidActiveScrollViewIdsTimeoutRef.current) {
      clearTimeout(invalidActiveScrollViewIdsTimeoutRef.current)
      invalidActiveScrollViewIdsTimeoutRef.current = null
    }
  }, [])

  // MARK: Bottom sheet context

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

    activeScrollViewIds,
    scrollViewMetadataMap,
    getScrollViewMetadata,
    cleanupScrollViewMetadata,

    scrollViewRef,
    isScrollViewInteracting,
    isPanGestureActive,
    lockedScrollY,
    isScrollLocked,

    keyboardExpanderTargetHeight,
    keyboardExpanderCurrentHeight,
    keyboardExpanderHeightRatio,
  })

  // MARK: Effects

  // Effect: Register bottom sheet in registry
  useEffect(() => {
    if (!registerSheet || !unregisterSheet) {
      return
    }

    const bottomSheetProviderId = id || autoGenBottomSheetProviderId

    registerSheet(bottomSheetProviderId, contextValue.current)

    return () => {
      unregisterSheet(bottomSheetProviderId)
    }
  }, [autoGenBottomSheetProviderId, id, registerSheet, unregisterSheet])

  // Effect: Watch for invalid activeScrollViewIds
  /*
    Because when a new scroll view shows up, 
    there will be a moment when both the old and new scroll views 
    are active at the same time

    So we have a timeout to wait for things to settle down
    before throwing an error if there are still 2 active scroll views
  */
  useAnimatedReaction(
    () => {
      return {
        activeScrollViewIds: activeScrollViewIds.value,
      }
    },
    (prepared) => {
      if (Object.keys(prepared.activeScrollViewIds).length >= 2) {
        runOnJS(setInvalidActiveScrollViewIdsTimeout)()
      } else {
        runOnJS(clearInvalidActiveScrollViewIdsTimeout)()
      }
    },
  )

  // MARK: Renderers

  return (
    <BottomSheetContext.Provider value={contextValue.current}>
      {children}
    </BottomSheetContext.Provider>
  )
}
