# useTrueSafeArea

A useful hook that combines the results of `useSafeAreaInsets`, `useSafeAreaFrame`, and `useWindowDimensions` to give you the "true" safe area insets and frame

Using any of these alone will not give the full picture of the safe area, especially when you have:

- iOS edge-to-edge
- Android non-edge-to-edge
- Android edge-to-edge
