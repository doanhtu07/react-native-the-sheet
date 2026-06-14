import type {
  Dispatch,
  PropsWithChildren,
  ReactNode,
  SetStateAction,
} from 'react'

export type PortalProviderProps = PropsWithChildren

export type PortalHostProps = {
  name: string
  debug?: boolean
}

export type PortalProps = PropsWithChildren & {
  name?: string
  hostName: string
}

export type PortalHostMap = Record<string, Dispatch<SetStateAction<PortalMap>>>

export type PortalMap = Record<string, ReactNode>
