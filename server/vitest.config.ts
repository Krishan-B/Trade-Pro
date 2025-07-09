import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node', // Crucial for server-side tests
    setupFiles: ['./tests/setup.ts'], // Relative to server directory
    include: ['src/__tests__/**/*.test.ts', 'src/**/*.test.ts'], // Scan for tests within server/src
    deps: {
      interopDefault: true, // For better CJS/ESM interop
    },
    ssr: {
      external: [/^node_modules\/.*/], // Externalize all node_modules for SSR/node environment
    },
    alias: {
      '@server': path.resolve(__dirname, './src'),
      '@shared': path.resolve(__dirname, '../shared'),
    },
  },
  // resolve: { // Aliases in `test.alias` are generally preferred for Vitest
  //   alias: {
  //     '@server': path.resolve(__dirname, './src'),
  //     '@shared': path.resolve(__dirname, '../shared'),
  //   },
  // },
});
