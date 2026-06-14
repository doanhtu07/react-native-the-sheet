import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import type {
  BottomSheetContextType,
  BottomSheetRegistryContextType,
  BottomSheetRegistryProviderProps,
} from './types'

const BottomSheetRegistryContext =
  createContext<BottomSheetRegistryContextType>(null!)

export const useBottomSheetRegistry = () => {
  const context = useContext(BottomSheetRegistryContext)

  if (!context) {
    throw new Error(
      'useBottomSheetRegistry must be used within a BottomSheetRegistryProvider',
    )
  }

  return context
}

export function BottomSheetRegistryProvider({
  children,
}: Readonly<BottomSheetRegistryProviderProps>) {
  const [sheets, setSheets] = useState(
    {} as Record<string, BottomSheetContextType>,
  )

  const registerSheet = useCallback(
    (id: string, ctx: BottomSheetContextType) => {
      setSheets((prev) => {
        if (prev[id] !== ctx) {
          return { ...prev, [id]: ctx }
        }
        return prev
      })
    },
    [],
  )

  const unregisterSheet = useCallback((id: string) => {
    setSheets((prev) => {
      if (prev[id]) {
        const newSheets = { ...prev }
        delete newSheets[id]
        return newSheets
      }
      return prev
    })
  }, [])

  const value = useMemo<BottomSheetRegistryContextType>(
    () => ({
      sheets,
      registerSheet,
      unregisterSheet,
    }),
    [registerSheet, sheets, unregisterSheet],
  )

  return (
    <BottomSheetRegistryContext.Provider value={value}>
      {children}
    </BottomSheetRegistryContext.Provider>
  )
}
