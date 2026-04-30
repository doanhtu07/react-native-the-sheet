# Chapter 2: The Road

- [x] Introduce HeightBudgetProvider, HeightConsumer, HeightBudgetConsumer API
  - To solve the extreme problem with ScrollView nested deeply in the tree but still wants dynamic sizing behavior

- [x] Fix styling prop interface for ScrollView and FlatList
  - `styles`, `style`, and `contentContainerStyle` are not consistent

- [ ] Optimize global providers to not have any React states
  - Use shared values instead
  - Avoid re-render when changing the state of the provider

- [ ] Template patterns
  - Encourage users to create a reusable template for their sheets
  - Easier to maintain, migrate, and update what features they want to use

- [ ] Create more examples: YouTube + Instagram

- [ ] Support for FlashList + LegendList

- [ ] A different type of keyboard expander that works based on `react-native-keyboard-controller`
  - Why? Because on Android, this will provide a more accurate behavior for keyboard expander, especially if the keyboard changes height due to emoji, GIF, or other panels
