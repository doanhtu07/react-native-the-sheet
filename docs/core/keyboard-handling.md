# Keyboard Handling

## KeyboardProvider

KeyboardProvider is highly recommended. It helps preventing bottom sheet jumping/flashing due to the root screen resizing, when the keyboard opens

Even though KeyboardProvider's docs say that you will enter `edge-to-edge` mode when wrapping your app with `KeyboardProvider`. Visually, I found that the app could still be in `non-edge-to-edge` mode if you opt out of `edge-to-edge` mode in Android config

### Expo Router in non-edge-to-edge mode

- When you use `KeyboardProvider` with Expo Router in **non-edge-to-edge** mode, you would notice double safe area insets on the default router header

- You can introduce something similar to `apps/example-expo/features/root-layout/custom-header-for-keyboard-provider.tsx` to remove the inset for the header

## Sample code

```tsx
const ManagedTextInput = forwardRef<TextInput, TextInputProps>(
  ({ onFocus: propOnFocus, onBlur: propOnBlur, ...rest }, ref) => {
    const { onFocus, onBlur } = useInputFocus()

    return (
      <TextInput
        ref={ref}
        {...rest}
        onFocus={(e) => {
          onFocus()
          propOnFocus?.(e)
        }}
        onBlur={(e) => {
          onBlur()
          propOnBlur?.(e)
        }}
      />
    )
  },
)

// ...

<Portal hostName="root">
  <SheetStackItem
    isOpen={isOpenA}
    close={() => setIsOpenA(false)}
    waitForFullyExit
    testID="sheetA"
  >
    <BottomSheetPresenter>
      <InputFocusProvider>
        <BottomSheet snapPoints={[400, 800]}>
          <BottomSheetHandle />

          <BottomSheetScrollView>
            <Text>Sheet A</Text>

            <Button title="Close Sheet A" onPress={() => setIsOpenA(false)} />

            <ManagedTextInput
              style={styles.input}
              placeholder="Type something..."
              placeholderTextColor="#999"
            />

            {renderContent()}
          </BottomSheetScrollView>
        </BottomSheet>

        <BottomSheetKeyboardExpander keyboardOffset={20} />
      </InputFocusProvider>
    </BottomSheetPresenter>
  </SheetStackItem>
</Portal>
```
