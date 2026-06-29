import { ThemedText } from '@/components/themed-text'
import { StyleSheet, View } from 'react-native'
import { Comment } from './comment'
import { Fragment, useCallback, useState } from 'react'
import {
  BottomSheetFlatList,
  useBottomSheetRegistryDangerously,
} from '@the-sheet/the-sheet'
import {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
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
  const bottomSheetRegistry = useBottomSheetRegistryDangerously()
  const sheets = bottomSheetRegistry?.sheets

  const commentSheet = sheets?.[sheetId]

  const getYoutubeCommentPanGesture = useBottomSheetYoutubePanGesture({
    close,
    sheetId,
  })

  const prevMarginBottom = useSharedValue(0)

  const [comments] = useState(new Array(100).fill(0))
  const [addCommentSheetHeight, setAddCommentSheetHeight] = useState(0)

  // MARK: Preparation

  const animatedFlatListStyle = useAnimatedStyle(() => {
    if (!commentSheet) {
      return {
        marginBottom: 0,
      }
    }

    const sheetHiddenHeight = Math.max(
      0,
      commentSheet.sheetHeight.value - commentSheet.sheetVisibleHeight.value,
    )

    if (
      (commentSheet.isTranslateYAnimating.value ||
        commentSheet.isPanGestureActive.value) &&
      prevMarginBottom.value < sheetHiddenHeight
    ) {
      return {
        marginBottom: prevMarginBottom.value,
      }
    }

    if (commentSheet.isTranslateYAnimating.value) {
      // When translateY is animating withSpring, somehow we need to use animate marginBottom as well
      // Or else, translateY will not animate smoothly and instead suddenly jump
      prevMarginBottom.value = withTiming(sheetHiddenHeight, { duration: 1 })
    } else {
      prevMarginBottom.value = sheetHiddenHeight
    }

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
