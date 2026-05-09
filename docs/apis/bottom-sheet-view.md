# BottomSheetView

BottomSheetView is a normal View, but it's wrapped by a gesture detector to work with the bottom sheet's pan gesture

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
