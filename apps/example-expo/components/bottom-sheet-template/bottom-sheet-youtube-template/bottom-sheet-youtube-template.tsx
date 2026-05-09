import React, { ReactNode } from 'react'
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
  BottomSheetFooter,
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
import AntDesign from '@expo/vector-icons/AntDesign'
import { useBottomSheetYoutubePanGesture } from '@/components/bottom-sheet-template/bottom-sheet-youtube-template/hooks/use-bottom-sheet-youtube-pan-gesture'

type Props = {
  isOpen: boolean
  close: () => void

  sheetId: string
  snapPoints: AnimatedProp<SnapPoint[]>

  headerLeft?: ReactNode
  headerRight?: ReactNode
  showClose?: boolean
  content: ReactNode
  footer?: ReactNode
}

export const BottomSheetYouTubeTemplate = ({
  isOpen,
  close,
  sheetId,
  snapPoints,
  headerLeft,
  headerRight,
  showClose,
  content,
  footer,
}: Props) => {
  const { sheets } = useBottomSheetRegistry()
  const theme = useColorScheme()

  const sheetData = sheets[sheetId]

  const isDark = theme === 'dark'
  const borderColor = isDark ? '#3A3A3C' : '#D1D1D6'
  const textColor = isDark ? '#FFFFFF' : '#000000'

  const getYoutubeCommentPanGesture = useBottomSheetYoutubePanGesture({
    close,
    sheetId,
  })

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
          {headerLeft && (
            <View style={localStyles.headerLeftSide}>{headerLeft}</View>
          )}

          {(headerRight || showClose) && (
            <View style={localStyles.headerRightSide}>
              {headerRight || (showClose && renderCloseButton())}
            </View>
          )}
        </View>

        <View style={[localStyles.divider, { backgroundColor: borderColor }]} />
      </View>
    )
  }

  return (
    <Portal hostName="root">
      <SheetStackItem isOpen={isOpen} close={close} waitForFullyExit>
        <Backdrop styles={{ root: animatedBackdropStyle }} />

        <BottomSheetPresenter>
          <BottomSheetProvider
            id={sheetId}
            snapPoints={snapPoints}
            enableOverdrag
          >
            <InputFocusProvider>
              <BottomSheet fill={true}>
                <BottomSheetHandle
                  getPanGesture={getYoutubeCommentPanGesture}
                />

                <BottomSheetView
                  fill={true}
                  getPanGesture={getYoutubeCommentPanGesture}
                >
                  {renderHeader()}
                  {content}
                  {footer && <BottomSheetFooter>{footer}</BottomSheetFooter>}
                </BottomSheetView>
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
  divider: {
    height: 1,
    marginBottom: 8,
    marginTop: 12,
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
