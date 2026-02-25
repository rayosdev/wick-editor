import type { ConnectDropTarget } from "react-dnd";
import type {
  WickProject,
  WickClip,
  TimelineObject,
  OnionSkinOptions,
  ToastType,
  ToastOptions,
} from "Editor/types";

export type TimelineRendererMode = "dom" | "classic";
export type TimelineShortcutPreset = "wick" | "flash";
export type TimelinePlaybackFollowMode = "off" | "follow-playhead";
export type TimelineSnapMode = "none" | "frames" | "markers";
export type TimelineDensityMode = "compact" | "standard";
export type TimelineInsertMode = "overwrite" | "ripple";

export type TimelineFrameSizeMode = "small" | "normal" | "large";

export type TimelineFillGapsMode = "auto_extend" | "blank_frames";

export type TimelineFrameVisualState =
  | "keyframe-content"
  | "keyframe-blank"
  | "span-content"
  | "span-blank"
  | "tween-span";

export type TimelineMarker = {
  id: string;
  frame: number;
  label: string;
  color: string;
};

export type TimelineWorkArea = {
  start: number;
  end: number;
};

export type TimelineTweenLike = {
  uuid?: string;
  playheadPosition?: number;
  parentFrame?: TimelineFrameLike;
  parentLayer?: TimelineLayerLike;
  remove?: () => void;
};

export type TimelineFrameLike = {
  uuid?: string;
  identifier?: string | null;
  name?: string | null;
  start?: number;
  end?: number;
  length?: number;
  contentful?: boolean;
  sound?: unknown;
  parentLayer?: TimelineLayerLike;
  tweens: TimelineTweenLike[];
  inPosition?: (playheadPosition: number) => boolean;
  inRange?: (startPlayhead: number, endPlayhead: number) => boolean;
  remove?: () => void;
  addTween?: (tween: TimelineTweenLike) => void;
  removeSound?: () => void;
};

export type TimelineLayerLike = {
  uuid?: string;
  name?: string | null;
  identifier?: string | null;
  index?: number;
  frames: TimelineFrameLike[];
  hidden?: boolean;
  locked?: boolean;
  activate?: () => void;
  addFrame?: (frame: TimelineFrameLike) => void;
  insertBlankFrame?: (playheadPosition: number) => TimelineFrameLike | null;
  remove?: () => void;
  getFrameAtPlayheadPosition?: (playheadPosition: number) => TimelineFrameLike | null;
};

export type TimelineActiveLike = {
  layers: TimelineLayerLike[];
  activeLayerIndex: number;
  playheadPosition: number;
  fillGapsMethod?: TimelineFillGapsMode;
  activeFrames?: TimelineFrameLike[];
  addLayer?: (layer: TimelineLayerLike, index?: number) => void;
  moveLayer?: (layer: TimelineLayerLike, index: number) => void;
  deferFrameGapResolve?: () => void;
  resolveFrameGaps?: (frames?: TimelineFrameLike[]) => void;
};

export type TimelineSelectionLike = {
  clear: () => void;
  select: (object: unknown) => void;
  deselect?: (object: unknown) => void;
  isObjectSelected?: (object: unknown) => boolean;
  getSelectedObjects?: (type?: string) => unknown[];
  getLeftmostFrames?: () => TimelineFrameLike[];
  getRightmostFrames?: () => TimelineFrameLike[];
};

export type TimelineGuiLike = {
  onProjectModified?: ((callback: () => void) => void) | (() => void);
  onProjectSoftModified?: ((callback: () => void) => void) | (() => void);
  canvasContainer?: HTMLDivElement | null;
  draw?: () => void;
  _canvas?: {
    getBoundingClientRect?: () => DOMRect;
  };
  checkForPlayheadAutoscroll?: () => void;
  scrollX?: number;
  scrollY?: number;
};

export type TimelineProject = {
  focus?: {
    isRoot?: boolean;
    identifier?: string | null;
  };
  playing?: boolean;
  framerate?: number;
  view?: {
    render?: () => void;
  };
  guiElement?: TimelineGuiLike;
  activeTimeline?: TimelineActiveLike;
  selection?: TimelineSelectionLike;
  getAssetByUUID?: (uuid: string) => unknown;
};

export interface TimelineOwnProps {
  project: TimelineProject | null;
  projectDidChange: (options: { actionName: string; [key: string]: unknown }) => void;
  projectData: WickProject;
  getSelectedTimelineObjects: () => TimelineObject[];
  setOnionSkinOptions: (options: OnionSkinOptions) => void;
  getOnionSkinOptions: () => OnionSkinOptions;
  setFocusObject: (object: WickClip | WickProject) => void;
  addTweenKeyframe: () => void;
  createTween: () => void;
  cutFrame: () => void;
  insertBlankFrame: () => void;
  deleteSelectedObjects: () => void;
  movePlayheadForwards: () => void;
  movePlayheadBackwards: () => void;
  focusTimelineOfParentClip: () => void;
  onRef?: (instance: unknown) => void;
  dragSoundOntoTimeline: (uuid: string, x: number, y: number, commit: boolean) => void;
  timelineRendererMode: TimelineRendererMode;
  onTimelineRendererModeChange: (mode: TimelineRendererMode) => void;
  timelineShortcutPreset: TimelineShortcutPreset;
  onTimelineShortcutPresetChange: (preset: TimelineShortcutPreset) => void;
  timelinePlaybackFollowMode: TimelinePlaybackFollowMode;
  onTimelinePlaybackFollowModeChange: (mode: TimelinePlaybackFollowMode) => void;
  timelineSnapMode: TimelineSnapMode;
  onTimelineSnapModeChange: (mode: TimelineSnapMode) => void;
  timelineDensityMode: TimelineDensityMode;
  onTimelineDensityModeChange: (mode: TimelineDensityMode) => void;
  timelineSoftRenderTick: number;
  toast?: (message: string, type?: ToastType, options?: ToastOptions) => void;
}

export interface TimelineInjectedProps {
  connectDropTarget?: ConnectDropTarget;
  isOver?: boolean;
}

export type TimelineProps = TimelineOwnProps & TimelineInjectedProps;

export type TimelineRendererProps = TimelineOwnProps &
  TimelineInjectedProps & {
    onRendererError?: (error: unknown) => void;
  };

export type DraggedSoundItem = {
  uuid: string;
};

export type TimelineContextMenuPosition = {
  x: number;
  y: number;
};

export type TimelineContextMenuItem = {
  id: string;
  label: string;
  icon?: string;
  glyph?: string;
  action: () => void;
  disabled?: boolean;
};

export type TimelineContextTargetArea = "frame" | "layer" | "numberLine" | "unknown";

export type TimelineContextTarget = {
  area: TimelineContextTargetArea;
  layerIndex: number | null;
  playheadPosition: number | null;
  frame: TimelineFrameLike | null;
  label: string;
};
