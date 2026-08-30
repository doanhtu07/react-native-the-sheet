# useBottomSheetClaimScrollViewRef

A hook used internally by scroll views to claim the main `scrollViewRef` when active. When `isActive` becomes `true`, the scroll view's native ref is forwarded to the animated ref and it is added to the `activeScrollViewIds` set. When `isActive` becomes `false`, it is removed.

This hook is used by `BottomSheetScrollView`, `BottomSheetFlatList`, `BottomSheetVirtualizedList`, `BottomSheetSectionList`, and `BottomSheetFlashList` internally. You generally don't need to use it directly unless you are building a custom scroll view component that integrates with the bottom sheet.

## Props

| Prop name             | Type                   | Required | Default | Description                                                  |
| --------------------- | ---------------------- | -------- | ------- | ------------------------------------------------------------ |
| `scrollViewId`        | `string`               | **true** | N/A     | A unique identifier for the scroll view                      |
| `scrollViewNativeRef` | `RefObject<any>`       | **true** | N/A     | A ref to the underlying native scroll view node              |
| `isActive`            | `SharedValue<boolean>` | **true** | N/A     | A shared value indicating whether this scroll view is active |
