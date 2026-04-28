# BottomSheetProvider

A provider that is responsible for initiating all the internal state of the bottom sheet

Any components of the bottom sheet, including the main bottom sheet, can then access this provider to get the internal state

This provides a more flexible way to orchestrate the bottom sheet system, as you can now have multiple add-ons that can easily access the bottom sheet state without having to pass props down or stream the values up through effects and reactions

## Props

| Prop name        | Type          | Required | Default         | Description                                                                                                                                       |
| ---------------- | ------------- | -------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`             | `string`      | false    | `React.useId()` | The id of the bottom sheet provider. If you want to easily access the bottom sheet state from the global registry, consider define a good id here |
| `snapPoints`     | `SnapPoint[]` | false    | `[]`            | The snap points of the bottom sheet. Bottom sheet will snap to these heights                                                                      |
| `enableFloat`    | `boolean`     | false    | `false`         | Bottom sheet doesn't need to snap to provided snap points                                                                                         |
| `enableOverdrag` | `boolean`     | false    | `false`         | Dragging beyond the highest snap point                                                                                                            |
| `disableDrag`    | `boolean`     | false    | `false`         | Disable dragging the bottom sheet (but can still be controlled programmatically)                                                                  |
| `children`       | `ReactNode`   | false    | `undefined`     | The children of the bottom sheet provider                                                                                                         |

### SnapPoint

Supports two formats:

- `number`: The snap point in pixels
- `number%`: The snap point in percentage of screen height

### enableOverdrag

Requires `snapPoints` to be provided

## Hook

Use `useBottomSheet` to access the bottom sheet provider state

It provides:

- `enableFloat`: Passed from props
- `enableOverdrag`: Passed from props
- `disableDrag`: Passed from props

---

- `sheetHeight`: A shared value that tracks the total height of the bottom sheet
- `sheetVisibleHeight`: A shared value that tracks the visible height of the bottom sheet on the screen
- `sheetVisibleRatio`: A shared value that tracks the visible ratio of the bottom sheet (0 means fully hidden, 1 means fully visible)

---

- `normalizedSnaps`: A shared value that stored the normalized snap points in pixels calculated from the provided snap points (which can be in percentage or pixels)
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

- `isPanGestureActive`: A shared value to track whether there is currently an active bottom sheet pan gesture
- `lockedScrollY`: A shared value to store the scroll y position of scroll view when we want to temporarily force the scroll view to stay at that position
- `isScrollLocked`: A shared value to track whether the scroll view is currently locked to a specific scroll y position
