import { ThemedText } from '@/components/text'
import { Fragment, useState } from 'react'
import { Button, StyleSheet, View } from 'react-native'
import {
  Backdrop,
  BottomSheet,
  BottomSheetHandle,
  BottomSheetPresenter,
  BottomSheetProvider,
  BottomSheetScrollView,
  BottomSheetView,
  HeightBudgetProvider,
  HeightClaim,
  HeightFill,
  SheetStackItem,
} from 'react-native-the-sheet'
import { Portal } from 'react-native-universe-portal'

export default function ExampleHeightBudgetScrollView() {
  const [isOpenA, setIsOpenA] = useState(false)

  // When using dynamic sizing, it's important to set a max height
  // to prevent content taking up the entire screen
  const maxHeight = 600

  // MARK: Renderers

  const renderContent = () => {
    return (
      <Fragment>
        {Array.from({ length: 100 }).map((_, index) => (
          <ThemedText key={index}>Item {index + 1}</ThemedText>
        ))}
      </Fragment>
    )
  }

  return (
    <View style={styles.root}>
      <ThemedText style={styles.header}>
        Example Height Budget Scroll View
      </ThemedText>

      <Button
        title="Open Sheet A (Dynamic sizing)"
        onPress={() => setIsOpenA(true)}
      />

      <Portal hostName="root">
        <SheetStackItem
          isOpen={isOpenA}
          close={() => setIsOpenA(false)}
          waitForFullyExit
          testID="sheetA"
        >
          <Backdrop />

          <BottomSheetPresenter>
            <BottomSheetProvider>
              <BottomSheet styles={{ root: { maxHeight } }}>
                <HeightBudgetProvider maxHeight={maxHeight}>
                  <HeightClaim>
                    <BottomSheetHandle />
                  </HeightClaim>

                  <View>
                    <HeightClaim>
                      <BottomSheetView>
                        <ThemedText>Sheet A</ThemedText>

                        <Button
                          title="Close Sheet A"
                          onPress={() => setIsOpenA(false)}
                        />
                      </BottomSheetView>
                    </HeightClaim>

                    <View>
                      <HeightFill>
                        <BottomSheetScrollView>
                          {renderContent()}
                        </BottomSheetScrollView>
                      </HeightFill>
                    </View>
                  </View>
                </HeightBudgetProvider>
              </BottomSheet>
            </BottomSheetProvider>
          </BottomSheetPresenter>
        </SheetStackItem>
      </Portal>
    </View>
  )
}

// MARK: Styles

const styles = StyleSheet.create({
  header: {
    fontSize: 20,
    fontWeight: '500',
  },
  root: {
    flex: 1,
    gap: 8,
    padding: 16,
  },
})
