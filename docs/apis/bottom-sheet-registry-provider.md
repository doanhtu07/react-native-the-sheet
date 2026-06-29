# BottomSheetRegistryProvider

A global provider that manages the registry of all bottom sheets in the app

It allows you to access the internal state of any bottom sheet, given the bottom sheet id

It provides:

- `sheets`: A record of bottom sheet id mapping to its internal state
- `registerSheet`: A function to register a bottom sheet with its id and internal state
- `unregisterSheet`: A function to unregister a bottom sheet with its id

## Optional provider

BottomSheetRegistryProvider is optional, and you can use `useBottomSheetRegistryDangerously` to access the registry state without throwing error when the provider is not available

## Hook

Use `useBottomSheetRegistry` to access the bottom sheet registry state

Use `useBottomSheetRegistryDangerously` to access the bottom sheet registry state without throwing error when the provider is not available

- It returns `undefined` when the provider is not available, instead of throwing error
