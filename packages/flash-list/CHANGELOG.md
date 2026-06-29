# @the-sheet/flash-list

## 1.0.21

### Patch Changes

- Updated dependencies
  - @the-sheet/the-sheet@1.0.21

---

- Make `BottomSheetRegistryProvider` optional
- Add `useBottomSheetRegistryDangerously`

- Add `BottomSheetPresenterRegistryProvider` (also optional)
- Add `useBottomSheetPresenterRegistry` and `useBottomSheetPresenterRegistryDangerously`

- Add `id` prop to `BottomSheetPresenter` for registry lookups
- Add `presenterHeight`, `presenterVisibleHeight`, and `presenterVisibleRatio` to `BottomSheetPresenterContextType`

- Skips sheet/presenter's visible height and ratio computation when sheet/presenter's height is 0, which prevents NaN cases

## 1.0.20

### Patch Changes

- Updated dependencies
  - @the-sheet/the-sheet@1.0.20

---

- Expose API `putOnTop` on `SheetStackItem`
- Expose API `reshow` on `BottomSheetPresenter`

## 1.0.19

### Patch Changes

- Updated dependencies
  - @the-sheet/the-sheet@1.0.19

---

- Fix bug: Remove stack item from stack provider when stack item unmounts, so it does not cause memory leak

## 1.0.18

### Patch Changes

- Updated dependencies
  - @the-sheet/the-sheet@1.0.18

---

- Rename `react-native-embedded-stack-navigator` to `@the-sheet/embedded-stack-navigator` (⚠️ **BREAKING**)

- Rename `react-native-universe-portal` to `@the-sheet/universe-portal` (⚠️ **BREAKING**)

- Rename `react-native-the-sheet` to `@the-sheet/the-sheet` (⚠️ **BREAKING**)

---

- Remove `ScrollViewRefCore` (⚠️ **BREAKING**)

- Make type of `scrollViewRef` more general: `AnimatedRef<any>`
  - Users can cast it to more specific types when used

---

- Add support for `@shopify/flash-list` - `BottomSheetFlashList`
  - `@the-sheet/flash-list` for `@shopify/flash-list@1.x`
  - `@the-sheet/flash-list-v2` for `@shopify/flash-list@2.x`
