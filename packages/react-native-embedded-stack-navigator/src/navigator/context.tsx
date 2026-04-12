import { createContext, useContext } from 'react'

export type MiniStackRoute<
  ParamList extends Record<string, unknown> = Record<string, unknown>,
  ScreenName extends keyof ParamList = keyof ParamList,
> = {
  key: string
  name: ScreenName
  params: ParamList[ScreenName]
  isFocused: boolean
  canGoBack: boolean
}

export type MiniStackNavigationApi<
  ParamList extends Record<string, unknown> = Record<string, unknown>,
> = {
  navigate: <ScreenName extends keyof ParamList>(input: {
    name: ScreenName
    params: ParamList[ScreenName]
  }) => void

  push: <ScreenName extends keyof ParamList>(input: {
    name: ScreenName
    params: ParamList[ScreenName]
  }) => void

  pop: () => void

  replace: <ScreenName extends keyof ParamList>(input: {
    name: ScreenName
    params: ParamList[ScreenName]
  }) => void

  reset: <ScreenName extends keyof ParamList>(input: {
    name: ScreenName
    params: ParamList[ScreenName]
  }) => void

  // Special method to force push a screen before the current one + pop the current one afterwards
  pushBefore: <ScreenName extends keyof ParamList>(input: {
    name: ScreenName
    params: ParamList[ScreenName]
  }) => void
}

export const MiniStackNavigationContext =
  createContext<MiniStackNavigationApi | null>(null)

export const MiniStackRouteContext = createContext<MiniStackRoute | null>(null)

export const useMiniStackNavigation = <
  ParamList extends Record<string, unknown> = Record<string, unknown>,
>() => {
  const nav = useContext(
    MiniStackNavigationContext,
  ) as MiniStackNavigationApi<ParamList> | null

  if (!nav)
    throw new Error(
      'useMiniStackNavigation must be used inside MiniStackNavigator',
    )

  return nav
}

export const useMiniStackRoute = <
  ParamList extends Record<string, unknown> = Record<string, unknown>,
  ScreenName extends keyof ParamList = keyof ParamList,
>() => {
  const route = useContext(MiniStackRouteContext) as MiniStackRoute<
    ParamList,
    ScreenName
  > | null

  if (!route)
    throw new Error('useMiniStackRoute must be used inside MiniStackNavigator')

  return route
}

export const useMiniStackRouteDangerously = <
  ParamList extends Record<string, unknown> = Record<string, unknown>,
  ScreenName extends keyof ParamList = keyof ParamList,
>() => {
  const route = useContext(MiniStackRouteContext) as MiniStackRoute<
    ParamList,
    ScreenName
  > | null

  return route
}
