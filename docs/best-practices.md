# Best Practices

## Templates

Because the library is an ecosystem of multiple components, it's best to create a reusable template of components and features that you want to use across your app.

This way, you can maintain and update the features much easier. It also creates a consistent experience for your app.

You can check out one template example at `apps/example-expo/components/bottom-sheet-template/bottom-sheet-template.tsx`. This template supports multiple features out of the box, such as:

- Sheet ID for you to override if needed
- Backdrop that animates opacity
- Input focus handling provider (You just need to adjust your input components to use the provided `onFocus` and `onBlur` handlers)
- Snap points / Max height
- Height budget system (You still need to use `HeightClaim` and `HeightFill` in your own children content properly)
- Header left / center / right
- Close button
- Action buttons (Not sticky footer though)

## Worklets and Object.freeze

Reanimated deep-freezes every plain object reachable from a captured closure when a worklet captures a value. This means if you capture the entire bottom sheet context (from `useBottomSheet`) inside a worklet (e.g. `useAnimatedStyle`), Reanimated will freeze the entire object graph — including any mutable refs.

**The problem**: If a `useRef` holding mutable data lives on the main sheet context, a consumer worklet that captures the context will freeze that ref. Subsequent writes silently no-op, causing `undefined` errors (e.g. `"Cannot read property 'hasLaidOut' of undefined"`).

**The workaround**: Don't throw the whole sheet context into a worklet. Access only the specific shared values you need:

```tsx
// Bad — captures entire context, triggers deep-freeze
const sheet = useBottomSheet()
useAnimatedStyle(() => {
  return {
    opacity: sheet.sheetVisibleRatio.value,
  }
})

// Good — only captures the specific shared value
const { sheetVisibleRatio } = useBottomSheet()
useAnimatedStyle(() => {
  return {
    opacity: sheetVisibleRatio.value,
  }
})
```
