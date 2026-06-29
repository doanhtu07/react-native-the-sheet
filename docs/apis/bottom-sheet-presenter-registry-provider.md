# BottomSheetPresenterRegistryProvider

A global provider that manages the registry of all bottom sheet presenters in the app

It allows you to access the internal state of any bottom sheet presenter, given the presenter id

It provides:

- `presenters`: A record of presenter id mapping to its internal state
- `registerPresenter`: A function to register a presenter with its id and internal state
- `unregisterPresenter`: A function to unregister a presenter with its id

## Optional provider

BottomSheetPresenterRegistryProvider is optional, and you can use `useBottomSheetPresenterRegistryDangerously` to access the registry state without throwing error when the provider is not available

## Hook

Use `useBottomSheetPresenterRegistry` to access the bottom sheet presenter registry state

Use `useBottomSheetPresenterRegistryDangerously` to access the bottom sheet presenter registry state without throwing error when the provider is not available

- It returns `undefined` when the provider is not available, instead of throwing error
