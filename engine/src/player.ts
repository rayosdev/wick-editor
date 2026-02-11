// @ts-nocheck
// Wick Player Entry Point for Vite
// This bundle is optimized for exported project playback (no editor timeline GUI modules).

// 1. Initialize Wick namespace
import "./Wick.ts";

// 2. Load all libraries in order
import "../lib/paper.js";
import "../lib/base64-arraybuffer.js";
import "../lib/currentTransform.js";
import "../lib/esprima.js";
import "../lib/howler.js";
import "../lib/hull.js";
import "../lib/is-var-name.js";
import "../lib/jszip.js";
import "../lib/lerp.js";
import localforage from "../lib/localforage.min.js";
import "../lib/platform.js";
import "../lib/reserved-words.js";
import "../lib/Tween.js";
import "../lib/uuid.js";

// Expose localforage as a global since some engine code references it directly.
if (typeof window !== "undefined") {
  window.localforage = localforage;
}

// 3. Load runtime/source files required for project playback
import "./Clipboard.ts";
import "./Color.ts";
import "./FileCache.ts";
import "./History.ts";
import "./ObjectCache.ts";
import "./Transformation.ts";
import "./ToolSettings.ts";
import "./GlobalAPI.ts";
import "./builtinassets/BuiltinAssets.ts";
import "./export/ExportUtils.ts";
import "./export/wick/WickFile.ts";
import "./export/wick/WickFile.Alpha.ts";
import "./base/Base.ts";
import "./base/Layer.ts";
import "./base/Project.ts";
import "./base/Selection.ts";
import "./base/Timeline.ts";
import "./base/Tween.ts";
import "./base/Path.ts";
import "./base/asset/Asset.ts";
import "./base/asset/FileAsset.ts";
import "./base/asset/ClipAsset.ts";
import "./base/asset/GIFAsset.ts";
import "./base/asset/FontAsset.ts";
import "./base/asset/ImageAsset.ts";
import "./base/asset/SoundAsset.ts";
import "./base/asset/SVGAsset.ts";
import "./base/Tickable.ts";
import "./base/Frame.ts";
import "./base/Clip.ts";
import "./base/Button.ts";
import "./tools/Tool.ts";
import "./tools/Interact.ts";
import "./view/paper-ext/Layer.erase.ts";
import "./view/paper-ext/Paper.OrderingUtils.ts";
import "./view/paper-ext/Paper.SelectionWidget.ts";
import "./view/paper-ext/Paper.SelectionBox.ts";
import "./view/paper-ext/TextItem.edit.ts";
import "./view/paper-ext/View.pressure.ts";
import "./view/paper-ext/View.gestures.ts";
import "./view/paper-ext/View.scrollToZoom.ts";
import "./view/View.ts";
import "./view/View.Project.ts";
import "./view/View.Selection.ts";
import "./view/View.Clip.ts";
import "./view/View.Button.ts";
import "./view/View.Timeline.ts";
import "./view/View.Layer.ts";
import "./view/View.Frame.ts";
import "./view/View.Path.Legacy.ts";
import "./gui/GUIElement.Legacy.ts";

console.log("Wick Player bundle loaded via Vite build system ::---");

// Re-export window.Wick for module consumers (though we're building as IIFE)
export default (typeof window !== "undefined" ? window.Wick : {});
