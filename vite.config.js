import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteImagemin from 'vite-plugin-imagemin'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteImagemin({
      gifsicle: { optimizationLevel: 7 },
      mozjpeg: { quality: 70 },
      pngquant: { quality: [0.6, 0.8] },
      svgo: { plugins: [{ removeViewBox: false }] },
    }),
  ],
  server: {
    proxy: {
      '/api': 'http://localhost:5000',
    },
  },
})
