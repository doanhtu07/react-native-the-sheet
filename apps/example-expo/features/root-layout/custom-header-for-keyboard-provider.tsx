import { Header } from '@react-navigation/elements'
import { Platform } from 'react-native'
import { useTrueSafeArea } from 'react-native-the-sheet'
import { NativeStackHeaderProps } from '@react-navigation/native-stack'

export const CustomHeaderForKeyboardProvider = (
  props: NativeStackHeaderProps,
) => {
  const { isEdgeToEdge } = useTrueSafeArea()

  return (
    <Header
      {...props}
      title={props.route.name}
      headerStatusBarHeight={
        Platform.OS === 'android' && !isEdgeToEdge ? 0 : undefined
      }
    />
  )
}
