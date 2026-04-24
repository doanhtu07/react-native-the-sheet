# Component Props

## PortalProvider

| Prop name  | Type        | Required | Default     | Description                  |
| ---------- | ----------- | -------- | ----------- | ---------------------------- |
| `children` | `ReactNode` | false    | `undefined` | The children of the provider |

## PortalHost

| Prop name | Type      | Required | Default     | Description                                                                    |
| --------- | --------- | -------- | ----------- | ------------------------------------------------------------------------------ |
| `name`    | `string`  | true     | N/A         | The name of the portal host                                                    |
| `debug`   | `boolean` | false    | `undefined` | Whether to enable debug mode (logs keys of portals in current host in console) |

## Portal

| Prop name  | Type        | Required | Default       | Description                                                                          |
| ---------- | ----------- | -------- | ------------- | ------------------------------------------------------------------------------------ |
| `name`     | `string`    | false    | React useId() | The name of the portal                                                               |
| `hostName` | `string`    | true     | N/A           | The name of the portal host to portal into (must match the `name` of a `PortalHost`) |
| `children` | `ReactNode` | false    | `undefined`   | The children of the portal                                                           |

## SheetKeyboardProvider

| Prop name  | Type        | Required | Default     | Description                  |
| ---------- | ----------- | -------- | ----------- | ---------------------------- |
| `children` | `ReactNode` | false    | `undefined` | The children of the provider |

## SheetStackProvider

| Prop name  | Type        | Required | Default     | Description                                               |
| ---------- | ----------- | -------- | ----------- | --------------------------------------------------------- |
| `debug`    | `boolean`   | false    | `undefined` | Whether to enable debug mode (logs stack info in console) |
| `children` | `ReactNode` | false    | `undefined` | The children of the provider                              |

## SheetStackItem

| Prop name          | Type                                   | Required | Default     | Description                                                                                                         |
| ------------------ | -------------------------------------- | -------- | ----------- | ------------------------------------------------------------------------------------------------------------------- |
| `ref`              | `RefObject<SheetStackItemApi \| null>` | false    | `undefined` | The ref of the stack item to use SheetStackItemApi                                                                  |
| `isOpen`           | `boolean`                              | true     | N/A         | Whether the stack item is open or not                                                                               |
| `close`            | `() => void`                           | true     | N/A         | The function to close the stack item                                                                                |
| `pushBehavior`     | `push` / `switch` / `replace`          | false    | `push`      | The behavior when pushing this item on top of the stack                                                             |
| `waitForFullyExit` | `boolean`                              | false    | `false`     | Whether to wait for a content to call `onFullyExit()` before fully unmount. Useful for bottom sheet close animation |
| `testID`           | `string`                               | false    | `undefined` | The test ID of the stack item (for testing purposes)                                                                |
| `children`         | `ReactNode`                            | false    | `undefined` | The children of the stack item                                                                                      |

---

- `SheetStackItemApi`
  - `hide()`: Temporarily hides the stack item (without unmounting)
  - `show()`: Shows the stack item if it's hidden

---

- `pushBehavior`
  - `push`: Pushes this item on top of the stack, keeping the previous one in the stack (default)
  - `switch`: Pushes this item on top of the stack + Temporarily hides the previous top
  - `replace`: Replaces the current top item in the stack with this one

## Backdrop

| Prop name | Type     | Required | Default     | Description                                        |
| --------- | -------- | -------- | ----------- | -------------------------------------------------- |
| `styles`  | object   | false    | `undefined` | The styles of the backdrop                         |
| `testID`  | `string` | false    | `undefined` | The test ID of the backdrop (for testing purposes) |

---

- `styles` is an object with the following

```tsx
styles?: {
    root?: StyleProp<ViewStyle>
}
```

## BottomSheetPresenter

| Prop name  | Type        | Required | Default     | Description                                                      |
| ---------- | ----------- | -------- | ----------- | ---------------------------------------------------------------- |
| `styles`   | object      | false    | `undefined` | The styles of the bottom sheet presenter                         |
| `testID`   | string      | false    | `undefined` | The test ID of the bottom sheet presenter (for testing purposes) |
| `children` | `ReactNode` | false    | `undefined` | The children of the bottom sheet presenter                       |

---

- `styles` is an object with the following

```tsx
styles?: {
  root?: StyleProp<ViewStyle>
}
```

## BottomSheet

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

---

- `BottomSheetApi`:
  - `snapToIndex(index: number)`: Snaps the bottom sheet to the snap point of the given index
  - `snapToPosition(position: SnapPoint)`: Snaps the bottom sheet to a specific position. Could lead to weird UI btw

---

- `SnapPoint`:
  - `number`: The snap point in pixels
  - `number%`: The snap point in percentage of screen height

---

- `enableOverdrag`:
  - Requires `snapPoints` to be provided

---

- `styles` is an object with the following

```tsx
styles?: {
  root?: StyleProp<ViewStyle>
}
```

## BottomSheetPositionTracker

| Prop name                       | Type                  | Required | Default     | Description                                         |
| ------------------------------- | --------------------- | -------- | ----------- | --------------------------------------------------- |
| `trackBottomSheetVisibleHeight` | `SharedValue<number>` | false    | `undefined` | Track the VISIBLE height of the bottom sheet        |
| `trackBottomSheetVisibleRatio`  | `SharedValue<number>` | false    | `undefined` | Track the VISIBLE ratio of the bottom sheet (0 - 1) |

## BottomSheetKeyboardExpander

| Prop name        | Type   | Required | Default     | Description                                            |
| ---------------- | ------ | -------- | ----------- | ------------------------------------------------------ |
| `keyboardOffset` | number | false    | `undefined` | The offset added to expander when the keyboard is open |

---

Notes on Android edge to edge behavior:

- When disabling edge to edge
  - If you are setting `windowSoftInputMode` as `adjustResize`
    - You should not use `BottomSheetKeyboardExpander` as the screen will be resized by OS
  - If you use `adjustPan` instead
    - You can use `BottomSheetKeyboardExpander` normally

- When enabling edge to edge
  - You can use `BottomSheetKeyboardExpander` normally regardless of the `windowSoftInputMode` you set

## BottomSheetHandle

| Prop name | Type   | Required | Default     | Description                           |
| --------- | ------ | -------- | ----------- | ------------------------------------- |
| `styles`  | object | false    | `undefined` | The styles of the bottom sheet handle |

---

- `styles` is an object with the following

```tsx
styles?: {
  root?: StyleProp<ViewStyle>
  indicator?: StyleProp<ViewStyle>
}
```

## BottomSheetView

| Prop name  | Type        | Required | Default                               | Description                                                                        |
| ---------- | ----------- | -------- | ------------------------------------- | ---------------------------------------------------------------------------------- |
| `fill`     | `boolean`   | false    | `undefined`                           | Whether the bottom sheet view should fill the available height (applies `flex: 1`) |
| `styles`   | object      | false    | `undefined`                           | The styles of the bottom sheet view                                                |
| `children` | `ReactNode` | false    | The children of the bottom sheet view |

---

- `styles` is an object with the following

```tsx
styles?: {
  root?: StyleProp<ViewStyle>
}
```

## BottomSheetScrollView

| Prop name | Type      | Required | Default     | Description                                                                               |
| --------- | --------- | -------- | ----------- | ----------------------------------------------------------------------------------------- |
| `fill`    | `boolean` | false    | `undefined` | Whether the bottom sheet scroll view should fill the available height (applies `flex: 1`) |
| `styles`  | object    | false    | `undefined` | The styles of the bottom sheet scroll view                                                |

---

- Inherits all props of `ScrollView` as well
- Cannot override `onScroll`

---

- `styles` is an object with the following

```tsx
styles?: {
  root?: StyleProp<ViewStyle>
}
```

## BottomSheetFlatList

| Prop name | Type      | Required | Default     | Description                                                                             |
| --------- | --------- | -------- | ----------- | --------------------------------------------------------------------------------------- |
| `fill`    | `boolean` | false    | `undefined` | Whether the bottom sheet flat list should fill the available height (applies `flex: 1`) |
| `styles`  | object    | false    | `undefined` | The styles of the bottom sheet flat list                                                |

---

- Inherits all props of `FlatList` as well
- Cannot override `onScroll`

---

- `styles` is an object with the following

```tsx
styles?: {
  root?: StyleProp<ViewStyle>
}
```

## BottomSheetFooter

| Prop name  | Type        | Required | Default     | Description                             |
| ---------- | ----------- | -------- | ----------- | --------------------------------------- |
| `styles`   | object      | false    | `undefined` | The styles of the bottom sheet footer   |
| `children` | `ReactNode` | false    | `undefined` | The children of the bottom sheet footer |

---

- `styles` is an object with the following

```tsx
styles?: {
  root?: StyleProp<ViewStyle>
}
```

## EmbeddedStackNavigator

| Prop name          | Type                             | Required | Default | Description                                         |
| ------------------ | -------------------------------- | -------- | ------- | --------------------------------------------------- |
| `initialRouteName` | `string`                         | true     | N/A     | The initial route of the stack navigator            |
| `initialParams`    | `object`                         | true     | N/A     | The initial params of the initial route             |
| `screens`          | `Record<string, ScreenRenderer>` | true     | N/A     | The screens of the stack navigator                  |
| `transitionType`   | `slide` / `fade`                 | false    | `slide` | The transition type when navigating between screens |

---

- `ScreenRenderer` = `() => ReactElement | null`
