import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  // Ignore build output, Storybook output, and vendored Untitled UI code (their components,
  // hooks, and CLI-synced utils are third-party — we don't lint their style).
  globalIgnores([
    'dist',
    'storybook-static',
    'src/components/**',
    'src/hooks/**',
    'src/utils/cx.ts',
    'src/utils/is-react-component.ts',
    'src/providers/theme-provider.tsx',
  ]),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
  },
])
