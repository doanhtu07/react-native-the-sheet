# Best Practices

## Templates

Because the library is an ecosystem of multiple components, it's best to create a reusable template of components and features that you want to use across your app.

This way, you can maintain and update the features much easier. It also creates a consistent experience for your app.

You can check out one template example at `apps/example-expo/components/bottom-sheet-template/bottom-sheet-template.tsx`. This template supports multiple features out of the box, such as:

- Sheet ID for you to override if needed
- Backdrop that animates opacity
- Input focus handling provider (You just need to adjust your input components to use the provided `onFocus` and `onBlur` handlers)
- Snap points / Max height
- Height budget system (You still need to use `HeightClaim` and `HeightFill` in your own children content properly)
- Header left / center / right
- Close button
- Action buttons (Not sticky footer though)
