# EmbeddedStackNavigator

[Read more](../core/embedded-stack-navigator.md)

## Props

| Prop name              | Type                             | Required | Default     | Description                                                                |
| ---------------------- | -------------------------------- | -------- | ----------- | -------------------------------------------------------------------------- |
| `initialRouteName`     | `InitialRouteName`               | true     | N/A         | The name of the initial route to render                                    |
| `initialParams`        | `ParamList[InitialRouteName]`    | true     | N/A         | The params to pass to the initial route                                    |
| `screens`              | `Record<string, ScreenRenderer>` | true     | N/A         | An object that maps route names to screen renderers                        |
| `transitionType`       | `slide` \| `fade` \| `none`      | false    | `slide`     | The type of transition to use when navigating between screens              |
| `animateDynamicHeight` | `boolean`                        | false    | `true`      | Whether the navigator height animates smoothly when content height changes |
| `fill`                 | `boolean`                        | false    | `false`     | Whether the navigator fills the parent container                           |
| `styles`               | object                           | false    | `undefined` | The styles of the embedded stack navigator                                 |

## Styles

```tsx
styles?: {
  root?: StyleProp<ViewStyle>
}
```
