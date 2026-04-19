import { useRef, useState } from 'react'
import { Button, StyleSheet, Text, View } from 'react-native'
import {
  Backdrop,
  SheetStackItem,
  SheetStackItemApi,
} from 'react-native-the-sheet'
import { Portal } from 'react-native-universe-portal'

export default function ExampleSheetStack() {
  const [isOpenA, setIsOpenA] = useState(false)
  const [isOpenB, setIsOpenB] = useState(false)
  const [isOpenC, setIsOpenC] = useState(false)

  const refA = useRef<SheetStackItemApi>(null)

  return (
    <View style={styles.root}>
      <Text style={styles.header}>Example Sheet Stack</Text>

      <Button title="Open Sheet A" onPress={() => setIsOpenA(true)} />

      <Button
        title="Show (Unhide) Sheet A"
        onPress={() => refA.current?.show()}
      />

      <Portal hostName="root">
        <SheetStackItem
          ref={refA}
          isOpen={isOpenA}
          close={() => setIsOpenA(false)}
          testID="sheetA"
        >
          <Backdrop />

          <View style={styles.boxContainer}>
            <View style={styles.boxA}>
              <Text>Sheet A</Text>
              <Button title="Close Sheet A" onPress={() => setIsOpenA(false)} />

              <Button
                title="Hide Sheet A"
                onPress={() => refA.current?.hide()}
              />

              <Button title="Open Sheet B" onPress={() => setIsOpenB(true)} />
            </View>
          </View>
        </SheetStackItem>
      </Portal>

      <Portal hostName="root">
        <SheetStackItem
          isOpen={isOpenB}
          close={() => setIsOpenB(false)}
          pushBehavior="replace"
          testID="sheetB"
        >
          <View style={styles.boxContainer}>
            <View style={styles.boxB}>
              <Text>Sheet B</Text>
              <Button title="Close Sheet B" onPress={() => setIsOpenB(false)} />
              <Button title="Open Sheet C" onPress={() => setIsOpenC(true)} />
            </View>
          </View>
        </SheetStackItem>
      </Portal>

      <Portal hostName="root">
        <SheetStackItem
          isOpen={isOpenC}
          close={() => setIsOpenC(false)}
          testID="sheetC"
        >
          <View style={styles.boxContainer}>
            <View style={styles.boxC}>
              <Text>Sheet C</Text>
              <Button title="Close Sheet C" onPress={() => setIsOpenC(false)} />
            </View>
          </View>
        </SheetStackItem>
      </Portal>
    </View>
  )
}

// MARK: Styles

const styles = StyleSheet.create({
  boxA: {
    backgroundColor: '#6A0572',
    height: 400,
    width: '100%',
  },
  boxB: {
    backgroundColor: '#AB0845',
    height: 300,
    width: '100%',
  },
  boxC: {
    backgroundColor: '#FFB800',
    height: 200,
    width: '100%',
  },
  boxContainer: {
    height: '100%',
    justifyContent: 'flex-end',
    width: '100%',
  },
  header: {
    fontSize: 20,
    fontWeight: '500',
  },
  root: {
    flex: 1,
    gap: 8,
    padding: 16,
  },
})
