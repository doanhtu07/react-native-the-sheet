# BottomSheetInlineKeyboardExpander

```tsx
import { BottomSheetInlineKeyboardExpander } from '@the-sheet/keyboard-controller'
```

Same expansion core as `BottomSheetKeyboardExpander` (`useBottomSheetKeyboardExpand`), but for inline use inside the sheet content — e.g. as the last child of a chat composer — when focus tracking is managed by the caller.

Pick this over `BottomSheetKeyboardExpander` when the input lives in a footer/composer pinned at the bottom of the sheet and you need the whole container (input + buttons below it) lifted above the keyboard, not just the input. `BottomSheetKeyboardExpander` sits as a sibling of `BottomSheet` and reads focus from `InputFocusProvider`; this one sits inside the sheet and takes `isInputFocused` as a prop.

## Requirements

- Must be rendered inside `BottomSheet` (it uses `useBottomSheet`) and under `SheetKeyboardProvider` (it uses `useSheetKeyboard`).
- No `InputFocusProvider` needed — focus is passed explicitly via `isInputFocused`.
- Peer dependency: `react-native-keyboard-controller` (for `KeyboardController.setInputMode`).

## Placement

Render it as the last child of the container you want lifted, not as a sibling of `BottomSheet`:

```tsx
<BottomSheetProvider snapPoints={['90%']}>
  <BottomSheet>
    <BottomSheetHandle />

    <BottomSheetView fill>
      <BottomSheetScrollView fill>{/* messages */}</BottomSheetScrollView>
      <ChatComposer onSend={handleSend} />
    </BottomSheetView>
  </BottomSheet>
</BottomSheetProvider>

// Inside ChatComposer (a View pinned at the bottom of the sheet):
<View style={[styles.composer, { paddingBottom: bottomInset + 12 }]}>
  <TextInput
    onFocus={() => setIsInputFocused(true)}
    onBlur={() => setIsInputFocused(false)}
    {/* ... */}
  />

  <View style={styles.footer} onLayout={/* measure footerHeight, see below */}>
    {/* send button, disclaimer, ... */}
  </View>

  <BottomSheetInlineKeyboardExpander
    isInputFocused={isInputFocused}
    keyboardOffset={footerHeight + bottomInset + 12}
  />
</View>
```

`isInputFocused` and `keyboardOffset` accept `AnimatedProp` — a plain value or a Reanimated shared value. Plain `useState` values (as above) are fine; shared values avoid re-renders if you already track focus on the UI thread.

## Props

| Prop name        | Type                    | Required | Default | Description                                                              |
| ---------------- | ----------------------- | -------- | ------- | ------------------------------------------------------------------------ |
| `isInputFocused` | `AnimatedProp<boolean>` | true     | N/A     | Whether the input is focused. Only expands while this is `true`          |
| `keyboardOffset` | `AnimatedProp<number>`  | false    | `0`     | The offset added to expander when the keyboard is open (container delta) |

Pass the container delta (`containerBottom - inputBottom`, optionally minus the bottom inset when the expander sits above it) as `keyboardOffset`, so the whole container — not just the input — ends up above the keyboard. In the chat example above that is `footerHeight + bottomInset + COMPOSER_PADDING_BOTTOM`, where `footerHeight` is the measured height of everything below the input.

Unlike `BottomSheetKeyboardExpander`, this component does not report its height back to `BottomSheet` context (`keyboardExpanderTargetHeight` / `keyboardExpanderCurrentHeight` / `keyboardExpanderHeightRatio` stay untouched) — the spacer is local to its parent container.

## Android behavior: auto-switches to `adjustNothing` while mounted

While mounted, the component forces `adjustNothing` and restores the previous mode on unmount:

```tsx
androidWindowSoftInputMode.value = 'adjustNothing'
KeyboardController.setInputMode(SOFT_INPUT_ADJUST_NOTHING)
// on unmount: restore defaultAndroidWindowSoftInputMode + setDefaultMode()
```

So your `AndroidManifest.xml` / `SheetKeyboardProvider.defaultAndroidWindowSoftInputMode` can stay on `adjustPan` (as in the example app) — no manifest edit needed just for this screen. The override is scoped to the composer's lifetime.

Why: under `adjustPan`, the OS owns the "input just above the keyboard" invariant with minimal pan, and it re-evaluates on every layout change: when the expander lifts the input above the keyboard, Android simply reduces its pan by the same amount, canceling the expansion visually (the expander still holds its height — the lift is undone by the OS, which is why it appears for a moment and then vanishes).

Under `adjustNothing` the OS never pans or resizes, so the expander is the sole owner of the offset and `target = inputOverlap + keyboardOffset` lifts the whole container exactly above the keyboard.

## Stability note

`keyboardOffset` feeds the expander's target height on the UI thread, so it must be stable: round it and only update on real changes (e.g. `>= 1pt` delta)

Raw `onLayout` heights flicker by subpoints on every layout pass (text re-measures fractionally), and each new value retargets the expander animation — the expander will never settle

```tsx
onLayout={(e) => {
  const next = Math.round(e.nativeEvent.layout.height)
  setFooterHeight((prev) => (Math.abs(prev - next) >= 1 ? next : prev))
}}
```
