# Component List

This lists all the components available in the library and their usage hierarchy:

- `SheetStackProvider` + `PortalProvider`
  - `PortalHost`
    - `Portal`
      - `SheetStackItem`
        - `Backdrop`
        - `BottomSheetPresenter`
          - `BottomSheet`
            - `BottomSheetPositionTracker` (Effect component)
            - `BottomSheetHandle`
            - `BottomSheetView`
            - `BottomSheetScrollView`, `BottomSheetFlatList` (Could be nested under `BottomSheetView` as well)
          - `KeyboardExpander`

---

- `EmbeddedStackNavigator` (Standalone component that can be used inside anything as long as it makes sense)

## `flex: 1` note

`flex: 1` in React Native is weird...

A few observations I've seen:

---

1. If you nest `BottomSheetScrollView` / `BottomSheetFlatList` inside `BottomSheetView`, you need to apply `flex: 1` on all components along the hierarchy

- Example: `BottomSheet` -- `BottomSheetView` -- `BottomSheetScrollView`
- Else, the scroll view will not fit normally inside the bottom sheet

---

2. If you use `EmbeddedStackNavigator` (which needs `flex: 1`), you need to apply `flex: 1` on bottom sheet components as well like above

---

To make it easier, I've exposed prop `fill` for:

- `BottomSheet`
- `BottomSheetView`
- `BottomSheetScrollView`
- `BottomSheetFlatList`

Which essentially applies `flex: 1` to the component
