import { Pressable, StyleSheet } from 'react-native'
import type { BackdropProps } from './types'
import { useSheetStackItem } from '../sheet-stack'
import Animated from 'react-native-reanimated'
import { useToSharedValue } from '../hooks/use-to-shared-value'
import { useToStateValue } from '../hooks/use-to-state-value'

export function Backdrop({
  disabled: propDisabled = false,
  styles: propStyles,
  testID,
}: Readonly<BackdropProps>) {
  const { close } = useSheetStackItem()

  const disabledShared = useToSharedValue(propDisabled)
  const disabled = useToStateValue(disabledShared, false)

  return (
    <Pressable
      style={StyleSheet.absoluteFill}
      onPress={disabled ? undefined : close}
      pointerEvents={disabled ? 'none' : 'auto'}
      testID={testID}
    >
      <Animated.View style={[styles.root, propStyles?.root]} />
    </Pressable>
  )
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000000',
    opacity: 0.5,
  },
})
