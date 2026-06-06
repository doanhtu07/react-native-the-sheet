// https://docs.expo.dev/guides/using-eslint/

import { fixupConfigRules } from '@eslint/compat'
import reactNativeConfig from '@react-native/eslint-config/flat'
import expoConfig from 'eslint-config-expo/flat.js'
import { globalIgnores } from 'eslint/config'
import prettier from 'eslint-plugin-prettier'
import * as espree from 'espree'

/** @param {import('eslint').Linter.Config[]} configs */
function dedupePlugins(configs) {
  const seen = new Set()

  return configs.map((config) => {
    if (!config.plugins) return config

    // Prevent duplicated plugins from different configs
    const plugins = Object.fromEntries(
      Object.entries(config.plugins).filter(([key]) => {
        if (seen.has(key)) return false
        seen.add(key)
        return true
      }),
    )

    return { ...config, plugins }
  })
}

export default [
  globalIgnores(['eslint.config.js', 'prettier.config.js', 'app.json', 'dist']),

  ...dedupePlugins([
    ...fixupConfigRules(expoConfig),
    ...fixupConfigRules(reactNativeConfig),
  ]),

  // Expo plugins
  {
    files: ['./plugins/**/*.js'],
    languageOptions: {
      // Override parser @babel/eslint-parser from reactNativeConfig, which causes issues with eslint v10
      parser: espree,
      parserOptions: {
        requireConfigFile: false,
      },
    },
  },

  // Prettier
  {
    plugins: { prettier },
    rules: {
      'prettier/prettier': 'warn',
    },
  },

  // React
  {
    rules: {
      'react/react-in-jsx-scope': 'off',
    },
  },

  // React Native
  {
    rules: {
      'react-native/no-raw-text': [
        'error',
        {
          skip: ['ThemedText'],
        },
      ],

      'react-native/sort-styles': 'warn',
      'react-native/no-unused-styles': 'warn',
    },
  },
]
