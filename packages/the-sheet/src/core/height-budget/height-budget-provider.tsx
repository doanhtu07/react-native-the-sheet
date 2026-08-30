import { createContext, useContext, useMemo } from 'react'
import type {
  HeightBudgetContextType,
  HeightBudgetProviderProps,
} from './types'
import { useSharedValue } from 'react-native-reanimated'
import { useToSharedValue } from '../hooks/use-to-shared-value'

const HeightBudgetContext = createContext<HeightBudgetContextType>(null!)

export function HeightBudgetProvider({
  maxHeight: propMaxHeight,
  children,
}: HeightBudgetProviderProps) {
  const maxHeight = useToSharedValue(propMaxHeight)
  const staticHeights = useSharedValue<Record<string, number>>({})
  const activeClaimIds = useSharedValue<Record<string, boolean>>({})

  // MARK: Context

  const contextValue = useMemo<HeightBudgetContextType>(() => {
    return {
      maxHeight,
      staticHeights,
      activeClaimIds,
    }
  }, [maxHeight, staticHeights, activeClaimIds])

  // MARK: Renderers

  return (
    <HeightBudgetContext.Provider value={contextValue}>
      {children}
    </HeightBudgetContext.Provider>
  )
}

export const useHeightBudget = () => {
  const context = useContext(HeightBudgetContext)

  if (!context) {
    throw new Error(
      '@the-sheet/the-sheet - src/core/height-budget/height-budget-provider.tsx - useHeightBudget must be used within a HeightBudgetProvider',
    )
  }

  return context
}
