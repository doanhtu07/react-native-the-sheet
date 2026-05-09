import { ThemedText } from '@/components/themed-text'
import { generateMockComment } from '@/utils/mock'
import { useState } from 'react'
import { StyleSheet, View } from 'react-native'

type Props = {
  index: number
}

export const Comment = ({ index }: Props) => {
  const [data] = useState(() => generateMockComment())

  return (
    <View style={styles.root}>
      <View style={[styles.avatar, { backgroundColor: data.color }]} />

      <View style={styles.mainColumn}>
        <ThemedText style={styles.username}>
          @{data.username}-{index + 1}
        </ThemedText>

        <ThemedText>{data.text}</ThemedText>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  avatar: {
    borderRadius: 9999,
    height: 20,
    width: 20,
  },
  mainColumn: {
    flex: 1,
    gap: 2,
  },
  root: {
    flexDirection: 'row',
    gap: 6,
  },
  username: {
    fontSize: 12,
    fontWeight: '600',
    paddingVertical: 2,
  },
})
