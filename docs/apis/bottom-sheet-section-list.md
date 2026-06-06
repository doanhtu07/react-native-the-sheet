# BottomSheetSectionList

BottomSheetSectionList is an `AnimatedSectionList` (created via `Animated.createAnimatedComponent(SectionList)`) that is wrapped by a gesture detector to work with the bottom sheet's pan gesture.

## Props

Inherits all props of `AnimatedSectionList`, except for the following overriden props:

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
