import {
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
} from 'react'
import { StyleSheet, type LayoutChangeEvent } from 'react-native'
import type {
  BottomSheetPresenterApi,
  BottomSheetPresenterContextType,
  BottomSheetPresenterProps,
} from './types'
import { useSheetStackItem } from '../sheet-stack'
import Animated, {
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated'
import { useSyncedRef } from '../hooks/use-synced-ref'
import { SPRING_CONFIG } from '../constants'
import { useTrueSafeArea } from '../hooks'
import { useBottomSheetPresenterRegistryDangerously } from './bottom-sheet-presenter-registry-provider'

const BottomSheetPresenterContext = createContext<
  BottomSheetPresenterContextType | undefined
>(undefined)

export const useBottomSheetPresenter = () => {
  const context = useContext(BottomSheetPresenterContext)

  if (!context) {
    throw new Error(
      '@the-sheet/the-sheet - src/core/bottom-sheet-presenter/bottom-sheet-presenter.tsx - useBottomSheetPresenter must be used within a BottomSheetPresenter',
    )
  }

  return context
}

export const BottomSheetPresenter = forwardRef<
  BottomSheetPresenterApi,
  BottomSheetPresenterProps
>(function BottomSheetPresenterCore(
  { id, styles: propStyles, testID, children },
  ref,
) {
  const autoGenBottomSheetPresenterId = useId()
  const { safeAreaHeight } = useTrueSafeArea()

  const bottomSheetPresenterRegistry =
    useBottomSheetPresenterRegistryDangerously()
  const registerPresenter = bottomSheetPresenterRegistry?.registerPresenter
  const unregisterPresenter = bottomSheetPresenterRegistry?.unregisterPresenter

  const { isHidden, isCurrentlyInStack, onFullyExit } = useSheetStackItem()
  const allowPresent = isCurrentlyInStack && !isHidden

  const onFullyExitRef = useSyncedRef(onFullyExit)

  const presenterHeight = useSharedValue(0)
  const presenterVisibleHeight = useSharedValue(0)
  const presenterVisibleRatio = useSharedValue(0)

  /**
   * translateY = tracks the offset of the bottom sheet presenter from the bottom of the screen
   * - = 0: Bottom sheet presenter is fully visible
   * - > 0: Bottom sheet presenter is going below the bottom of the screen
   */
  const translateY = useSharedValue(safeAreaHeight)

  const onLayout = (event: LayoutChangeEvent) => {
    'worklet'
    presenterHeight.value = event.nativeEvent.layout.height
  }

  // MARK: Bottom sheet presenter context

  const contextValue = useRef<BottomSheetPresenterContextType>({
    presenterHeight,
    presenterVisibleHeight,
    presenterVisibleRatio,

    translateY,
  })

  // MARK: Effects

  // Effect: Expose API
  useImperativeHandle(ref, () => ({
    reshow: () => {
      if (allowPresent) {
        translateY.value = safeAreaHeight // start from hidden (below the screen)
        translateY.value = withSpring(0, SPRING_CONFIG) // finish at fully visible (0)
      }
    },
  }))

  // Effect: Register presenter in registry
  useEffect(() => {
    if (!registerPresenter || !unregisterPresenter) {
      return
    }

    const bottomSheetProviderId = id || autoGenBottomSheetPresenterId

    registerPresenter(bottomSheetProviderId, contextValue.current)

    return () => {
      unregisterPresenter(bottomSheetProviderId)
    }
  }, [
    autoGenBottomSheetPresenterId,
    id,
    registerPresenter,
    unregisterPresenter,
  ])

  // Effect: Animate translateY on allowPresent change
  useEffect(() => {
    if (allowPresent) {
      translateY.value = safeAreaHeight
    }

    // Snapshot refs for worklet
    const onFullyExitRefCurrent = onFullyExitRef.current

    translateY.value = withSpring(
      allowPresent ? 0 : safeAreaHeight,
      SPRING_CONFIG,
      (finished) => {
        'worklet'
        if (finished && !allowPresent) {
          runOnJS(onFullyExitRefCurrent)()
        }
      },
    )
  }, [allowPresent, onFullyExitRef, safeAreaHeight, translateY])

  // Effect: Track presenter visible height and ratio
  useAnimatedReaction(
    () => {
      return {
        translateY: translateY.value,
        presenterHeight: presenterHeight.value,
      }
    },
    (prepared) => {
      const total = prepared.presenterHeight

      if (total === 0) {
        return
      }

      presenterVisibleHeight.value = total - prepared.translateY
      presenterVisibleRatio.value = presenterVisibleHeight.value / total
    },
  )

  // MARK: Preparation

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    }
  })

  // MARK: Renderers

  return (
    <BottomSheetPresenterContext.Provider value={contextValue.current}>
      <Animated.View
        style={[
          styles.root,
          propStyles?.root,
          { height: safeAreaHeight },
          animatedStyle,
        ]}
        onLayout={onLayout}
        testID={testID}
      >
        {children}
      </Animated.View>
    </BottomSheetPresenterContext.Provider>
  )
})

// MARK: Styles

const styles = StyleSheet.create({
  root: {
    justifyContent: 'flex-end',
    pointerEvents: 'box-none',
    width: '100%',
  },
})
