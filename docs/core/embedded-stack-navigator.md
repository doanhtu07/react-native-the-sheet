# Embedded Stack Navigator

React Navigation is not designed specifically for bottom sheets navigation

Traditionally, you would use `NavigationIndependentTree` to create an independent navigation tree inside the bottom sheet

But it has limitations and is tricky to work with if you want to navigate outside from inside the bottom sheet

Read more here: https://reactnavigation.org/docs/8.x/navigation-container#independent-navigation-containers

## Solution

To solve this problem, I've created a really simple standalone stack navigator that can be used inside anything, including bottom sheets

## Usage

```tsx
type RouteParamList = {
  ScreenA: undefined
  ScreenB: undefined
}

// ...

function ScreenA() {
  const navigation = useEmbeddedStackNavigation<RouteParamList>()

  return (
    <View style={styles.root}>
      <Text>Screen A</Text>

      <Button
        title="Go to Screen B"
        onPress={() =>
          navigation.navigate({ name: 'ScreenB', params: undefined })
        }
      />
    </View>
  )
}

// ...

const renderScreenA = useCallback(() => <ScreenA />, [])

const renderScreenB = useCallback(() => <ScreenB />, [])

const screens = useMemo(() => {
return {
    ScreenA: renderScreenA,
    ScreenB: renderScreenB,
} satisfies Record<keyof RouteParamList, ScreenRenderer>
}, [renderScreenA, renderScreenB])

// ...

<Portal hostName="root">
  <SheetStackItem
    isOpen={isOpenA}
    close={() => setIsOpenA(false)}
    waitForFullyExit
    testID="sheetA"
  >
    <Backdrop />

    <BottomSheetPresenter>
      <BottomSheet fill styles={{ root: { maxHeight: '75%' } }}>
        <BottomSheetHandle />

        <BottomSheetView fill>
          <Text>Sheet A</Text>
          <Button
            title="Close Sheet A"
            onPress={() => setIsOpenA(false)}
          />

          <EmbeddedStackNavigator<
            typeof screens,
            RouteParamList,
            'ScreenA'
          >
            initialRouteName={'ScreenA'}
            initialParams={undefined}
            screens={screens}
            transitionType="fade"
          />
        </BottomSheetView>
      </BottomSheet>
    </BottomSheetPresenter>
  </SheetStackItem>
</Portal>
```
