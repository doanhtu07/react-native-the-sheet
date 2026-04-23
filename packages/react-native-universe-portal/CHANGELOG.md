# react-native-universe-portal

## 1.0.3

### Patch Changes

- Update `Backdrop` to use `Animated.View` to allow for animated styling

- Add `BottomSheetFooter` component, which sticks to the bottom of the sheet

- Add `sheetVisibleHeight` and `sheetVisibleRatio` to `BottomSheetContext`

- Remove `useBottomSheetPositionTracker` hook, as you can now access the visible height and ratio directly from the context (⚠️ **BREAKING**)

- Add `trackBottomSheetVisibleRatio` to `BottomSheetPositionTracker`

## 1.0.2

### Patch Changes

- Add disableDrag to BottomSheet

## 1.0.1

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
