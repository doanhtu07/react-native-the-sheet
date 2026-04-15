import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type FC,
} from 'react'
import {
  SheetStackItemPushBehavior,
  type SheetStackProviderProps,
} from './types'

// MARK: Types

type SheetStackItemData = {
  id: string
  pushBehavior: keyof typeof SheetStackItemPushBehavior
  testID?: string
}

type SheetStackContextType = {
  stack: SheetStackItemData[]

  push: (
    input: { item: SheetStackItemData }, // Reference of new sheet
  ) => void

  pop: (
    input: { item: SheetStackItemData }, // Reference to confirm the correct sheet is being popped
  ) => void

  remove: (
    input: { item: SheetStackItemData }, // Reference of sheet to remove
  ) => void
}

// MARK: Context

const SheetStackContext = createContext<SheetStackContextType | undefined>(
  undefined,
)

// MARK: Provider

export const SheetStackProvider: FC<SheetStackProviderProps> = ({
  debug,
  children,
}) => {
  const [stack, setStack] = useState<SheetStackItemData[]>([])

  const push = useCallback<SheetStackContextType['push']>(({ item }) => {
    setStack((prevStack) => {
      const top = prevStack.length === 0 ? undefined : prevStack.at(-1)

      // Cannot push same ref on top again
      if (top?.id === item.id) {
        return prevStack
      }

      if (item.pushBehavior === SheetStackItemPushBehavior.replace) {
        return [...prevStack.slice(0, -1), item]
      } else {
        return [...prevStack, item]
      }
    })
  }, [])

  const pop = useCallback<SheetStackContextType['pop']>(({ item }) => {
    setStack((prevStack) => {
      const top = prevStack.length === 0 ? undefined : prevStack.at(-1)

      // Cannot pop a different ref out
      if (prevStack.length === 0 || top?.id !== item.id) {
        return prevStack
      }

      return prevStack.slice(0, -1)
    })
  }, [])

  const remove = useCallback<SheetStackContextType['remove']>(({ item }) => {
    setStack((prevStack) => {
      const index = prevStack.findIndex((cur) => cur.id === item.id)

      // Cannot find the ref to remove
      if (prevStack.length === 0 || index === -1) {
        return prevStack
      }

      // Prune ref from stack
      const newStack = prevStack.filter((cur) => cur.id !== item.id)

      return newStack
    })
  }, [])

  const contextValue: SheetStackContextType = useMemo(() => {
    return {
      stack,
      push,
      pop,
      remove,
    }
  }, [pop, push, remove, stack])

  // MARK: Effects

  useEffect(() => {
    if (debug) {
      console.debug(
        'react-native-the-sheet - src/sheet-stack/sheet-stack-provider.tsx - stack:',
        { stack },
      )
    }
  }, [debug, stack])

  // MARK: Renderers

  return (
    <SheetStackContext.Provider value={contextValue}>
      {children}
    </SheetStackContext.Provider>
  )
}

// MARK: Hook

export const useSheetStack = () => {
  const context = useContext(SheetStackContext)

  if (!context) {
    throw new Error('useSheetStack must be used within a SheetStackProvider')
  }

  return context
}
