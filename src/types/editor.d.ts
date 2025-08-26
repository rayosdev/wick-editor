// Type definitions for Wick Editor components

// Editor class properties interface
interface EditorProperties {
  project: any;
  paper: any;
  editorVersion: string;
  error: any;
  _lastAutosave: number;
  fontInfoInterface: any;
  hotKeyInterface: any;
  actionMapInterface: any;
  scriptInfoInterface: any;
  openProjectFileFromClient: () => void;
  openAssetFileFromClient: () => void;
  maxLastColors: number;
  _onEyedropperPickedColor: (color: string) => void;
  RESIZE_THROTTLE_AMOUNT_MS: number;
  WINDOW_RESIZE_THROTTLE_AMOUNT_MS: number;
  resizeProps: any;
  canvasComponent: any;
  timelineComponent: any;
  lastUsedTool: string;
  builtinPreviews: any;
  customHotKeysKey: string;
  colorPickerTypeKey: string;
  _showWaitOverlayTimeoutID: number;
  _processingAction: boolean;
  resizeThrottleAmount: number;
  windowResizeThrottleAmount: number;
  onStopCodeEditorResize: () => void;
}

export interface EditorState {
  // Core state properties
  previewPlaying: boolean;
  lastColorsUsed: any[];
  outlinerPoppedOut: boolean;
  codeEditorWindowProperties: any;
  activeModalName: string | null;
  activeModalQueue: string[];
  codeEditorOpen: boolean;
  showCanvasActions: boolean;
  showBrushModes: boolean;
  customOnionSkinningColors: {
    backward: string;
    forward: string;
  };
  customHotKeys: any;
  errors?: any;
  // Add other state properties as needed
  [key: string]: any;
}

export interface EditorProps {
  // Add props if any are passed to the main Editor component
  [key: string]: any;
}

// Extend React.Component for Editor
export interface WickEditorComponent {
  state: EditorState;
  props: EditorProps;
  
  // Editor-specific properties
  project?: any;
  paper?: any;
  editorVersion?: string;
  error?: any;
  _lastAutosave?: number;
  fontInfoInterface?: any;
  hotKeyInterface?: any;
  actionMapInterface?: any;
  scriptInfoInterface?: any;
  openProjectFileFromClient?: any;
  openAssetFileFromClient?: any;
  maxLastColors?: number;
  _onEyedropperPickedColor?: (color: any) => void;
  RESIZE_THROTTLE_AMOUNT_MS?: number;
  WINDOW_RESIZE_THROTTLE_AMOUNT_MS?: number;
  resizeProps?: any;
  canvasComponent?: any;
  timelineComponent?: any;
  lastUsedTool?: string;
  builtinPreviews?: any;
  customHotKeysKey?: string;
  colorPickerTypeKey?: string;
  _showWaitOverlayTimeoutID?: number;
  _processingAction?: boolean;
  resizeThrottleAmount?: number;
  windowResizeThrottleAmount?: number;
  onStopCodeEditorResize?: any;
}

// Global Window extensions for Wick Editor
declare global {
  interface Window {
    // Wick Engine
    Wick: any;
    project?: any;
    paper: any;
    
    // File handling
    wickEditorFileSystemType?: string;
    openWickLocalFileViewer?: (files: any) => void;
    warnBeforeSave?: (args: any) => void;
    createFileInput?: (args: any) => any;
    saveFileFromWick?: (file: any, name: string, extension: string, successCallback?: () => void, failureCallback?: () => void) => void;
    getSavedWickFiles?: (callback: (files: any[]) => void) => void;
    deleteLocalWickFile?: (fileEntry: any, successCallback?: () => void, failureCallback?: () => void) => void;
    allowedExportTypes?: string[];
    enableAssetLibrary?: boolean;
    
    // Electron API
    electronAPI?: any;
    
    // Other properties
    wickEditor?: any;
  }
}

// Module declarations for assets
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.svg';
declare module '*.css';
declare module '*.scss';
declare module 'Editor' {
  const Editor: any;
  export default Editor;
}

export default {};
