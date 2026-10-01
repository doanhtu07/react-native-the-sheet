# @the-sheet/keyboard-controller

## 1.1.0

### Minor Changes

**New package: `@the-sheet/keyboard-controller`**

- Adds `BottomSheetInlineKeyboardExpander` for `react-native-keyboard-controller` users (chat-composer style sheets); on Android it temporarily forces `adjustNothing` while mounted and restores the default mode on unmount
- Peer deps: `react`, `react-native`, `react-native-reanimated`, `react-native-keyboard-controller`

**`@the-sheet/the-sheet`**

- ⚠️ **BREAKING (shipped as minor — update your code):** `SheetKeyboardProvider` prop `androidWindowSoftInputMode: AnimatedProp<...>` is renamed to `defaultAndroidWindowSoftInputMode: adjustResize | adjustPan | adjustNothing` (plain value). `androidWindowSoftInputMode` remains as a mutable shared value in context, initialized from the new prop
  - Migration: `<SheetKeyboardProvider androidWindowSoftInputMode={...}>` → `<SheetKeyboardProvider defaultAndroidWindowSoftInputMode={...}>`
- Extracts keyboard-expander logic into a new public hook `useBottomSheetKeyboardExpand({ isInputFocused, keyboardOffset })` (returns `{ targetHeight, currentHeight }`); `BottomSheetKeyboardExpander` is now a thin wrapper with no behavior change

### Patch Changes

- Updated dependencies
  - @the-sheet/the-sheet@1.1.0
