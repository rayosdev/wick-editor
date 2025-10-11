/**
 * Editor-specific Type Definitions
 *
 * These types are specific to the Wick Editor UI and not part of the core engine.
 */

import type {
  WickProject,
  WickAsset,
  CanvasObject,
  TimelineObject,
} from "./core.types";

// ============================================================================
// Tool Settings
// ============================================================================

export interface ToolSettings {
  // Brush Tool
  brushSize: number;
  brushColor: string;
  brushSmoothness: number;
  brushPressureEnabled: boolean;

  // Eraser Tool
  eraserSize: number;
  eraserSmoothness: number;

  // Fill & Stroke
  fillColor: string;
  strokeColor: string;
  strokeWidth: number;

  // Text Tool
  fontFamily: string;
  fontSize: number;
  fontWeight: string;
  fontStyle: string;

  // Eyedropper Tool
  eyedropperTarget: "fill" | "stroke";

  // Additional tool settings
  [key: string]: string | number | boolean;
}

export type ToolSettingKey = keyof ToolSettings;

export interface ToolSettingRestrictions {
  min?: number;
  max?: number;
  step?: number;
  options?: string[];
}

export type ToolSettingRestrictionsMap = Record<
  string,
  ToolSettingRestrictions
>;

export type ToolType =
  | "cursor"
  | "brush"
  | "eraser"
  | "pencil"
  | "rectangle"
  | "ellipse"
  | "line"
  | "text"
  | "fillbucket"
  | "eyedropper"
  | "pathcursor"
  | "zoom"
  | "pan";

// ============================================================================
// Project Settings
// ============================================================================

export interface ProjectSettings {
  name?: string;
  width?: number;
  height?: number;
  framerate?: number;
  backgroundColor?: string;
}

// ============================================================================
// File System (Local Storage)
// ============================================================================

export interface LocalFileEntry {
  handle: FileSystemFileHandle;
  name: string;
  lastModified: number;
}

export interface SavedProject {
  name: string;
  date?: string;
  size?: string;
}

// Warning Modal Info - Base interface
export interface WarningModalInfoBase {
  title: string;
  description: string;
  acceptText: string;
  acceptAction: () => void;
  cancelAction: () => void;
}

// SavedProjects version (has typo in original: canceltText)
export interface SavedProjectsWarningInfo extends WarningModalInfoBase {
  canceltText: string; // Note: typo in original component
}

// GeneralWarning version (has icons and finalAction)
export interface GeneralWarningInfo extends WarningModalInfoBase {
  cancelText: string;
  acceptIcon: string;
  cancelIcon: string;
  finalAction: () => void;
}

// Union type for all warning modal variants
export type WarningModalInfo = SavedProjectsWarningInfo | GeneralWarningInfo;

// Type guard to check if it's GeneralWarningInfo
export function isGeneralWarningInfo(
  info: WarningModalInfo
): info is GeneralWarningInfo {
  return "acceptIcon" in info && "cancelIcon" in info && "finalAction" in info;
}

// Union type for file entries (EditorWrapper uses LocalFileEntry, SavedProjects uses SavedProject)
export type ProjectFileEntry = LocalFileEntry | SavedProject;

// Type guards for file entries
export function isLocalFileEntry(
  file: ProjectFileEntry
): file is LocalFileEntry {
  return "handle" in file && "lastModified" in file;
}

export function isSavedProject(file: ProjectFileEntry): file is SavedProject {
  return "name" in file && !("handle" in file);
}

// ============================================================================
// Asset Library
// ============================================================================

// BuiltinLibrary component version
export interface BuiltinLibraryPreview {
  blob: Blob;
  src?: string;
}

// Editor-level version (different structure!)
export interface BuiltinPreview {
  name: string;
  thumbnail?: string;
  projectData?: WickProject;
}

export interface AssetLibraryItem extends WickAsset {
  inLibrary: boolean;
  preview?: string;
}

// ============================================================================
// Console & Logging
// ============================================================================

export type ConsoleMethod = "log" | "warn" | "error" | "info" | "debug";

export interface ConsoleLogEntry {
  id: string;
  method: ConsoleMethod;
  data: unknown[];
  timestamp: number;
}

// ============================================================================
// Rendering & Export
// ============================================================================

export type RenderType =
  | "gif"
  | "video"
  | "zip"
  | "html"
  | "image-sequence"
  | "audio"
  | "svg";

export interface RenderOptions {
  type: RenderType;
  progress: number;
  statusMessage: string;
}

export type RenderSize = "small" | "medium" | "large" | "full";

// ============================================================================
// Modals & UI State
// ============================================================================

export type ModalName =
  | "CreateNewProjectPrompt"
  | "SettingsModal"
  | "ExportMediaModal"
  | "ReferenceModal"
  | "BuiltinLibrary"
  | "WelcomeModal"
  | "AutosaveWarningModal"
  | "WarningModal"
  | "HotKeySettings"
  | null;

// ============================================================================
// Color Picker
// ============================================================================

export type ColorPickerType = "chrome" | "sketch" | "circle";

// ============================================================================
// Onion Skin
// ============================================================================

export interface OnionSkinOptions {
  enabled: boolean;
  mode: "single" | "multiple";
  forwardCount: number;
  backwardCount: number;
  opacity: number;
}

// ============================================================================
// Keyboard & Hotkeys
// ============================================================================

export interface CustomHotKeys {
  [action: string]: string;
}

export interface HotKeyConfig {
  name: string;
  description: string;
  keys: string;
  category: string;
}

export type HotKeyMap = Record<string, string>;

export type HotKeyMapGroups = Record<string, string[]>;

// ============================================================================
// Inspector Panel
// ============================================================================

export interface InspectorData {
  type: "canvas" | "timeline" | "script" | "asset" | null;
  objects: (CanvasObject | TimelineObject | WickAsset)[];
  attributes: Record<string, unknown>;
}

// ============================================================================
// Timeline Panel
// ============================================================================

export interface TimelineUIState {
  zoom: number;
  scrollX: number;
  scrollY: number;
  selectedFrames: string[]; // identifiers
  selectedTweens: string[]; // identifiers
  layerHeight: number;
}

// ============================================================================
// Canvas Panel
// ============================================================================

export interface CanvasUIState {
  zoom: number;
  panX: number;
  panY: number;
  gridEnabled: boolean;
  rulersEnabled: boolean;
  guidesEnabled: boolean;
}

// ============================================================================
// Toast Notifications
// ============================================================================

export type ToastType = "success" | "info" | "warning" | "error";

export interface ToastOptions {
  autoClose?: number | false;
  hideProgressBar?: boolean;
  closeOnClick?: boolean;
  pauseOnHover?: boolean;
  draggable?: boolean;
  position?:
    | "top-left"
    | "top-right"
    | "top-center"
    | "bottom-left"
    | "bottom-right"
    | "bottom-center";
}

// ============================================================================
// Script Info Interface
// ============================================================================

export interface ScriptObject {
  name: string;
}

export interface Script {
  scripts: ScriptObject[];
}

export interface ScriptInfoInterface {
  projectReference: WickProject;
  scriptOwnerReference: CanvasObject | TimelineObject;
  updateScript: (newSrc: string) => void;
  scriptSrc: string;
  scriptName: string;
}

export interface ScriptWindowScriptInfoInterface {
  scriptsByType: Record<string, string[]>;
  scriptTypeColors: Record<string, string>;
}

// ============================================================================
// Action History
// ============================================================================

export interface ActionOptions {
  actionName: string;
  [key: string]: unknown;
}
