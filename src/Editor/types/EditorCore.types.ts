import type { ConsoleLogEntry, CustomHotKeys } from "./editor.types";

export interface WarningModalInfo {
  description: string;
  title: string;
  acceptText: string;
  cancelText?: string;
  canceltText?: string;
  acceptAction: () => void;
  cancelAction: () => void;
  acceptIcon?: string;
  cancelIcon?: string;
  finalAction?: () => void;
}

export interface CustomOnionSkinningColors {
  backward: string;
  forward: string;
}

export interface EditorRenderStatus {
  renderProgress: number;
  renderType: string;
  renderStatusMessage: string;
  exporting: boolean;
}

export interface EditorCoreUIState extends EditorRenderStatus {
  project: unknown;
  previewPlaying: boolean;
  activeModalName: string | null;
  activeModalQueue: string[];
  codeEditorOpen: boolean;
  scriptToEdit: string;
  showCanvasActions: boolean;
  showBrushModes: boolean;
  showCodeErrors: boolean;
  codeError: unknown;
  popoutOutlinerSize: number;
  outlinerPoppedOut: boolean;
  inspectorSize: number;
  timelineSize: number;
  timelineRendererMode: "dom" | "classic";
  timelineShortcutPreset: "wick" | "flash";
  timelinePlaybackFollowMode: "off" | "follow-playhead";
  timelineSnapMode: "none" | "frames" | "markers";
  timelineDensityMode: "compact" | "standard";
  timelineSoftRenderTick: number;
  assetLibrarySize: number;
  consoleLogs: ConsoleLogEntry[];
  warningModalInfo: WarningModalInfo;
  customHotKeys: CustomHotKeys;
  colorPickerType: string;
  lastColorsUsed: string[];
  useCustomOnionSkinningColors: boolean;
  customOnionSkinningColors: CustomOnionSkinningColors;
  onionSkinningWasOn: boolean;
  localSavedFiles: unknown[];
}
