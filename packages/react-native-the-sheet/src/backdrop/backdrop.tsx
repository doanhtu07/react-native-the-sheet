import { Pressable, StyleSheet } from 'react-native'
import type { BackdropProps } from './types'
import { useSheetStackItem } from '../sheet-stack'

export function Backdrop({
  styles: propStyles,
  testID,
}: Readonly<BackdropProps>) {
  const { close } = useSheetStackItem()

  return (
    <Pressable
      style={[styles.root, propStyles?.root]}
      onPress={close}
      testID={testID}
    />
  )
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#1C1F2E',
    opacity: 0.5,
  },
})
