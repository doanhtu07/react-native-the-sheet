import { createContext, useContext, useEffect, useMemo } from 'react'
import type {
  SheetKeyboardProviderContextType,
  SheetKeyboardProviderProps,
} from './types'
import { Keyboard, Platform } from 'react-native'
import { useAnimatedReaction, useSharedValue } from 'react-native-reanimated'
import { useTrueSafeArea } from '../hooks'
import { useBridgedValue } from '../../private/hooks/use-bridged-value'
import { isApproxEqual } from '../../private/utils/approximately-equal'

const SheetKeyboardProviderContext = createContext<
  SheetKeyboardProviderContextType | undefined
>(undefined)

export const SheetKeyboardProvider = ({
  children,
}: SheetKeyboardProviderProps) => {
  const { trueBottom } = useTrueSafeArea()

  const trueBottomBridge = useBridgedValue(trueBottom)

  const keyboardVisible = useSharedValue(false)
  const keyboardFinalHeight = useSharedValue(0)

  const isAndroidKeyboardResizeMode = useSharedValue<boolean | null>(null)

  const contextValue = useMemo<SheetKeyboardProviderContextType>(() => {
    return {
      keyboardVisible,
      keyboardFinalHeight,

      isAndroidKeyboardResizeMode,
    }
  }, [keyboardVisible, keyboardFinalHeight, isAndroidKeyboardResizeMode])

  // MARK: Effects

  // Effect: Listen to keyboard events
  useEffect(() => {
    if (Platform.OS === 'android') {
      const keyboardDidShowListener = Keyboard.addListener(
        'keyboardDidShow',
        (e) => {
          keyboardVisible.value = true
          keyboardFinalHeight.value = e.endCoordinates.height
        },
      )

      const keyboardDidHideListener = Keyboard.addListener(
        'keyboardDidHide',
        () => {
          keyboardVisible.value = false
          keyboardFinalHeight.value = 0
        },
      )

      return () => {
        keyboardDidShowListener.remove()
        keyboardDidHideListener.remove()
      }
    }

    // keyboardWillShow, keyboardWillHide, keyboardWillChangeFrame
    // are generally not available on Android since there is no native corresponding event
    if (Platform.OS === 'ios') {
      const keyboardWillShowListener = Keyboard.addListener(
        'keyboardWillShow',
        (e) => {
          keyboardVisible.value = true
          keyboardFinalHeight.value = e.endCoordinates.height
        },
      )

      const keyboardWillHideListener = Keyboard.addListener(
        'keyboardWillHide',
        () => {
          keyboardVisible.value = false
          keyboardFinalHeight.value = 0
        },
      )

      const keyboardWillChangeFrameListener = Keyboard.addListener(
        'keyboardWillChangeFrame',
        (e) => {
          keyboardFinalHeight.value = e.endCoordinates.height
        },
      )

      return () => {
        keyboardWillShowListener.remove()
        keyboardWillHideListener.remove()
        keyboardWillChangeFrameListener.remove()
      }
    }

    return () => {}
  }, [keyboardFinalHeight, keyboardVisible])

  // Effect: Detect Android adjustResize keyboard behavior
  useAnimatedReaction(
    () => {
      return {
        trueBottom: trueBottomBridge.value,
        keyboardFinalHeight: keyboardFinalHeight.value,
      }
    },
    (prepared, previous) => {
      if (isAndroidKeyboardResizeMode.value !== null) {
        // Already determined
        return
      }

      if (Platform.OS !== 'android') {
        isAndroidKeyboardResizeMode.value = false
        return
      }

      const previousTrueBottom = previous?.trueBottom ?? 0

      if (
        isApproxEqual(
          previousTrueBottom + prepared.keyboardFinalHeight,
          prepared.trueBottom,
        )
      ) {
        isAndroidKeyboardResizeMode.value = true
      } else {
        isAndroidKeyboardResizeMode.value = false
      }
    },
  )

  // MARK: Renderers

  return (
    <SheetKeyboardProviderContext.Provider value={contextValue}>
      {children}
    </SheetKeyboardProviderContext.Provider>
  )
}

export const useSheetKeyboardProvider = () => {
  const context = useContext(SheetKeyboardProviderContext)

  if (!context) {
    throw new Error(
      'useSheetKeyboardProvider must be used within a SheetKeyboardProvider',
    )
  }

  return context
}
