/**
 * TypeScript definitions for Wick Engine
 * Provides strongly-typed interfaces for the engine objects that remain in JS.
 */

export interface SerializedWickObject {
  uuid: string;
  identifier?: string | null;
  name?: string | null;
  classname: string;
  [key: string]: any;
}

export interface SerializedProject extends SerializedWickObject {
  classname: "Project";
  name: string;
  width: number;
  height: number;
  framerate: number;
  backgroundColor: string;
  onionSkinEnabled: boolean;
  onionSkinSeekForwards: number;
  onionSkinSeekBackwards: number;
  focus: string;
  metadata?: any;
}

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
}

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
}

export interface WickSelectableObject {
  uuid: string;
  classname: string;
}

export interface WickSelection {
  uuid: string;
  selectedObjects: string[];
  selectedObjectsList: WickSelectableObject[];
  fillColor: string;
  strokeColor: string;
  widgetRotation: number;
  pivotPoint: { x: number; y: number };
  originalWidth: number;
  originalHeight: number;
  clear(): void;
  select(object: WickSelectableObject): void;
  deselect(object: WickSelectableObject): void;
  selectAll(): void;
  isEmpty(): boolean;
  get(type?: string): WickSelectableObject[];
  serialize(): SerializedWickObject;
}

export interface WickHistory {
  project: WickProject | null;
  states: any[];
  currentStateIndex: number;
  pushState(stateType: string): void;
  undo(): void;
  redo(): void;
  canUndo(): boolean;
  canRedo(): boolean;
  clear(): void;
  readonly numUndoStates: number;
}

export interface WickClipboard {
  objects: WickSelectableObject[];
  copy(objects: WickSelectableObject[]): void;
  cut(objects: WickSelectableObject[]): void;
  paste(): WickSelectableObject[];
  isEmpty(): boolean;
  clear(): void;
}

export interface WickToolSettings {
  settings: Record<string, any>;
  getSetting(name: string): any;
  setSetting(name: string, value: any): void;
  onSettingsChanged(callback: (name: string, value: any) => void): void;
}

export interface WickBase {
  uuid: string;
  identifier: string | null;
  name: string | null;
  classname: string;
  project: WickProject | null;
  parent: WickBase | null;
  children: WickBase[];
  view: any;
  guiElement: any;
  needsAutosave: boolean;
  _temporary: boolean;
  serialize(args?: any): SerializedWickObject;
  clone(): WickBase;
  remove(): void;
  addChild(child: WickBase): void;
  removeChild(child: WickBase): void;
}

export interface WickTimeline extends WickBase {
  classname: "Timeline";
  layers: WickLayer[];
  activeLayer: WickLayer;
  addLayer(layer: WickLayer, index?: number): void;
  removeLayer(layer: WickLayer): void;
}

export interface WickLayer extends WickBase {
  classname: "Layer";
  frames: WickFrame[];
  activeFrame: WickFrame;
  locked: boolean;
  visible: boolean;
  addFrame(frame: WickFrame, index?: number): void;
  removeFrame(frame: WickFrame): void;
}

export interface WickFrame extends WickBase {
  classname: "Frame";
  start: number;
  end: number;
  clips: WickClip[];
  tweens: WickTween[];
  addClip(clip: WickClip): void;
  removeClip(clip: WickClip): void;
}

export interface WickTween extends WickBase {
  classname: "Tween";
  property: string;
  startValue: any;
  endValue: any;
  startFrame: number;
  endFrame: number;
  easing: string;
}

export interface WickPath extends WickBase {
  classname: "Path";
  fillColor: string;
  strokeColor: string;
  strokeWidth: number;
}

export interface WickClip extends WickBase {
  classname: "Clip";
  timeline: WickTimeline;
  transformation: WickTransformation;
  animationType: "loop" | "single" | "playOnce";
  singleFrameNumber: number;
  assetSourceUUID: string | null;
  isSynced: boolean;
  cursor: string;
  addObjects(objects: WickBase[]): void;
  removeObject(object: WickBase): void;
  play(): void;
  stop(): void;
}

export interface WickAsset extends WickBase {
  classname: string;
  filename: string;
}

export type WickToolName =
  | "cursor"
  | "brush"
  | "pencil"
  | "eraser"
  | "rectangle"
  | "ellipse"
  | "line"
  | "pathcursor"
  | "text"
  | "fillbucket"
  | "eyedropper"
  | "pan"
  | "zoom"
  | "interact"
  | "none";

export interface WickTool {
  name: WickToolName;
}

export interface WickProject extends WickBase {
  classname: "Project";
  name: string;
  width: number;
  height: number;
  framerate: number;
  backgroundColor: WickColor;
  hitTestOptions: Record<string, any>;
  pan: { x: number; y: number };
  zoom: number;
  rotation: number;
  onionSkinEnabled: boolean;
  onionSkinSeekBackwards: number;
  onionSkinSeekForwards: number;
  selection: WickSelection;
  history: WickHistory;
  clipboard: WickClipboard;
  root: WickClip;
  focus: WickClip;
  assets: WickAsset[];
  activeTool: WickToolName;
  toolSettings: WickToolSettings;
  playing: boolean;
  muted: boolean;
  publishedMode: boolean;
  activeTimeline: WickTimeline;
  activeLayer: WickLayer;
  activeFrame: WickFrame;
  activeFrames: WickFrame[];
  serialize(args?: any): SerializedProject;
  recenter(): void;
  onError(fn: (message: string) => void): void;
  play(options?: { onError?: (error: any) => void; onAfterTick?: () => void; onBeforeTick?: () => void }): void;
  stop(): void;
  undo(): boolean;
  redo(): boolean;
  view: any;
}

export interface WickFile {
  fromWickFile(file: Blob, callback: (project: WickProject) => void): void;
  fromWickFileData(data: any, callback: (project: WickProject) => void): void;
  toWickFile(project: WickProject, callback: (file: Blob | string) => void, type?: string): void;
  generateMetaData(): any;
}

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

export interface WickAutoSave {
  save(project: WickProject, callback: () => void): void;
  load(uuid: string, callback: (project: WickProject) => void): void;
  delete(uuid: string, callback: () => void): void;
  getAutosavesList(callback: (autosaves: AutosaveEntry[]) => void): void;
  generateAutosaveData(project: WickProject): AutosaveData;
  generateProjectFromAutosaveData(autosaveData: AutosaveData, callback: (project: WickProject) => void): void;
}

export interface WickNamespace {
  version: string;
  resourcepath: string;
  Project: new (args?: any) => WickProject;
  Clip: new (args?: any) => WickClip;
  Frame: new (args?: any) => WickFrame;
  Layer: new (args?: any) => WickLayer;
  Timeline: new (args?: any) => WickTimeline;
  Path: new (args?: any) => WickPath;
  Tween: new (args?: any) => WickTween;
  Asset: new (args?: any) => WickAsset;
  Selection: new () => WickSelection;
  History: new () => WickHistory;
  Clipboard: new () => WickClipboard;
  Color: new (color?: string) => WickColor;
  ToolSettings: new () => WickToolSettings;
  AutoSave: WickAutoSave;
  WickFile: WickFile;
  ObjectCache: {
    addObject(obj: WickBase): void;
    removeObject(obj: WickBase): void;
    getObjectByUUID(uuid: string): WickBase | null;
  };
  Tools: Record<WickToolName, new () => WickTool>;
  History: {
    StateType: {
      ONLY_VISIBLE_OBJECTS: string;
      FULL_PROJECT: string;
      [key: string]: string;
    };
  };
  [key: string]: any;
}

declare global {
  interface Window {
    Wick: WickNamespace;
    paper: any;
  }
}

export {};
