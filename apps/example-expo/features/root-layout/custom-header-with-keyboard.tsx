import { Platform } from 'react-native'
import { useTrueSafeArea } from 'react-native-the-sheet'
import { NativeStackHeaderProps } from 'expo-router'
import { Header } from 'expo-router/build/react-navigation'

export const CustomHeaderWithKeyboard = (props: NativeStackHeaderProps) => {
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
