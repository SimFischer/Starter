/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Relative base + hash routing: the build runs unchanged on GitHub Pages
// (repository sub-path) and from any static host.
export default defineConfig({
  base: './',
  plugins: [react()],
  server: { port: 5173, strictPort: true },
  build: { target: 'es2022', assetsInlineLimit: 4096 },
  test: { include: ['tests/**/*.test.ts'], environment: 'node' },
});
