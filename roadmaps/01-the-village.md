## Chapter 1: The Village

- [ ] Support both Reanimated v3 and v4
  - [ ] Reanimated compat export layer

---

- [x] Embedded stack navigator

---

- [x] Portal
  - Support for isolated host

---

- [x] Sheet stack provider
  - Actions: push, pop, remove

- [x] Sheet stack item
  - Behavior: push, switch, replace
  - z-index based on index in provider stack
  - Always open at 100%, no animation at all
  - [x] Ref API: Hide, present

---

- [x] Backdrop

---

- [x] Bottom sheet presenter
  - Open: Always slide from 0% to 100%
    - This solves the problem of bottom sheet dynamic sizing
  - Close: Always slide from 100% to 0%
    - Can signal sheet stack item to unmount when close animation finishes

- [x] Bottom sheet
  - [x] Free movement
  - [x] Snap points
  - [x] Float mode
    - Does not strictly require snap points
    - Can be dragged anywhere
    - Could go beyond max snap point if used with overdrag snap mode
  - [x] Overdrag snap mode
    - Need at least 1 snap point
    - Allow overdragging beyond the max snap point
  - [x] Ref API: snap to index, snap to position

- [x] Bottom sheet handle
  - Drag to move bottom sheet
  - Gesture to close bottom sheet

- [x] Bottom sheet view
  - The whole view handles pan gesture + animate bottom sheet position

- [x] Bottom sheet scroll view
  - Handle pan gesture for both scrolling and moving bottom sheet
  - Note: Use only one main bottom sheet scroll view per bottom sheet, which is responsible for syncing the pan gesture
    - You can still have nested normal scroll views inside this bottom sheet scroll view

- [x] Bottom sheet flat list
  - Similar to bottom sheet scroll view

---

- [x] Above bottom sheet view example
  - Uses BottomSheetPositionTracker (which calculates the visible height of bottom sheet, not taking into account the keyboard)

---

- [x] Keyboard expander
  - Get keyboard height and animate expanding/shrinking height gradually
  - Conditions to disable expanding
    - Maybe the input position is already higher than the keyboard height?
