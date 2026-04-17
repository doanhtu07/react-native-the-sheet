## Roadmap: The Village

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

---

- [x] Backdrop

---

- [x] Bottom sheet presenter
  - Open: Always slide from 0% to 100%
    - This solves the problem of bottom sheet dynamic sizing
  - Close: Always slide from 100% to 0%
    - Can signal sheet stack item to unmount when close animation finishes

- [ ] Bottom sheet
  - [x] Free movement
  - [ ] Snap points
  - [ ] Hide, present, snap to index, move to position

- [x] Bottom sheet handle
  - Drag to move bottom sheet
  - Gesture to close bottom sheet

- [ ] Bottom sheet scroll view

- [ ] Bottom sheet flat list

---

- [ ] Keyboard view
  - Get keyboard height and animate expanding/shrinking height gradually
