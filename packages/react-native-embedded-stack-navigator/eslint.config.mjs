import { fixupConfigRules } from '@eslint/compat'
import reactNativeConfig from '@react-native/eslint-config/flat'
import prettier from 'eslint-plugin-prettier'
import { defineConfig } from 'eslint/config'

export default defineConfig([
  ...fixupConfigRules(reactNativeConfig),

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
