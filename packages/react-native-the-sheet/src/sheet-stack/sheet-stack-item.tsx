import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react'
import { StyleSheet, View } from 'react-native'
import { useSheetStack } from './sheet-stack-provider'
import {
  SheetStackItemPushBehavior,
  type SheetStackItemContextType,
  type SheetStackItemProps,
} from './types'

const SheetStackItemContext = createContext<
  SheetStackItemContextType | undefined
>(undefined)

export function SheetStackItem({
  isOpen,
  close,
  pushBehavior = SheetStackItemPushBehavior.push,
  waitForFullyExit = false,
  testID,
  children,
}: SheetStackItemProps) {
  const { stack, push, remove } = useSheetStack()
  const id = useId()

  const closeRef = useRef(close)
  closeRef.current = close

  const [allowShow, setAllowShow] = useState(false)
  const [isHidden, setIsHidden] = useState(false)

  const lastProcessedIsOpen = useRef(!isOpen)
  const isSyncingToStack = useRef(false)

  // MARK: Stack index related

  const stackIndex = useMemo(() => {
    return stack.findIndex((itemWrapper) => itemWrapper.item.id === id)
  }, [id, stack])

  const isCurrentlyInStack = stackIndex !== -1
  const isTop = stackIndex === stack.length - 1

  const nextSheetPushBehavior = isTop
    ? undefined
    : stack[stackIndex + 1]?.item.pushBehavior

  // Persist zIndex for cases where the sheet is removed from stack but still exiting
  const persistedZIndex = useRef(stack[stackIndex]?.assignedZIndex)
  if (isCurrentlyInStack) {
    persistedZIndex.current = stack[stackIndex]?.assignedZIndex
  }

  // MARK: Sheet stack item context

  const onFullyExit = useCallback(() => {
    setAllowShow(false)
  }, [])

  const contextValue = useMemo<SheetStackItemContextType>(() => {
    return { isOpen, close, isHidden, isCurrentlyInStack, onFullyExit }
  }, [isOpen, close, isHidden, isCurrentlyInStack, onFullyExit])

  // MARK: Effects

  // Effect: Clear allowShow on unmount
  useEffect(() => {
    return () => {
      setAllowShow(false)
    }
  }, [testID])

  // Effect: Reset allowShow when sheet becomes isOpen and not hidden
  useEffect(() => {
    if (isOpen && !isHidden) {
      setAllowShow(true)
    }
  }, [isHidden, isOpen])

  // Effect: Reset isSyncingToStack
  useEffect(() => {
    if (isCurrentlyInStack === isOpen) {
      isSyncingToStack.current = false
    }
  }, [isCurrentlyInStack, isOpen])

  // Effect: Sync external isOpen -> stack (Intent)
  useEffect(() => {
    // Already processed this open state, don't do it again
    if (isOpen === lastProcessedIsOpen.current) {
      return
    }

    lastProcessedIsOpen.current = isOpen
    isSyncingToStack.current = true

    if (isOpen) {
      push({ item: { id, pushBehavior, testID } })
    } else {
      remove({ item: { id, pushBehavior, testID } })
    }
  }, [id, isOpen, push, pushBehavior, remove, testID])

  // Effect: Sync stack -> external isOpen (Feedback)
  useEffect(() => {
    if (!isSyncingToStack.current && !isCurrentlyInStack && isOpen) {
      lastProcessedIsOpen.current = false
      closeRef.current()
    }
  }, [isCurrentlyInStack, isOpen])

  // Effect: Internal Visibility
  useEffect(() => {
    if (
      isCurrentlyInStack &&
      nextSheetPushBehavior === SheetStackItemPushBehavior.switch &&
      !isTop
    ) {
      setIsHidden(true)
    } else {
      setIsHidden(false)
    }
  }, [isTop, isCurrentlyInStack, nextSheetPushBehavior])

  // MARK: Renderers

  const allowRender =
    isCurrentlyInStack || // Currently in stack
    (waitForFullyExit && allowShow && !isCurrentlyInStack) // On exiting transition

  const applyHiddenStyle =
    (!waitForFullyExit && isHidden) || // If not waiting for exit, hide immediately
    (waitForFullyExit && !allowShow && isHidden) // Wait for exit before hide

  if (!allowRender) {
    return null
  }

  return (
    <SheetStackItemContext.Provider value={contextValue}>
      <View
        style={[
          styles.root,
          applyHiddenStyle && styles.hidden,
          { zIndex: persistedZIndex.current },
        ]}
        testID={testID}
      >
        {children}
      </View>
    </SheetStackItemContext.Provider>
  )
}

// MARK: Hooks

export const useSheetStackItem = () => {
  const context = useContext(SheetStackItemContext)

  if (!context) {
    throw new Error('useSheetStackItem must be used within a SheetStackItem')
  }

  return context
}

// MARK: Styles

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFill,
    pointerEvents: 'box-none',
  },
  hidden: {
    opacity: 0,
    pointerEvents: 'none',
  },
})
