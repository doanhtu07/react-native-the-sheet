# useBottomSheetScrollViewUtils

A hook that provides enhanced handlers for scroll views. You put the returned handlers into `Animated.ScrollView` or Animated scrolling components of your choice

It provides:

- `onLayout`
- `onTouchStart`
- `onTouchEnd`
- `onScroll`

## Props

| Prop name         | Type                                 | Required | Default     | Description                                                  |
| ----------------- | ------------------------------------ | -------- | ----------- | ------------------------------------------------------------ |
| `onLayout`        | `(e: LayoutChangeEvent) => void`     | false    | `undefined` | The onLayout callback of the bottom sheet scroll view        |
| `onTouchStart`    | `(e: GestureResponderEvent) => void` | false    | `undefined` | The onTouchStart callback of the bottom sheet scroll view    |
| `onTouchEnd`      | `(e: GestureResponderEvent) => void` | false    | `undefined` | The onTouchEnd callback of the bottom sheet scroll view      |
| `onScroll`        | `ScrollHandler`                      | false    | `undefined` | The onScroll callback of the bottom sheet scroll view        |
| `onBeginDrag`     | `ScrollHandler`                      | false    | `undefined` | The onBeginDrag callback of the bottom sheet scroll view     |
| `onEndDrag`       | `ScrollHandler`                      | false    | `undefined` | The onEndDrag callback of the bottom sheet scroll view       |
| `onMomentumBegin` | `ScrollHandler`                      | false    | `undefined` | The onMomentumBegin callback of the bottom sheet scroll view |
| `onMomentumEnd`   | `ScrollHandler`                      | false    | `undefined` | The onMomentumEnd callback of the bottom sheet scroll view   |
