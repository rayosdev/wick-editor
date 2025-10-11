/**
 * Central export point for all Wick Editor types
 */

// Core Wick Engine Types
export type {
  // Base Types
  Transformation,
  EasingType,
  AssetType,

  // Project Structure
  WickProject,

  // Timeline Objects
  WickTimeline,
  WickLayer,
  WickFrame,
  WickTween,

  // Canvas Objects
  WickClip,
  WickPath,
  WickText,

  // Assets
  WickAsset,
  WickImageAsset,
  WickSoundAsset,

  // Scripts & Sounds
  WickScript,
  WickSound,

  // Selection
  WickSelection,

  // Union Types
  CanvasObject,
  TimelineObject,
  ScriptableObject,
  SelectableObject,
  WickObject,
} from "./core.types";

// Core Type Guards
export {
  isWickProject,
  isWickClip,
  isWickFrame,
  isWickPath,
  isWickTween,
  isWickAsset,
  isCanvasObject,
  isTimelineObject,
} from "./core.types";

// Editor-specific Types
export type {
  // Tool Settings
  ToolSettings,
  ToolSettingKey,
  ToolSettingRestrictions,
  ToolSettingRestrictionsMap,
  ToolType,

  // Project Settings
  ProjectSettings,

  // File System
  LocalFileEntry,
  SavedProject,
  ProjectFileEntry,

  // Asset Library
  BuiltinPreview,
  BuiltinLibraryPreview,
  AssetLibraryItem,

  // Console & Logging
  ConsoleMethod,
  ConsoleLogEntry,

  // Rendering & Export
  RenderType,
  RenderOptions,
  RenderSize,

  // Modals & UI State
  ModalName,
  WarningModalInfo,
  WarningModalInfoBase,
  SavedProjectsWarningInfo,
  GeneralWarningInfo,

  // Color Picker
  ColorPickerType,

  // Onion Skin
  OnionSkinOptions,

  // Keyboard & Hotkeys
  CustomHotKeys,
  HotKeyConfig,
  HotKeyMap,
  HotKeyMapGroups,

  // Inspector Panel
  InspectorData,

  // Timeline Panel
  TimelineUIState,

  // Canvas Panel
  CanvasUIState,

  // Toast Notifications
  ToastType,
  ToastOptions,

  // Script Info Interface
  ScriptObject,
  Script,
  ScriptInfoInterface,
  ScriptWindowScriptInfoInterface,

  // Action History
  ActionOptions,
} from "./editor.types";

// Export type guards from editor.types
export {
  isGeneralWarningInfo,
  isLocalFileEntry,
  isSavedProject,
} from "./editor.types";

// Selection Interface Types
export type {
  SelectionInterface,
  SelectionAttribute,
  SelectionAttributeValue,
} from "./selection.types";
