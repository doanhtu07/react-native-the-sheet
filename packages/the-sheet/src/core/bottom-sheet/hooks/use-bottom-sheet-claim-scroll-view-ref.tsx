import { useCallback, useEffect, useMemo, type RefObject } from 'react'
import { useBottomSheet } from '../bottom-sheet-provider'
import {
  runOnJS,
  useAnimatedReaction,
  type SharedValue,
} from 'react-native-reanimated'

type Props = {
  scrollViewId: string
  scrollViewNativeRef: RefObject<any>
  isActive: SharedValue<boolean>
}

export const useBottomSheetClaimScrollViewRef = ({
  scrollViewId,
  scrollViewNativeRef,
  isActive,
}: Props) => {
  const {
    activeScrollViewIds,
    getScrollViewMetadata,
    scrollViewRef,
    isScrollViewInteracting,
    isPanGestureActive,
    lockedScrollY,
    isScrollLocked,
  } = useBottomSheet()

  const metadata = useMemo(() => {
    return getScrollViewMetadata(scrollViewId)
  }, [getScrollViewMetadata, scrollViewId])

  // JS callback: forward native ref to animated ref (requires .current access)
  const setScrollViewRef = useCallback(
    (active: boolean) => {
      if (active && scrollViewNativeRef.current) {
        scrollViewRef(scrollViewNativeRef.current)
      }
    },
    [scrollViewNativeRef, scrollViewRef],
  )

  // MARK: Effects

  // Effect: Unmount - Remove from active set
  useEffect(() => {
    return () => {
      const activeIds = { ...activeScrollViewIds.value }
      delete activeIds[scrollViewId]
      activeScrollViewIds.value = activeIds
    }
  }, [activeScrollViewIds, scrollViewId])

  // Effect: Claim scrollViewRef when isActive becomes true
  useAnimatedReaction(
    () => isActive.value,
    (active, prevActive) => {
      if (active === prevActive) return

      // UI thread: mutate activeScrollViewIds deterministically
      const activeIds = { ...activeScrollViewIds.value }

      if (active) {
        activeIds[scrollViewId] = true
      } else {
        delete activeIds[scrollViewId]
      }

      activeScrollViewIds.value = activeIds

      if (active) {
        isScrollViewInteracting.value = false
        isPanGestureActive.value = false
        lockedScrollY.value = metadata.scrollY.value
        isScrollLocked.value = false
      }

      // JS thread: forward native ref (slight delay acceptable)
      runOnJS(setScrollViewRef)(active)
    },
  )
}
