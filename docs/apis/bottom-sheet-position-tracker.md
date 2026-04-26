# BottomSheetPositionTracker

BottomSheetPositionTracker is an effect component (doesn't render actual UI) that consumes `useBottomSheet` and passes `sheetVisibleHeight` and `sheetVisibleRatio` back

This is useful when you want to observe the bottom sheet from the parent component

## Props

| Prop name                       | Type                  | Required | Default     | Description                                         |
| ------------------------------- | --------------------- | -------- | ----------- | --------------------------------------------------- |
| `trackBottomSheetVisibleHeight` | `SharedValue<number>` | false    | `undefined` | Track the VISIBLE height of the bottom sheet        |
| `trackBottomSheetVisibleRatio`  | `SharedValue<number>` | false    | `undefined` | Track the VISIBLE ratio of the bottom sheet (0 - 1) |
