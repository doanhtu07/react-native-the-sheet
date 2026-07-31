# @the-sheet/flash-list

## 1.0.23

### Patch Changes

- Updated dependencies
  - @the-sheet/the-sheet@1.0.23

---

- Remove redundant code in BottomSheetKeyboardExpander

## 1.0.22

### Patch Changes

- Updated dependencies
  - @the-sheet/the-sheet@1.0.22

#### Changes only in `@the-sheet/embedded-stack-navigator`

- Add `react-native-reanimated` as a peer dependency (⚠️ **BREAKING**)

---

- Remove `SLIDE_DURATION_MS`. Instead, sliding animation is done through new combo `withSpring` + `SPRING_CONFIG` (⚠️ **BREAKING**)

---

- Add new value for `transitionType` = `none`

---

- Add `animateDynamicHeight` prop to control whether the height of the stack navigator should animate when the content height changes. Defaults to `true`

---

- Add `fill` prop to control whether the stack navigator should fill the parent container. Defaults to `false` (⚠️ **BREAKING**)

  - Before, the stack navigator would always fill the parent container, but now it will only do so if `fill` is set to `true`

---

- Add `styles` prop to override some stylings in the stack navigator

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
