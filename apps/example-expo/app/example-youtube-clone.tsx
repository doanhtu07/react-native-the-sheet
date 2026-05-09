import { useNavigation } from 'expo-router'
import { Pressable, View, StyleSheet, Image } from 'react-native'
import { useEffect, useId, useState } from 'react'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { useBottomSheetRegistry, useTrueSafeArea } from 'react-native-the-sheet'
import Animated, { useAnimatedStyle } from 'react-native-reanimated'
import { BottomNavbar } from '@/features/example-youtube-clone/bottom-navbar'
import { CommentBottomSheet } from '@/features/example-youtube-clone/comment-bottom-sheet'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const IMAGE_RATIO = 336 / 480 // width / height

export default function ExampleYouTubeClone() {
  const navigation = useNavigation()
  const { sheets } = useBottomSheetRegistry()
  const insets = useSafeAreaInsets()
  const { safeAreaHeight } = useTrueSafeArea()
  const reactId = useId()

  const commentSheetId = `${reactId}.commentSheet`
  const commentSheet = sheets[commentSheetId]

  const [isCommentSheetOpen, setIsCommentSheetOpen] = useState(false)
  const [imageHeight, setImageHeight] = useState(0)
  const [bottomNavbarHeight, setBottomNavbarHeight] = useState(0)

  const maxSheetHeight = safeAreaHeight - insets.top

  // MARK: Effects

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    })
  }, [navigation])

  // MARK: Preparation

  const animatedImageStyle = useAnimatedStyle(() => {
    const paddingBottom = commentSheet
      ? Math.max(0, commentSheet.sheetVisibleHeight.value - bottomNavbarHeight)
      : 0

    const halfPaddingBottom = paddingBottom / 2

    // paddingBottom ≈ imageHeight * (1 - scale) / 2
    // => scale ≈ 1 - (paddingBottom / (imageHeight / 2))
    const scale = 1 - halfPaddingBottom / (imageHeight / 2)

    // Translate up by another half of padding bottom
    const translateY = -halfPaddingBottom

    return {
      transform: [{ translateY }, { scale }],
    }
  })

  // MARK: Renderers

  return (
    <View style={styles.container}>
      {/* Image */}
      <Animated.View
        style={[styles.imageContainer, animatedImageStyle]}
        onLayout={(e) => setImageHeight(e.nativeEvent.layout.height)}
      >
        <Image
          source={{
            uri: 'https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExZmFqaXpqZWZpcnd2dGNoYTBpbmZsajkybDg3ZzExN2t1NTF5czVndCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/ILnrzp5uo1LfG/giphy.gif',
          }}
          style={styles.image}
        />
      </Animated.View>

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
    aspectRatio: IMAGE_RATIO,
    height: '100%',
    resizeMode: 'contain',
  },
  imageContainer: {
    flex: 1,
  },
})
