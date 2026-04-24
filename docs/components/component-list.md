# Component List

This lists all the components available in the library and their usage hierarchy:

- `SafeAreaProvider` (Required) + `KeyboardProvider` (Recommended)
  - `SheetKeyboardProvider` + `SheetStackProvider` + `PortalProvider`
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
              - `BottomSheetFooter`
            - `BottomSheetKeyboardExpander`

- `useTrueSafeArea` (A useful hook that combines `useSafeAreaInsets`, `useSafeAreaFrame`, and `useWindowDimensions` to give you the "true" safe area)

- `useSheetKeyboardProvider` (A hook to get some keyboard states from `SheetKeyboardProvider`)

- `useSheetStack` (A hook to monitor and manipulate the sheet stack from `SheetStackProvider`)

- `usePortalHosts` (A hook to monitor portal hosts from `PortalProvider`)

- `useSheetStackItem` (A hook to monitor and manipulate the current sheet stack item from `SheetStackItem`)

- `useBottomSheetPresenter` (A hook to monitor and manipulate the current bottom sheet presenter from `BottomSheetPresenter`)

- `useBottomSheet` (A hook to monitor and manipulate the current bottom sheet from `BottomSheet`)

---

- `EmbeddedStackNavigator` (Standalone component that can be used inside anything as long as it makes sense)

## `flex: 1` issue

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

## KeyboardProvider notes

### Super recommended

KeyboardProvider is recommended

It helps preventing bottom sheet jumping/flashing due to the root screen resizing, when the keyboard opens

Even though its docs say that you will enter `edge-to-edge` mode when wrapping your app with `KeyboardProvider`

- Visually, I found that the app could still be in `non-edge-to-edge` mode if you opt out of `edge-to-edge` mode in Android config
- Really weird... But yeah

### KeyboardProvider with Expo Router in non-edge-to-edge mode

NOTE:

- When you use `KeyboardProvider` with Expo Router in **non-edge-to-edge** mode, you would notice double safe area insets on the default router header

- You can introduce something similar to `apps/example-expo/features/root-layout/custom-header-for-keyboard-provider.tsx` to remove the inset for the header
