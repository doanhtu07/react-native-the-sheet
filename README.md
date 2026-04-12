# react-native-the-sheet

This is the sheet for React Native

## Roadmap

- [x] Embedded stack navigator

- [x] Portal
  - Support for isolated host

- [ ] Provider sheet stack
  - Push, switch, replace

- [ ] Sheet stack item
  - Own z-index, based on index in provider stack
  - Always open at 100%, no animation at all
  - Backdrop

- [ ] Sheet container
  - Sheet interface
    - Signal close
  - Open: Always slide from 0% to 100%
    - This hopefully solves the problem of bottom sheet dynamic sizing
  - Close: Wait for sheet interface signal close
    - Unmount + Close clean up

- [ ] Bottom sheet
  - Implements sheet interface
  - Snap points
  - Free movement
  - Hide, present, snap to index, move to position
