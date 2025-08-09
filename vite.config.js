import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          [
            'babel-plugin-styled-components',
            {
              displayName: true,
              fileName: false
            }
          ]
        ]
      }
    }), 
    svgr()
  ],
  // The build output directory.
  build: {
    outDir: 'build'
  },
  resolve: {
    alias: {
      'Editor': path.resolve(__dirname, './src/Editor'),
      'resources': path.resolve(__dirname, './src/resources'),
      'Wick': path.resolve(__dirname, './src/Wick')
    }
  },
  define: {
    'process.env': {},
    'global': {}
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
}) 