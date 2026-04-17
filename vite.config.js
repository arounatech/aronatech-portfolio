import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
  build: {
    target: "es2020",
    sourcemap: false,
    cssCodeSplit: true,
    modulePreload: {
      polyfill: false,
    },
  },
})
