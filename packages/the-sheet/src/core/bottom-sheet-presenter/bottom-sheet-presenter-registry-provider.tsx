import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import type {
  BottomSheetPresenterContextType,
  BottomSheetPresenterRegistryContextType,
  BottomSheetPresenterRegistryProviderProps,
} from './types'

const BottomSheetPresenterRegistryContext =
  createContext<BottomSheetPresenterRegistryContextType>(null!)

export const useBottomSheetPresenterRegistry = () => {
  const context = useContext(BottomSheetPresenterRegistryContext)

  if (!context) {
    throw new Error(
      '@the-sheet/the-sheet - src/core/bottom-sheet-presenter/bottom-sheet-presenter-registry-provider.tsx - useBottomSheetPresenterRegistry must be used within a BottomSheetPresenterRegistryProvider',
    )
  }

  return context
}

export const useBottomSheetPresenterRegistryDangerously = () => {
  const context = useContext(BottomSheetPresenterRegistryContext)
  return context
}

export function BottomSheetPresenterRegistryProvider({
  children,
}: Readonly<BottomSheetPresenterRegistryProviderProps>) {
  const [presenters, setPresenters] = useState(
    {} as Record<string, BottomSheetPresenterContextType>,
  )

  const registerPresenter = useCallback(
    (id: string, ctx: BottomSheetPresenterContextType) => {
      setPresenters((prev) => {
        if (prev[id] !== ctx) {
          return { ...prev, [id]: ctx }
        }
        return prev
      })
    },
    [],
  )

  const unregisterPresenter = useCallback((id: string) => {
    setPresenters((prev) => {
      if (prev[id]) {
        const newPresenters = { ...prev }
        delete newPresenters[id]
        return newPresenters
      }
      return prev
    })
  }, [])

  const value = useMemo<BottomSheetPresenterRegistryContextType>(
    () => ({
      presenters,
      registerPresenter,
      unregisterPresenter,
    }),
    [registerPresenter, presenters, unregisterPresenter],
  )

  return (
    <BottomSheetPresenterRegistryContext.Provider value={value}>
      {children}
    </BottomSheetPresenterRegistryContext.Provider>
  )
}
