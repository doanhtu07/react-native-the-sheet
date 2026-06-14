# BottomSheetFlashList

BottomSheetFlashList is a [FlashList](https://github.com/Shopify/flash-list) that is wrapped by a gesture detector to work with the bottom sheet's pan gesture

This component is available via the `react-native-the-sheet/flash-list-v1` and `react-native-the-sheet/flash-list-v2` subpaths:

```tsx
import { BottomSheetFlashList } from 'react-native-the-sheet/flash-list-v1'
import { BottomSheetFlashList } from 'react-native-the-sheet/flash-list-v2'
```

| Subpath         | Required `@shopify/flash-list` version |
| --------------- | -------------------------------------- |
| `flash-list-v1` | `1.x`                                  |
| `flash-list-v2` | `2.x`                                  |

> [!IMPORTANT]
> You need to install `@shopify/flash-list` as a dependency in your project to use this component. Choose the version that matches your project's needs:
>
> - Install `@shopify/flash-list@1.x` for `react-native-the-sheet/flash-list-v1`
> - Install `@shopify/flash-list@2.x` for `react-native-the-sheet/flash-list-v2`

## Props

Inherits all props of `FlashList`, except for the following overriden props:

| Prop name             | Type                                 | Required | Default     | Description                                                                                                      |
| --------------------- | ------------------------------------ | -------- | ----------- | ---------------------------------------------------------------------------------------------------------------- |
| `fill`                | `AnimatedProp<boolean>`              | false    | `false`     | Whether the bottom sheet scroll view should fill the available height (applies `flex: 1`)                        |
| `getPanGesture`       | `() => PanGesture`                   | false    | `undefined` | The custom pan gesture factory                                                                                   |
| `onLayout`            | `(e: LayoutChangeEvent) => void`     | false    | `undefined` | The onLayout callback of the bottom sheet scroll view                                                            |
| `onContentSizeChange` | `(w: number, h: number) => void`     | false    | `undefined` | The onContentSizeChange callback of the bottom sheet scroll view                                                 |
| `onTouchStart`        | `(e: GestureResponderEvent) => void` | false    | `undefined` | The onTouchStart callback of the bottom sheet scroll view                                                        |
| `onTouchEnd`          | `(e: GestureResponderEvent) => void` | false    | `undefined` | The onTouchEnd callback of the bottom sheet scroll view                                                          |
| `onScroll`            | `ScrollHandler`                      | false    | `undefined` | The onScroll callback of the bottom sheet scroll view, wrapped by Reanimated's `useAnimatedScrollHandler`        |
| `onBeginDrag`         | `ScrollHandler`                      | false    | `undefined` | The onBeginDrag callback of the bottom sheet scroll view, wrapped by Reanimated's `useAnimatedScrollHandler`     |
| `onEndDrag`           | `ScrollHandler`                      | false    | `undefined` | The onEndDrag callback of the bottom sheet scroll view, wrapped by Reanimated's `useAnimatedScrollHandler`       |
| `onMomentumBegin`     | `ScrollHandler`                      | false    | `undefined` | The onMomentumBegin callback of the bottom sheet scroll view, wrapped by Reanimated's `useAnimatedScrollHandler` |
| `onMomentumEnd`       | `ScrollHandler`                      | false    | `undefined` | The onMomentumEnd callback of the bottom sheet scroll view, wrapped by Reanimated's `useAnimatedScrollHandler`   |
