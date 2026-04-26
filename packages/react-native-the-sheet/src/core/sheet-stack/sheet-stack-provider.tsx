import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FC,
} from 'react'
import {
  SheetStackItemPushBehavior,
  type SheetStackContextType,
  type SheetStackItemDataWrapper,
  type SheetStackProviderProps,
} from './types'

const COMPRESS_STACK_TIMEOUT = 5 * 1000

// MARK: Provider

const SheetStackContext = createContext<SheetStackContextType | undefined>(
  undefined,
)

export const useSheetStack = () => {
  const context = useContext(SheetStackContext)

  if (!context) {
    throw new Error('useSheetStack must be used within a SheetStackProvider')
  }

  return context
}

export const SheetStackProvider: FC<SheetStackProviderProps> = ({
  debug,
  children,
}) => {
  const [stack, setStack] = useState<SheetStackItemDataWrapper[]>([])
  const zIndexCounter = useRef(0)

  const compressStackTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const compressStack = useCallback(() => {
    setStack((prevStack) => {
      // Reassign zIndex to current stack items to prevent zIndex overflow in long sessions

      const newStack = prevStack.map((itemWrapper, index) => ({
        ...itemWrapper,
        assignedZIndex: index + 1,
      }))

      zIndexCounter.current = newStack.length + 1

      return newStack
    })
  }, [])

  const push = useCallback<SheetStackContextType['push']>(
    ({ item }) => {
      if (compressStackTimer.current) {
        clearTimeout(compressStackTimer.current)
      }

      compressStackTimer.current = setTimeout(() => {
        compressStack()
      }, COMPRESS_STACK_TIMEOUT)

      setStack((prevStack) => {
        const top = prevStack.length === 0 ? undefined : prevStack.at(-1)!

        // Cannot push same ref on top again
        if (top?.item.id === item.id) {
          return prevStack
        }

        zIndexCounter.current++

        if (item.pushBehavior === SheetStackItemPushBehavior.replace) {
          return [
            ...prevStack.slice(0, -1),
            { item, assignedZIndex: zIndexCounter.current },
          ]
        } else {
          return [...prevStack, { item, assignedZIndex: zIndexCounter.current }]
        }
      })
    },
    [compressStack],
  )

  const pop = useCallback<SheetStackContextType['pop']>(
    ({ item }) => {
      if (compressStackTimer.current) {
        clearTimeout(compressStackTimer.current)
      }

      compressStackTimer.current = setTimeout(() => {
        compressStack()
      }, COMPRESS_STACK_TIMEOUT)

      setStack((prevStack) => {
        const top = prevStack.length === 0 ? undefined : prevStack.at(-1)!

        // Cannot pop a different ref out
        if (prevStack.length === 0 || top?.item.id !== item.id) {
          return prevStack
        }

        return prevStack.slice(0, -1)
      })
    },
    [compressStack],
  )

  const remove = useCallback<SheetStackContextType['remove']>(
    ({ item }) => {
      if (compressStackTimer.current) {
        clearTimeout(compressStackTimer.current)
      }

      compressStackTimer.current = setTimeout(() => {
        compressStack()
      }, COMPRESS_STACK_TIMEOUT)

      setStack((prevStack) => {
        const index = prevStack.findIndex((cur) => cur.item.id === item.id)

        // Cannot find the ref to remove
        if (prevStack.length === 0 || index === -1) {
          return prevStack
        }

        // Prune ref from stack
        const newStack = prevStack.filter((cur) => cur.item.id !== item.id)

        return newStack
      })
    },
    [compressStack],
  )

  const contextValue: SheetStackContextType = useMemo(() => {
    return {
      stack,
      push,
      pop,
      remove,
    }
  }, [pop, push, remove, stack])

  // MARK: Effects

  // Effect: Clear timers
  useEffect(() => {
    return () => {
      if (compressStackTimer.current) {
        clearTimeout(compressStackTimer.current)
      }
    }
  }, [])

  // Effect: Debug log
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
