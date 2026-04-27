import { forwardRef } from 'react'
import { TextInputProps } from 'react-native'
import { TextInput } from 'react-native-gesture-handler'
import { useInputFocus } from 'react-native-the-sheet'

export const ManagedTextInput = forwardRef<TextInput, TextInputProps>(
  ({ onFocus: propOnFocus, onBlur: propOnBlur, ...rest }, ref) => {
    const { onFocus, onBlur } = useInputFocus()

    return (
      <TextInput
        ref={ref}
        {...rest}
        onFocus={(e) => {
          onFocus()
          propOnFocus?.(e)
        }}
        onBlur={(e) => {
          onBlur()
          propOnBlur?.(e)
        }}
      />
    )
  },
)
