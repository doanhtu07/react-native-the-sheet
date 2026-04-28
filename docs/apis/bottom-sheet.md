# BottomSheet

BottomSheet is a component that represents the actual bottom sheet container that you would see on the screen

It's responsible for handling the gestures, animations, and interactions of the bottom sheet

## Props

| Prop name  | Type                                | Required | Default     | Description                                                                   |
| ---------- | ----------------------------------- | -------- | ----------- | ----------------------------------------------------------------------------- |
| `ref`      | `RefObject<BottomSheetApi \| null>` | false    | `undefined` | The ref of the bottom sheet to use BottomSheetApi                             |
| `fill`     | `boolean`                           | false    | `false`     | Whether the bottom sheet should fill the available height (applies `flex: 1`) |
| `styles`   | object                              | false    | `undefined` | The styles of the bottom sheet                                                |
| `children` | `ReactNode`                         | false    | `undefined` | The children of the bottom sheet                                              |

## Ref methods (BottomSheetApi)

- `snapToIndex(index: number)`: Snaps the bottom sheet to the snap point of the given index
- `snapToPosition(position: SnapPoint)`: Snaps the bottom sheet to a specific position. Could lead to weird UI btw

## Styles

```tsx
styles?: {
  root?: StyleProp<ViewStyle>
}
```
