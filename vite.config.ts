import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import fs from 'fs'

// Custom plugin to copy manifest.json to dist/
const copyManifest = () => {
  return {
    name: 'copy-manifest',
    closeBundle() {
      if (fs.existsSync('manifest.json')) {
        fs.copyFileSync('manifest.json', 'dist/manifest.json')
        console.log('manifest.json copied to dist/')
      }
    }
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), copyManifest()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        content: resolve(__dirname, 'src/content/index.ts'),
        background: resolve(__dirname, 'src/background/index.ts'),
      },
      output: {
        entryFileNames: (chunkInfo) => {
          if (chunkInfo.name === 'content') return 'content.js'
          if (chunkInfo.name === 'background') return 'background.js'
          return 'assets/[name]-[hash].js'
        }
      }
    },
    outDir: 'dist',
    emptyOutDir: true
  }
})
