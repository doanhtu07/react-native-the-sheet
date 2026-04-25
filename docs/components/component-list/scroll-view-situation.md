# ScrollView situation

ScrollView in React Native will act weirdly if you're not careful with the component hierarchy and bound constraints

## Experiments

Here are some experiments I did:

- Case 1: `BottomSheetPresenter` > `BottomSheet` > (`BottomSheetHandle` + `BottomSheetScrollView`)
  - Bounds:
    - BottomSheetPresenter has fixed height
    - BottomSheet is unconstrained
    - BottomSheetScrollView is unconstrained
  - ScrollView will work as expected in this case, aware of its siblings

- Case 2: `BottomSheetPresenter` > `BottomSheet` > (`BottomSheetHandle` + `View` > `BottomSheetScrollView`)
  - Bounds:
    - BottomSheetPresenter has fixed height
    - BottomSheet is unconstrained
    - View is unconstrained
    - BottomSheetScrollView is unconstrained
  - ScrollView will expand until 100% of the root fixed height, ignoring its parent's siblings

- Case 3: `BottomSheetPresenter` > `BottomSheet` > (`BottomSheetHandle` + `View` > `BottomSheetScrollView`)
  - Bounds:
    - BottomSheetPresenter has fixed height
    - BottomSheet is unconstrained
    - View has `height: '100%'`
    - BottomSheetScrollView is unconstrained
  - ScrollView will expand until 100% of the root fixed height, ignoring its parent's siblings

- Case 4: `BottomSheetPresenter` > `BottomSheet` > (`BottomSheetHandle` + `View` > `BottomSheetScrollView`)
  - Bounds:
    - BottomSheetPresenter has fixed height
    - BottomSheet has `height: '100%'`
    - View has `height: '100%'`
    - BottomSheetScrollView has `height: '100%'`
  - ScrollView will expand until 100% of the root fixed height, ignoring its parent's siblings

- Case 5: `BottomSheetPresenter` > `BottomSheet` > (`BottomSheetHandle` + `View` > `BottomSheetScrollView`)
  - Bounds:
    - BottomSheetPresenter has fixed height
    - BottomSheet is unconstrained
    - View has `flex: 1`
    - BottomSheetScrollView is unconstrained
  - ScrollView will collapse to 0 height in this case

- Case 6: `BottomSheetPresenter` > `BottomSheet` > (`BottomSheetHandle` + `View` > `BottomSheetScrollView`)
  - Bounds:
    - BottomSheetPresenter has fixed height
    - BottomSheet has `flex: 1`
    - View has `flex: 1`
    - BottomSheetScrollView is unconstrained
  - ScrollView will work as expected in this case, aware of its siblings

## Yoga layout modes

In Yoga, every node is measured in one of two modes:

- Definite mode - the node has a known, exact size. It can distribute remaining space among children after accounting for all siblings.

- Indefinite (content-size) mode - the node has no known size yet. It asks children how big they want to be, and sizes itself to fit them. But it can still pass down an `atMost` constraint from its own parent.

## ScrollView behavior

When laying out a ScrollView, Yoga will look for the bound height from its parent (either definite or inherited `atMost`) and also look at its **direct** siblings

`Case 1`: This case works because ScrollView can find the bound height inherited from BottomSheetPresenter and also see the height of BottomSheetHandle as its direct sibling. ScrollView can then calculate its own height correctly

`Case 2, 3, 4`: In these cases, ScrollView sees the bound height inherited from BottomSheetPresenter, but it can't see **indirect** siblings like BottomSheetHandle. So it will just expand to the full height given by BottomSheetPresenter

`Case 5`: In this case, `flex: 1` is special, because they don't care about inherited `atMost` bound from parent. The direct parent needs explicit constraint. Because BottomSheet is unconstrained, View needs to rely entirely on its children. But its child (ScrollView) is relying on View to provide some bounds. This circular dependency causes ScrollView to collapse to 0 height, leading to the parent View to also collapse to 0 height

`Case 6`: In this case, BottomSheet doesn't care about its children. It grows to fill the BottomSheetPresenter. View also grows to fill BottomSheet, fully aware of its direct sibling (BottomSheetHandle). ScrollView relies on View and grows to fill View

## `fill` prop

NOTE: If you use `EmbeddedStackNavigator` (which needs `flex: 1`), you need to be aware of the rules above

---

To make it easier, I've exposed prop `fill` for:

- `BottomSheet`
- `BottomSheetView`
- `BottomSheetScrollView`
- `BottomSheetFlatList`

Which essentially applies `flex: 1` to the component

## Summary

In general, if ScrollView does not need any indirect siblings, you can just let the component chain be without any bounds or contraints. But you should have a definite ceiling height from the root

If ScrollView has indirect siblings, you need to `flex: 1` all the way from the root to the parent of ScrollView
