import { createContext, useContext, useEffect, useMemo } from 'react'
import {
  ANDROID_WINDOW_SOFT_INPUT_MODES,
  type SheetKeyboardContextType,
  type SheetKeyboardProviderProps,
} from './types'
import { Keyboard, Platform } from 'react-native'
import {
  useAnimatedReaction,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated'
import { useTrueSafeArea } from '../hooks'
import { useToSharedValue } from '../../private/hooks/use-to-shared-value'
import { isApproxEqual } from '../../private/utils/approximately-equal'

const SheetKeyboardContext = createContext<
  SheetKeyboardContextType | undefined
>(undefined)

export const useSheetKeyboard = () => {
  const context = useContext(SheetKeyboardContext)

  if (!context) {
    throw new Error(
      'useSheetKeyboard must be used within a SheetKeyboardProvider',
    )
  }

  return context
}

export const SheetKeyboardProvider = ({
  androidWindowSoftInputMode: propAndroidWindowSoftInputMode,
  children,
}: SheetKeyboardProviderProps) => {
  const { isEdgeToEdge, trueBottom: trueBottomValue } = useTrueSafeArea()

  const trueBottom = useToSharedValue(trueBottomValue)

  const keyboardVisible = useSharedValue(false)
  const keyboardFinalHeight = useSharedValue(0)

  const androidWindowSoftInputMode = useToSharedValue(
    propAndroidWindowSoftInputMode,
  )
  const isVisuallyAndroidKeyboardResizeMode = useSharedValue<boolean | null>(
    null,
  )

  const isAndroidKeyboardResizeMode = useDerivedValue(() => {
    if (Platform.OS !== 'android') {
      return false
    }

    if (isVisuallyAndroidKeyboardResizeMode.value) {
      return true
    }

    if (
      !isEdgeToEdge &&
      androidWindowSoftInputMode.value ===
        ANDROID_WINDOW_SOFT_INPUT_MODES.adjustResize
    ) {
      return true
    }

    return false
  })

  const contextValue = useMemo<SheetKeyboardContextType>(() => {
    return {
      keyboardVisible,
      keyboardFinalHeight,

      androidWindowSoftInputMode,
      isVisuallyAndroidKeyboardResizeMode,
      isAndroidKeyboardResizeMode,
    }
  }, [
    keyboardVisible,
    keyboardFinalHeight,
    androidWindowSoftInputMode,
    isVisuallyAndroidKeyboardResizeMode,
    isAndroidKeyboardResizeMode,
  ])

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
        trueBottom: trueBottom.value,
        keyboardFinalHeight: keyboardFinalHeight.value,
      }
    },
    (prepared, previous) => {
      if (isVisuallyAndroidKeyboardResizeMode.value !== null) {
        // Already determined
        return
      }

      if (Platform.OS !== 'android') {
        isVisuallyAndroidKeyboardResizeMode.value = false
        return
      }

      const previousTrueBottom = previous?.trueBottom ?? 0

      if (
        isApproxEqual(
          previousTrueBottom + prepared.keyboardFinalHeight,
          prepared.trueBottom,
        )
      ) {
        isVisuallyAndroidKeyboardResizeMode.value = true
      } else {
        isVisuallyAndroidKeyboardResizeMode.value = false
      }
    },
  )

  // MARK: Renderers

  return (
    <SheetKeyboardContext.Provider value={contextValue}>
      {children}
    </SheetKeyboardContext.Provider>
  )
}
