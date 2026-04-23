import type { WithSpringConfig } from 'react-native-reanimated'

export const SPRING_CONFIG: WithSpringConfig = {
  overshootClamping: true,
  damping: 20,
  stiffness: 200,
  mass: 1,
}
