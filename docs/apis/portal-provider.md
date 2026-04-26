# PortalProvider

A provider that manages all portal hosts in the app, allowing you to render components in different parts of the app, out of the normal React tree hierarchy

It provides:

- An object that maps portal host names to their register portal functions

## Props

| Prop name  | Type        | Required | Default     | Description                  |
| ---------- | ----------- | -------- | ----------- | ---------------------------- |
| `children` | `ReactNode` | false    | `undefined` | The children of the provider |

## Hook

Use `usePortalHosts` to access the portal hosts and their register functions from the context
