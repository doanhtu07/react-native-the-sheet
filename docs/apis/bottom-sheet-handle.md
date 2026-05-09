# BottomSheetHandle

BottomSheetHandle is a component that renders the handle for the bottom sheet, which is the area that users can grab to drag the bottom sheet up and down

## Props

| Prop name       | Type               | Required | Default     | Description                                                   |
| --------------- | ------------------ | -------- | ----------- | ------------------------------------------------------------- |
| `getPanGesture` | `() => PanGesture` | false    | `undefined` | The custom pan gesture factory                                |
| `styles`        | object             | false    | `undefined` | The styles of the bottom sheet handle                         |
| `testID`        | `string`           | false    | `undefined` | The test ID of the bottom sheet handle (for testing purposes) |

## Styles

```tsx
styles?: {
  root?: StyleProp<ViewStyle>
  indicator?: StyleProp<ViewStyle>
}
```
