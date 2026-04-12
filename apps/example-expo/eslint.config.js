// https://docs.expo.dev/guides/using-eslint/

import { fixupConfigRules } from '@eslint/compat'
import reactNativeConfig from '@react-native/eslint-config/flat'
import expoConfig from 'eslint-config-expo/flat.js'
import { globalIgnores } from 'eslint/config'

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
  ...dedupePlugins([
    ...fixupConfigRules(expoConfig),
    ...fixupConfigRules(reactNativeConfig),
  ]),

  globalIgnores(['eslint.config.js', 'prettier.config.js', 'app.json', 'dist']),

  {
    rules: {
      'react-native/no-raw-text': 'error',
    },
  },
]
