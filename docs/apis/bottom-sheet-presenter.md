# BottomSheetPresenter

BottomSheetPresenter is a component that opens from the bottom of the screen and goes all the way up to the top

When `SheetStackItem` wants to close, BottomSheetPresenter will call `onFullyExit` to notify the stack item that the close animation has fully finished and it's safe to unmount

## Props

| Prop name  | Type        | Required | Default     | Description                                                      |
| ---------- | ----------- | -------- | ----------- | ---------------------------------------------------------------- |
| `styles`   | object      | false    | `undefined` | The styles of the bottom sheet presenter                         |
| `testID`   | string      | false    | `undefined` | The test ID of the bottom sheet presenter (for testing purposes) |
| `children` | `ReactNode` | false    | `undefined` | The children of the bottom sheet presenter                       |

## Styles

```tsx
styles?: {
  root?: StyleProp<ViewStyle>
}
```

## Hook

Use `useBottomSheetPresenter` to access the presenter internal state and methods

It provides:

- `translateY`: A shared value that tracks the offset of the bottom sheet presenter from the bottom of the screen
  - `= 0`: Bottom sheet presenter is fully visible
  - `> 0`: Bottom sheet presenter is going below the bottom of the screen
