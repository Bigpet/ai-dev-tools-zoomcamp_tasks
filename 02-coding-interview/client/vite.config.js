import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteStaticCopy } from 'vite-plugin-static-copy'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        // Pyodide files
        {
          src: 'node_modules/pyodide/pyodide.js',
          dest: 'assets/pyodide'
        },
        {
          src: 'node_modules/pyodide/pyodide.asm.js',
          dest: 'assets/pyodide'
        },
        {
          src: 'node_modules/pyodide/pyodide.asm.wasm',
          dest: 'assets/pyodide'
        },
        {
          src: 'node_modules/pyodide/python_stdlib.zip',
          dest: 'assets/pyodide'
        },
        {
          src: 'node_modules/pyodide/pyodide-lock.json',
          dest: 'assets/pyodide'
        }
      ]
    })
  ],
  worker: {
    format: 'es',
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
  },
})
