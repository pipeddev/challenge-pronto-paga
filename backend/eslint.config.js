import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist', 'node_modules'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.ts'],
    languageOptions: { globals: globals.node },
    rules: {
      // Permite parámetros sin usar con prefijo _ (ej: _next en el error handler)
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      // Necesario para extender Express.Request en express.d.ts
      '@typescript-eslint/no-namespace': ['error', { allowDeclarations: true }],
    },
  },
);
