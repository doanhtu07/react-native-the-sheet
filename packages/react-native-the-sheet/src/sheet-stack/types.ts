import type { PropsWithChildren } from 'react'

export const SheetStackItemPushBehavior = {
  push: 'push',
  switch: 'switch',
  replace: 'replace',
} as const

export type SheetStackProviderProps = PropsWithChildren & {
  debug?: boolean
}

export type SheetStackItemProps = PropsWithChildren & {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void

  pushBehavior?: keyof typeof SheetStackItemPushBehavior

  testID?: string
}
