# BottomSheetPresenter

BottomSheetPresenter is a component that opens from the bottom of the screen and goes all the way up to the top

When `SheetStackItem` wants to close, BottomSheetPresenter will call `onFullyExit` to notify the stack item that the close animation has fully finished and it's safe to unmount

## Props

| Prop name  | Type                                         | Required | Default         | Description                                                                                                                                                  |
| ---------- | -------------------------------------------- | -------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `ref`      | `RefObject<BottomSheetPresenterApi \| null>` | false    | `undefined`     | The ref of the bottom sheet presenter to use BottomSheetPresenterApi                                                                                         |
| `id`       | `string`                                     | false    | `React.useId()` | The id of the bottom sheet presenter. If you want to easily access the bottom sheet presenter state from the global registry, consider define a good id here |
| `styles`   | object                                       | false    | `undefined`     | The styles of the bottom sheet presenter                                                                                                                     |
| `testID`   | string                                       | false    | `undefined`     | The test ID of the bottom sheet presenter (for testing purposes)                                                                                             |
| `children` | `ReactNode`                                  | false    | `undefined`     | The children of the bottom sheet presenter                                                                                                                   |

## Styles

```tsx
styles?: {
  root?: StyleProp<ViewStyle>
}
```

## Hook

Use `useBottomSheetPresenter` to access the presenter internal state and methods

It provides:

- `presenterHeight`: A shared value that tracks the total height of the bottom sheet presenter
- `presenterVisibleHeight`: A shared value that tracks the visible height of the bottom sheet presenter on the screen
- `presenterVisibleRatio`: A shared value that tracks the visible ratio of the bottom sheet presenter (0 means fully hidden, 1 means fully visible)

---

- `translateY`: A shared value that tracks the offset of the bottom sheet presenter from the bottom of the screen
  - `= 0`: Bottom sheet presenter is fully visible
  - `> 0`: Bottom sheet presenter is going below the bottom of the screen

## Ref methods (BottomSheetPresenterApi)

- `reshow()`:
  - Re-animates the bottom sheet presenter from hidden to fully visible
  - Useful when a sheet has been buried in the stack and needs to appear back on top via `SheetStackItemApi.putOnTop()`

## Registry

BottomSheetPresenter is automatically registered to the global registry when it mounts and unregistered when it unmounts if the global registry is available (via `BottomSheetPresenterRegistryProvider`)

You can control the registered id via the `id` prop, which defaults to `React.useId()`
