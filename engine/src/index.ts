// @ts-nocheck
// Wick Engine Entry Point for Vite
// This file ensures all modules are bundled in the correct order

// 1. Initialize Wick namespace
import "./Wick.ts";

// 2. Load all libraries in order
import "../lib/paper.js";
import "../lib/base64-arraybuffer.js";
import "../lib/convert-range.js";
import "../lib/croquis.js";
import "../lib/currentTransform.js";
import "../lib/esprima.js";
import "../lib/floodfill.min.js";
import "../lib/howler.js";
import "../lib/hull.js";
import "../lib/invert.min.js";
import "../lib/invert-shim.js";
import "../lib/is-var-name.js";
import "../lib/jszip.js";
import "../lib/lerp.js";
import localforage from "../lib/localforage.min.js";
import "../lib/platform.js";
import "../lib/potrace.js";
import "../lib/reserved-words.js";
import "../lib/roundRect.js";
import "../lib/timestamp.js";
import "../lib/soundcloud-waveform.js";
import "../lib/Tween.js";
import "../lib/uuid.js";

// Expose localforage as a global since the engine code references it directly
if (typeof window !== 'undefined') {
  window.localforage = localforage;
}

// 3. Load all source files in concatenation order
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
import "./export/audio/AudioTrack.ts";
import "./export/autosave/AutoSave.ts";
import "./export/wick/WickFile.ts";
import "./export/wick/WickFile.Alpha.ts";
import "./export/wickobj/WickObjectFile.ts";
import "./export/html/HTMLExport.ts";
import "./export/html/HTMLPreview.ts";
import "./export/svg/SvgFile.ts";
import "./export/image/imageSequence.ts";
import "./export/zip/ZIPExport.ts";
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
import "./tools/Brush.ts";
import "./tools/Cursor.ts";
import "./tools/Ellipse.ts";
import "./tools/Eraser.ts";
import "./tools/Eyedropper.ts";
import "./tools/FillBucket.ts";
import "./tools/Interact.ts";
import "./tools/Line.ts";
import "./tools/None.ts";
import "./tools/Pan.ts";
import "./tools/PathCursor.ts";
import "./tools/Pencil.ts";
import "./tools/Rectangle.ts";
import "./tools/Text.ts";
import "./tools/Zoom.ts";
import "./view/paper-ext/Layer.erase.ts";
import "./view/paper-ext/Paper.hole.ts";
import "./view/paper-ext/Paper.OrderingUtils.ts";
import "./view/paper-ext/Paper.SelectionWidget.ts";
import "./view/paper-ext/Paper.SelectionBox.ts";
import "./view/paper-ext/Path.potrace.ts";
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
import "./gui/Button.ts";
import "./gui/Ghost.ts";
import "./gui/Icons.ts";
import "./gui/ActionButton.ts";
import "./gui/ActionButtonsContainer.ts";
import "./gui/Breadcrumbs.ts";
import "./gui/BreadcrumbsButton.ts";
import "./gui/Frame.ts";
import "./gui/FrameEdgeGhost.ts";
import "./gui/FrameGhost.ts";
import "./gui/FramesContainer.ts";
import "./gui/Layer.ts";
import "./gui/LayerButton.ts";
import "./gui/LayerCreateLabel.ts";
import "./gui/LayersContainer.ts";
import "./gui/NumberLine.ts";
import "./gui/OnionSkinRange.ts";
import "./gui/Playhead.ts";
import "./gui/PopupMenu.ts";
import "./gui/Project.ts";
import "./gui/Scrollbar.ts";
import "./gui/ScrollbarGrabber.ts";
import "./gui/SelectionBox.ts";
import "./gui/Timeline.Legacy.ts";
import "./gui/Tooltip.ts";
import "./gui/Tween.ts";
import "./gui/TweenGhost.ts";

console.log("Wick Engine loaded via Vite build system ::---");

// Re-export window.Wick for module consumers (though we're building as IIFE)
export default (typeof window !== 'undefined' ? window.Wick : {});
