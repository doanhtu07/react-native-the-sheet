# SheetKeyboardProvider

A simple provider that tracks some useful keyboard states:

- `keyboardVisible`: A shared value that indicates whether the keyboard is visible or not
- `keyboardFinalHeight`: A shared value that tracks the height of keyboard when it's fully open or fully closed
- `isAndroidKeyboardResizeMode`: A shared value that indicates whether the app is "truly" using Android keyboard resize mode (where the root view of the app resizes when the keyboard opens)

## Props

| Prop name  | Type        | Required | Default     | Description                  |
| ---------- | ----------- | -------- | ----------- | ---------------------------- |
| `children` | `ReactNode` | false    | `undefined` | The children of the provider |

## Hook

Use `useSheetKeyboard` to access the keyboard states from the context
