import { createContext, useContext } from 'react'
import type { EmbeddedStackNavigationApi, EmbeddedStackRoute } from './types'

export const EmbeddedStackNavigationContext =
  createContext<EmbeddedStackNavigationApi | null>(null)

export const EmbeddedStackRouteContext =
  createContext<EmbeddedStackRoute | null>(null)

export const useEmbeddedStackNavigation = <
  ParamList extends Record<string, unknown> = Record<string, unknown>,
>() => {
  const nav = useContext(
    EmbeddedStackNavigationContext,
  ) as EmbeddedStackNavigationApi<ParamList> | null

  if (!nav)
    throw new Error(
      'useEmbeddedStackNavigation must be used inside EmbeddedStackNavigator',
    )

  return nav
}

export const useEmbeddedStackRoute = <
  ParamList extends Record<string, unknown> = Record<string, unknown>,
  ScreenName extends keyof ParamList = keyof ParamList,
>() => {
  const route = useContext(EmbeddedStackRouteContext) as EmbeddedStackRoute<
    ParamList,
    ScreenName
  > | null

  if (!route)
    throw new Error(
      'useEmbeddedStackRoute must be used inside EmbeddedStackNavigator',
    )

  return route
}

export const useEmbeddedStackRouteDangerously = <
  ParamList extends Record<string, unknown> = Record<string, unknown>,
  ScreenName extends keyof ParamList = keyof ParamList,
>() => {
  const route = useContext(EmbeddedStackRouteContext) as EmbeddedStackRoute<
    ParamList,
    ScreenName
  > | null

  return route
}
