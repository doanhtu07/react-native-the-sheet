import type { WithSpringConfig } from 'react-native-reanimated'

export const FADE_DURATION_MS = 200

export const SPRING_CONFIG: WithSpringConfig = {
  overshootClamping: true,
  damping: 20,
  stiffness: 200,
  mass: 1,
}
