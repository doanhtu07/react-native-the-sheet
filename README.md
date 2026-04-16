# react-native-the-sheet

This is the sheet for React Native

## Roadmap

- [x] Embedded stack navigator

- [x] Portal
  - Support for isolated host

- [x] Sheet stack provider
  - Actions: push, pop, remove

- [x] Sheet stack item
  - Behavior: push, switch, replace
  - z-index based on index in provider stack
  - Always open at 100%, no animation at all

- [x] Backdrop

- [x] Bottom sheet presenter
  - Open: Always slide from 0% to 100%
    - This solves the problem of bottom sheet dynamic sizing
  - Close: Always slide from 100% to 0%
    - Can signal sheet stack item to unmount when close animation finishes

- [ ] Bottom sheet
  - Implements sheet interface
  - Snap points
  - Free movement
  - Hide, present, snap to index, move to position

# Maintenance

## Global dependency versions

Keep these dependency versions when updating dependencies in packages:

- react: 19.2.0
- react-native: 0.83.4

## Resources

- [Create React Native Module](./docs/create-react-native-module.md)
- [React Native Module Codegen](./docs/react-native-module-codegen.md)
