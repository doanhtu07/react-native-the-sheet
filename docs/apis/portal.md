# Portal

Portal is a component that allows you to render its children in a different part of the component tree

This is useful for rendering components on top of everything else, such as bottom sheets, modals, toasts, dropdowns, etc.

## Props

| Prop name  | Type        | Required | Default       | Description                                                                            |
| ---------- | ----------- | -------- | ------------- | -------------------------------------------------------------------------------------- |
| `name`     | `string`    | false    | React useId() | The name of the portal                                                                 |
| `hostName` | `string`    | true     | N/A           | The name of the portal host to teleport into (must match the `name` of a `PortalHost`) |
| `children` | `ReactNode` | false    | `undefined`   | The children of the portal                                                             |
