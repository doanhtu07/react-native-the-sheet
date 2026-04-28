import type { ExpoConfig } from 'expo/config'

const config: ExpoConfig = {
  name: 'expo-template',
  slug: 'expo-template',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'expotemplate',
  userInterfaceStyle: 'automatic',
  platforms: ['ios', 'android'],
  ios: {
    bundleIdentifier: 'com.reactnativethesheet.exampleexpo',
    supportsTablet: true,
  },
  android: {
    package: 'com.reactnativethesheet.exampleexpo',
    adaptiveIcon: {
      backgroundColor: '#E6F4FE',
      foregroundImage: './assets/images/android-icon-foreground.png',
      backgroundImage: './assets/images/android-icon-background.png',
      monochromeImage: './assets/images/android-icon-monochrome.png',
    },

    // === Edge to edge ===

    // Case 1: Resize + Edge to edge opt out
    softwareKeyboardLayoutMode: 'resize',
    edgeToEdgeEnabled: false,

    // Case 2: Pan + Edge to edge opt out
    // softwareKeyboardLayoutMode: 'pan',
    // edgeToEdgeEnabled: false,

    // Case 3: Edge to edge enabled + adjustResize
    // softwareKeyboardLayoutMode: 'resize',
    // edgeToEdgeEnabled: true,

    // Case 4: Edge to edge enabled + adjustPan
    // softwareKeyboardLayoutMode: 'pan',
    // edgeToEdgeEnabled: true,
  },
  plugins: [
    'expo-router',
    [
      'expo-splash-screen',
      {
        image: './assets/images/splash-icon.png',
        imageWidth: 200,
        resizeMode: 'contain',
        backgroundColor: '#ffffff',
        dark: {
          backgroundColor: '#000000',
        },
      },
    ],
    'expo-font',
    'expo-web-browser',
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
}

export default config
