import { useCallback, useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { TextInput } from 'react-native-gesture-handler'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { BottomSheetInlineKeyboardExpander } from '@the-sheet/keyboard-controller'

const COMPOSER_PADDING_BOTTOM = 12

type Props = {
  onSend: (text: string) => void
}

export const ChatComposer = ({ onSend }: Props) => {
  const { bottom: bottomInset } = useSafeAreaInsets()

  const [text, setText] = useState('')
  const [isInputFocused, setIsInputFocused] = useState(false)

  /*
    Height of everything below the input (actions row + disclaimer).
    Together with the bottom inset, this is the container delta:
    containerBottom - inputBottom, which the inline expander needs
    on top of the input overlap so the WHOLE composer lands above
    the keyboard — not just the input.
  */
  const [footerHeight, setFooterHeight] = useState(0)

  const canSend = text.trim().length > 0

  const handleSend = useCallback(() => {
    if (!canSend) {
      return
    }

    onSend(text.trim())
    setText('')
  }, [canSend, onSend, text])

  // MARK: Renderers

  return (
    <View
      style={[
        styles.composer,
        { paddingBottom: bottomInset + COMPOSER_PADDING_BOTTOM },
      ]}
    >
      <TextInput
        style={styles.input}
        placeholder="Type a message..."
        placeholderTextColor="#999"
        value={text}
        onChangeText={setText}
        multiline
        onFocus={() => setIsInputFocused(true)}
        onBlur={() => setIsInputFocused(false)}
        onSubmitEditing={handleSend}
      />

      <View
        style={styles.footer}
        onLayout={(e) => {
          // Round + threshold: text measurement flickers by subpoints
          // on every layout pass, and each new value would retarget
          // the expander animation forever. Only accept real changes.
          const next = Math.round(e.nativeEvent.layout.height)
          setFooterHeight((prev) => (Math.abs(prev - next) >= 1 ? next : prev))
        }}
      >
        <View style={styles.actions}>
          <View style={styles.actionsSpacer} />

          <Pressable
            onPress={handleSend}
            disabled={!canSend}
            accessibilityLabel="Send message"
            style={({ pressed }) => [
              styles.sendButton,
              {
                backgroundColor: canSend ? '#007AFF' : '#E5E5EA',
                opacity: pressed && canSend ? 0.8 : 1,
              },
            ]}
          >
            <Text
              style={[
                styles.sendLabel,
                canSend ? styles.sendLabelActive : styles.sendLabelIdle,
              ]}
            >
              Send
            </Text>
          </Pressable>
        </View>

        <Text style={styles.disclaimer}>
          Messages are stored locally in this example
        </Text>
      </View>

      {/*
        No InputFocusProvider needed: focus is tracked by the caller
        and the container delta is supplied via keyboardOffset.

        On Android this needs adjustNothing (synced above at runtime):
        under adjustPan the OS re-pans on every layout change and
        cancels the expansion visually.
      */}
      <BottomSheetInlineKeyboardExpander
        isInputFocused={isInputFocused}
        keyboardOffset={footerHeight + COMPOSER_PADDING_BOTTOM}
      />
    </View>
  )
}

// MARK: Styles

const styles = StyleSheet.create({
  actions: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: 8,
  },
  actionsSpacer: {
    flex: 1,
  },
  composer: {
    backgroundColor: '#FFFFFF',
    borderTopColor: '#D1D1D6',
    borderTopWidth: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  disclaimer: {
    color: '#8E8E93',
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
  },
  footer: {},
  input: {
    backgroundColor: '#F2F2F7',
    borderRadius: 20,
    color: '#000000',
    fontSize: 16,
    maxHeight: 120,
    minHeight: 44,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  sendButton: {
    alignItems: 'center',
    borderRadius: 20,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  sendLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  sendLabelActive: {
    color: '#FFFFFF',
  },
  sendLabelIdle: {
    color: '#8E8E93',
  },
})
