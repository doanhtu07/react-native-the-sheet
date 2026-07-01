import type { Dispatch, ReactElement, SetStateAction } from 'react'
import type { StyleProp, ViewStyle } from 'react-native'
import type { SharedValue } from 'react-native-reanimated'

export type TransitionType = 'slide' | 'fade' | 'none'

export type ScreenRenderer = () => ReactElement | null

export type NavigationMethodType<
  ParamList extends Record<string, unknown> = Record<string, unknown>,
> = <ScreenName extends keyof ParamList>(input: {
  name: ScreenName
  params: ParamList[ScreenName]
}) => void

// MARK: Context

export type EmbeddedStackNavigationApi<
  ParamList extends Record<string, unknown> = Record<string, unknown>,
> = {
  navigate: NavigationMethodType<ParamList>
  push: NavigationMethodType<ParamList>
  pop: () => void
  replace: NavigationMethodType<ParamList>
  reset: NavigationMethodType<ParamList>
  // Special method to force push a screen before the current one + pop the current one afterwards
  pushBefore: NavigationMethodType<ParamList>
}

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
  animateDynamicHeight?: boolean

  fill?: boolean

  styles?: {
    root?: StyleProp<ViewStyle>
  }
}

// MARK: EmbeddedScreenContainer

export type EmbeddedScreenContainerProps = {
  // Props from EmbeddedStackNavigator
  screens: Record<string, ScreenRenderer>
  transitionType: TransitionType
  animateDynamicHeight: boolean
  fill: boolean

  // Routing
  stack: EmbeddedStackRoute[]

  // Navigator sizing
  navigatorWidth: number

  // Slide
  slideTranslateX: SharedValue<number>

  // Fade
  removingFadeScreenName: string | null
  onFadeComplete: () => void

  // Dynamic height
  dynamicRouteHeights: Record<string, number>
  setDynamicRouteHeights: Dispatch<SetStateAction<Record<string, number>>>
  currentDynamicRouteHeight: SharedValue<number>
}

// MARK: EmbeddedStackScreen

export type EmbeddedStackScreenProps = {
  // Props from EmbeddedStackNavigator
  screens: Record<string, ScreenRenderer>
  transitionType: TransitionType
  fill: boolean

  // Routing
  route: EmbeddedStackRoute
  idx: number
  stackLength: number

  // Navigator sizing
  navigatorWidth: number

  // Fade
  removingFadeScreenName: string | null
  onFadeComplete: () => void

  // Dynamic height
  onHeightChange: (route: EmbeddedStackRoute, height: number) => void
}
