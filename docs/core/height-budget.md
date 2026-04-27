# Height Budget

ScrollView in React Native will act weirdly if you're not careful with the component hierarchy and bound constraints

To understand the height budget system, it's important to understand how ScrollView behaves in different scenarios, and how Yoga engine determines the layout of components based on their constraints and siblings

## Scenarios

Here are some scenarios I did:

### Case 1

```
BottomSheetPresenter (View - fixed height)
└── BottomSheet (View - no height constraint)
    └── BottomSheetHandle (View - no height constraint)
    └── BottomSheetScrollView (ScrollView - no height constraint)
```

**Behavior**: ScrollView grows normally in this case. It fits content when needed. If content is large, it will grow until it reaches (BottomSheetPresenter's fixed height - BottomSheetHandle's height), which is expected

### Case 2

```
BottomSheetPresenter (View - fixed height)
└── BottomSheet (View - no height constraint)
    └── BottomSheetHandle (View - no height constraint)
    └── View (View - no height constraint)
        └── BottomSheetScrollView (ScrollView - no height constraint)
```

**Behavior**: ScrollView grows to the full height of BottomSheetPresenter, ignoring BottomSheetHandle's height, which is not what we want

### Case 3

```
BottomSheetPresenter (View - fixed height)
└── BottomSheet (View - no height constraint)
    └── BottomSheetHandle (View - no height constraint)
    └── View (View - height: '100%')
        └── BottomSheetScrollView (ScrollView - no height constraint)
```

**Behavior**: ScrollView grows to the full height of BottomSheetPresenter, ignoring BottomSheetHandle's height, which is not what we want

### Case 4

```
BottomSheetPresenter (View - fixed height)
└── BottomSheet (View - height: '100%')
    └── BottomSheetHandle (View - no height constraint)
    └── View (View - height: '100%')
        └── BottomSheetScrollView (ScrollView - no height constraint)
```

**Behavior**: ScrollView grows to the full height of BottomSheetPresenter, ignoring BottomSheetHandle's height, which is not what we want

### Case 5

```
BottomSheetPresenter (View - fixed height)
└── BottomSheet (View - no height constraint)
    └── BottomSheetHandle (View - no height constraint)
    └── View (View - flex: 1)
        └── BottomSheetScrollView (ScrollView - no height constraint)
```

**Behavior**: ScrollView collapses to height 0, which is not what we want

### Case 6

```
BottomSheetPresenter (View - fixed height)
└── BottomSheet (View - flex: 1)
    └── BottomSheetHandle (View - no height constraint)
    └── View (View - flex: 1)
        └── BottomSheetScrollView (ScrollView - no height constraint)
```

**Behavior**:

- ScrollView always grows to the fit the remaining height of (BottomSheetPresenter's fixed height - BottomSheetHandle's height), which is what we want but with a catch

- ScrollView could no longer be dynamic sizing and fit content if content is small, because of the `flex: 1` on its parent View

## Analysis

From these scenarios, we can somewhat see 2 different modes of a node in Yoga engine:

1. Content sizing mode: The node has no known size yet

- It asks its children how big they want to be and sizes itself to fit them
- It can receive an `at-most` constraint from its parent and pass that down to its children, but it does not have a definite size that it can use to distribute space among its children

2. Definite sizing mode: The node has a known and exact size

- It does not need to rely on other nodes (siblings + children) to determine its size
- It can also distribute space effectively among its children thanks to its known size

### `flex: 1` behavior

When a node has `flex: 1`, its direct parent will do something special

The parent will perform a bottom-up pass to measure all its children's natural height

Then, it will use that total natural height together with its own height constraint to determine how much space a node with `flex: 1` should take

### ScrollView behavior

When laying out a ScrollView, from our observations, Yoga seems to look for 2 things:

- The bound height from ScrollView's **direct** parent (either definite or inherited `at-most` bound)
- ScrollView's **direct** siblings' heights (if any)

### Explanation

Now that we know the behavior of `flex: 1` and ScrollView, we can explain why ScrollView behaves the way it does in the scenarios above:

---

`Case 1`: This case works because ScrollView can find the bound height inherited from BottomSheetPresenter and also see the height of BottomSheetHandle as its direct sibling. ScrollView can effectively calculate its own height, aware of both the bound from the parent and the height of its sibling

---

`Case 2, 3, 4`: In these cases, ScrollView sees the bound height inherited from BottomSheetPresenter, but it can't see **indirect** siblings like BottomSheetHandle. So it will always expand to the full height given by BottomSheetPresenter

---

`Case 5`: In this case, `flex: 1` is special. It tells the parent to try sizing itself first before distributing the total space. So, BottomSheet tries to do a bottom-up measurement of all its children. But ScrollView needs to know the height of its parent View, which is waiting for BottomSheet to give some space. This creates a circular dependency, and ScrollView collapses to height 0

---

`Case 6`: In this case, BottomSheet doesn't care about its children. It grows to fill the BottomSheetPresenter. View also grows to fill BottomSheet, fully aware of its direct sibling (BottomSheetHandle). ScrollView relies on View and grows to fill View. But of course, you lose the ability for ScrollView to fit content when content is small, because of the `flex: 1` on View

### `fill` prop

NOTE: If you use `EmbeddedStackNavigator` (which needs `flex: 1`) with `ScrollView`, you need to be aware of the rules above

---

To make it easier, I've exposed prop `fill` for:

- `BottomSheet`
- `BottomSheetView`
- `BottomSheetScrollView`
- `BottomSheetFlatList`

Which essentially applies `flex: 1` to the component

### Summary

In general, if ScrollView is directly under `BottomSheet` and does not have any indirect siblings, you can let the component chain as-is without any bounds or contraints

If ScrollView has indirect siblings, you need to `flex: 1` all the way from the root to the parent of ScrollView

If you need dynamic sizing ScrollView with indirect siblings, continue reading!

## Dynamic sizing ScrollView with indirect siblings

What if you want to have:

1. A ScrollView that is NOT directly under BottomSheet and NOT aware of its siblings like BottomSheetHandle
2. ScrollView fits its content if content is small
3. But ScrollView could grow up to a height limit that takes into account any indirect siblings like BottomSheetHandle

Something that looks like this:

```tsx
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
```

### Solution

The good news is that it's possible. But the bad news is that it's not as trivial as simply setting style `flex: 1`

You need to measure the heights of all indirect siblings, sums them up, and manually pass down the remaining height until it reaches the direct parent of ScrollView

```tsx
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
```

### Height budget API

I've created a height budget API to solve this problem, so you don't need to have states scattering around

- The general idea is to have a `HeightBudgetProvider` to manage the total maxHeight and all the static heights along the tree
- `HeightClaim` will take a slice from maxHeight for itself
- `HeightFill` will set its own max height to be the remaining height from the provider after all claims

Congratulations! You've bypassed the limitations of Yoga and have dynamic sizing ScrollView work with indirect siblings

```tsx
const maxHeight = 600
const maxHeightShared = useSharedValue(maxHeight)

// ...

<BottomSheet styles={{ root: { maxHeight } }}>
  <HeightBudgetProvider maxHeight={maxHeightShared}>
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
```
