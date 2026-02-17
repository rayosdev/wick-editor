/**
 * TypeScript definitions for Wick Engine
 * Provides strongly-typed interfaces for the engine objects that remain in JS.
 */

export interface SerializedWickObject {
  uuid: string;
  identifier?: string | null;
  name?: string | null;
  classname: string;
  [key: string]: unknown;
}

export interface WickTimelineMarkerMetadata {
  id: string;
  frame: number;
  label: string;
  color: string;
}

export interface WickTimelineWorkAreaMetadata {
  start: number;
  end: number;
}

export interface WickTimelineUiMetadata {
  markers?: WickTimelineMarkerMetadata[];
  workArea?: WickTimelineWorkAreaMetadata;
}

export interface WickEditorUiMetadata {
  timelineUi?: WickTimelineUiMetadata;
  [key: string]: unknown;
}

export interface SerializedProjectMetadata {
  editorUi?: WickEditorUiMetadata;
  [key: string]: unknown;
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
  metadata?: SerializedProjectMetadata | unknown;
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

export interface WickSoundInfo {
  playheadPosition?: number;
  start: number;
  end: number;
  offset: number;
  src: string;
  filetype: string;
  name?: string;
  volume?: number;
  playedFrom?: string;
  [key: string]: unknown;
}

export type WickRenderedImage = HTMLImageElement | HTMLCanvasElement;

export interface WickImageSequenceArgs {
  imageType?: string;
  width?: number;
  height?: number;
  onProgress?: (currentFrame: number, totalFrames: number) => void;
  onFinish?: (images: WickRenderedImage[]) => void;
}

export type WickAudioProgressCallback = (
  messageOrFrame: string | number,
  progress?: number | string,
) => void;

export interface WickAudioTrackArgs {
  soundInfo?: WickSoundInfo[];
  onProgress?: WickAudioProgressCallback;
}

export interface WickSelectableObject {
  uuid?: string;
  identifier?: string | null;
  classname?: string;
  isScriptable?: boolean;
  [key: string]: unknown;
}

export interface WickSelection {
  uuid: string;
  selectedObjects: string[];
  selectedObjectsList: WickSelectableObject[];
  fillColor: string;
  strokeColor: string;
  selectionType: string;
  isScriptable: boolean;
  numObjects: number;
  types: string[];
  location: string;
  x: number;
  y: number;
  allAttributeNames: string[];
  widgetRotation: number;
  pivotPoint: { x: number; y: number };
  originalWidth: number;
  originalHeight: number;
  [key: string]: unknown;
  clear(): void;
  select(object: WickSelectableObject): void;
  deselect(object: WickSelectableObject): void;
  selectMultipleObjects(objects: WickSelectableObject[]): void;
  selectAll(): void;
  isEmpty(): boolean;
  isObjectSelected(object: WickSelectableObject): boolean;
  get(type?: string): WickSelectableObject[];
  getSelectedObject(type?: string): WickSelectableObject;
  getSelectedObjects(type?: string): WickSelectableObject[];
  getLeftmostFrames(): WickFrame[];
  getRightmostFrames(): WickFrame[];
  sendToBack(): void;
  bringToFront(): void;
  moveBackwards(): void;
  moveForwards(): void;
  flipHorizontally(): void;
  flipVertically(): void;
  serialize(): SerializedWickObject;
}

export interface WickHistory {
  project: WickProject | null;
  states: unknown[];
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
  settings: Record<string, unknown>;
  getSetting(name: string): string | number | boolean;
  setSetting(name: string, value: string | number | boolean): void;
  getSettingRestrictions(name: string): {
    min?: number;
    max?: number;
    step?: number;
    options?: string[];
  };
  onSettingsChanged(
    callback: (name: string, value: string | number | boolean) => void,
  ): void;
}

export interface WickBase {
  uuid: string;
  identifier: string | null;
  name: string | null;
  classname: string;
  project: WickProject | null;
  parent: WickBase | null;
  children: WickBase[];
  view: {
    render(): void;
    applyChanges?: () => void;
    paper?: {
      Point: new (x?: number, y?: number) => { x: number; y: number };
      view: {
        viewToProject: (point: { x: number; y: number }) => {
          x: number;
          y: number;
        };
      };
      project: {
        view: {
          element: {
            getBoundingClientRect: () => { x: number; y: number };
          };
        };
      };
    };
    [key: string]: unknown;
  };
  guiElement: {
    draw(): void;
    checkForPlayheadAutoscroll?: () => void;
    dragAssetAtPosition?: (
      uuid: string,
      x: number,
      y: number,
      drop: boolean,
    ) => void;
    [key: string]: unknown;
  };
  needsAutosave: boolean;
  _temporary: boolean;
  serialize(args?: unknown): SerializedWickObject;
  clone(): WickBase;
  remove(): void;
  addChild(child: WickBase): void;
  removeChild(child: WickBase): void;
}

export interface WickTimeline extends WickBase {
  classname: "Timeline";
  layers: WickLayer[];
  activeLayer: WickLayer;
  activeLayerIndex: number;
  playheadPosition: number;
  activeFrames: WickFrame[];
  addLayer(layer: WickLayer, index?: number): void;
  removeLayer(layer: WickLayer): void;
  moveLayer(layer: WickLayer, index: number): void;
  deferFrameGapResolve(): void;
  resolveFrameGaps(frames?: WickFrame[]): void;
}

export interface WickLayer extends WickBase {
  classname: "Layer";
  frames: WickFrame[];
  activeFrame: WickFrame;
  locked: boolean;
  hidden: boolean;
  visible: boolean;
  index?: number;
  addFrame(frame: WickFrame, index?: number): void;
  removeFrame(frame: WickFrame): void;
  getFrameAtPlayheadPosition(playheadPosition: number): WickFrame | null;
  activate(): void;
}

export interface WickFrame extends WickBase {
  classname: "Frame";
  start: number;
  end: number;
  clips: WickClip[];
  tweens: WickTween[];
  sound?: WickAsset | null;
  addClip(clip: WickClip): void;
  removeClip(clip: WickClip): void;
  createTween(): void;
}

export interface WickTween extends WickBase {
  classname: "Tween";
  property: string;
  startValue: unknown;
  endValue: unknown;
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
  [key: string]: unknown;
  classname: "Project";
  name: string;
  width: number;
  height: number;
  framerate: number;
  backgroundColor: WickColor;
  hitTestOptions: Record<string, unknown>;
  pan: { x: number; y: number };
  zoom: number;
  rotation: number;
  onionSkinEnabled: boolean;
  onionSkinSeekBackwards: number;
  onionSkinSeekForwards: number;
  metadata?: SerializedProjectMetadata;
  showClipBorders: boolean;
  selection: WickSelection;
  history: WickHistory;
  clipboard: WickClipboard;
  root: WickClip;
  focus: WickClip | WickProject;
  assets: WickAsset[];
  activeTool: WickToolName | WickTool;
  toolSettings: WickToolSettings;
  playing: boolean;
  muted: boolean;
  publishedMode: boolean;
  activeTimeline: WickTimeline;
  activeLayer: WickLayer;
  activeFrame: WickFrame;
  activeFrames: WickFrame[];
  soundsPlayed: WickSoundInfo[];
  error: unknown;
  _internalErrorMessages?: string[];
  canCreateTween?: boolean;
  serialize(args?: unknown): SerializedProject;
  recenter(): void;
  zoomIn(): void;
  zoomOut(): void;
  selectAll(): void;
  moveSelection(target: WickFrame | WickLayer, index: number): boolean;
  createClipFromSelection(args: {
    identifier: string;
    type: "Clip" | "Button";
  }): void;
  breakApartSelection(): void;
  deleteSelectedObjects(): void;
  doBooleanOperationOnSelection(op: "unite" | "subtract" | "intersect"): void;
  focusTimelineOfSelectedClip(): void;
  focusTimelineOfParentClip(): void;
  createImagePathFromAsset(
    asset: WickBase | null,
    x: number,
    y: number,
    onFinish: (path: WickPath) => void,
  ): void;
  createClipInstanceFromAsset(
    asset: WickBase | null,
    x: number,
    y: number,
    onFinish: (clip: WickClip) => void,
  ): void;
  createSVGInstanceFromAsset(
    asset: WickBase | null,
    x: number,
    y: number,
    onFinish: (path: WickPath) => void,
  ): void;
  importFile(file: File, callback: (asset: WickAsset | null) => void): void;
  getAssets(type?: string): WickAsset[];
  addAsset(asset: WickAsset): void;
  loadAssets(callback: () => void): void;
  generateImageSequence(args: WickImageSequenceArgs): void;
  generateAudioTrack(
    args: WickAudioTrackArgs,
    callback: (audioBuffer: AudioBuffer | null) => void,
  ): void;
  prepareProjectForEditor(): void;
  copySelectionToClipboard(): boolean;
  duplicateSelection(): boolean;
  cutSelectionToClipboard(): boolean;
  pasteClipboardContents(): boolean;
  createTween(): void;
  getFonts(): string[];
  hasFont(font: string): boolean;
  extendFrames(frames: WickSelectableObject[]): void;
  shrinkFrames(frames: WickSelectableObject[]): void;
  moveSelectedFramesRight(): void;
  moveSelectedFramesLeft(): void;
  cutSelectedFrames(): void;
  insertBlankFrame(): void;
  extendFramesAndPushOtherFrames(frames: WickSelectableObject[]): void;
  shrinkFramesAndPullOtherFrames(frames: WickSelectableObject[]): void;
  onError(fn: (message: string) => void): void;
  play(options?: {
    onError?: (error: unknown) => void;
    onAfterTick?: () => void;
    onBeforeTick?: () => void;
  }): void;
  stop(): void;
  undo(): boolean;
  redo(): boolean;
}

export interface WickFile {
  fromWickFile(
    file: Blob,
    callback: (project: WickProject) => void,
    type?: string,
  ): void;
  fromWickFileData(
    data: unknown,
    callback: (project: WickProject) => void,
  ): void;
  toWickFile(
    project: WickProject,
    callback: (file: Blob | string) => void,
    type?: string,
  ): void;
  generateMetaData(): unknown;
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
  generateProjectFromAutosaveData(
    autosaveData: AutosaveData,
    callback: (project: WickProject) => void,
  ): void;
}

export interface WickNamespace {
  version: string;
  resourcepath: string;
  Project: new (args?: unknown) => WickProject;
  Clip: new (args?: unknown) => WickClip;
  Frame: new (args?: unknown) => WickFrame;
  Layer: new (args?: unknown) => WickLayer;
  Timeline: new (args?: unknown) => WickTimeline;
  Path: new (args?: unknown) => WickPath;
  Tween: new (args?: unknown) => WickTween;
  Asset: new (args?: unknown) => WickAsset;
  Selection: new () => WickSelection;
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
  HTMLPreview: {
    previewProject(
      project: WickProject,
      callback: (previewWindow: Window | null | undefined) => void,
    ): void;
  };
  ImageSequence: {
    toPNGSequence(args: {
      project: WickProject;
      width?: number;
      height?: number;
      onProgress: (completed: number, maxFrames: number) => void;
      onError: () => void;
      onFinish: (file: Blob) => void;
    }): void;
  };
  SVGFile: {
    toSVGFile(
      timeline: WickTimeline,
      onError: (message?: string) => void,
      onFinish: (file: Blob) => void,
    ): void;
  };
  ZIPExport: {
    bundleProject(project: WickProject, onFinish: (blob: Blob) => void): void;
  };
  HTMLExport: {
    bundleProject(
      project: WickProject,
      onFinish: (html: BlobPart | ArrayBuffer) => void,
    ): void;
  };
  WickObjectFile: {
    toWickObjectFile(
      clip: WickClip,
      type: "blob",
      onFinish: (file: Blob) => void,
    ): void;
  };
  ImageAsset: new (args: { filename: string; src: string }) => WickAsset;
  ClipAsset: new (...args: unknown[]) => WickBase;
  SVGAsset: new (...args: unknown[]) => WickBase;
  GIFAsset: {
    fromImages(
      imageAssets: WickAsset[],
      project: WickProject,
      onFinish: (gifAsset: WickAsset) => void,
    ): void;
  };
  History: {
    new (): WickHistory;
    StateType: {
      ONLY_VISIBLE_OBJECTS: string;
      FULL_PROJECT: string;
      [key: string]: string;
    };
  };
  Tools: Record<WickToolName, new () => WickTool>;
  [key: string]: unknown;
}

export {};
