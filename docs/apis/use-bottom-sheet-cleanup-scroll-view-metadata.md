# useBottomSheetCleanupScrollViewMetadata

A hook used internally by scroll views to clean up their metadata when they unmount. This ensures no stale entries remain in the `scrollViewMetadataMap`.

This hook is used by `BottomSheetScrollView`, `BottomSheetFlatList`, `BottomSheetVirtualizedList`, `BottomSheetSectionList`, and `BottomSheetFlashList` internally. You generally don't need to use it directly unless you are building a custom scroll view component that integrates with the bottom sheet.

## Props

| Prop name      | Type     | Required | Default | Description                             |
| -------------- | -------- | -------- | ------- | --------------------------------------- |
| `scrollViewId` | `string` | **true** | N/A     | A unique identifier for the scroll view |
