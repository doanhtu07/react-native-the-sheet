import { ManagedTextInput } from '../example-bottom-sheet-with-keyboard/managed-text-input'
import { Portal } from '@the-sheet/universe-portal'
import {
  Backdrop,
  BottomSheet,
  BottomSheetKeyboardExpander,
  BottomSheetPresenter,
  BottomSheetProvider,
  InputFocusProvider,
  SheetStackItem,
  useBottomSheetRegistryDangerously,
} from '@the-sheet/the-sheet'
import { useColorScheme, View, StyleSheet, Keyboard } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useAnimatedStyle, useDerivedValue } from 'react-native-reanimated'

type Props = {
  isOpen: boolean
  sheetId: string
  reportHeight: (height: number) => void
}

export const AddCommentBottomSheet = ({
  isOpen,
  sheetId,
  reportHeight,
}: Props) => {
  const { bottom } = useSafeAreaInsets()
  const theme = useColorScheme()

  const bottomSheetRegistry = useBottomSheetRegistryDangerously()
  const sheets = bottomSheetRegistry?.sheets

  const addCommentSheet = sheets?.[sheetId]
  const { keyboardExpanderHeightRatio } = addCommentSheet || {}

  const isDark = theme === 'dark'
  const backgroundColor = isDark ? '#1C1C1E' : '#FFFFFF'
  const borderColor = isDark ? '#3A3A3C' : '#D1D1D6'

  const backdropDisabled = useDerivedValue(() => {
    return keyboardExpanderHeightRatio?.value !== 1
  })

  // MARK: Preparation

  const animatedBackdropStyle = useAnimatedStyle(() => {
    const maxOpacity = 0.6

    const opacity = Math.max(
      0,
      maxOpacity * (keyboardExpanderHeightRatio?.value || 0),
    )

    return {
      opacity,
    }
  })

  // MARK: Renderers

  return (
    <Portal hostName="root">
      <SheetStackItem
        isOpen={isOpen}
        close={() => {
          Keyboard.dismiss()
        }}
        waitForFullyExit
      >
        <Backdrop
          styles={{ root: animatedBackdropStyle }}
          disabled={backdropDisabled}
        />

        <BottomSheetPresenter>
          <BottomSheetProvider id={sheetId}>
            <InputFocusProvider>
              <BottomSheet>
                <View
                  style={[
                    styles.main,
                    {
                      paddingBottom: bottom + 12,
                      backgroundColor,
                      borderColor,
                    },
                  ]}
                  onLayout={(e) => reportHeight(e.nativeEvent.layout.height)}
                >
                  <ManagedTextInput placeholder="Add a comment..." />
                </View>
              </BottomSheet>

              <BottomSheetKeyboardExpander keyboardOffset={12} />
            </InputFocusProvider>
          </BottomSheetProvider>
        </BottomSheetPresenter>
      </SheetStackItem>
    </Portal>
  )
}

// MARK: Styles

const styles = StyleSheet.create({
  main: {
    borderTopWidth: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
})
