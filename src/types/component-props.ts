/**
 * Component Props Interface Definitions
 * Centralized location for all React component prop types
 */

import { TODO_ANY } from './utility';

// MenuBar child component props
export interface MenuBarButtonProps {
  text: string;
  action: () => void;
  color?: string;
}

export interface MenuBarIconButtonProps {
  id?: string;
  tooltip?: string;
  action: () => void;
  icon: string;
  tooltipPlace?: string;
}

export interface MenuBarSupportButtonProps {
  icon: string;
  text?: string;
  id: string;
  action: () => void;
}

// MenuBar component props
export interface MenuBarProps {
  renderSize: string;
  openModal: (name: TODO_ANY) => void;
  projectName: TODO_ANY;
  openProjectFileDialog: () => void;
  openNewProjectConfirmation: () => void;
  exportProjectAsWickFile: () => void;
  importProjectAsWickFile: (file: TODO_ANY) => void;
  exporting?: boolean;
  toast: (message: TODO_ANY, type: TODO_ANY, options: TODO_ANY) => TODO_ANY;
  keyMap?: TODO_ANY; // Make keyMap optional since it's not always passed
  openExportMedia: () => void;
  openExportOptions: () => void;
}

// Toolbox component props
export interface ToolboxProps {
  project: TODO_ANY;
  getActiveToolName: () => TODO_ANY;
  activeToolName: TODO_ANY;
  setActiveTool: (newTool: TODO_ANY) => void;
  getToolSetting: (name: TODO_ANY) => TODO_ANY;
  setToolSetting: (name: TODO_ANY, value: TODO_ANY) => void;
  renderSize: string;
  keyMap: TODO_ANY;
  setCanvasBackgroundColor?: (color: TODO_ANY) => void;
  zoomIn?: () => void;
  zoomOut?: () => void;
  recenterCanvas?: () => void;
  colorPickerType: TODO_ANY;
  changeColorPickerType: (type: TODO_ANY) => void;
  previewPlaying?: boolean; // Add missing prop
  togglePreviewPlaying?: () => void; // Add missing prop
  editorActions: TODO_ANY; // Add missing prop
  getToolSettingRestrictions: (name: TODO_ANY) => TODO_ANY;
  showCanvasActions: TODO_ANY;
  showBrushModes: TODO_ANY;
  // These callbacks are sometimes called with a state argument at runtime.
  // Allow an optional parameter for gradual typing; we'll refine types later.
  toggleCanvasActions: (state?: TODO_ANY) => void;
  toggleBrushModes: (state?: TODO_ANY) => void;
  updateLastColors: (colors: TODO_ANY) => void;
  lastColorsUsed: TODO_ANY;
}

// CanvasTransforms component props
export interface CanvasTransformsProps {
  onionSkinEnabled: TODO_ANY;
  toggleOnionSkin: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
  recenterCanvas: () => void;
  activeToolName: TODO_ANY;
  setActiveTool: (newTool: TODO_ANY) => void;
  previewPlaying?: boolean;
  togglePreviewPlaying: () => void;
  renderSize: string;
  keyMap: TODO_ANY;
}

// OutlinerExpandButton component props
export interface OutlinerExpandButtonProps {
  expanded?: boolean;
  toggleOutliner: () => void;
}

// Outliner component props
export interface OutlinerProps {
  className?: string;
  project: TODO_ANY;
  selectObjects: (objects: TODO_ANY) => void;
  deselectObjects: (objects: TODO_ANY) => void;
  clearSelection: () => void;
  editScript: (scriptName: TODO_ANY) => void;
  setFocusObject: (object: TODO_ANY) => void;
  setActiveLayerIndex: (index: TODO_ANY) => void;
  moveSelection: (target: TODO_ANY, index: TODO_ANY) => void;
  toggleHidden: (layer: TODO_ANY) => void;
  toggleLocked: (layer: TODO_ANY) => void;
  renderSize?: string; // Make renderSize optional since it's not always passed
}

// MobileContainer component props
export interface MobileContainerProps {
  project: TODO_ANY;
  projectDidChange: (options: TODO_ANY) => void;
  projectData: TODO_ANY;
  getSelectedTimelineObjects: () => TODO_ANY;
  setOnionSkinOptions: TODO_ANY;
  getOnionSkinOptions: TODO_ANY;
  setFocusObject: (object: TODO_ANY) => void;
  addSoundToActiveFrame: (soundAsset: TODO_ANY) => void;
  [key: string]: TODO_ANY; // Allow additional props for now
}

// Inspector component props
export interface InspectorProps {
  getToolSetting: (name: TODO_ANY) => TODO_ANY;
  setToolSetting: (name: TODO_ANY, value: TODO_ANY) => void;
  getSelectionType: () => TODO_ANY;
  getAllSoundAssets: () => TODO_ANY;
  getAllSelectionAttributes: () => {};
  setSelectionAttribute: (attribute: TODO_ANY, newValue: TODO_ANY) => void;
  getClipAnimationTypes: () => TODO_ANY[];
  [key: string]: TODO_ANY; // Allow additional props for now
}

// AssetLibrary component props
export interface AssetLibraryProps {
  projectData: TODO_ANY;
  assets: TODO_ANY;
  openModal: (name: TODO_ANY) => void;
  openImportAssetFileDialog: () => void;
  selectObjects: (objects: TODO_ANY) => void;
  clearSelection: () => void;
  isObjectSelected: (object: TODO_ANY) => TODO_ANY;
  addSoundToActiveFrame: (soundAsset: TODO_ANY) => void;
  [key: string]: TODO_ANY; // Allow additional props for now
}

// MenuBar child component props
export interface MenuBarButtonProps {
  text: string;
  action: () => void;
  color?: string;
}

export interface MenuBarIconButtonProps {
  id?: string;
  tooltip?: string;
  action: () => void;
  icon: string;
  tooltipPlace?: string;
}

export interface MenuBarSupportButtonProps {
  icon: string;
  text?: string;
  id: string;
  action: () => void;
}
