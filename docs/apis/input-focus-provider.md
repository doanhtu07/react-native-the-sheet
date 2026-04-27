# InputFocusProvider

InputFocusProvider is a component that manages the focus state of input, so that BottomSheetKeyboardExpander knows whether the focused input is truly inside the sheet or not

Don't forget to pass `onFocus` and `onBlur` to the inputs you want to be tracked

## Props

| Prop name  | Type        | Required | Default     | Description                  |
| ---------- | ----------- | -------- | ----------- | ---------------------------- |
| `children` | `ReactNode` | false    | `undefined` | The children of the provider |

## Hook

Use `useInputFocus` to access the input focus state and methods from the context

It provides:

- `isInputFocused`: A shared value that tracks whether an input is focused or not
- `onFocus`: A method to call when an input is focused
- `onBlur`: A method to call when an input is blurred
