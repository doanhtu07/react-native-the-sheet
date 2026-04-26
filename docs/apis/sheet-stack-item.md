# SheetStackItem

SheetStackItem is a component that represents an item in the sheet stack

When it opens, it will register itself to the sheet stack and obtain a z-index based on its position in the stack

When it closes, it will unregister itself from the sheet stack

## Props

| Prop name          | Type                                   | Required | Default     | Description                                                                                                         |
| ------------------ | -------------------------------------- | -------- | ----------- | ------------------------------------------------------------------------------------------------------------------- |
| `ref`              | `RefObject<SheetStackItemApi \| null>` | false    | `undefined` | The ref of the stack item to use SheetStackItemApi                                                                  |
| `isOpen`           | `boolean`                              | true     | N/A         | Whether the stack item is open or not                                                                               |
| `close`            | `() => void`                           | true     | N/A         | The function to close the stack item                                                                                |
| `pushBehavior`     | `push` / `switch` / `replace`          | false    | `push`      | The behavior when pushing this item on top of the stack                                                             |
| `waitForFullyExit` | `boolean`                              | false    | `false`     | Whether to wait for a content to call `onFullyExit()` before fully unmount. Useful for bottom sheet close animation |
| `testID`           | `string`                               | false    | `undefined` | The test ID of the stack item (for testing purposes)                                                                |
| `children`         | `ReactNode`                            | false    | `undefined` | The children of the stack item                                                                                      |

### pushBehavior

- `push`: Pushes this item on top of the stack, keeping the previous one in the stack (default)
- `switch`: Pushes this item on top of the stack + Temporarily hides the previous top
- `replace`: Replaces the current top item in the stack with this one

## Ref methods (SheetStackItemApi)

- `hide()`: Temporarily hides the stack item (without unmounting)
- `show()`: Shows the stack item if it's hidden
