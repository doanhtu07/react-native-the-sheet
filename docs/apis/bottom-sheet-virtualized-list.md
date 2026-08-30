# BottomSheetVirtualizedList

BottomSheetVirtualizedList is an `AnimatedVirtualizedList` (created via `Animated.createAnimatedComponent(VirtualizedList)`) that is wrapped by a gesture detector to work with the bottom sheet's pan gesture.

## Props

Inherits all props of `AnimatedVirtualizedList`, except for the following overriden props:

| Prop name             | Type                                 | Required | Default     | Description                                                                                                                    |
| --------------------- | ------------------------------------ | -------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `fill`                | `AnimatedProp<boolean>`              | false    | `false`     | Whether the bottom sheet scroll view should fill the available height (applies `flex: 1`)                                      |
| `isActive`            | `AnimatedProp<boolean>`              | false    | `true`      | Whether this scroll view is the active one controlling the bottom sheet height. Drive from navigation state (e.g. `isFocused`) |
| `getPanGesture`       | `() => PanGesture`                   | false    | `undefined` | The custom pan gesture factory                                                                                                 |
| `onLayout`            | `(e: LayoutChangeEvent) => void`     | false    | `undefined` | The onLayout callback of the bottom sheet scroll view                                                                          |
| `onContentSizeChange` | `(w: number, h: number) => void`     | false    | `undefined` | The onContentSizeChange callback of the bottom sheet scroll view                                                               |
| `onTouchStart`        | `(e: GestureResponderEvent) => void` | false    | `undefined` | The onTouchStart callback of the bottom sheet scroll view                                                                      |
| `onTouchEnd`          | `(e: GestureResponderEvent) => void` | false    | `undefined` | The onTouchEnd callback of the bottom sheet scroll view                                                                        |
| `onScroll`            | `ScrollHandler`                      | false    | `undefined` | The onScroll callback of the bottom sheet scroll view, wrapped by Reanimated's `useAnimatedScrollHandler`                      |
| `onBeginDrag`         | `ScrollHandler`                      | false    | `undefined` | The onBeginDrag callback of the bottom sheet scroll view, wrapped by Reanimated's `useAnimatedScrollHandler`                   |
| `onEndDrag`           | `ScrollHandler`                      | false    | `undefined` | The onEndDrag callback of the bottom sheet scroll view, wrapped by Reanimated's `useAnimatedScrollHandler`                     |
| `onMomentumBegin`     | `ScrollHandler`                      | false    | `undefined` | The onMomentumBegin callback of the bottom sheet scroll view, wrapped by Reanimated's `useAnimatedScrollHandler`               |
| `onMomentumEnd`       | `ScrollHandler`                      | false    | `undefined` | The onMomentumEnd callback of the bottom sheet scroll view, wrapped by Reanimated's `useAnimatedScrollHandler`                 |

## Ref forwarding

BottomSheetVirtualizedList forwards `ref<VirtualizedList<T>>`.

```tsx
const virtualizedListRef = useRef<VirtualizedList<Item>>(null)

<BottomSheetVirtualizedList ref={virtualizedListRef} data={items} renderItem={renderItem} />
```

You can still use `scrollViewRef` from `useBottomSheet()` to access whichever scroll view is currently active -- it's now set by the claiming system rather than directly by the scroll view.

## isActive

Only one scroll view should control the bottom sheet height at a time. When navigating between screens inside a bottom sheet (via React Navigation or an embedded stack navigator), the previous screen's scroll view stays mounted while the new screen's scroll view mounts -- both fight for the main `scrollViewRef`.

Use `isActive` to explicitly tell the bottom sheet which scroll view is active. Drive it from your navigation state (e.g. `isFocused`).

```tsx
import { useNavigation } from '@react-navigation/native'

function ScreenA() {
  const navigation = useNavigation()
  const isFocused = navigation.isFocused()

  return (
    <BottomSheetVirtualizedList
      isActive={isFocused}
      data={items}
      renderItem={renderItem}
    />
  )
}
```
