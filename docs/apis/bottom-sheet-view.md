# BottomSheetView

BottomSheetView is a normal View, but it's wrapped by a gesture detector to work with the bottom sheet's pan gesture

> [!TIP]
> It's not recommended to nest `BottomSheetScrollView` (or other bottom sheet scrollables like `BottomSheetFlatList`) inside `BottomSheetView`. Both attach their own gesture detector for the bottom sheet pan gesture, so nesting may cause the gestures to conflict in some cases. To cover areas that need the bottom sheet gesture, it's recommended to use multiple sibling `BottomSheetView`s instead of wrapping:

```tsx
// Recommended — sibling views, no nesting
<>
  <BottomSheetView>{/* header / fixed content */}</BottomSheetView>
  <BottomSheetScrollView>{/* scrollable content */}</BottomSheetScrollView>
  <BottomSheetView>{/* footer / fixed content */}</BottomSheetView>
</>
```

## Props

| Prop name       | Type                    | Required | Default     | Description                                                                        |
| --------------- | ----------------------- | -------- | ----------- | ---------------------------------------------------------------------------------- |
| `fill`          | `AnimatedProp<boolean>` | false    | `false`     | Whether the bottom sheet view should fill the available height (applies `flex: 1`) |
| `getPanGesture` | `() => PanGesture`      | false    | `undefined` | The custom pan gesture factory                                                     |
| `styles`        | object                  | false    | `undefined` | The styles of the bottom sheet view                                                |
| `children`      | `ReactNode`             | false    | `undefined` | The children of the bottom sheet view                                              |
| `testID`        | `string`                | false    | `undefined` | The test ID of the bottom sheet view (for testing purposes)                        |

## Styles

```tsx
styles?: {
  root?: StyleProp<ViewStyle>
}
```
