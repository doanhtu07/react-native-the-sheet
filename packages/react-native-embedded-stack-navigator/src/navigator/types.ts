import type { ReactElement } from 'react'

export type TransitionType = 'slide' | 'fade'

export type ScreenRenderer = () => ReactElement | null

// MARK: Context

export type EmbeddedStackRoute<
  ParamList extends Record<string, unknown> = Record<string, unknown>,
  ScreenName extends keyof ParamList = keyof ParamList,
> = {
  key: string
  name: ScreenName
  params: ParamList[ScreenName]
  isFocused: boolean
  canGoBack: boolean
}

export type EmbeddedStackNavigationApi<
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

// MARK: EmbeddedStackNavigator

export type EmbeddedStackNavigatorProps<
  Screens extends Record<string, ScreenRenderer>,
  ParamList extends Record<keyof Screens, unknown>,
  InitialRouteName extends keyof Screens = keyof Screens,
> = {
  initialRouteName: InitialRouteName
  initialParams: ParamList[InitialRouteName]
  screens: Screens
  transitionType?: TransitionType
}

// MARK: EmbeddedStackScreen

export type EmbeddedStackScreenProps = {
  screens: Record<string, ScreenRenderer>
  transitionType: TransitionType

  route: EmbeddedStackRoute
  idx: number
  stackLength: number
  rootWidth: number
  removingScreenName: string | null
}
