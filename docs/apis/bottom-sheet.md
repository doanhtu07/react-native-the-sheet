# BottomSheet

BottomSheet is a component that represents the actual bottom sheet container that you would see on the screen

It's responsible for handling the gestures, animations, and interactions of the bottom sheet

## Props

| Prop name        | Type                                | Required | Default     | Description                                                                      |
| ---------------- | ----------------------------------- | -------- | ----------- | -------------------------------------------------------------------------------- |
| `ref`            | `RefObject<BottomSheetApi \| null>` | false    | `undefined` | The ref of the bottom sheet to use BottomSheetApi                                |
| `snapPoints`     | `SnapPoint[]`                       | false    | `[]`        | The snap points of the bottom sheet. Bottom sheet will snap to these heights     |
| `enableFloat`    | `boolean`                           | false    | `false`     | Bottom sheet doesn't need to snap to provided snap points                        |
| `enableOverdrag` | `boolean`                           | false    | `false`     | Dragging beyond the highest snap point                                           |
| `disableDrag`    | `boolean`                           | false    | `false`     | Disable dragging the bottom sheet (but can still be controlled programmatically) |
| `fill`           | `boolean`                           | false    | `false`     | Whether the bottom sheet should fill the available height (applies `flex: 1`)    |
| `styles`         | object                              | false    | `undefined` | The styles of the bottom sheet                                                   |
| `children`       | `ReactNode`                         | false    | `undefined` | The children of the bottom sheet                                                 |

### SnapPoint

Supports two formats:

- `number`: The snap point in pixels
- `number%`: The snap point in percentage of screen height

### enableOverdrag

Requires `snapPoints` to be provided

## Ref methods (BottomSheetApi)

- `snapToIndex(index: number)`: Snaps the bottom sheet to the snap point of the given index
- `snapToPosition(position: SnapPoint)`: Snaps the bottom sheet to a specific position. Could lead to weird UI btw

## Styles

```tsx
styles?: {
  root?: StyleProp<ViewStyle>
}
```

## Hook

Use `useBottomSheet` to access the bottom sheet internal state and methods

It provides:

- `enableOverdrag`: Passed from props

---

- `sheetHeight`: A shared value that tracks the total height of the bottom sheet
- `sheetVisibleHeight`: A shared value that tracks the visible height of the bottom sheet on the screen
- `sheetVisibleRatio`: A shared value that tracks the visible ratio of the bottom sheet (0 means fully hidden, 1 means fully visible)

---

- `snapTranslateYs`: A shared value that stores all the possible snap translateY values calculated from the provided snap points
- `translateY`: A shared value that tracks relative position of bottom sheet to its rest point
  - `= 0`: Bottom sheet is fully visible inside bottom sheet presenter
  - `> 0`: Bottom sheet is being dragged down from rest point
  - `< 0`: Bottom sheet is being dragged up from rest point

---

- `scrollViewRef`: A ref to the scroll view that is mainly responsible handling the intersection of pan and scroll gestures
- `isScrollViewReady`: A boolean that tracks whether the scroll view is ready to handle gestures (Whether it mounts and has its layout measured yet)
- `isScrolling`: A shared value of 0 or 1 that tracks whether the scroll view is currently scrolling
- `scrollY`: A shared value that tracks the scroll position of the scroll view

---

- `getPanGesture()`: A method that returns a pan gesture instance that can be passed to any gesture detector
