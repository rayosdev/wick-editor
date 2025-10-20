var fs = require("fs");
var footer = require("gulp-footer");
var gulp = require("gulp");
var babel = require("gulp-babel");
var concat = require("gulp-concat");
var rename = require("gulp-rename");
var uglify = require("gulp-uglify");
var header = require("gulp-header");
var mergeStream = require("merge-stream");
var ts = require("gulp-typescript");
var path = require("path");

gulp.task("default", function () {
  /* Generate build number */
  /* Year.Month.Day[micro] */
  var date = new Date();
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var hour = date.getHours();
  var minute = date.getMinutes();
  var second = date.getSeconds();
  var buildString =
    year + "." + month + "." + day + "." + hour + "." + minute + "." + second;

  /* Libraries */
  var libs = gulp
    .src([
      "lib/paper.js",
      "lib/base64-arraybuffer.js",
      "lib/convert-range.js",
      "lib/croquis.js",
      "lib/currentTransform.js",
      "lib/esprima.js",
      "lib/floodfill.min.js",
      "lib/howler.js",
      "lib/hull.js",
      "lib/invert.min.js",
      "lib/invert-shim.js",
      "lib/is-var-name.js",
      // jQuery removed - using native browser APIs
      // "lib/jquery-3.3.1.min.js",
      // "lib/jquery.pressure.js",
      // "lib/jquery.mousewheel.js",
      "lib/jszip.js",
      "lib/lerp.js",
      "lib/localforage.min.js",
      "lib/platform.js",
      "lib/potrace.js",
      "lib/reserved-words.js",
      "lib/roundRect.js",
      "lib/timestamp.js",
      "lib/soundcloud-waveform.js",
      "lib/Tween.js",
      "lib/uuid.js",
    ])
    .pipe(concat("libs.js"));

  /* Engine */
  // Helper function to resolve file (handles both .ts and .js)
  function resolveSourceFile(fileName) {
    var tsPath = path.join("src", fileName.replace(/\.js$/, ".ts"));
    var jsPath = path.join("src", fileName);
    if (fs.existsSync(tsPath)) {
      return tsPath;
    }
    return jsPath;
  }

  // List of source files (specify without extension, gulp will find .ts or .js)
  var srcFiles = [
    "Wick",
    "Clipboard",
    "Color",
    "FileCache",
    "History",
    "ObjectCache",
    "Transformation",
    "ToolSettings",
    "ObjectCache",
    "Transformation",
    "GlobalAPI",
    "builtinassets/BuiltinAssets",
    "export/ExportUtils",
    "export/audio/AudioTrack",
    "export/autosave/AutoSave",
    "export/wick/WickFile",
    "export/wick/WickFile.Alpha",
    "export/wickobj/WickObjectFile",
    "export/html/HTMLExport",
    "export/html/HTMLPreview",
    "export/svg/SvgFile",
    "export/image/ImageSequence",
    "export/zip/ZIPExport",
    "base/Base",
    "base/Layer",
    "base/Project",
    "base/Selection",
    "base/Timeline",
    "base/Tween",
    "base/Path",
    "base/asset/Asset",
    "base/asset/FileAsset",
    "base/asset/FontAsset",
    "base/asset/ImageAsset",
    "base/asset/ClipAsset",
    "base/asset/GIFAsset",
    "base/asset/SoundAsset",
    "base/asset/SVGAsset",
    "base/Tickable",
    "base/Frame",
    "base/Clip",
    "base/Button",
    "tools/Tool",
    "tools/Brush",
    "tools/Cursor",
    "tools/Ellipse",
    "tools/Eraser",
    "tools/Eyedropper",
    "tools/FillBucket",
    "tools/Interact",
    "tools/Line",
    "tools/None",
    "tools/Pan",
    "tools/PathCursor",
    "tools/Pencil",
    "tools/Rectangle",
    "tools/Text",
    "tools/Zoom",
    "view/paper-ext/Layer.erase",
    "view/paper-ext/Paper.hole",
    "view/paper-ext/Paper.OrderingUtils",
    "view/paper-ext/Paper.SelectionWidget",
    "view/paper-ext/Paper.SelectionBox",
    "view/paper-ext/Path.potrace",
    "view/paper-ext/TextItem.edit",
    "view/paper-ext/View.pressure",
    "view/paper-ext/View.gestures",
    "view/paper-ext/View.scrollToZoom",
    "view/View",
    "view/View.Project",
    "view/View.Selection",
    "view/View.Clip",
    "view/View.Button",
    "view/View.Timeline",
    "view/View.Layer",
    "view/View.Frame",
    "view/View.Path",
    "gui/GUIElement",
    "gui/Button",
    "gui/Ghost",
    "gui/Icons",
    "gui/ActionButton",
    "gui/ActionButtonsContainer",
    "gui/Breadcrumbs",
    "gui/BreadcrumbsButton",
    "gui/Frame",
    "gui/FrameEdgeGhost",
    "gui/FrameGhost",
    "gui/FramesContainer",
    "gui/Layer",
    "gui/LayerButton",
    "gui/LayerCreateLabel",
    "gui/LayersContainer",
    "gui/NumberLine",
    "gui/OnionSkinRange",
    "gui/Playhead",
    "gui/PopupMenu",
    "gui/Project",
    "gui/Scrollbar",
    "gui/ScrollbarGrabber",
    "gui/SelectionBox",
    "gui/Timeline",
    "gui/Tooltip",
    "gui/Tween",
    "gui/TweenGhost",
  ];

  // Map to full paths
  var srcPaths = srcFiles.map(function (fileName) {
    return resolveSourceFile(fileName + ".js");
  });

  var src = gulp
    .src(srcPaths)
    .pipe(
      ts({
        noImplicitAny: false,
        allowJs: true,
        strict: false,
        target: "es2017",
        module: "esnext",
        skipLibCheck: true,
        esModuleInterop: true,
      })
    )
    .pipe(babel())
    .pipe(concat("src.js"));

  /* Write wickengine.js */
  return mergeStream(src, libs)
    .pipe(concat("wickengine.js"))
    .pipe(
      header(
        "(function() {\n// Browser compatibility shims\nvar require = function(moduleName) {\n  // Handle common Node.js modules\n  if (moduleName === 'acorn') return { parse: function() { return {}; } };\n  if (moduleName === 'jquery') return window.jQuery || window.$ || { fn: {} };\n  if (moduleName === './node/self.js') return window;\n  if (moduleName === './node/extend.js') return function(obj) { return obj; };\n  if (moduleName === './intersect.js') return {};\n  if (moduleName === './grid.js') return {};\n  if (moduleName === './format.js') return {};\n  if (moduleName === './convex.js') return {};\n  if (moduleName === './utils') return {};\n  if (moduleName === './support') return {};\n  // JSZip related modules\n  if (moduleName === './external') return {};\n  if (moduleName === './stream/DataWorker') return function() {};\n  if (moduleName === './stream/DataLengthProbe') return function() {};\n  if (moduleName === './stream/Crc32Probe') return function() {};\n  if (moduleName === './stream/GenericWorker') return function() {};\n  if (moduleName === './flate') return {};\n  if (moduleName === 'lie') return { Promise: window.Promise || function() {} };\n  if (moduleName === 'pako') return {};\n  if (moduleName === '../stream/GenericWorker') return function() {};\n  if (moduleName === '../utf8') return {};\n  if (moduleName === '../crc32') return {};\n  if (moduleName === '../signature') return {};\n  if (moduleName === '../compressions') return {};\n  if (moduleName === './ZipFileWorker') return function() {};\n  if (moduleName === './object') return {};\n  if (moduleName === '../utils') return {};\n  if (moduleName === '../stream/GenericWorker') return function() {};\n  if (moduleName === '../utf8') return {};\n  // Default fallback\n  return {};\n};\nvar module = { exports: {} }; // Dummy module\n// Make `exports` a live alias of `module.exports` so CommonJS-style\n// modules that assign to `exports` or `module.exports` both work in the\n// bundled browser build.\nvar exports = module.exports;\nvar global = window; // Map global to window\nvar self = window; // Map self to window\nif (typeof console === \"undefined\") { var console = { log: function() {}, error: function() {} }; }\nif (typeof process === \"undefined\") { var process = { env: {} }; }\nif (typeof Buffer === \"undefined\") { var Buffer = function() {}; }\nif (typeof __dirname === \"undefined\") { var __dirname = \"\"; }\nif (typeof __filename === \"undefined\") { var __filename = \"\"; }\n\n/*Wick Engine https://github.com/Wicklets/wick-engine*/\nvar WICK_ENGINE_BUILD_VERSION = \"" +
          buildString +
          '";\n\n'
      )
    )
    .pipe(
      footer(
        '\n// If any modules exported a `platform`-like API into `module.exports` (eg platform.js),\n// expose it to the browser global so code that expects `window.platform` continues to work.\ntry {\n  if (typeof window !== "undefined") {\n    if (typeof module !== "undefined" && module && module.exports) {\n      if (!window.platform && module.exports && (module.exports.name || module.exports.os)) {\n        window.platform = module.exports;\n      }\n    }\n    try {\n      if (!window.platform && exports && (exports.name || exports.os)) {\n        window.platform = exports;\n      }\n    } catch (e) {}\n\n    // Defensive: ensure platform.os exists so code reading platform.os.architecture doesn\'t throw\n    try {\n      if (window.platform && !window.platform.os) {\n        window.platform.os = { architecture: null, family: null, version: null };\n      }\n    } catch (e) {}\n  }\n} catch (e) {}\n\n})(); // End IIFE wrapper\n'
      )
    )
    .pipe(gulp.dest("dist"))
    .on("end", () => {
      /* Generate empty HTML file ready for wick projects to be injected into */
      var blankHTML = fs.readFileSync("src/export/html/project.html", "utf8");
      var engineSRC = fs.readFileSync("dist/wickengine.js", "utf8");
      var engineSRCSafe = engineSRC.replace(/\$/g, "$$$"); // http://forums.mozillazine.org/viewtopic.php?f=19&t=2182187
      blankHTML = blankHTML.replace(
        "<!--INJECT_WICKENGINE_HERE-->",
        engineSRCSafe
      );
      fs.writeFileSync("dist/emptyproject.html", blankHTML);

      /* Copy ZIP export resources to dist folder */
      var zipindex = fs.readFileSync("src/export/zip/index.html", "utf8");
      var preloadjs = fs.readFileSync(
        "src/export/zip/preloadjs.min.js",
        "utf8"
      );
      var projecthtml = fs.readFileSync("src/export/html/project.html", "utf8");
      fs.writeFileSync("dist/index.html", zipindex);
      fs.writeFileSync("dist/preloadjs.min.js", preloadjs);
      fs.writeFileSync("dist/project.html", projecthtml);
    });
});
