# HeightBudgetProvider

[Read more](../core/height-budget.md)

## Props

| Prop name   | Type                  | Required | Default     | Description                                                              |
| ----------- | --------------------- | -------- | ----------- | ------------------------------------------------------------------------ |
| `maxHeight` | `SharedValue<number>` | true     | N/A         | The maximum height budget that this provider can provide to its children |
| `children`  | `ReactNode`           | false    | `undefined` | The children of the provider                                             |

## Hook

Use `useHeightBudget` to access the height budget system from the context

It provides:

- `maxHeight`: Passed from props
- `staticHeights`: A shared value that tracks all static heights from `HeightClaim` in the subtree of this provider
