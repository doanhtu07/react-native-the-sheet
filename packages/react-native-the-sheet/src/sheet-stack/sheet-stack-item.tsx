import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { useSheetStack } from './sheet-stack-provider'
import { SheetStackItemPushBehavior, type SheetStackItemProps } from './types'

export function SheetStackItem({
  isOpen,
  setIsOpen,
  pushBehavior = SheetStackItemPushBehavior.push,
  testID,
  children,
}: SheetStackItemProps) {
  const { stack, push, remove } = useSheetStack()
  const id = useId()

  const [isHidden, setIsHidden] = useState(false)

  const lastProcessedIsOpen = useRef(!isOpen)
  const isSyncingToStack = useRef(false)

  const stackIndex = useMemo(() => {
    return stack.findIndex((item) => item.id === id)
  }, [id, stack])

  const isCurrentlyInStack = stackIndex !== -1
  const isTop = stackIndex === stack.length - 1

  const nextSheetPushBehavior = isTop
    ? undefined
    : stack[stackIndex + 1]?.pushBehavior

  const zIndex = isCurrentlyInStack ? stackIndex + 1 : undefined

  // MARK: Effects

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
      setIsOpen(false)
    }
  }, [isCurrentlyInStack, isOpen, setIsOpen])

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

  if (!isCurrentlyInStack) {
    return null
  }

  return (
    <View style={[styles.root, isHidden && styles.hidden, { zIndex }]}>
      {children}
    </View>
  )
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
