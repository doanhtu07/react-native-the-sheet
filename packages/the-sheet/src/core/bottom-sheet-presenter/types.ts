import type { PropsWithChildren } from 'react'
import type { StyleProp, ViewStyle } from 'react-native'
import type { SharedValue } from 'react-native-reanimated'

// MARK: Bottom sheet presenter registry provider

export type BottomSheetPresenterRegistryContextType = {
  presenters: Record<string, BottomSheetPresenterContextType>
  registerPresenter: (id: string, ctx: BottomSheetPresenterContextType) => void
  unregisterPresenter: (id: string) => void
}

export type BottomSheetPresenterRegistryProviderProps = PropsWithChildren

// MARK: Bottom sheet presenter

export type BottomSheetPresenterContextType = {
  presenterHeight: SharedValue<number>
  presenterVisibleHeight: SharedValue<number>
  presenterVisibleRatio: SharedValue<number>

  translateY: SharedValue<number>
}

export type BottomSheetPresenterProps = PropsWithChildren & {
  id?: string

  styles?: {
    root?: StyleProp<ViewStyle>
  }

  testID?: string
}

export type BottomSheetPresenterApi = {
  reshow: () => void
}
