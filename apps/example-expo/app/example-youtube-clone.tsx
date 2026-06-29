import { useNavigation } from 'expo-router'
import { Pressable, View, StyleSheet } from 'react-native'
import { useEffect, useId, useState } from 'react'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import {
  useBottomSheetRegistryDangerously,
  useTrueSafeArea,
} from '@the-sheet/the-sheet'
import Animated, {
  clamp,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated'
import { BottomNavbar } from '@/features/example-youtube-clone/bottom-navbar'
import { CommentBottomSheet } from '@/features/example-youtube-clone/comment-bottom-sheet'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function ExampleYouTubeClone() {
  const navigation = useNavigation()
  const insets = useSafeAreaInsets()
  const { safeAreaHeight } = useTrueSafeArea()
  const reactId = useId()

  const bottomSheetRegistry = useBottomSheetRegistryDangerously()
  const sheets = bottomSheetRegistry?.sheets

  const commentSheetId = `${reactId}.commentSheet`
  const commentSheet = sheets?.[commentSheetId]

  const maxSheetHeight = safeAreaHeight - insets.top

  const [isCommentSheetOpen, setIsCommentSheetOpen] = useState(false)

  const [bottomNavbarHeight, setBottomNavbarHeight] = useState(0)

  const [imageHeight, setImageHeight] = useState(0)
  const [imageLocalTop, setImageLocalTop] = useState(0)
  const [aspectRatio, setAspectRatio] = useState(1)

  // MARK: Effects

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    })
  }, [navigation])

  // MARK: Preparation

  const animatedImageStyle = useAnimatedStyle(() => {
    if (!commentSheet) {
      return {
        transform: [{ translateY: 0 }],
      }
    }

    const sheetVisibleHeight = commentSheet.sheetVisibleHeight.value

    const maxTranslate = imageLocalTop
    const dockSheetTop = insets.top + imageHeight
    const dockSheetVisibleHeight = safeAreaHeight - dockSheetTop

    const translateProgress = clamp(
      sheetVisibleHeight / dockSheetVisibleHeight,
      0,
      1,
    )

    const remainingSheetProgress =
      (sheetVisibleHeight - dockSheetVisibleHeight) /
      (maxSheetHeight - dockSheetVisibleHeight)

    const scaleProgress = clamp(remainingSheetProgress, 0, 1)

    let translateY: number
    let scale: number

    // Stage 1: translateY only until the image touches the top of the screen
    if (translateProgress < 1) {
      translateY = -translateProgress * maxTranslate
      scale = 1
    }
    // Stage 2: image scales down, and translateY compensates to keep the image at the top
    else {
      scale = interpolate(scaleProgress, [0, 1], [1, 0])
      const missingHeight = imageHeight * (1 - scale) // includes top and bottom, since scaling works from the center
      const topCompensation = missingHeight / 2
      translateY = -maxTranslate - topCompensation
    }

    return {
      transform: [{ translateY }, { scale }],
    }
  })

  // MARK: Renderers

  return (
    <View style={styles.container}>
      <View style={{ height: insets.top }} />

      {/* Image */}
      <View style={[styles.imageContainer]}>
        <Animated.Image
          source={{
            uri: 'https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExZmFqaXpqZWZpcnd2dGNoYTBpbmZsajkybDg3ZzExN2t1NTF5czVndCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/ILnrzp5uo1LfG/giphy.gif',
          }}
          style={[styles.image, { aspectRatio }, animatedImageStyle]}
          onLayout={(event) => {
            setImageHeight(event.nativeEvent.layout.height)
            setImageLocalTop(event.nativeEvent.layout.y)
          }}
          onLoad={(event) => {
            const { width, height } = event.nativeEvent.source
            setAspectRatio(width / height)
          }}
        />
      </View>

      {/* Comment button */}
      <Pressable
        style={({ pressed }) => [
          styles.commentButton,
          { opacity: pressed ? 0.6 : 1, bottom: bottomNavbarHeight + 16 },
        ]}
        onPress={() => {
          setIsCommentSheetOpen(true)
        }}
      >
        <MaterialCommunityIcons
          name="comment-text-outline"
          size={32}
          color="white"
        />
      </Pressable>

      <CommentBottomSheet
        isOpen={isCommentSheetOpen}
        close={() => setIsCommentSheetOpen(false)}
        maxHeight={maxSheetHeight}
        sheetId={commentSheetId}
      />

      <BottomNavbar setHeight={setBottomNavbarHeight} />
    </View>
  )
}

// MARK: Styles

const styles = StyleSheet.create({
  commentButton: {
    position: 'absolute',
    right: 16,
    zIndex: 1,
  },
  container: {
    alignItems: 'center',
    backgroundColor: 'black',
    flex: 1,
  },
  image: {
    backgroundColor: 'blue',
    maxHeight: '100%',
    resizeMode: 'contain',
    width: '100%',
  },
  imageContainer: {
    alignItems: 'center',
    backgroundColor: 'red',
    flex: 1,
    justifyContent: 'center',
    width: '100%',
  },
})
