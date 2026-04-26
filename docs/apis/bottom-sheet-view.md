# BottomSheetView

BottomSheetView is a normal View, but it's wrapped by a gesture detector to work with the bottom sheet's pan gesture

## Props

| Prop name  | Type        | Required | Default     | Description                                                                        |
| ---------- | ----------- | -------- | ----------- | ---------------------------------------------------------------------------------- |
| `fill`     | `boolean`   | false    | `undefined` | Whether the bottom sheet view should fill the available height (applies `flex: 1`) |
| `styles`   | object      | false    | `undefined` | The styles of the bottom sheet view                                                |
| `children` | `ReactNode` | false    | `undefined` | The children of the bottom sheet view                                              |

## Styles

```tsx
styles?: {
  root?: StyleProp<ViewStyle>
}
```
