import { defineConfig } from 'oxfmt';

export default defineConfig({
  singleQuote: true,
  printWidth: 80,
  ignorePatterns: ['package-lock.json', '*.d.ts', 'dist', 'src/data'],
  overrides: [
    {
      files: ['**/*.yml'],
      options: {
        singleQuote: false,
      },
    },
  ],
  sortImports: {
    sortSideEffects: true,
  },
});
