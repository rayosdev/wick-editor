const path = require('path');

/**
 * CommonJS Vite config wrapper to ensure the config loads under CommonJS environments
 */
module.exports = {
  root: './',
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.js'),
      name: 'Wick',
      fileName: () => 'wickengine.js',
      formats: ['umd']
    },
    outDir: 'dist',
    rollupOptions: {
      external: [],
      output: {
        name: 'Wick',
        format: 'umd',
        inlineDynamicImports: true
      },
      onwarn(warning) {
        if (warning.code === 'THIS_IS_UNDEFINED') return;
      }
    },
    minify: false,
    sourcemap: true
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
};
