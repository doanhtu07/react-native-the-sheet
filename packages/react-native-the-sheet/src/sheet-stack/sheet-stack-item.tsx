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

  const [allowMount, setAllowMount] = useState(false)
  const [isHidden, setIsHidden] = useState(false)

  const lastProcessedIsOpen = useRef(!isOpen)
  const isSyncingToStack = useRef(false)

  // MARK: Stack index

  const stackIndex = useMemo(() => {
    return stack.findIndex((item) => item.id === id)
  }, [id, stack])

  const isCurrentlyInStack = stackIndex !== -1
  const isTop = stackIndex === stack.length - 1

  const nextSheetPushBehavior = isTop
    ? undefined
    : stack[stackIndex + 1]?.pushBehavior

  const zIndex = isCurrentlyInStack ? stackIndex + 1 : undefined

  // MARK: Sheet stack item context

  const onFullyExit = useCallback(() => {
    setAllowMount(false)
  }, [])

  const contextValue = useMemo<SheetStackItemContextType>(() => {
    return { isCurrentlyInStack, close, onFullyExit }
  }, [isCurrentlyInStack, close, onFullyExit])

  // MARK: Effects

  // Effect: Clear allowMount on unmount
  useEffect(() => {
    return () => {
      setAllowMount(false)
    }
  }, [])

  // Effect: Allow mounting when isOpen becomes true
  useEffect(() => {
    if (isOpen) {
      setAllowMount(true)
    }
  }, [isOpen])

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
    (waitForFullyExit && !isOpen && allowMount) // On exiting transition

  if (!allowRender) {
    return null
  }

  return (
    <SheetStackItemContext.Provider value={contextValue}>
      <View
        style={[styles.root, isHidden && styles.hidden, { zIndex }]}
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
