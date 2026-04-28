# Architecture

## Overview

This shows the full architecture of the library, how the providers and components are structured

```
SafeAreaProvider (Required) + KeyboardProvider (Recommended)
└── SheetKeyboardProvider + SheetStackProvider + PortalProvider + BottomSheetRegistryProvider
    └── PortalHost
        └── Portal
            └── SheetStackItem
                └── Backdrop
                └── BottomSheetPresenter
                    └── BottomSheetProvider
                        └── InputFocusProvider (Only needed when using BottomSheetKeyboardExpander)
                            └── BottomSheet
                                └── BottomSheetHandle
                                └── BottomSheetView
                                └── BottomSheetScrollView / BottomSheetFlatList (Could be nested under BottomSheetView as well)
                                └── BottomSheetFooter
                            └── BottomSheetKeyboardExpander
```

## Concepts

### Multi-sheet

These two components will work together to provide a multi-sheet stacking system, where you can have multiple sheets open at the same time, and they will stack on top of each other

- `SheetStackProvider`
- `SheetStackItem`

You can put any content inside `SheetStackItem`, not necessarily a bottom sheet

### Portal

These three components will work together to provide a portal system, where you can render content outside of the normal React tree flow, which is useful for rendering sheets above everything else in the app

- `PortalProvider`
- `PortalHost`
- `Portal`

### Keyboard handling

These three components will work together to provide a good keyboard avoiding experience for bottom sheets

- `SheetKeyboardProvider`
- `InputFocusProvider`
- `BottomSheetKeyboardExpander`

You can optionally wrap your app with `KeyboardProvider` as well

[Read more](./keyboard-handling.md)

### Height budget

Use this to solve the problem of deeply nested dynamic sizing scroll view

- `HeightBudgetProvider`
- `HeightClaim`
- `HeightFill`

[Read more](./height-budget.md)

### Embedded stack navigator

A standalone navigator that can navigate between screens

This component does not depend on external dependencies like React Navigation, and can be used inside anything as long as it makes sense

- `EmbeddedStackNavigator`

[Read more](./embedded-stack-navigator.md)
