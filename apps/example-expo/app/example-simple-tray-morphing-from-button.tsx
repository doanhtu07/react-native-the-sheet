import { ThemedText } from '@/components/themed-text'
import { useEffect } from 'react'
import { Text, Button, Pressable, StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useNavigation } from 'expo-router'
import Animated, {
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'

const TRAY_CONTAINER_PADDING = 24
const TRAY_BACKGROUND_PADDING = 16

export default function ExampleSimpleTrayMorphingFromButton() {
  const navigation = useNavigation()
  const safeAreaInsets = useSafeAreaInsets()

  const isOpen = useSharedValue(false)
  const openProgress = useDerivedValue(() => {
    return withTiming(isOpen.value ? 1 : 0, { duration: 300 })
  })
  const isPressing = useSharedValue(false)

  const trayContainerWidth = useSharedValue(0)
  const trayButtonHeight = useSharedValue(0)
  const trayButtonWidth = useSharedValue(0)
  const trayContentHeight = useSharedValue(0)

  // MARK: Effects

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    })
  }, [navigation])

  // MARK: Preparation

  const animatedTrayShapeStyle = useAnimatedStyle(() => {
    const height = interpolate(
      openProgress.value,
      [0, 1],
      [
        trayButtonHeight.value,
        trayContentHeight.value + trayButtonHeight.value,
      ],
    )

    const width = interpolate(
      openProgress.value,
      [0, 1],
      [
        trayButtonWidth.value,
        trayButtonWidth.value + TRAY_BACKGROUND_PADDING * 2,
      ],
    )

    const borderRadius = interpolate(
      openProgress.value,
      [0, 1],
      [trayButtonHeight.value / 2, 16],
    )

    const left = trayContainerWidth.value / 2 - width / 2

    const bottom = interpolate(
      openProgress.value,
      [0, 1],
      [0, -TRAY_BACKGROUND_PADDING / 2],
    )

    return {
      backgroundColor: 'lightgray',
      overflow: 'hidden',
      position: 'absolute',
      opacity: isPressing.value && openProgress.value === 0 ? 0 : 1,
      height,
      width,
      borderRadius,
      left,
      bottom,
    }
  })

  const animatedTrayContentStyle = useAnimatedStyle(() => {
    const paddingTop = interpolate(
      openProgress.value,
      [0, 1],
      [0, TRAY_BACKGROUND_PADDING],
    )

    const paddingBottom = interpolate(
      openProgress.value,
      [0, 1],
      [0, TRAY_BACKGROUND_PADDING],
    )

    const paddingHorizontal = interpolate(
      openProgress.value,
      [0, 1],
      [0, TRAY_BACKGROUND_PADDING],
    )

    return {
      position: 'absolute',
      top: 0,
      paddingTop,
      paddingBottom,
      paddingHorizontal,
    }
  })

  const animatedTrayBottomCoverStyle = useAnimatedStyle(() => {
    const height = interpolate(
      openProgress.value,
      [0, 1],
      [
        trayButtonHeight.value,
        trayButtonHeight.value + TRAY_BACKGROUND_PADDING,
      ],
    )

    const bottom = interpolate(
      openProgress.value,
      [0, 1],
      [0, -TRAY_BACKGROUND_PADDING / 2],
    )

    const borderRadius = interpolate(
      openProgress.value,
      [0, 1],
      [trayButtonHeight.value / 2, 0],
    )

    return {
      backgroundColor: 'lightgray',
      position: 'absolute',
      opacity: isPressing.value && openProgress.value === 0 ? 0 : 1,
      borderRadius,
      height,
      width: trayButtonWidth.value,
      bottom,
      left: trayContainerWidth.value / 2 - trayButtonWidth.value / 2,
    }
  })

  const animatedTrayButtonContainerStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      openProgress.value,
      [0, 1],
      [0, -TRAY_BACKGROUND_PADDING / 2],
    )

    return {
      transform: [{ translateY }],
    }
  })

  const animatedBackdropStyle = useAnimatedStyle(() => {
    const opacity = interpolate(openProgress.value, [0, 1], [0, 0.5])

    return {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: '#000000',
      opacity,
    }
  })

  // MARK: Renderers

  return (
    <View
      style={[
        styles.root,
        {
          paddingTop: safeAreaInsets.top,
          paddingBottom: safeAreaInsets.bottom,
        },
      ]}
    >
      <Button title="Back" onPress={() => navigation.goBack()} />

      <ThemedText style={styles.header}>
        Example Simple Tray Morphing From Button
      </ThemedText>

      <View style={styles.spacer} />

      {/* MARK: Backdrop */}
      <Pressable
        style={StyleSheet.absoluteFill}
        onPress={() => (isOpen.value = false)}
      >
        <Animated.View style={animatedBackdropStyle} />
      </Pressable>

      {/* MARK: Tray container */}
      <View
        style={styles.trayContainer}
        onLayout={(e) => {
          trayContainerWidth.value = e.nativeEvent.layout.width
        }}
      >
        {/* MARK: Tray shape */}
        <Animated.View style={animatedTrayShapeStyle}>
          {/* MARK: Tray content (dynamic height supposingly) */}
          <Animated.View
            style={animatedTrayContentStyle}
            onLayout={(e) => {
              trayContentHeight.value = e.nativeEvent.layout.height
            }}
          >
            <View style={styles.trayContentInner}>
              {Array.from({ length: 20 }).map((_, index) => (
                <Text key={index}>Item {index + 1}</Text>
              ))}
            </View>
          </Animated.View>
        </Animated.View>

        {/* MARK: Tray bottom cover */}
        <Animated.View style={animatedTrayBottomCoverStyle} />

        {/* MARK: Tray button */}
        <Animated.View style={animatedTrayButtonContainerStyle}>
          <Pressable
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
            ]}
            onLayout={(e) => {
              trayButtonHeight.value = e.nativeEvent.layout.height
              trayButtonWidth.value = e.nativeEvent.layout.width
            }}
            onPressIn={() => {
              isPressing.value = true
            }}
            onPressOut={() => {
              isPressing.value = false
            }}
            onPress={() => {
              isOpen.value = !isOpen.value
            }}
          >
            <Text style={styles.buttonText}>Press Me</Text>
          </Pressable>
        </Animated.View>
      </View>
    </View>
  )
}

// MARK: Styles

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: '#53b7f9',
    borderRadius: 9999,
    justifyContent: 'center',
    padding: 10,
  },
  buttonPressed: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#DFF7FD',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    fontSize: 20,
    fontWeight: '500',
  },
  root: {
    flex: 1,
    gap: 8,
    padding: 16,
  },
  spacer: {
    flex: 1,
  },
  trayContainer: {
    marginBottom: 8,
    paddingHorizontal: TRAY_CONTAINER_PADDING,
  },
  trayContentInner: {
    backgroundColor: 'lightgray',
    flex: 1,
    padding: 8,
  },
})
