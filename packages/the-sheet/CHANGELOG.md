# @the-sheet/the-sheet

## 2.0.20

### Patch Changes

- Fix bug: Remove stack item from stack provider when stack item unmounts, so it does not cause memory leak

## 2.0.19

### Patch Changes

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

# react-native-the-sheet

## 2.0.18

### Patch Changes

- Add `BottomSheetSectionList` and `BottomSheetVirtualizedList` components

## 2.0.17

### Patch Changes

- Update type of `BackdropProps.styles.root` to `StyleProp<AnimatedStyle<ViewStyle>>`

## 2.0.16

### Patch Changes

**Examples**:

- Add example `YouTube Clone` to `example-expo` app

**Backdrop**:

- Change default background color of backdrop to #000000
- Add disabled state to backdrop (default to false)

**Hooks**:

- Export hooks:
  - `useSyncedRef`
  - `useSyncedSharedValue`
  - `useToSharedValue`
  - `useToStateValue`

**Utils**:

- Export util `isApproxEqual`

**Constants**:

- Export `SPRING_CONFIG`

**Types**:

- Rename `SheetStackItemPushBehavior` to `SHEET_STACK_ITEM_PUSH_BEHAVIOR` (⚠️ **BREAKING**)

**Bottom Sheet Hooks**:

You can use these two hooks together to lock scroll when bottom sheet is translating:

- Add `onContentSizeChange` to props of `useBottomSheetScrollViewUtils`

- `useBottomSheetScrollViewUtils` returns new properties:
  - `setScrollViewInteracting`
  - `unsetScrollViewInteracting`
  - `onContentSizeChange`

**Bottom Sheet Constants**:

- Export:
  - `TRANSLATE_Y_REST_THRESHOLD`
  - `SCROLL_Y_TOP_THRESHOLD`
  - `MICRO_FLICK_VELOCITY_THRESHOLD`
  - `FLICK_VELOCITY_THRESHOLD`

**BottomSheetProvider**:

- Rename `isScrolling` to `isScrollViewInteracting` (⚠️ **BREAKING**)
- Change type of `isScrollViewInteracting` back to boolean (⚠️ **BREAKING**)

- Add states
  - `isTranslateYAnimating`
  - `scrollViewHeight`
  - `scrollViewContentHeight`
  - `keyboardExpanderTargetHeight`
  - `keyboardExpanderCurrentHeight`
  - `keyboardExpanderHeightRatio`

**BottomSheet**:

- No longer use effect `usePanGestureLockScroll` at this level
- Lock scrolling is purely controlled by `useBottomSheetPanGesture` together with `BottomSheetScrollView` or `BottomSheetFlatList` using `useAnimatedReaction`

**BottomSheetFlatList + BottomSheetScrollView**:

- Add prop `getPanGesture`
- Take control of `onContentSizeChange`

**BottomSheetHandle + BottomSheetView**:

- Add prop `getPanGesture`, `testID`

**BottomSheetKeyboardExpander**:

- Report back `keyboardExpanderTargetHeight`, `keyboardExpanderCurrentHeight`, `keyboardExpanderHeightRatio` to context

## 2.0.15

### Patch Changes

- `onMomentumBegin` in `useBottomSheetScrollViewUtils` no longer sets scrolling, which blocks bottom sheet panning

## 2.0.14

### Patch Changes

- Make `AnimatedProp` + `SnapPoint` types public

## 2.0.13

### Patch Changes

- Introduce AnimatedProp => T | { value: T }

`BottomSheetProviderProps`

- Make `snapPoints`, `enableFloat`, `enableOverdrag`, `disableDrag` as AnimatedProp

`BottomSheetProps`

- Make `fill` as AnimatedProp

`BottomSheetViewProps`

- Make `fill` as AnimatedProp

`BottomSheetScrollViewProps`

- Make `fill` as AnimatedProp

`BottomSheetFlatListProps`

- Make `fill` as AnimatedProp

`BottomSheetKeyboardExpanderProps`

- Make `keyboardOffset` as AnimatedProp

`HeightBudgetProviderProps`

- Make `maxHeight` as AnimatedProp

`SheetKeyboardProviderProps`

- Make `androidWindowSoftInputMode` as AnimatedProp

## 2.0.12

### Patch Changes

- Fix a race condition in `BottomSheetKeyboardExpander` on iOS

## 2.0.11

### Patch Changes

**Goal of this release**: First steps to hoist internal states of bottom sheet to a global provider, which allows new patterns and better DX

- Export `useBottomSheetPanGesture`

- Export `useBottomSheetScrollViewUtils`

- Introduce required global provider for bottom sheet `BottomSheetRegistryProvider` (⚠️ **BREAKING**)

- Introduce extra layer provider for bottom sheet `BottomSheetProvider` (⚠️ **BREAKING**)

- Remove certain props from `BottomSheet` to `BottomSheetProvider` (⚠️ **BREAKING**)

- Remove `BottomSheetPositionTracker` (⚠️ **BREAKING**)

- `SheetKeyboardProvider` now requires `androidWindowSoftInputMode` to be explicitly set by user (⚠️ **BREAKING**)
  - When using Android input mode `adjustResize` + `non-edge-to-edge` + `KeyboardProvider`, set `androidWindowSoftInputMode` of `SheetKeyboardProvider` to `adjustNothing`

- Improve `BottomSheetKeyboardExpander` to work better with different combos of Android input modes, edge-to-edge, and `KeyboardProvider`

## 2.0.10

### Patch Changes

- Calculate the true safe area more accurately using frame.x and frame.y
- Also, expose `trueLeft` and `trueRight`

## 2.0.9

### Patch Changes

- Add `InputFocusProvider` to granularly observe input focus (⚠️ **BREAKING**)
- Change `maxHeight` of `HeightBudgetProvider` and `HeightBudgetContextType` to be a shared value (⚠️ **BREAKING**)
- Change `enableOverdrag` to be a shared value (⚠️ **BREAKING**)

## 2.0.8

### Patch Changes

- BottomSheetScrollViewProps has a more defined prop interface (⚠️ **BREAKING**)
  - Remove `styles` prop
- BottomSheetFlatListProps has a more defined prop interface (⚠️ **BREAKING**)
  - Remove `styles` prop

- Rename `SheetKeyboardProviderContextType` to `SheetKeyboardContextType` (⚠️ **BREAKING**)
- Rename `useSheetKeyboardProvider` to `useSheetKeyboard` (⚠️ **BREAKING**)

- Add `useHeightBudget`, `HeightBudgetProvider`, `HeightClaim`, and `HeightFill` to support for deeply nested dynamic sizing scroll views

## 2.0.7

### Patch Changes

- Refactor internal code structure

- Improve `SheetKeyboardProvider` to also listen to `keyboardWillChangeFrame` event on iOS, which detects keyboard height changes due to emoji keyboard type

- Improve `BottomSheetKeyboardExpander` to take keyboard height changes after initial height into account

## 2.0.6

### Patch Changes

- Add a requirement for `react-native-safe-area-context` + `SafeAreaProvider` (⚠️ **BREAKING**)
- Introduce and add a requirement for `SheetKeyboardProvider` (⚠️ **BREAKING**)
- Rename `KeyboardExpander` to `BottomSheetKeyboardExpander` (⚠️ **BREAKING**)
- Introduce `useTrueSafeArea` hook

- Overall, support safe area and Android edge-to-edge quirks more robustly for bottom sheet presenter, bottom sheet, and keyboard expander

## 2.0.5

### Patch Changes

- Update `KeyboardExpander` to push the input just enough to be above the keyboard, instead of pushing an amount equal to the keyboard height all the time

- Expose `keyboardOffset` prop on `KeyboardExpander` to allow users to specify an additional offset on iOS and Android depending on screen mode and layout

## 2.0.4

### Patch Changes

- Update `Backdrop` to use `Animated.View` to allow for animated styling

- Add `BottomSheetFooter` component, which sticks to the bottom of the sheet

- Add `sheetVisibleHeight` and `sheetVisibleRatio` to `BottomSheetContext`

- Remove `useBottomSheetPositionTracker` hook, as you can now access the visible height and ratio directly from the context (⚠️ **BREAKING**)

- Add `trackBottomSheetVisibleRatio` to `BottomSheetPositionTracker`

## 2.0.3

### Patch Changes

- Add disableDrag to BottomSheet

## 2.0.2

### Patch Changes

- Rename embedded stack navigator (⚠️ **BREAKING**)
  - MiniStackRoute -> EmbeddedStackRoute
  - MiniStackNavigationApi -> EmbeddedStackNavigationApi
  - MiniStackNavigationContext -> EmbeddedStackNavigationContext
  - MiniStackRouteContext -> EmbeddedStackRouteContext
  - useMiniStackNavigation -> useEmbeddedStackNavigation
  - useMiniStackRoute -> useEmbeddedStackRoute
  - useMiniStackRouteDangerously -> useEmbeddedStackRouteDangerously
  - MiniStackNavigator -> EmbeddedStackNavigator
  - StackScreen -> EmbeddedStackScreen

- EmbeddedStackNavigatorProps (NEW)
- EmbeddedStackScreenProps (NEW)
