import { ThemedText } from '@/components/themed-text'
import { StyleSheet, View } from 'react-native'
import { Comment } from './comment'
import { Fragment, useCallback, useState } from 'react'
import {
  BottomSheetFlatList,
  useBottomSheetRegistry,
} from 'react-native-the-sheet'
import { useAnimatedStyle, useSharedValue } from 'react-native-reanimated'
import { AddCommentBottomSheet } from './add-comment-bottom-sheet'
import { useBottomSheetYoutubePanGesture } from '../../components/bottom-sheet-template/bottom-sheet-youtube-template/hooks/use-bottom-sheet-youtube-pan-gesture'
import { BottomSheetYouTubeTemplate } from '@/components/bottom-sheet-template/bottom-sheet-youtube-template/bottom-sheet-youtube-template'

type Props = {
  isOpen: boolean
  close: () => void
  maxHeight: number
  sheetId: string
}

export const CommentBottomSheet = ({
  isOpen,
  close,
  maxHeight,
  sheetId,
}: Props) => {
  const { sheets } = useBottomSheetRegistry()

  const commentSheet = sheets[sheetId]
  const prevMarginBottom = useSharedValue(0)

  const getYoutubeCommentPanGesture = useBottomSheetYoutubePanGesture({
    close,
    sheetId,
  })

  const [comments] = useState(new Array(100).fill(0))
  const [addCommentSheetHeight, setAddCommentSheetHeight] = useState(0)

  // MARK: Preparation

  const animatedFlatListStyle = useAnimatedStyle(() => {
    if (!commentSheet) {
      return {
        marginBottom: 0,
      }
    }

    if (commentSheet.isTranslateYAnimating.value) {
      return {
        marginBottom: prevMarginBottom.value,
      }
    }

    const sheetHiddenHeight = commentSheet
      ? Math.max(
          0,
          commentSheet.sheetHeight.value -
            commentSheet.sheetVisibleHeight.value,
        )
      : 0

    prevMarginBottom.value = sheetHiddenHeight

    return {
      marginBottom: prevMarginBottom.value,
    }
  })

  // MARK: Renderers

  const renderSeparator = useCallback(() => {
    return <View style={styles.separator} />
  }, [])

  const renderContent = () => {
    return (
      <BottomSheetFlatList
        style={[animatedFlatListStyle]}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: addCommentSheetHeight + 20 },
        ]}
        data={comments}
        renderItem={({ index }) => <Comment index={index} />}
        ItemSeparatorComponent={renderSeparator}
        getPanGesture={getYoutubeCommentPanGesture}
      />
    )
  }

  return (
    <Fragment>
      <BottomSheetYouTubeTemplate
        isOpen={isOpen}
        close={close}
        snapPoints={['60%', maxHeight]}
        sheetId={sheetId}
        headerLeft={<ThemedText style={styles.headerText}>Comments</ThemedText>}
        showClose
        content={renderContent()}
      />

      <AddCommentBottomSheet
        isOpen={isOpen}
        sheetId={`${sheetId}.addCommentSheet`}
        reportHeight={setAddCommentSheetHeight}
      />
    </Fragment>
  )
}

// MARK: Styles

const styles = StyleSheet.create({
  headerText: {
    fontSize: 18,
    fontWeight: '600',
  },
  scrollContent: {
    paddingHorizontal: 12,
  },
  separator: {
    height: 16,
  },
})
