# Backdrop

Backdrop is a component that takes up the entire screen

When you press on the backdrop, it will trigger `close` function of the current sheet stack item

## Props

| Prop name | Type     | Required | Default     | Description                                        |
| --------- | -------- | -------- | ----------- | -------------------------------------------------- |
| `styles`  | object   | false    | `undefined` | The styles of the backdrop                         |
| `testID`  | `string` | false    | `undefined` | The test ID of the backdrop (for testing purposes) |

## Styles

```tsx
styles?: {
  root?: StyleProp<ViewStyle>
}
```
