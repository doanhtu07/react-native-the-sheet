import type { PropsWithChildren } from 'react'

export const SheetStackItemPushBehavior = {
  push: 'push',
  switch: 'switch',
  replace: 'replace',
} as const

// MARK: SheetStackProvider

export type SheetStackItemData = {
  id: string
  pushBehavior: keyof typeof SheetStackItemPushBehavior
  testID?: string
}

export type SheetStackContextType = {
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

export type SheetStackProviderProps = PropsWithChildren & {
  debug?: boolean
}

// MARK: SheetStackItem

export type SheetStackItemContextType = {
  isCurrentlyInStack: boolean
  close: () => void
  onFullyExit: () => void
}

export type SheetStackItemProps = PropsWithChildren & {
  isOpen: boolean
  close: () => void

  pushBehavior?: keyof typeof SheetStackItemPushBehavior
  waitForFullyExit?: boolean

  testID?: string
}
