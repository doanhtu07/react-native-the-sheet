# Contributing

## Dependency compatibility

When contributing to this project, please ensure the versions of these core dependencies are consistent across all packages

## Branching

Most up-to-date branches:

- `main`, `v1`, ...

Release tags (code freeze):

- `react-native-the-sheet@1.0.0`, `react-native-the-sheet@2.0.0`, ...

## Versioning

We use @changesets/cli for managing versioning and releases

- We will use lockstep versioning for simplicity

## Testing

### Manual testing

- When you change something, make sure to manually test it in the example Expo app

### Android edge-to-edge testing

- When testing `edge-to-edge` features for Android target SDK 35-:
  - Adjust config accordingly in `apps/example-expo/app.config.ts`
  - There are 3 different cases we need to test

- To enable `non-edge-to-edge` mode in Android, run `pnpm ete:disable && pnpm android:clean`
  - Also need to delete `react-native-edge-to-edge` from `plugins` in `app.config.ts` for the example Expo app

- To enable `edge-to-edge` mode in Android, run `pnpm ete:enable && pnpm android:clean`
  - Also need to write `react-native-edge-to-edge` to `plugins` in `app.config.ts` for the example Expo app

### Android keyboard mode testing

- When updating keyboard mode for Android, don't forget to adjust `androidWindowSoftInputMode` in `apps/example-expo/app/_layout.tsx`
