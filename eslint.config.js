import eslint from '@eslint/js'
import globals from 'globals'

export default [
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'src/**/*.ts',
      'src/**/*.tsx',
      'src/**/*.css',
    ],
  },
  eslint.configs.recommended,
  {
    files: ['**/*.js', '**/*.jsx'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
  {
    files: ['**/*.jsx'],
    rules: {
      // JSX-Verwendungen werden ohne eslint-plugin-react nicht als Variablenverwendung erkannt.
      'no-unused-vars': 'off',
    },
  },
]
