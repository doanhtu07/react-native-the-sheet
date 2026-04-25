import { Pressable, StyleSheet } from 'react-native'
import type { BackdropProps } from './types'
import { useSheetStackItem } from '../sheet-stack'
import Animated from 'react-native-reanimated'

export function Backdrop({
  styles: propStyles,
  testID,
}: Readonly<BackdropProps>) {
  const { close } = useSheetStackItem()

  return (
    <Pressable style={StyleSheet.absoluteFill} onPress={close} testID={testID}>
      <Animated.View style={[styles.root, propStyles?.root]} />
    </Pressable>
  )
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#1C1F2E',
    opacity: 0.5,
  },
})
