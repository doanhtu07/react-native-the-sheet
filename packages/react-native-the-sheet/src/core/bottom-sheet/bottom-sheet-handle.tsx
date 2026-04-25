import { StyleSheet, useColorScheme, View } from 'react-native'
import type { BottomSheetHandleProps } from './types'
import { GestureDetector } from 'react-native-gesture-handler'
import { useBottomSheet } from './bottom-sheet'
import { useMemo } from 'react'

export function BottomSheetHandle({
  styles: propStyles,
}: Readonly<BottomSheetHandleProps>) {
  const theme = useColorScheme()
  const { getPanGesture } = useBottomSheet()

  const isDark = theme === 'dark'
  const backgroundColor = isDark ? '#48484A' : '#E0E0E0'

  const panGesture = useMemo(() => {
    return getPanGesture()
  }, [getPanGesture])

  // MARK: Renderers

  return (
    <GestureDetector gesture={panGesture}>
      <View style={[styles.root, propStyles?.root]}>
        <View
          style={[styles.indicator, { backgroundColor }, propStyles?.indicator]}
        />
      </View>
    </GestureDetector>
  )
}

// MARK: Styles

const styles = StyleSheet.create({
  indicator: {
    borderRadius: 9999,
    height: 5,
    width: 36,
  },
  root: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    width: '100%',
  },
})
