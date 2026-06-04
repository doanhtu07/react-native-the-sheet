import React, { ReactNode, useId } from 'react'
import {
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native'
import { useAnimatedStyle } from 'react-native-reanimated'
import {
  AnimatedProp,
  Backdrop,
  BottomSheet,
  BottomSheetHandle,
  BottomSheetKeyboardExpander,
  BottomSheetPresenter,
  BottomSheetProvider,
  BottomSheetView,
  InputFocusProvider,
  SheetStackItem,
  SnapPoint,
  useBottomSheetRegistry,
} from 'react-native-the-sheet'
import { Portal } from 'react-native-universe-portal'
import AntDesign from '@react-native-vector-icons/ant-design/static'
import { HeightBudgetConditional } from './height-budget-conditional'

type Props = {
  isOpen: boolean
  close: () => void

  sheetId?: string

  // Either use snapPoints or maxHeight
  snapPoints?: AnimatedProp<SnapPoint[]>
  maxHeight?: AnimatedProp<number>
  fill?: boolean

  headerLeft?: ReactNode
  headerCenter?: ReactNode
  headerRight?: ReactNode
  showClose?: boolean
  content: ReactNode
  actions?: ReactNode
}

export const BottomSheetTemplate = ({
  isOpen,
  close,
  sheetId,
  snapPoints,
  maxHeight,
  fill,
  headerLeft,
  headerCenter,
  headerRight,
  showClose,
  content,
  actions,
}: Props) => {
  const reactId = useId()
  const { sheets } = useBottomSheetRegistry()
  const theme = useColorScheme()

  const showLeftRightHeaders = !!headerLeft || !!headerRight || !!showClose

  const resolvedSheetId = sheetId || reactId
  const sheetData = sheets[resolvedSheetId]

  const isDark = theme === 'dark'
  const borderColor = isDark ? '#3A3A3C' : '#D1D1D6'
  const textColor = isDark ? '#FFFFFF' : '#000000'

  // MARK: Preparation

  const animatedBackdropStyle = useAnimatedStyle(() => {
    const maxOpacity = 0.6
    const opacity = Math.min(
      maxOpacity,
      maxOpacity * (sheetData?.sheetVisibleRatio.value || 0),
    )

    return {
      opacity,
    }
  })

  // MARK: Renderers

  const renderCloseButton = () => {
    return (
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={close}
        style={localStyles.iconWrapper}
      >
        <AntDesign name="close" size={22} color={textColor} />
      </TouchableOpacity>
    )
  }

  const renderHeader = () => {
    return (
      <View style={localStyles.headerContainer}>
        <View style={localStyles.headerContent}>
          {showLeftRightHeaders && (
            <View style={localStyles.headerLeftSide}>{headerLeft}</View>
          )}

          <View style={localStyles.headerCenter}>{headerCenter}</View>

          {showLeftRightHeaders && (
            <View style={localStyles.headerRightSide}>
              {headerRight || (showClose && renderCloseButton())}
            </View>
          )}
        </View>

        <View style={[localStyles.divider, { backgroundColor: borderColor }]} />
      </View>
    )
  }

  const renderActions = () => {
    if (!actions) {
      return null
    }

    return (
      <View style={[localStyles.actions, { borderColor: borderColor }]}>
        {actions}
      </View>
    )
  }

  return (
    <Portal hostName="root">
      <SheetStackItem isOpen={isOpen} close={close} waitForFullyExit>
        <Backdrop styles={{ root: animatedBackdropStyle }} />

        <BottomSheetPresenter>
          <BottomSheetProvider id={resolvedSheetId} snapPoints={snapPoints}>
            <InputFocusProvider>
              <BottomSheet fill={fill}>
                <HeightBudgetConditional type="provider" maxHeight={maxHeight}>
                  <HeightBudgetConditional type="claim" maxHeight={maxHeight}>
                    <BottomSheetHandle />
                  </HeightBudgetConditional>

                  <BottomSheetView fill={fill}>
                    <HeightBudgetConditional type="claim" maxHeight={maxHeight}>
                      {renderHeader()}
                    </HeightBudgetConditional>

                    {content}

                    <HeightBudgetConditional type="claim" maxHeight={maxHeight}>
                      {renderActions()}
                    </HeightBudgetConditional>
                  </BottomSheetView>
                </HeightBudgetConditional>
              </BottomSheet>

              <BottomSheetKeyboardExpander keyboardOffset={20} />
            </InputFocusProvider>
          </BottomSheetProvider>
        </BottomSheetPresenter>
      </SheetStackItem>
    </Portal>
  )
}

// MARK: Styles

const localStyles = StyleSheet.create({
  actions: {
    borderTopWidth: 1,
    flexDirection: 'row',
    gap: 8,
    padding: 16,
    width: '100%',
  },
  divider: {
    height: 1,
    marginBottom: 8,
    marginTop: 12,
  },
  headerCenter: {
    alignItems: 'center',
    flex: 3,
    justifyContent: 'center',
  },
  headerContainer: {},
  headerContent: {
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
  },
  headerLeftSide: {
    alignItems: 'flex-start',
    flex: 1,
    paddingLeft: 12,
    paddingRight: 8,
  },
  headerRightSide: {
    alignItems: 'flex-end',
    flex: 1,
    paddingLeft: 8,
    paddingRight: 12,
  },
  iconWrapper: {
    padding: 4,
  },
})
