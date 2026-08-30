# BottomSheetProvider

A provider that is responsible for initiating all the internal state of the bottom sheet

Any components of the bottom sheet, including the main bottom sheet, can then access this provider to get the internal state

This provides a more flexible way to orchestrate the bottom sheet system, as you can now have multiple add-ons that can easily access the bottom sheet state without having to pass props down or stream the values up through effects and reactions

## Props

| Prop name        | Type                        | Required | Default         | Description                                                                                                                                       |
| ---------------- | --------------------------- | -------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`             | `string`                    | false    | `React.useId()` | The id of the bottom sheet provider. If you want to easily access the bottom sheet state from the global registry, consider define a good id here |
| `snapPoints`     | `AnimatedProp<SnapPoint[]>` | false    | `[]`            | The snap points of the bottom sheet. Bottom sheet will snap to these heights                                                                      |
| `enableFloat`    | `AnimatedProp<boolean>`     | false    | `false`         | Bottom sheet doesn't need to snap to provided snap points                                                                                         |
| `enableOverdrag` | `AnimatedProp<boolean>`     | false    | `false`         | Dragging beyond the highest snap point                                                                                                            |
| `disableDrag`    | `AnimatedProp<boolean>`     | false    | `false`         | Disable dragging the bottom sheet (but can still be controlled programmatically)                                                                  |
| `children`       | `ReactNode`                 | false    | `undefined`     | The children of the bottom sheet provider                                                                                                         |

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
- `isTranslateYAnimating`: A shared value that tracks whether translateY is currently being animated with `withSpring` or some other animation functions

---

- `activeScrollViewIds`: A shared value (Record<string, true>) that tracks which scroll views are currently active. The last item is the most recent active scroll view.
- `scrollViewMetadataMap`: A ref to the raw metadata store (Record<string, ScrollViewMetadata>)
- `getScrollViewMetadata(scrollViewId)`: Returns per-scroll-view metadata `{ scrollY, scrollViewHeight, scrollViewContentHeight, hasLaidOut }` for a given scroll view id
- `cleanupScrollViewMetadata(scrollViewId)`: Removes metadata entry for a given scroll view id

---

- `scrollViewRef`: A ref to the scroll view that is mainly responsible handling the intersection of pan and scroll gestures. Set by the claiming system (via `isActive` on scroll views) rather than directly by the scroll view.
- `isScrollViewInteracting`: A shared value that tracks whether the scroll view is currently scrolling
- `isPanGestureActive`: A shared value to track whether there is currently an active bottom sheet pan gesture
- `lockedScrollY`: A shared value to store the scroll y position of scroll view when we want to temporarily force the scroll view to stay at that position
- `isScrollLocked`: A shared value to track whether the scroll view is currently locked to a specific scroll y position

---

- `keyboardExpanderTargetHeight`: A shared value that tracks the target height of the keyboard expander when the keyboard is open/close
- `keyboardExpanderCurrentHeight`: A shared value that tracks the current height of the keyboard expander
- `keyboardExpanderHeightRatio`: A shared value that tracks the height ratio of the keyboard expander

Note that with Android non-edge-to-edge mode + adjustResize, keyboard expander height will not involved

As the system will already resize the bottom sheet when keyboard is open

## Safety net

If 2+ scroll views remain active for more than 3 seconds, an error is thrown. This catches cases where `isActive` is not being toggled correctly.

## Registry

BottomSheetProvider is automatically registered to the global registry when it mounts and unregistered when it unmounts if the global registry is available (via `BottomSheetRegistryProvider`)

You can control the registered id via the `id` prop, which defaults to `React.useId()`
