# @the-sheet/flash-list

## 2.0.25

### Patch Changes

- Updated dependencies
  - @the-sheet/the-sheet@2.0.25

---

#### Scroll views

**Introduce `isActive` prop to all scroll views** (🐛 **Bug Fix**)

- Only one scroll view should control the bottom sheet height at a time
- When navigating between screens inside a bottom sheet (via React Navigation or an embedded stack navigator), the previous screen's scroll view stays mounted while the new screen's scroll view mounts — both fight for the main `scrollViewRef`
- This prop lets you explicitly tell the bottom sheet which scroll view is active. Drive it from your navigation state (e.g. `isFocused`)

Applies to: `BottomSheetScrollView`, `BottomSheetFlatList`, `BottomSheetVirtualizedList`, `BottomSheetSectionList`, `BottomSheetFlashList`, `BottomSheetFlashList` (v2)

---

**You can now pass `ref` to all scroll views**

- `BottomSheetScrollView` forwards `ref<ScrollView>`
- `BottomSheetFlatList` forwards `ref<FlatList<T>>`
- `BottomSheetVirtualizedList` forwards `ref<VirtualizedList<T>>`
- `BottomSheetSectionList` forwards `ref<SectionList<T>>`
- `BottomSheetFlashList` / `BottomSheetFlashList` (v2) forwards `ref<FlashListRef<T>>`

You can still use `scrollViewRef` from `useBottomSheet()` to access whichever scroll view is currently active — it's now set by the claiming system rather than directly by the scroll view.

---

**Introduce a few hooks for scroll views:**

- `useBottomSheetClaimScrollViewRef` — used by scroll views to claim the main `scrollViewRef` when active
- `useBottomSheetCleanupScrollViewMetadata` — used by scroll views to clean up their metadata on unmount
- `useBottomSheetLockScroll` — used by scroll views to lock scroll position (works together with the panning gesture orchestration)

---

**`useBottomSheetScrollViewUtils` now requires `scrollViewId`** (⚠️ **BREAKING**)

- Pass a unique `scrollViewId` (e.g. from `useId()`) so metadata is tracked per scroll view

---

**Remove `isScrollViewReady`, `scrollY`, `scrollViewHeight`, `scrollViewContentHeight` from `useBottomSheet()`** (⚠️ **BREAKING**)

- Replaced with per-scroll-view metadata accessed via:
  - `activeScrollViewIds` — which scroll views are currently active (last item = most recent)
  - `getScrollViewMetadata(id)` — returns `{ scrollY, scrollViewHeight, scrollViewContentHeight, hasLaidOut }` for a given scroll view
  - `cleanupScrollViewMetadata(id)` — removes metadata entry
  - `scrollViewMetadataMap` — raw ref to the metadata store

---

**Safety net: timeout for stale active scroll views**

- If 2+ scroll views remain active for more than 3 seconds, an error is thrown
- This catches cases where `isActive` is not being toggled correctly

---

#### Height claims

**Introduce `isActive` prop to `HeightClaim`** (🐛 **Bug Fix**)

- Similar to the scroll view `isActive` prop
- Height claims from inactive screens no longer contribute to the height fill calculation

---

**Expose `activeClaimIds` from `useHeightBudget()`**

- Which height claims are currently active

---

#### Developer experience

**Improved error messages**

- All error messages now include the file path (e.g. `@the-sheet/the-sheet - src/core/bottom-sheet/bottom-sheet-provider.tsx - useBottomSheet must be used within a BottomSheetProvider`)
- Makes it easier to trace where an error originates

## 2.0.24

### Patch Changes

- Updated dependencies
  - @the-sheet/the-sheet@2.0.24

---

- Remove redundant code in BottomSheetKeyboardExpander

## 2.0.23

### Patch Changes

- Updated dependencies
  - @the-sheet/the-sheet@2.0.23

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

## 2.0.22

### Patch Changes

- Updated dependencies
  - @the-sheet/the-sheet@2.0.22

---

- Make `BottomSheetRegistryProvider` optional
- Add `useBottomSheetRegistryDangerously`

- Add `BottomSheetPresenterRegistryProvider` (also optional)
- Add `useBottomSheetPresenterRegistry` and `useBottomSheetPresenterRegistryDangerously`

- Add `id` prop to `BottomSheetPresenter` for registry lookups
- Add `presenterHeight`, `presenterVisibleHeight`, and `presenterVisibleRatio` to `BottomSheetPresenterContextType`

- Skips sheet/presenter's visible height and ratio computation when sheet/presenter's height is 0, which prevents NaN cases

## 2.0.21

### Patch Changes

- Updated dependencies
  - @the-sheet/the-sheet@2.0.21

---

- Expose API `putOnTop` on `SheetStackItem`
- Expose API `reshow` on `BottomSheetPresenter`

## 2.0.20

### Patch Changes

- Updated dependencies
  - @the-sheet/the-sheet@2.0.20

---

- Fix bug: Remove stack item from stack provider when stack item unmounts, so it does not cause memory leak

## 2.0.19

### Patch Changes

- Updated dependencies
  - @the-sheet/the-sheet@2.0.19

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
