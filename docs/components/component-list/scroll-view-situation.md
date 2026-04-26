# ScrollView Situation

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
    - But ScrollView could no longer be dynamic sizing and fit content if content is small

### Yoga layout modes

In Yoga, every node is measured in one of two modes:

- Definite mode - the node has a known and exact size. It can distribute remaining space among children after accounting for all siblings.

- Indefinite (content-size) mode - the node has no known size yet. It asks children how big they want to be, and sizes itself to fit them. But it can still pass down an `atMost` constraint from its own parent.

### ScrollView behavior

From my experiments, when laying out a ScrollView, Yoga seems to look for the bound height from its parent (either definite or inherited `atMost`) and also look at its **direct** siblings

`Case 1`: This case works because ScrollView can find the bound height inherited from BottomSheetPresenter and also see the height of BottomSheetHandle as its direct sibling. ScrollView can then calculate its own height correctly

`Case 2, 3, 4`: In these cases, ScrollView sees the bound height inherited from BottomSheetPresenter, but it can't see **indirect** siblings like BottomSheetHandle. So it will just expand to the full height given by BottomSheetPresenter

`Case 5`: In this case, `flex: 1` is special. It tells the parent to try sizing itself first before distributing the remaining space. So, BottomSheet tries to do a bottom-up measurement of all its children. But ScrollView needs to know the height of its parent View (which is waiting for BottomSheet to give some remaining space) in order to fill. This creates a circular dependency, and ScrollView collapses to 0 height

`Case 6`: In this case, BottomSheet doesn't care about its children. It grows to fill the BottomSheetPresenter. View also grows to fill BottomSheet, fully aware of its direct sibling (BottomSheetHandle). ScrollView relies on View and grows to fill View

### `fill` prop

NOTE: If you use `EmbeddedStackNavigator` (which needs `flex: 1`), you need to be aware of the rules above

---

To make it easier, I've exposed prop `fill` for:

- `BottomSheet`
- `BottomSheetView`
- `BottomSheetScrollView`
- `BottomSheetFlatList`

Which essentially applies `flex: 1` to the component

### Summary

In general, if ScrollView does not need any indirect siblings, you can just let the component chain be without any bounds or contraints. But you should have a definite ceiling height from the root

If ScrollView has indirect siblings, you need to `flex: 1` all the way from the root to the parent of ScrollView

## Extreme case

What if you want to have:

1. A ScrollView that is NOT directly under BottomSheet and NOT aware of its siblings like BottomSheetHandle
2. ScrollView fits its content if content is small
3. But grows up to a height limit that takes into account any indirect siblings (BottomSheetHandle)

Something that looks like this:

```tsx
<BottomSheetPresenter>
  <BottomSheet styles={{ root: { maxHeight } }}>
    <BottomSheetHandle />

    <View>
      <BottomSheetScrollView>
        <Text>Sheet A</Text>
        <Button title="Close Sheet A" onPress={() => setIsOpenA(false)} />
        {renderContent()}
      </BottomSheetScrollView>
    </View>
  </BottomSheet>
</BottomSheetPresenter>
```

### Solution

The good news is that it's possible. But the bad news is that it's not as trivial as setting `flex: 1`

You would need to measure the heights of all indirect siblings, sums them up, and manually pass down the remaining height until it reaches the direct parent of ScrollView

```tsx
<BottomSheetPresenter>
  <BottomSheet styles={{ root: { maxHeight } }}>
    <View onLayout={(e) => setStaticContentHeight(e.nativeEvent.layout.height)}>
      <BottomSheetHandle />
    </View>

    <View style={{ maxHeight: maxHeight - staticContentHeight }}>
      <BottomSheetScrollView>
        <Text>Sheet A</Text>
        <Button title="Close Sheet A" onPress={() => setIsOpenA(false)} />
        {renderContent()}
      </BottomSheetScrollView>
    </View>
  </BottomSheet>
</BottomSheetPresenter>
```

### Height budget API

I've created a height budget API to solve this problem, so you don't need to have states scattering around

- The general idea is to have a `HeightBudgetProvider` to manage the total maxHeight and all the static heights along the tree
- `HeightClaim` will take a slice from maxHeight for itself
- `HeightFill` will set its own max height to be the remaining height from the provider after all claims

```tsx
<BottomSheetPresenter>
  <BottomSheet styles={{ root: { maxHeight } }}>
    <HeightBudgetProvider maxHeight={maxHeight}>
      <HeightClaim>
        <BottomSheetHandle />
      </HeightClaim>

      <View>
        <HeightClaim>
          <BottomSheetView>
            <Text>Sheet A</Text>
            <Button title="Close Sheet A" onPress={() => setIsOpenA(false)} />
          </BottomSheetView>
        </HeightClaim>

        <View>
          <HeightFill>
            <BottomSheetScrollView>{renderContent()}</BottomSheetScrollView>
          </HeightFill>
        </View>
      </View>
    </HeightBudgetProvider>
  </BottomSheet>
</BottomSheetPresenter>
```
