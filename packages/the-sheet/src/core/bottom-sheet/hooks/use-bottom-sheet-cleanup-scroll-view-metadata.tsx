import { useBottomSheet } from '../bottom-sheet-provider'
import { useEffect } from 'react'

type Props = {
  scrollViewId: string
}

export const useBottomSheetCleanupScrollViewMetadata = ({
  scrollViewId,
}: Props) => {
  const { cleanupScrollViewMetadata } = useBottomSheet()

  // MARK: Effects

  // Effect: Unmount - Cleanup metadata
  useEffect(
    () => {
      return () => {
        cleanupScrollViewMetadata(scrollViewId)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [scrollViewId],
  )
}
