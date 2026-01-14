/**
 * TypeScript definitions for Wick Engine
 * 
 * This file provides type definitions for the Wick Engine namespace,
 * which is written in JavaScript but used throughout the TypeScript editor.
 * 
 * These types enable proper type checking and IDE support when working
 * with Wick Engine objects.
 */

/**
 * Serialized representation of a Wick object
 */
export interface SerializedWickObject {
  uuid: string;
  identifier?: string | null;
  name?: string | null;
  classname: string;
  [key: string]: any;
}

/**
 * Serialized representation of a Wick Project
 */
export interface SerializedProject extends SerializedWickObject {
  classname: 'Project';
  name: string;
  width: number;
  height: number;
  framerate: number;
  backgroundColor: string;
  onionSkinEnabled: boolean;
  onionSkinSeekForwards: number;
  onionSkinSeekBackwards: number;
  focus: string; // UUID of focused clip
  metadata?: any;
}

/**
 * Wick Color class
 */
export interface WickColor {
  r: number;
  g: number;
  b: number;
  a: number;
  hex: string;
  rgba: string;
  hue: number;
  saturation: number;
  brightness: number;
  
  constructor(color?: string): WickColor;
  clone(): WickColor;
  equals(color: WickColor): boolean;
}

/**
 * Wick Transformation
 */
export interface WickTransformation {
  x: number;
  y: number;
  scaleX: number;
  scaleY: number;
  rotation: number;
  opacity: number;
  values: {
    x: number;
    y: number;
    scaleX: number;
    scaleY: number;
    rotation: number;
    opacity: number;
  };
  
  constructor(args?: Partial<WickTransformation>): WickTransformation;
  clone(): WickTransformation;
  applyToPoint(point: { x: number; y: number }): { x: number; y: number };
}

/**
 * Wick Selection
 */
export interface WickSelection {
  uuid: string;
  selectedObjects: string[]; // UUIDs
  selectedObjectsList: WickSelectableObject[];
  fillColor: string;
  strokeColor: string;
  widgetRotation: number;
  pivotPoint: { x: number; y: number };
  originalWidth: number;
  originalHeight: number;
  
  constructor(args?: any): WickSelection;
  clear(): void;
  select(object: WickSelectableObject): void;
  deselect(object: WickSelectableObject): void;
  selectAll(): void;
  isEmpty(): boolean;
  get(type?: string): WickSelectableObject[];
  serialize(): SerializedWickObject;
}

/**
 * Wick History (Undo/Redo)
 */
export interface WickHistory {
  project: WickProject | null;
  states: any[];
  currentStateIndex: number;
  
  constructor(): WickHistory;
  pushState(stateType: string): void;
  undo(): void;
  redo(): void;
  canUndo(): boolean;
  canRedo(): boolean;
  clear(): void;
  get numUndoStates(): number;
}

/**
 * Wick Clipboard
 */
export interface WickClipboard {
  objects: WickSelectableObject[];
  
  constructor(): WickClipboard;
  copy(objects: WickSelectableObject[]): void;
  cut(objects: WickSelectableObject[]): void;
  paste(): WickSelectableObject[];
  isEmpty(): boolean;
  clear(): void;
}

/**
 * Wick Tool Settings
 */
export interface WickToolSettings {
  settings: Record<string, any>;
  
  constructor(): WickToolSettings;
  getSetting(name: string): any;
  setSetting(name: string, value: any): void;
  onSettingsChanged(callback: (name: string, value: any) => void): void;
}

/**
 * Base class for all Wick objects
 */
export interface WickBase {
  uuid: string;
  identifier: string | null;
  name: string | null;
  classname: string;
  project: WickProject | null;
  parent: WickBase | null;
  children: WickBase[];
  view: any; // Paper.js view
  guiElement: any; // GUI element
  needsAutosave: boolean;
  _temporary: boolean;
  
  constructor(args?: any): WickBase;
  serialize(args?: any): SerializedWickObject;
  _serialize(args?: any): SerializedWickObject;
  _deserialize(data: any): void;
  clone(): WickBase;
  remove(): void;
  addChild(child: WickBase): void;
  removeChild(child: WickBase): void;
}

/**
 * Wick Timeline
 */
export interface WickTimeline extends WickBase {
  classname: 'Timeline';
  layers: WickLayer[];
  activeLayer: WickLayer;
  activeLayerIndex: number;
  
  constructor(args?: any): WickTimeline;
  addLayer(layer: WickLayer, index?: number): void;
  removeLayer(layer: WickLayer): void;
  getLayer(index: number): WickLayer | null;
  getLayerIndex(layer: WickLayer): number;
}

/**
 * Wick Layer
 */
export interface WickLayer extends WickBase {
  classname: 'Layer';
  frames: WickFrame[];
  activeFrame: WickFrame;
  locked: boolean;
  visible: boolean;
  
  constructor(args?: any): WickLayer;
  addFrame(frame: WickFrame, index?: number): void;
  removeFrame(frame: WickFrame): void;
  getFrame(index: number): WickFrame | null;
  getFrameIndex(frame: WickFrame): number;
}

/**
 * Wick Frame
 */
export interface WickFrame extends WickBase {
  classname: 'Frame';
  start: number;
  end: number;
  clips: WickClip[];
  tweens: WickTween[];
  
  constructor(args?: any): WickFrame;
  addClip(clip: WickClip): void;
  removeClip(clip: WickClip): void;
  getClip(index: number): WickClip | null;
  addTween(tween: WickTween): void;
  removeTween(tween: WickTween): void;
}

/**
 * Wick Tween
 */
export interface WickTween extends WickBase {
  classname: 'Tween';
  property: string;
  startValue: any;
  endValue: any;
  startFrame: number;
  endFrame: number;
  easing: string;
  
  constructor(args?: any): WickTween;
}

/**
 * Wick Path
 */
export interface WickPath extends WickBase {
  classname: 'Path';
  fillColor: string;
  strokeColor: string;
  strokeWidth: number;
  viewItem: any; // Paper.js Path item
  
  constructor(args?: any): WickPath;
  remove(): void;
  clone(): WickPath;
}

/**
 * Wick Clip
 */
export interface WickClip extends WickBase {
  classname: 'Clip';
  timeline: WickTimeline;
  transformation: WickTransformation;
  animationType: 'loop' | 'single' | 'playOnce';
  singleFrameNumber: number;
  assetSourceUUID: string | null;
  isSynced: boolean;
  cursor: string;
  
  constructor(args?: any): WickClip;
  addObjects(objects: WickBase[]): void;
  removeObject(object: WickBase): void;
  play(): void;
  stop(): void;
  get currentFrame(): WickFrame | null;
}

/**
 * Wick Asset (base)
 */
export interface WickAsset extends WickBase {
  classname: 'Asset' | 'ImageAsset' | 'SoundAsset' | 'ClipAsset' | 'FontAsset' | 'GIFAsset' | 'FileAsset' | 'SVGAsset';
  src: string;
  filename: string;
  
  constructor(args?: any): WickAsset;
}

/**
 * Union type for all selectable objects
 */
export type WickSelectableObject = 
  | WickPath 
  | WickClip 
  | WickFrame 
  | WickTween 
  | WickLayer 
  | WickAsset;

/**
 * Tool types
 */
export type WickToolName = 
  | 'cursor' 
  | 'brush' 
  | 'pencil' 
  | 'eraser' 
  | 'rectangle' 
  | 'ellipse' 
  | 'line' 
  | 'pathcursor' 
  | 'text' 
  | 'fillbucket' 
  | 'eyedropper'
  | 'pan'
  | 'zoom'
  | 'interact'
  | 'none';

/**
 * Wick Tool (base interface)
 */
export interface WickTool {
  name: WickToolName;
  project: WickProject | null;
  
  onActivate(): void;
  onDeactivate(): void;
  onMouseDown(event: any): void;
  onMouseDrag(event: any): void;
  onMouseUp(event: any): void;
  onKeyDown(event: any): void;
  onKeyUp(event: any): void;
}

/**
 * Hit test options
 */
export interface HitTestOptions {
  mode: 'RECTANGLE' | 'CIRCLE' | 'CONVEX';
  offset: boolean;
  overlap: boolean;
  intersections: boolean;
}

/**
 * Wick Project - Main project class
 */
export interface WickProject extends WickBase {
  classname: 'Project';
  
  // Project properties
  name: string;
  width: number;
  height: number;
  framerate: number;
  backgroundColor: WickColor;
  hitTestOptions: HitTestOptions;
  
  // View properties
  pan: { x: number; y: number };
  zoom: number;
  rotation: number;
  
  // Onion skinning
  onionSkinEnabled: boolean;
  onionSkinSeekBackwards: number;
  onionSkinSeekForwards: number;
  
  // Core objects
  selection: WickSelection;
  history: WickHistory;
  clipboard: WickClipboard;
  root: WickClip;
  focus: WickClip;
  
  // Assets
  assets: WickAsset[];
  
  // Tools
  activeTool: WickToolName;
  _tools: Record<WickToolName, WickTool>;
  toolSettings: WickToolSettings;
  
  // Playback
  playing: boolean;
  muted: boolean;
  publishedMode: boolean;
  
  // Active state
  activeTimeline: WickTimeline;
  activeLayer: WickLayer;
  activeFrame: WickFrame;
  activeFrames: WickFrame[];
  
  // Mouse/keyboard state
  _mousePosition: { x: number; y: number };
  _lastMousePosition: { x: number; y: number };
  _isMouseDown: boolean;
  _keysDown: string[];
  _currentKey: string | null;
  
  // Methods
  constructor(args?: {
    name?: string;
    width?: number;
    height?: number;
    framerate?: number;
    backgroundColor?: WickColor;
  }): WickProject;
  
  serialize(args?: any): SerializedProject;
  _serialize(args?: any): SerializedProject;
  _deserialize(data: any): void;
  
  // Project management
  initialize(): void;
  prepareProjectForEditor(): void;
  resetCache(): void;
  destroy(): void;
  recenter(): void;
  
  // Error handling
  onError(fn: (message: string) => void): void;
  errorOccured(message: string): void;
  
  // Playback control
  play(): void;
  stop(): void;
  pause(): void;
  seek(playheadPosition: number): void;
  
  // Asset management
  addAsset(asset: WickAsset): void;
  removeAsset(asset: WickAsset): void;
  getAsset(uuid: string): WickAsset | null;
  getAssetsByType(type: string): WickAsset[];
  
  // Selection
  selectAll(): void;
  deselectAll(): void;
  
  // History
  undo(): void;
  redo(): void;
  canUndo(): boolean;
  canRedo(): boolean;
  get numUndoStates(): number;
  
  // Tools
  getActiveTool(): WickTool;
  setActiveTool(toolName: WickToolName): void;
  
  // Utility
  getDefaultHitTestOptions(): HitTestOptions;
}

/**
 * AutoSave related types
 */
export interface AutosaveData {
  projectData: SerializedProject;
  objectsData: SerializedWickObject[];
  lastModified: number;
}

export interface AutosaveEntry {
  uuid: string;
  lastModified: number;
  projectData: SerializedProject;
  objectsData: SerializedWickObject[];
}

/**
 * Wick File types
 */
export interface WickFile {
  fromWickFile(file: File, callback: (project: WickProject) => void): void;
  fromWickFileData(data: any, callback: (project: WickProject) => void): void;
  toWickFile(project: WickProject, callback: (file: File) => void): void;
  generateMetaData(): any;
}

/**
 * AutoSave utility
 */
export interface WickAutoSave {
  save(project: WickProject, callback: () => void): void;
  load(uuid: string, callback: (project: WickProject) => void): void;
  getAutosavesList(callback: (autosaves: AutosaveEntry[]) => void): void;
  generateAutosaveData(project: WickProject): AutosaveData;
  generateProjectFromAutosaveData(
    autosaveData: AutosaveData,
    callback: (project: WickProject) => void
  ): void;
}

/**
 * Main Wick namespace
 */
export interface WickNamespace {
  version: string;
  resourcepath: string;
  _originals: Record<string, any>;
  
  // Classes
  Base: new (args?: any) => WickBase;
  Project: new (args?: any) => WickProject;
  Clip: new (args?: any) => WickClip;
  Frame: new (args?: any) => WickFrame;
  Layer: new (args?: any) => WickLayer;
  Timeline: new (args?: any) => WickTimeline;
  Path: new (args?: any) => WickPath;
  Tween: new (args?: any) => WickTween;
  Asset: new (args?: any) => WickAsset;
  Selection: new (args?: any) => WickSelection;
  History: new () => WickHistory;
  Clipboard: new () => WickClipboard;
  Color: new (color?: string) => WickColor;
  Transformation: new (args?: any) => WickTransformation;
  ToolSettings: new () => WickToolSettings;
  View: new (model: any) => any;
  
  // Tools
  Tools: {
    [key in WickToolName]: new () => WickTool;
  };
  
  // Utilities
  AutoSave: WickAutoSave;
  WickFile: WickFile;
  ObjectCache: {
    addObject(obj: WickBase): void;
    removeObject(obj: WickBase): void;
    getObject(uuid: string): WickBase | null;
    removeUnusedObjects(project: WickProject): void;
  };
  
  // Constants
  History: {
    StateType: {
      ONLY_VISIBLE_OBJECTS: string;
      FULL_PROJECT: string;
      [key: string]: string;
    };
  };
  
  [key: string]: any;
}

/**
 * Global window interface extension
 */
declare global {
  interface Window {
    Wick: WickNamespace;
    paper: any; // Paper.js namespace
  }
}

export {};

