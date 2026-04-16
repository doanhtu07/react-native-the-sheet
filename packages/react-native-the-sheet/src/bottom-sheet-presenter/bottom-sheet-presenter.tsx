import { useEffect, useRef } from 'react'
import { Animated, StyleSheet, useWindowDimensions } from 'react-native'
import type { BottomSheetPresenterProps } from './types'
import { useSheetStackItem } from '../sheet-stack'

export function BottomSheetPresenter({
  styles: propStyles,
  testID,
  children,
}: Readonly<BottomSheetPresenterProps>) {
  const { isHidden, isCurrentlyInStack, onFullyExit } = useSheetStackItem()

  const { height } = useWindowDimensions()

  const onFullyExitRef = useRef(onFullyExit)
  onFullyExitRef.current = onFullyExit

  const allowPresent = isCurrentlyInStack && !isHidden

  const translateY = useRef(new Animated.Value(height))

  // MARK: Effects

  useEffect(() => {
    if (allowPresent) {
      translateY.current.setValue(height)
    }

    Animated.spring(translateY.current, {
      toValue: allowPresent ? 0 : height,
      useNativeDriver: true,
      overshootClamping: true,
      damping: 20,
      stiffness: 200,
      mass: 1,
    }).start(({ finished }) => {
      if (finished && !allowPresent) {
        onFullyExitRef.current()
      }
    })
  }, [height, allowPresent, testID])

  // MARK: Renderers

  return (
    <Animated.View
      style={[
        styles.root,
        propStyles?.root,
        { height, transform: [{ translateY: translateY.current }] },
      ]}
      testID={testID}
    >
      {children}
    </Animated.View>
  )
}

// MARK: Styles

const styles = StyleSheet.create({
  root: {
    width: '100%',
    justifyContent: 'flex-end',
    pointerEvents: 'box-none',
  },
})
