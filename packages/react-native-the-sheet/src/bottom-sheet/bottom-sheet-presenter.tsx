import { useEffect, useRef } from 'react'
import { Animated, StyleSheet, useWindowDimensions } from 'react-native'
import type { BottomSheetPresenterProps } from './types'
import { useSheetStackItem } from '../sheet-stack'

export function BottomSheetPresenter({
  styles: propStyles,
  children,
}: Readonly<BottomSheetPresenterProps>) {
  const { isCurrentlyInStack, onFullyExit } = useSheetStackItem()
  const { height } = useWindowDimensions()

  const onFullyExitRef = useRef(onFullyExit)
  onFullyExitRef.current = onFullyExit

  const translateY = useRef(new Animated.Value(height))

  // MARK: Effects

  useEffect(() => {
    if (isCurrentlyInStack) {
      translateY.current.setValue(height)
    }

    Animated.spring(translateY.current, {
      toValue: isCurrentlyInStack ? 0 : height,
      useNativeDriver: false,
      overshootClamping: true,
      damping: 20,
      stiffness: 200,
      mass: 1,
    }).start(({ finished }) => {
      if (finished && !isCurrentlyInStack) {
        onFullyExitRef.current()
      }
    })
  }, [height, isCurrentlyInStack])

  // MARK: Renderers

  return (
    <Animated.View
      style={[
        styles.root,
        propStyles?.root,
        { height, transform: [{ translateY: translateY.current }] },
      ]}
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
