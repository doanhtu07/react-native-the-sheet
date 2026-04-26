# EmbeddedStackNavigator

[Read more](../core/embedded-stack-navigator.md)

## Props

| Prop name          | Type                             | Required | Default | Description                                                   |
| ------------------ | -------------------------------- | -------- | ------- | ------------------------------------------------------------- |
| `initialRouteName` | `InitialRouteName`               | true     | N/A     | The name of the initial route to render                       |
| `initialParams`    | `ParamList[InitialRouteName]`    | true     | N/A     | The params to pass to the initial route                       |
| `screens`          | `Record<string, ScreenRenderer>` | true     | N/A     | An object that maps route names to screen renderers           |
| `transitionType`   | `slide` \| `fade`                | false    | `slide` | The type of transition to use when navigating between screens |
