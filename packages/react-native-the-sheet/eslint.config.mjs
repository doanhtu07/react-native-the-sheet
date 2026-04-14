import { fixupConfigRules } from '@eslint/compat'
import reactNativeConfig from '@react-native/eslint-config/flat'
import prettier from 'eslint-plugin-prettier'
import { defineConfig } from 'eslint/config'

export default defineConfig([
  ...fixupConfigRules(reactNativeConfig).filter(
    // https://github.com/facebook/react-native/issues/42996#issuecomment-4034672917
    // ft-flow is not compatible with flat config
    (config) => config.plugins?.['ft-flow'] === undefined,
  ),

  {
    ignores: ['node_modules/', 'lib/'],
  },

  {
    plugins: { prettier },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'prettier/prettier': 'error',
    },
  },
])
