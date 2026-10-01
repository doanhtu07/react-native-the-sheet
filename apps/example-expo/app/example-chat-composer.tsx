import { ThemedText } from '@/components/themed-text'
import { ChatComposer } from '@/features/example-chat-composer/chat-composer'
import { useCallback, useState } from 'react'
import { Button, StyleSheet, Text, View } from 'react-native'
import {
  Backdrop,
  BottomSheet,
  BottomSheetHandle,
  BottomSheetPresenter,
  BottomSheetProvider,
  BottomSheetScrollView,
  BottomSheetView,
  SheetStackItem,
} from '@the-sheet/the-sheet'
import { Portal } from '@the-sheet/universe-portal'

type Message = {
  id: string
  text: string
  fromMe: boolean
}

const SEED_MESSAGES: Message[] = [
  { id: '1', text: 'Hey! How does the inline expander work?', fromMe: false },
  { id: '2', text: 'Focus the input below 👇', fromMe: false },
  {
    id: '3',
    text: 'The whole composer (input + send button) lifts above the keyboard',
    fromMe: true,
  },
  {
    id: '4',
    text: 'No InputFocusProvider needed — focus is passed as a prop',
    fromMe: true,
  },
]

export default function ExampleChatComposer() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>(SEED_MESSAGES)

  const handleSend = useCallback((text: string) => {
    setMessages((prev) => [
      ...prev,
      { id: `${Date.now()}`, text, fromMe: true },
    ])
  }, [])

  // MARK: Renderers

  return (
    <View style={styles.root}>
      <ThemedText style={styles.header}>Example Chat Composer</ThemedText>

      <Button title="Open Chat Sheet" onPress={() => setIsOpen(true)} />

      <Portal hostName="root">
        <SheetStackItem
          isOpen={isOpen}
          close={() => setIsOpen(false)}
          waitForFullyExit
          testID="chatSheet"
        >
          <Backdrop />

          <BottomSheetPresenter>
            <BottomSheetProvider snapPoints={['90%']}>
              <BottomSheet>
                <BottomSheetHandle />

                <BottomSheetView fill>
                  <BottomSheetScrollView
                    fill
                    contentContainerStyle={styles.messages}
                  >
                    {messages.map((message) => (
                      <View
                        key={message.id}
                        style={[
                          styles.bubble,
                          message.fromMe
                            ? styles.bubbleFromMe
                            : styles.bubbleFromThem,
                        ]}
                      >
                        <Text
                          style={
                            message.fromMe
                              ? styles.bubbleTextFromMe
                              : styles.bubbleTextFromThem
                          }
                        >
                          {message.text}
                        </Text>
                      </View>
                    ))}
                  </BottomSheetScrollView>

                  <ChatComposer onSend={handleSend} />
                </BottomSheetView>
              </BottomSheet>
            </BottomSheetProvider>
          </BottomSheetPresenter>
        </SheetStackItem>
      </Portal>
    </View>
  )
}

// MARK: Styles

const styles = StyleSheet.create({
  bubble: {
    borderRadius: 18,
    maxWidth: '80%',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  bubbleFromMe: {
    alignSelf: 'flex-end',
    backgroundColor: '#007AFF',
  },
  bubbleFromThem: {
    alignSelf: 'flex-start',
    backgroundColor: '#E5E5EA',
  },
  bubbleTextFromMe: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  bubbleTextFromThem: {
    color: '#000000',
    fontSize: 16,
  },
  header: {
    fontSize: 20,
    fontWeight: '500',
  },
  messages: {
    gap: 8,
    padding: 16,
  },
  root: {
    flex: 1,
    gap: 8,
    padding: 16,
  },
})
