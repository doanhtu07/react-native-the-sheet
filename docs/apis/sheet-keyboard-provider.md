# SheetKeyboardProvider

A simple provider that tracks some useful keyboard states:

- `keyboardVisible`: A shared value that indicates whether the keyboard is visible or not
- `keyboardFinalHeight`: A shared value that tracks the height of keyboard when it's fully open or fully closed
- `androidWindowSoftInputMode`: Pass from props
- `isVisuallyAndroidKeyboardResizeMode`: A shared value that indicates whether the app is "truly" using Android keyboard resize mode
  - Where the root view of the app resizes when the keyboard opens
- `isAndroidKeyboardResizeMode`: A shared value that combines `androidWindowSoftInputMode` and `isVisuallyAndroidKeyboardResizeMode`

## Props

| Prop name                    | Type                                             | Required | Default     | Description                                                                |
| ---------------------------- | ------------------------------------------------ | -------- | ----------- | -------------------------------------------------------------------------- |
| `androidWindowSoftInputMode` | `adjustResize` \| `adjustPan` \| `adjustNothing` | true     | N/A         | The Android window soft input mode you defined in your AndroidManifest.xml |
| `children`                   | `ReactNode`                                      | false    | `undefined` | The children of the provider                                               |

### androidWindowSoftInputMode

When using this combo of 3 things:

- Android input mode `adjustResize`
- `non-edge-to-edge`
- `KeyboardProvider`

=> Set `androidWindowSoftInputMode` of `SheetKeyboardProvider` to `adjustNothing`

Other than that, matching `androidWindowSoftInputMode` with the one defined in AndroidManifest.xml should work fine

## Hook

Use `useSheetKeyboard` to access the keyboard states from the context
