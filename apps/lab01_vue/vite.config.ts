/// <reference types="vitest" />

import legacy from '@vitejs/plugin-legacy'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/mobileweb/lab01_vue',
  plugins: [
    vue(),
    legacy()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
    build: {
    outDir: path.resolve(__dirname, '../../docs/lab01_vue'),
    emptyOutDir: true,
  },
  test: {
    globals: true,
    environment: 'jsdom'
  }
})
