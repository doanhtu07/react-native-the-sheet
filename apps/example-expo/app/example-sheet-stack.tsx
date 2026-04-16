import { useState } from 'react'
import { Button, StyleSheet, Text, View } from 'react-native'
import { Backdrop, SheetStackItem } from 'react-native-the-sheet'
import { Portal } from 'react-native-universe-portal'

export default function ExampleSheetStack() {
  const [isOpenA, setIsOpenA] = useState(false)
  const [isOpenB, setIsOpenB] = useState(false)
  const [isOpenC, setIsOpenC] = useState(false)

  return (
    <View style={styles.root}>
      <Text style={styles.header}>Example Sheet Stack</Text>

      <Button title="Open Sheet A" onPress={() => setIsOpenA(true)} />

      <Portal hostName="root">
        <SheetStackItem
          isOpen={isOpenA}
          close={() => setIsOpenA(false)}
          testID="sheetA"
        >
          <Backdrop />

          <View style={styles.boxContainer}>
            <View style={styles.boxA}>
              <Text>Sheet A</Text>
              <Button title="Close Sheet A" onPress={() => setIsOpenA(false)} />
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
  boxContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  boxA: {
    backgroundColor: '#6A0572',
    width: '100%',
    height: 400,
  },
  boxB: {
    backgroundColor: '#AB0845',
    width: '100%',
    height: 300,
  },
  boxC: {
    backgroundColor: '#FFB800',
    width: '100%',
    height: 200,
  },
  root: {
    flex: 1,
    padding: 16,
    gap: 8,
  },
  header: {
    fontSize: 20,
    fontWeight: '500',
  },
})
