# BottomSheetKeyboardExpander

BottomSheetKeyboardExpander is a component that expands its height to offset the keyboard height when the keyboard is open

You usually want to put this component under `BottomSheet`, so when it expands, it will push the bottom sheet up

You need to use this component together with `InputFocusProvider`, so that it only expands when the focused input is inside the sheet

## Props

| Prop name        | Type   | Required | Default     | Description                                            |
| ---------------- | ------ | -------- | ----------- | ------------------------------------------------------ |
| `keyboardOffset` | number | false    | `undefined` | The offset added to expander when the keyboard is open |
