# useBottomSheetPanGestureWithLockScroll

A hook that returns a pan gesture factory that locks scrolling in place with you drag the bottom sheet

Of course, when you intend to scroll, it will unlock the scroll and let you scroll normally

You can pass this pan gesture factory to all `getPanGesture` prop of the bottom sheet components:

- `BottomSheetHandle`
- `BottomSheetView`
- `BottomSheetScrollView`
- `BottomSheetFlatList`
