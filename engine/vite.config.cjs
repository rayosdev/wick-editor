const path = require('path');
const fs = require('fs');

// Generate build version (matches Gulp format)
const date = new Date();
const buildVersion = `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}.${date.getHours()}.${date.getMinutes()}.${date.getSeconds()}`;

// Banner with browser shims (matches Gulp exactly)
const banner = `(function() {
// Browser compatibility shims
var require = function(moduleName) {
  // Handle common Node.js modules
  if (moduleName === 'acorn') return { parse: function() { return {}; } };
  if (moduleName === 'jquery') return window.jQuery || window.$ || { fn: {} };
  if (moduleName === './node/self.js') return window;
  if (moduleName === './node/extend.js') return function(obj) { return obj; };
  if (moduleName === './intersect.js') return {};
  if (moduleName === './grid.js') return {};
  if (moduleName === './format.js') return {};
  if (moduleName === './convex.js') return {};
  if (moduleName === './utils') return {};
  if (moduleName === './support') return {};
  // JSZip related modules
  if (moduleName === './external') return {};
  if (moduleName === './stream/DataWorker') return function() {};
  if (moduleName === './stream/DataLengthProbe') return function() {};
  if (moduleName === './stream/Crc32Probe') return function() {};
  if (moduleName === './stream/GenericWorker') return function() {};
  if (moduleName === './flate') return {};
  if (moduleName === 'lie') return { Promise: window.Promise || function() {} };
  if (moduleName === 'pako') return {};
  if (moduleName === '../stream/GenericWorker') return function() {};
  if (moduleName === '../utf8') return {};
  if (moduleName === '../crc32') return {};
  if (moduleName === '../signature') return {};
  if (moduleName === '../compressions') return {};
  if (moduleName === './ZipFileWorker') return function() {};
  if (moduleName === './object') return {};
  if (moduleName === '../utils') return {};
  if (moduleName === '../stream/GenericWorker') return function() {};
  if (moduleName === '../utf8') return {};
  // Default fallback
  return {};
};
var module = { exports: {} }; // Dummy module
// Make \`exports\` a live alias of \`module.exports\` so CommonJS-style
// modules that assign to \`exports\` or \`module.exports\` both work in the
// bundled browser build.
var exports = module.exports;
var global = window; // Map global to window
var self = window; // Map self to window
if (typeof console === "undefined") { 
  var console = { 
    log: function() {}, 
    error: function() {}, 
    warn: function() {}, 
    info: function() {}, 
    debug: function() {} 
  }; 
}
if (typeof process === "undefined") { var process = { env: {} }; }
if (typeof Buffer === "undefined") { var Buffer = function() {}; }
if (typeof __dirname === "undefined") { var __dirname = ""; }
if (typeof __filename === "undefined") { var __filename = ""; }

/*Wick Engine https://github.com/Wicklets/wick-engine*/
var WICK_ENGINE_BUILD_VERSION = "${buildVersion}";

`;

// Footer to expose platform and close IIFE (matches Gulp exactly)
const footer = `
// If any modules exported a \`platform\`-like API into \`module.exports\` (eg platform.js),
// expose it to the browser global so code that expects \`window.platform\` continues to work.
try {
  if (typeof window !== "undefined") {
    if (typeof module !== "undefined" && module && module.exports) {
      if (!window.platform && module.exports && (module.exports.name || module.exports.os)) {
        window.platform = module.exports;
      }
    }
    try {
      if (!window.platform && exports && (exports.name || exports.os)) {
        window.platform = exports;
      }
    } catch (e) {}

    // Defensive: ensure platform.os exists so code reading platform.os.architecture doesn't throw
    try {
      if (window.platform && !window.platform.os) {
        window.platform.os = { architecture: null, family: null, version: null };
      }
    } catch (e) {}
  }
} catch (e) {}

})(); // End IIFE wrapper
`;

/**
 * Rollup plugin to remove "use strict" directives
 * Needed because implicit globals (like WickObjectCache = class) 
 * don't work in strict mode
 */
function removeUseStrictPlugin() {
  return {
    name: 'remove-use-strict',
    enforce: 'post',
    generateBundle(options, bundle) {
      for (const fileName in bundle) {
        const chunk = bundle[fileName];
        if (chunk.type === 'chunk' && chunk.code) {
          // Remove "use strict"; directives that are standalone statements
          // Be careful to only match actual directives, not strings in code
          chunk.code = chunk.code.replace(/^\s*["']use strict["'];?\s*$/gm, '');
        }
      }
    }
  };
}

/**
 * Vite plugin to handle post-build processing
 * Generates emptyproject.html and copies ZIP export resources
 */
function postBuildPlugin() {
  return {
    name: 'post-build',
    closeBundle() {
      const distPath = path.resolve(__dirname, 'dist');
      
      console.log('Running post-build processing...');
      
      // Generate emptyproject.html
      try {
        const projectHtml = fs.readFileSync(
          path.resolve(__dirname, 'src/export/html/project.html'),
          'utf8'
        );
        const engineSrc = fs.readFileSync(
          path.resolve(distPath, 'wickengine.js'),
          'utf8'
        );
        
        // Escape $ in replacement string (same as Gulp)
        const engineSrcSafe = engineSrc.replace(/\$/g, '$$$$');
        const emptyProjectHtml = projectHtml.replace(
          '<!--INJECT_WICKENGINE_HERE-->',
          engineSrcSafe
        );
        
        fs.writeFileSync(
          path.resolve(distPath, 'emptyproject.html'),
          emptyProjectHtml
        );
        
        console.log('✓ emptyproject.html generated');
      } catch (error) {
        console.error('Error generating emptyproject.html:', error.message);
      }
      
      // Copy ZIP export resources
      try {
        const zipIndex = fs.readFileSync(
          path.resolve(__dirname, 'src/export/zip/index.html'),
          'utf8'
        );
        const preloadJs = fs.readFileSync(
          path.resolve(__dirname, 'src/export/zip/preloadjs.min.js'),
          'utf8'
        );
        const projectHtml = fs.readFileSync(
          path.resolve(__dirname, 'src/export/html/project.html'),
          'utf8'
        );
        
        fs.writeFileSync(path.resolve(distPath, 'index.html'), zipIndex);
        fs.writeFileSync(path.resolve(distPath, 'preloadjs.min.js'), preloadJs);
        fs.writeFileSync(path.resolve(distPath, 'project.html'), projectHtml);
        
        console.log('✓ ZIP export resources copied');
      } catch (error) {
        console.error('Error copying ZIP resources:', error.message);
      }
      
      // Log bundle size
      try {
        const stats = fs.statSync(path.resolve(distPath, 'wickengine.js'));
        const sizeMB = (stats.size / 1024 / 1024).toFixed(2);
        console.log(`✓ Bundle size: ${sizeMB} MB`);
      } catch (error) {
        console.error('Error checking bundle size:', error.message);
      }
      
      console.log('Post-build processing complete');
    }
  };
}

module.exports = {
  build: {
    // Use Rollup options directly instead of lib mode to avoid extra wrapper
    rollupOptions: {
      input: path.resolve(__dirname, 'src/index.js'),
      // Don't try to resolve Node.js built-in modules or relative requires from libraries
      external: (id) => {
        // External Node.js modules that our shim will handle
        const nodeModules = [
          './node/self.js',
          './node/extend.js',
          './intersect.js',
          './grid.js',
          './format.js',
          './convex.js',
          './utils',
          './support',
          './external',
          './stream/DataWorker',
          './stream/DataLengthProbe',
          './stream/Crc32Probe',
          './stream/GenericWorker',
          './flate',
          'lie',
          'pako',
          '../stream/GenericWorker',
          '../utf8',
          '../crc32',
          '../signature',
          '../compressions',
          './ZipFileWorker',
          './object',
          '../utils',
          'acorn',
          'jquery'
        ];
        return nodeModules.includes(id);
      },
      output: {
        dir: path.resolve(__dirname, 'dist'),
        entryFileNames: 'wickengine.js',
        banner,
        footer,
        format: 'iife',
        // Don't assign to a name - our code handles window.Wick
        name: undefined,
        inlineDynamicImports: true,
        // Don't add extra wrappers
        extend: false,
        // Map externals to the shimmed versions
        globals: (id) => {
          // Return how to access the external in the global scope
          // Since our shim provides require(), these will be handled by require()
          return `require('${id}')`;
        }
      },
      // Suppress warnings
      onwarn(warning, warn) {
        // Suppress common warnings
        if (warning.code === 'THIS_IS_UNDEFINED') return;
        if (warning.code === 'CIRCULAR_DEPENDENCY') return;
        if (warning.code === 'MISSING_EXPORT') return;
        if (warning.code === 'UNRESOLVED_IMPORT') {
          // These are handled by our require() shim
          return;
        }
        // Show other warnings
        warn(warning);
      }
    },
    outDir: 'dist',
    emptyOutDir: true,
    minify: false,
    sourcemap: true,
    // Increase chunk size warning limit (engine is large)
    chunkSizeWarningLimit: 5000,
    // Ensure all dependencies are bundled
    commonjsOptions: {
      include: [/node_modules/, /lib/],
      transformMixedEsModules: true,
      // Ignore these requires - our shim will handle them
      ignore: [
        './node/self.js',
        './node/extend.js',
        './intersect.js',
        './grid.js',
        './format.js',
        './convex.js',
        'acorn',
        'jquery',
        'lie',
        'pako'
      ]
    }
  },
  plugins: [
    removeUseStrictPlugin(),
    postBuildPlugin()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    },
    extensions: ['.js', '.ts', '.json']
  },
  // Optimize dependencies
  optimizeDeps: {
    include: []
  }
};
