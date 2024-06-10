import { defineConfig } from 'vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    nodePolyfills(),
    react(),
    visualizer({
      filename: './dist/stats.html',
      open: true,
    })
  ],
  build: {
    chunkSizeWarningLimit: 1000, // Increased limit to 1000 kB
    rollupOptions: {
      output: {
        manualChunks: {
          lodash: ['lodash']
        }
      }
    }
  }
})
