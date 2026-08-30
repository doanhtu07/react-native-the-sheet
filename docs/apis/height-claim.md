# HeightClaim

[Read more](../core/height-budget.md)

## Props

Inherits all props from `Animated.View` except for the following props:

| Prop name   | Type                             | Required | Default     | Description                                                                                       |
| ----------- | -------------------------------- | -------- | ----------- | ------------------------------------------------------------------------------------------------- |
| `isActive`  | `AnimatedProp<boolean>`          | false    | `true`      | Whether this height claim is active. Height claims from inactive screens no longer contribute to the height fill calculation |
| `onLayout`  | `(e: LayoutChangeEvent) => void` | false    | `undefined` | The onLayout callback of the view                                                                 |
