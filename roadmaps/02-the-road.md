# Chapter 2: The Road

- [x] Introduce HeightBudgetProvider, HeightConsumer, HeightBudgetConsumer API
  - To solve the extreme problem with ScrollView nested deeply in the tree but still wants dynamic sizing behavior

  ***

- [x] Fix styling prop interface for ScrollView and FlatList
  - `styles`, `style`, and `contentContainerStyle` are not consistent

---

- [x] Note a rule for component design
  - Make all props to be like in Skia (except the ones related directly to render conditions, such as those in `SheetStackItem`)

```tsx
type AnimatedProp<T> = T | { value: T }

type AnimatedProps<T, O extends keyof T | never = never> = {
  [K in keyof T]: K extends 'children'
    ? T[K]
    : K extends O
      ? T[K]
      : AnimatedProp<T[K]>
}

type SkiaProps<P = object, O extends keyof P | never = never> = AnimatedProps<
  P,
  O
>
```

---

- [x] Template patterns
  - Encourage users to create a reusable template for their sheets
  - Easier to maintain, migrate, and update what features they want to use

---

- [x] Create YouTube clone

Need to handle image scaling a little differently (Support for both vertically fit and horizontally fit)

To support that, we need:

- maxTranslate = initialImageTop - topInset
- dockSheetTop = topInset + imageHeight
- requiredSheetTravel = collapsedSheetTop - dockSheetTop

- progress = clamp(sheetTravel / requiredSheetTravel, 0, 1)
- translateY = -progress \* maxTranslate

---

- [x] Support for VirtualizedList + SectionList
- [x] Support for FlashList

---

- [x] Add a mechanism to swap a sheet stack item to the top and re-present (like on YouTube iPad)

---

- [ ] Introduce bottom sheet presenter registry
- [ ] Introduce bottom sheet presenter: presenterVisibleHeight, presenterVisibleRatio
- [ ] Make registry providers optional

---

- [ ] A different type of keyboard expander that works based on `react-native-keyboard-controller`
  - Why? Because on Android, this will provide a more accurate behavior for keyboard expander, especially if the keyboard changes height due to emoji, GIF, or other panels

---

- [ ] Example with iOS glass effect

---

- [ ] Create Google clone
- [ ] Create Instagram clone
