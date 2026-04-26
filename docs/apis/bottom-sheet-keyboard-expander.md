# BottomSheetKeyboardExpander

BottomSheetKeyboardExpander is a component that expands its height to offset the keyboard height when the keyboard is open

You usually want to put this component under `BottomSheet`, so when it expands, it will push the bottom sheet up

## Props

| Prop name        | Type   | Required | Default     | Description                                            |
| ---------------- | ------ | -------- | ----------- | ------------------------------------------------------ |
| `keyboardOffset` | number | false    | `undefined` | The offset added to expander when the keyboard is open |

### Android edge-to-edge behavior

- When disabling edge-to-edge
  - If you are setting `windowSoftInputMode` as `adjustResize`
    - You should not use `BottomSheetKeyboardExpander` as the screen will be resized by OS
    - Unless you are using `KeyboardProvider`, which will prevent the screen from being resized
  - If you use `adjustPan` instead
    - You can use `BottomSheetKeyboardExpander` normally

- When enabling edge-to-edge
  - You can use `BottomSheetKeyboardExpander` normally regardless of the `windowSoftInputMode` you set
