# SheetStackProvider

A provider that manages the stack of sheets, allowing you to push and pop sheets in a stack-like manner

It provides:

- `stack`: An array of sheet stack items, each with its data and assigned z-index
- `push`: A function to push a new sheet onto the stack
- `pop`: A function to pop the top sheet from the stack
- `remove`: A function to remove a specific sheet from the stack

## Props

| Prop name  | Type        | Required | Default     | Description                                               |
| ---------- | ----------- | -------- | ----------- | --------------------------------------------------------- |
| `debug`    | `boolean`   | false    | `undefined` | Whether to enable debug mode (logs stack info in console) |
| `children` | `ReactNode` | false    | `undefined` | The children of the provider                              |

## Hook

Use `useSheetStack` to access the sheet stack and its manipulation functions from the context
