# react-native-embedded-stack-navigator

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
