import {
  scrollTo,
  useAnimatedReaction,
  type SharedValue,
} from 'react-native-reanimated'
import { useBottomSheet } from '../bottom-sheet-provider'
import { useMemo } from 'react'

type Props = {
  scrollViewId: string
  isActive: SharedValue<boolean>
}

export const useBottomSheetLockScroll = ({ scrollViewId, isActive }: Props) => {
  const {
    getScrollViewMetadata,
    scrollViewRef,
    isScrollLocked,
    lockedScrollY,
  } = useBottomSheet()

  const metadata = useMemo(() => {
    return getScrollViewMetadata(scrollViewId)
  }, [scrollViewId, getScrollViewMetadata])

  // MARK: Effects

  // Effect: Lock scrolling
  useAnimatedReaction(
    () => ({
      isActive: isActive.value,
      isScrollLocked: isScrollLocked.value,
      lockedScrollY: lockedScrollY.value,
      scrollY: metadata.scrollY.value,
    }),
    (prepared) => {
      // If we are locked but the current scroll doesn't match the target
      // might be due to momentum)
      // force it back immediately
      if (
        prepared.isActive &&
        prepared.isScrollLocked &&
        prepared.scrollY !== prepared.lockedScrollY
      ) {
        scrollTo(scrollViewRef, 0, prepared.lockedScrollY, false)
      }
    },
  )
}
