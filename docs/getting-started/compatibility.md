# Compatibility

## Tested example stacks

The arrows for 2.x show the example app's previous stack → current stack after its Expo 58 upgrade.

| Sheet line   | Reanimated / Worklets           | Gesture Handler  | React Native    | Expo SDK |
| ------------ | ------------------------------- | ---------------- | --------------- | -------- |
| 2.x (`main`) | 4.5.1 / 0.10.1 → 4.7.1 / 0.13.0 | ~2.32.0 → ~3.3.0 | 0.86.3 → 0.88.0 | 57 → 58  |
| 1.x (`v1`)   | ~3.17.5 / N/A                   | ~2.24.0          | 0.79.6          | 53       |

Sheet 2.x was developed and worked with Gesture Handler 2. The recent Expo upgrade moved its example app to Gesture Handler 3; the sheet still uses the gesture-builder API (`Gesture.Pan()`), which Gesture Handler 3 deprecates but retains. This does not represent a deliberate drop of Gesture Handler 2 support or a migration to `usePanGesture`.

These are example stacks, not exhaustive version bounds. For other combinations, check the [Reanimated 4](https://docs.swmansion.com/react-native-reanimated/docs/4.x/guides/compatibility/) or [Reanimated 3](https://docs.swmansion.com/react-native-reanimated/docs/3.x/guides/compatibility/) compatibility table and use Expo's recommended package versions.

## Core dependencies

If confused, check `apps/example-expo/package.json` to see the versions of the core dependencies we use in our example Expo app

---

`react-native-reanimated`

- Defines our package major version => Other dependencies (React, React Native, ...) must be compatible with it
- Check the compatibility table for [Reanimated 4](https://docs.swmansion.com/react-native-reanimated/docs/4.x/guides/compatibility/) or [Reanimated 3](https://docs.swmansion.com/react-native-reanimated/docs/3.x/guides/compatibility/)

---

`react-native-worklets`

- Required by the-sheet 2.x with Reanimated 4; follows Reanimated compatibility

---

`react-native-gesture-handler`

- See the example stacks above; 2.x supports the builder API used by Gesture Handler 2 and currently runs against Gesture Handler 3 in the Expo 58 example

---

`react-native`

- Defines React version
- Check React Native compatibility through its package.json
  - Example: [package.json](https://github.com/facebook/react-native/blob/v0.85.0/package.json)

---

`react`

- Follows React Native compatibility

---

`expo`

- Manages React Native version and some other dependencies (including Reanimated)
- Check compatibility table: [Compatibility Table](https://docs.expo.dev/versions/latest/)

Note: You can use `apps/example-expo/scripts/expo-packages-check.ts` to check the packages Expo manages

- Go to `apps/example-expo`
- Run `pnpm epc <expo-sdk-version>` (e.g. `pnpm epc 56`)

---

`react-native-safe-area-context`

- Anything is fine as long as it has:
  - `SafeAreaProvider` component
  - `useSafeAreaInsets` hook
  - `useSafeAreaFrame` hook

---

`typescript`

- Anything is fine as long as it works with React Native
