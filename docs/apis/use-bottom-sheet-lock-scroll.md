# useBottomSheetLockScroll

A hook used internally by scroll views to lock scroll position. When the scroll view is active and the scroll is locked, it forces the scroll position back to the locked position if it drifts (e.g. due to momentum scrolling). Works together with the panning gesture orchestration.

This hook is used by `BottomSheetScrollView`, `BottomSheetFlatList`, `BottomSheetVirtualizedList`, `BottomSheetSectionList`, and `BottomSheetFlashList` internally. You generally don't need to use it directly unless you are building a custom scroll view component that integrates with the bottom sheet.

## Props

| Prop name      | Type                   | Required | Default | Description                                                  |
| -------------- | ---------------------- | -------- | ------- | ------------------------------------------------------------ |
| `scrollViewId` | `string`               | **true** | N/A     | A unique identifier for the scroll view                      |
| `isActive`     | `SharedValue<boolean>` | **true** | N/A     | A shared value indicating whether this scroll view is active |
