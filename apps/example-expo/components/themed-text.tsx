import { forwardRef } from 'react'
import {
  Text,
  TextProps,
  useColorScheme,
  type TextInstance,
} from 'react-native'

export const ThemedText = forwardRef<TextInstance, TextProps>(
  ({ style, ...rest }, ref) => {
    const theme = useColorScheme()

    const isDark = theme === 'dark'
    const textColor = isDark ? '#FFFFFF' : '#000000'

    return <Text ref={ref} {...rest} style={[{ color: textColor }, style]} />
  },
)
