/// <reference types="vitest" />

import legacy from '@vitejs/plugin-legacy'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    legacy()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom'
  },
  // --- เพิ่มส่วนนี้เข้าไปที่ด้านล่างสุด (ก่อนวงเล็บปีกกาปิดอันสุดท้าย) ---
  server: {
    allowedHosts: [
      'uneventful-kane-reversibly.ngrok-free.dev'
    ]
  }
  // -----------------------------------------------------------
})