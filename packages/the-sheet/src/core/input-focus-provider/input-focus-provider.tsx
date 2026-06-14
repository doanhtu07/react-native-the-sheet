import { createContext, useCallback, useContext, useMemo } from 'react'
import type { InputFocusContextType, InputFocusProviderProps } from './types'
import { useSharedValue } from 'react-native-reanimated'

const InputFocusContext = createContext<InputFocusContextType>(null!)

export const useInputFocus = () => {
  const context = useContext(InputFocusContext)

  if (!context) {
    throw new Error('useInputFocus must be used within a InputFocusProvider')
  }

  return context
}

export function InputFocusProvider({
  children,
}: Readonly<InputFocusProviderProps>) {
  const isInputFocused = useSharedValue(false)

  const onFocus = useCallback(() => {
    isInputFocused.value = true
  }, [isInputFocused])

  const onBlur = useCallback(() => {
    isInputFocused.value = false
  }, [isInputFocused])

  const contextValue = useMemo(() => {
    return { isInputFocused, onFocus, onBlur }
  }, [isInputFocused, onFocus, onBlur])

  return (
    <InputFocusContext.Provider value={contextValue}>
      {children}
    </InputFocusContext.Provider>
  )
}
