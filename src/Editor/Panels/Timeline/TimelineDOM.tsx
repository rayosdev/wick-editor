import {
  useEffect,
  useMemo,
  useRef,
  useState,
  Fragment,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";

import ActionButton from "Editor/Util/ActionButton/ActionButton";
import ToolIcon from "Editor/Util/ToolIcon/ToolIcon";
import { getWickRuntime } from "Editor/Util/wickRuntime";
import {
  TIMELINE_CONTEXT_MENU_CLASSES,
  TIMELINE_CONTEXT_MENU_ICON_CLASSES,
  TIMELINE_CONTEXT_MENU_ITEM_CLASSES,
  TIMELINE_CONTEXT_MENU_GLYPH_CLASSES,
  TIMELINE_CONTEXT_MENU_LABEL_CLASSES,
} from "./timelineContextMenuClasses";
import {
  getTimelineHeaderRightAdvancedClasses,
  getTimelineFooterChoiceClasses,
  getTimelineHeaderOptionsButtonClasses,
  getTimelineRendererToggleButtonClasses,
  getTimelineShortcutToggleButtonClasses,
  TIMELINE_ACTION_BUTTON_CLASSES,
  TIMELINE_BACK_BUTTON_CLASSES,
  TIMELINE_BREADCRUMB_CLASSES,
  TIMELINE_DOM_LAYER_ADD_CLASSES,
  TIMELINE_DOM_LAYER_BUTTON_ICON_CLASSES,
  TIMELINE_DOM_LAYER_FILLER_CLASSES,
  TIMELINE_DOM_LAYER_DELETE_BUTTON_CLASSES,
  TIMELINE_DOM_LAYER_ICON_BUTTON_CLASSES,
  TIMELINE_DOM_LAYER_REORDER_LINE_CLASSES,
  TIMELINE_DOM_LAYER_MAIN_CLASSES,
  TIMELINE_DOM_LAYER_NAME_CLASSES,
  TIMELINE_DOM_LAYER_NAME_INPUT_CLASSES,
  TIMELINE_DOM_LAYERS_HEADER_CLASSES,
  TIMELINE_DOM_LAYERS_SUBHEADER_CLASSES,
  TIMELINE_DOM_KEYPRESS_INDICATOR_CLASSES,
  TIMELINE_DOM_FRAME_LABEL_CLASSES,
  TIMELINE_DOM_FRAME_RESIZE_LEFT_CLASSES,
  TIMELINE_DOM_FRAME_RESIZE_RIGHT_CLASSES,
  TIMELINE_DOM_GRID_SCROLL_CLASSES,
  TIMELINE_DOM_IMPLICIT_TAIL_FRAME_CLASSES,
  TIMELINE_DOM_INSERT_TARGET_OUTLINE_CLASSES,
  TIMELINE_DOM_MARKER_CLASSES,
  TIMELINE_DOM_MARKER_LABEL_CLASSES,
  TIMELINE_DOM_MARKER_ROW_CLASSES,
  TIMELINE_DOM_NUMBERLINE_CLASSES,
  TIMELINE_DOM_PLAYHEAD_CLASSES,
  TIMELINE_DOM_PLAYHEAD_CAP_CLASSES,
  TIMELINE_DOM_PLAYHEAD_SELECTED_CELL_CLASSES,
  TIMELINE_DOM_PRESS_FEEDBACK_BADGE_CLASSES,
  TIMELINE_DOM_PRESS_FEEDBACK_CLASSES,
  TIMELINE_DOM_PRESS_FEEDBACK_RING_CLASSES,
  TIMELINE_DOM_SELECTION_BOX_CLASSES,
  TIMELINE_DOM_SOUND_HOVER_CLASSES,
  TIMELINE_DOM_TWEEN_ORIGIN_GHOST_CLASSES,
  TIMELINE_DOM_WORK_AREA_OVERLAY_CLASSES,
  TIMELINE_DOM_WORK_AREA_HANDLE_CLASSES,
  TIMELINE_DOM_WORK_AREA_SPAN_CLASSES,
  TIMELINE_DOM_WORK_AREA_TRACK_CLASSES,
  TIMELINE_FOOTER_CLASSES,
  TIMELINE_FOOTER_BUTTON_CLASSES,
  TIMELINE_FOOTER_CHOICE_ICON_CLASSES,
  TIMELINE_FOOTER_FIELD_GROUP_CLASSES,
  TIMELINE_FOOTER_HINT_CLASSES,
  TIMELINE_FOOTER_GROUP_CLASSES,
  TIMELINE_HEADER_ACTIONS_CLASSES,
  TIMELINE_HEADER_CLASSES,
  TIMELINE_HEADER_RIGHT_CLASSES,
  TIMELINE_HEADER_RIGHT_PRIMARY_CLASSES,
  TIMELINE_FOOTER_ICON_CLASSES,
  TIMELINE_FOOTER_ICON_LABEL_CLASSES,
  TIMELINE_FOOTER_INPUT_CLASSES,
  TIMELINE_FOOTER_INPUT_FPS_CLASSES,
  TIMELINE_FOOTER_INPUT_JUMP_CLASSES,
  TIMELINE_FOOTER_INPUT_RANGE_CLASSES,
  TIMELINE_FOOTER_LABEL_CLASSES,
  TIMELINE_FOOTER_READOUT_CLASSES,
  TIMELINE_FOOTER_SHORTCUT_HINT_CLASSES,
  TIMELINE_META_CLASSES,
  TIMELINE_RENDERER_TOGGLE_CLASSES,
  TIMELINE_ROOT_CONTAINER_CLASSES,
  TIMELINE_SCENE_LABEL_CLASSES,
  TIMELINE_SCENE_NAME_CLASSES,
  TIMELINE_SHELL_CLASSES,
  TIMELINE_SHORTCUT_TOGGLE_CLASSES,
  TIMELINE_TEXT_ACTION_CLASSES,
  TIMELINE_UNIFIED_BODY_CLASSES,
  TIMELINE_UNIFIED_CORNER_CLASSES,
  TIMELINE_UNIFIED_EMPTY_COVER_CLASSES,
  TIMELINE_UNIFIED_GRID_CANVAS_CLASSES,
  TIMELINE_UNIFIED_HEADER_CLASSES,
  TIMELINE_UNIFIED_LAYER_CONTROLS_CLASSES,
  TIMELINE_UNIFIED_NUMBERLINE_CANVAS_CLASSES,
  TIMELINE_UNIFIED_OVERLAYS_CLASSES,
  TIMELINE_UNIFIED_ROW_CLASSES,
  TIMELINE_UNIFIED_RULER_CLASSES,
  TIMELINE_UNIFIED_TRACK_CLASSES,
  TIMELINE_UNIFIED_WORKSPACE_CLASSES,
  getTimelineDomDropModeClasses,
  getTimelineDomFrameClasses,
  getTimelineDomGridRowStateClasses,
  getTimelineDomLayerRowClasses,
  getTimelineDomTweenArrowClasses,
  getTimelineDomTweenArrowHeadClasses,
  getTimelineDomTweenArrowLineClasses,
  getTimelineDomTweenClasses,
} from "./timelineControlClasses";
import {
  resolveDoubleClickMenuMode,
  shouldAutoRunDoubleClickInsert,
  type DoubleClickMenuMode,
} from "./doubleClickMenuMode";
import {
  duplicateClosestLeftFrameAt,
  getClosestLeftFrame,
} from "./keyframeInsertion";

import "./timeline-legacy.css";

import iconLock from "resources/timeline-icons/locked.png";
import iconUnlock from "resources/timeline-icons/unlocked.png";
import iconHidden from "resources/timeline-icons/hidden.png";
import iconShown from "resources/timeline-icons/shown.png";
import iconDelete from "resources/timeline-icons/delete.png";
import iconSmallFrames from "resources/timeline-icons/framesSmall.png";
import iconNormalFrames from "resources/timeline-icons/framesNormal.png";
import iconLargeFrames from "resources/timeline-icons/framesLarge.png";
import iconFrameSizeMenu from "resources/timeline-icons/frameSizeMenu.png";
import iconGapFillMenuBlankFrames from "resources/timeline-icons/gapFillMenuBlankFrames.png";
import iconGapFillMenuExtendFrames from "resources/timeline-icons/gapFillMenuExtendFrames.png";
import iconGapFillBlankFrames from "resources/timeline-icons/gapFillBlankFrames.png";
import iconGapFillExtendFrames from "resources/timeline-icons/gapFillExtendFrames.png";

import type {
  TimelineContextMenuItem,
  TimelineContextMenuPosition,
  TimelineContextTarget,
  TimelineDensityMode,
  TimelineFrameVisualState,
  TimelineFillGapsMode,
  TimelineFrameLike,
  TimelineFrameSizeMode,
  TimelineInsertMode,
  TimelineLayerLike,
  TimelineMarker,
  TimelineRendererProps,
  TimelineSnapMode,
  TimelineTweenLike,
  TimelineWorkArea,
} from "./Timeline.types";

type InteractionMode =
  | "playhead"
  | "select-box"
  | "frame-move"
  | "frame-resize-left"
  | "frame-resize-right"
  | "tween-move"
  | "layer-reorder"
  | "work-area-start"
  | "work-area-end";

type InteractionState = {
  mode: InteractionMode;
  pointerId: number;
  pointerType: string;
  startClientX: number;
  startClientY: number;
  startCol: number;
  startRow: number;
  startLayerIndex: number;
  startPlayhead: number;
  axisLock: "x" | "y" | null;
  moveCols: number;
  moveRows: number;
  rawMoveRows: number;
  frames: TimelineFrameLike[];
  tweens: TimelineTweenLike[];
  layer: TimelineLayerLike | null;
  workArea: TimelineWorkArea | null;
};

type SelectionBox = {
  startCol: number;
  startRow: number;
  endCol: number;
  endRow: number;
};

type SoundHoverDetail = {
  x: number;
  y: number;
  uuid?: string;
};

const DEFAULT_FRAME_RATE = 12;
const MIN_FRAME_RATE = 1;
const MAX_FRAME_RATE = 60;
const LONG_PRESS_MS = 450;
const LONG_PRESS_CANCEL_DISTANCE_PX = 12;
const DOUBLE_TAP_MAX_DELAY_MS = 320;
const DOUBLE_TAP_MAX_DISTANCE_PX = 18;
const TOUCH_AXIS_LOCK_THRESHOLD_PX = 14;
const FRAME_MOVE_INTENT_THRESHOLD_PX = 8;
const FRAME_VERTICAL_INTENT_THRESHOLD_PX = 10;
const LAYER_REORDER_INTENT_THRESHOLD_PX = 10;
const CONTEXT_MENU_WIDTH_PX = 220;
const CONTEXT_MENU_HEIGHT_PX = 320;
const CONTEXT_MENU_MARGIN_PX = 8;
const DENSITY_SCALE: Record<TimelineDensityMode, number> = {
  compact: 0.86,
  standard: 1,
};
const DEFAULT_MARKER_COLORS = [
  "#66B6FF",
  "#FFB347",
  "#7CE38B",
  "#F08282",
  "#B79EFF",
];
const VIRTUALIZATION_LAYER_THRESHOLD = 80;
const VIRTUALIZATION_FRAME_THRESHOLD = 260;
const VIRTUALIZATION_LAYER_OVERSCAN = 4;

function createTimelineLayer(): TimelineLayerLike | null {
  const layerConstructor = getWickRuntime()?.Layer as
    | (new () => TimelineLayerLike)
    | undefined;
  if (typeof layerConstructor !== "function") {
    return null;
  }

  return new layerConstructor();
}
const VIRTUALIZATION_FRAME_OVERSCAN = 10;
const LAYER_PANEL_WIDTH_PX = 210;

const getKeyDisplayLabel = (rawKey: string): string => {
  const key = rawKey.trim();
  if (!key) {
    return "";
  }

  if (key === " ") return "Space";
  if (key === "ArrowLeft") return "Left";
  if (key === "ArrowRight") return "Right";
  if (key === "ArrowUp") return "Up";
  if (key === "ArrowDown") return "Down";
  if (key === "Escape") return "Esc";
  if (key === "Control") return "Ctrl";
  if (key === "Meta") return "Cmd";

  if (key.length === 1) {
    return key.toUpperCase();
  }

  return key;
};

const formatShortcutIndicator = (
  keyboardEvent: Pick<KeyboardEvent, "key" | "metaKey" | "ctrlKey" | "altKey" | "shiftKey">,
): string => {
  if (["Shift", "Control", "Alt", "Meta"].includes(keyboardEvent.key)) {
    return "";
  }

  const parts: string[] = [];
  if (keyboardEvent.metaKey) parts.push("Cmd");
  if (keyboardEvent.ctrlKey) parts.push("Ctrl");
  if (keyboardEvent.altKey) parts.push("Alt");
  if (keyboardEvent.shiftKey) parts.push("Shift");

  const keyLabel = getKeyDisplayLabel(keyboardEvent.key);
  if (!keyLabel) {
    return "";
  }

  parts.push(keyLabel);
  return parts.join("+");
};

const getFrameSizeMode = (): TimelineFrameSizeMode => {
  const guiElement = window?.Wick?.GUIElement;
  if (!guiElement) {
    return "small";
  }

  const currentWidth = Number(guiElement.GRID_DEFAULT_CELL_WIDTH);
  if (currentWidth === Number(guiElement.GRID_SMALL_CELL_WIDTH)) {
    return "small";
  }
  if (currentWidth === Number(guiElement.GRID_LARGE_CELL_WIDTH)) {
    return "large";
  }

  return "small";
};

const setFrameSizeMode = (mode: TimelineFrameSizeMode): void => {
  const guiElement = window?.Wick?.GUIElement;
  if (!guiElement) {
    return;
  }

  if (mode === "small") {
    guiElement.GRID_DEFAULT_CELL_WIDTH = guiElement.GRID_SMALL_CELL_WIDTH;
    guiElement.GRID_DEFAULT_CELL_HEIGHT = guiElement.GRID_SMALL_CELL_HEIGHT;
  } else if (mode === "large") {
    guiElement.GRID_DEFAULT_CELL_WIDTH = guiElement.GRID_LARGE_CELL_WIDTH;
    guiElement.GRID_DEFAULT_CELL_HEIGHT = guiElement.GRID_LARGE_CELL_HEIGHT;
  } else {
    guiElement.GRID_DEFAULT_CELL_WIDTH = guiElement.GRID_NORMAL_CELL_WIDTH;
    guiElement.GRID_DEFAULT_CELL_HEIGHT = guiElement.GRID_NORMAL_CELL_HEIGHT;
  }
};

const getGridMetrics = (): { cellWidth: number; cellHeight: number } => {
  const guiElement = window?.Wick?.GUIElement;
  return {
    cellWidth: Number(guiElement?.GRID_DEFAULT_CELL_WIDTH ?? 38),
    cellHeight: Number(guiElement?.GRID_DEFAULT_CELL_HEIGHT ?? 42),
  };
};

const clampNumber = (value: number, min: number, max: number): number => {
  return Math.min(max, Math.max(min, value));
};

const getLayerIndex = (layers: TimelineLayerLike[], layer: TimelineLayerLike): number => {
  const arrayIndex = layers.indexOf(layer);
  if (arrayIndex >= 0) {
    return arrayIndex;
  }

  if (typeof layer.index === "number" && Number.isFinite(layer.index)) {
    return layer.index;
  }

  return 0;
};

const normalizeFrameLength = (frame: TimelineFrameLike): number => {
  if (typeof frame.length === "number" && Number.isFinite(frame.length)) {
    return Math.max(1, Math.round(frame.length));
  }

  const start = Number(frame.start ?? 1);
  const end = Number(frame.end ?? start);
  return Math.max(1, Math.round(end - start + 1));
};

const getFrameVisualState = (frame: TimelineFrameLike): TimelineFrameVisualState => {
  const length = normalizeFrameLength(frame);
  const isContentful = Boolean(frame.contentful);

  if (length <= 1) {
    return isContentful ? "keyframe-content" : "keyframe-blank";
  }

  return isContentful ? "span-content" : "span-blank";
};

const frameContainsPlayhead = (frame: TimelineFrameLike, playheadPosition: number): boolean => {
  if (typeof frame.inPosition === "function") {
    return Boolean(frame.inPosition(playheadPosition));
  }

  const start = Number(frame.start ?? 1);
  const end = Number(frame.end ?? start);
  return playheadPosition >= start && playheadPosition <= end;
};

const frameInRange = (
  frame: TimelineFrameLike,
  startPlayhead: number,
  endPlayhead: number,
): boolean => {
  if (typeof frame.inRange === "function") {
    return Boolean(frame.inRange(startPlayhead, endPlayhead));
  }

  const frameStart = Number(frame.start ?? 1);
  const frameEnd = Number(frame.end ?? frameStart);
  return frameStart <= endPlayhead && frameEnd >= startPlayhead;
};

const getFrameAtPlayhead = (
  layer: TimelineLayerLike,
  playheadPosition: number,
): TimelineFrameLike | null => {
  if (typeof layer.getFrameAtPlayheadPosition === "function") {
    return layer.getFrameAtPlayheadPosition(playheadPosition);
  }

  return (
    layer.frames.find((frame) => frameContainsPlayhead(frame, playheadPosition)) ?? null
  );
};

const getTimelineLength = (layers: TimelineLayerLike[]): number => {
  return Math.max(
    1,
    layers.reduce((longest, layer) => {
      const layerLength = layer.frames.reduce((maxEnd, frame) => {
        const frameEnd = Number(frame.end ?? frame.start ?? 1);
        return Math.max(maxEnd, frameEnd);
      }, 1);

      return Math.max(longest, layerLength);
    }, 1),
  );
};

const clampContextMenuPosition = (
  clientX: number,
  clientY: number,
): TimelineContextMenuPosition => {
  const maxX = Math.max(
    CONTEXT_MENU_MARGIN_PX,
    window.innerWidth - CONTEXT_MENU_WIDTH_PX - CONTEXT_MENU_MARGIN_PX,
  );
  const maxY = Math.max(
    CONTEXT_MENU_MARGIN_PX,
    window.innerHeight - CONTEXT_MENU_HEIGHT_PX - CONTEXT_MENU_MARGIN_PX,
  );

  return {
    x: Math.min(Math.max(CONTEXT_MENU_MARGIN_PX, clientX), maxX),
    y: Math.min(Math.max(CONTEXT_MENU_MARGIN_PX, clientY), maxY),
  };
};

const TimelineDOM: React.FC<TimelineRendererProps> = (props) => {
  const timelineRootRef = useRef<HTMLDivElement>(null);
  const workspaceRef = useRef<HTMLDivElement>(null);
  const unifiedGridCanvasRef = useRef<HTMLCanvasElement>(null);
  const unifiedNumberLineCanvasRef = useRef<HTMLCanvasElement>(null);
  const contextMenuRef = useRef<HTMLDivElement>(null);
  const interactionRef = useRef<InteractionState | null>(null);
  const selectionBoxRef = useRef<SelectionBox | null>(null);
  const selectionAnchorRef = useRef<{ layerIndex: number; playheadPosition: number } | null>(null);
  const layerReorderPreviewRef = useRef<number | null>(null);
  const workAreaDirtyRef = useRef(false);
  const longPressTimerRef = useRef<number | null>(null);
  const keyPressIndicatorTimerRef = useRef<number | null>(null);
  const longPressStartRef = useRef<{ x: number; y: number } | null>(null);
  const longPressTriggeredRef = useRef(false);
  const lastTouchTapRef = useRef<{
    time: number;
    x: number;
    y: number;
    layerIndex: number;
    playheadPosition: number;
  } | null>(null);
  const [renderTick, setRenderTick] = useState(0);
  const [frameInputValue, setFrameInputValue] = useState("1");
  const [fpsInputValue, setFpsInputValue] = useState(DEFAULT_FRAME_RATE.toFixed(1));
  const [selectionBox, setSelectionBox] = useState<SelectionBox | null>(null);
  const [contextMenuPosition, setContextMenuPosition] =
    useState<TimelineContextMenuPosition | null>(null);
  const [contextMenuTarget, setContextMenuTarget] = useState<TimelineContextTarget | null>(null);
  const [doubleClickMenuContext, setDoubleClickMenuContext] = useState<{
    layer: TimelineLayerLike;
    playheadPosition: number;
    label: string;
    mode: DoubleClickMenuMode;
  } | null>(null);
  const [insertMenuTargetCell, setInsertMenuTargetCell] =
    useState<{ layerIndex: number; playheadPosition: number } | null>(null);
  const [dragPreview, setDragPreview] = useState<{ moveCols: number; moveRows: number } | null>(
    null,
  );
  const [layerRename, setLayerRename] = useState<{ layer: TimelineLayerLike; value: string } | null>(
    null,
  );
  const [layerReorderPreview, setLayerReorderPreview] = useState<number | null>(null);
  const [dragCollisionMode, setDragCollisionMode] = useState<"overwrite" | "push" | null>(null);
  const [pressFeedback, setPressFeedback] = useState<{ x: number; y: number } | null>(null);
  const [keyPressIndicator, setKeyPressIndicator] = useState<string | null>(null);
  const [gridViewportHeight, setGridViewportHeight] = useState(0);
  const [gridViewport, setGridViewport] = useState({
    width: 0,
    height: 0,
    scrollTop: 0,
    scrollLeft: 0,
  });
  const [soundHoverCell, setSoundHoverCell] =
    useState<{ layerIndex: number; playheadPosition: number } | null>(null);
  const [markers, setMarkers] = useState<TimelineMarker[]>([]);
  const [workArea, setWorkArea] = useState<TimelineWorkArea>({
    start: 1,
    end: 120,
  });
  const [loopWorkArea, setLoopWorkArea] = useState(false);
  const [showHeaderOptions, setShowHeaderOptions] = useState(false);
  const [gridContrastMode, setGridContrastMode] = useState<"soft" | "strong">("soft");
  const [jumpFrameValue, setJumpFrameValue] = useState("");
  const [jumpLayerValue, setJumpLayerValue] = useState("");
  const [workAreaStartInput, setWorkAreaStartInput] = useState("1");
  const [workAreaEndInput, setWorkAreaEndInput] = useState("120");

  const project = props.project;
  const activeTimeline = project?.activeTimeline;
  const layers = activeTimeline?.layers ?? [];
  const playheadPosition = Number(activeTimeline?.playheadPosition ?? 1);
  const frameRate = Number(project?.framerate ?? 0);
  const frameSizeMode = getFrameSizeMode();
  const baseGridMetrics = getGridMetrics();
  const densityScale = DENSITY_SCALE[props.timelineDensityMode] ?? 1;
  const cellWidth = Math.max(20, Math.round(baseGridMetrics.cellWidth * densityScale));
  const cellHeight = Math.max(26, Math.round(baseGridMetrics.cellHeight * densityScale));
  const timelineLength = useMemo(() => {
    const layerDrivenLength = getTimelineLength(layers) + 24;
    const workAreaDrivenLength = Math.max(1, Math.round(Number(workArea.end ?? 1)));
    const markerDrivenLength = markers.reduce((maxFrame, marker) => {
      const markerFrame = Math.max(1, Math.round(Number(marker.frame ?? 1)));
      return Math.max(maxFrame, markerFrame);
    }, 1);
    return Math.max(layerDrivenLength, workAreaDrivenLength, markerDrivenLength, 48);
  }, [layers, markers, renderTick, frameSizeMode, workArea.end]);
  const maxLayerIndex = Math.max(0, layers.length - 1);
  const viewportWidth =
    gridViewport.width > 0
      ? gridViewport.width
      : Math.max(cellWidth, timelineLength * cellWidth);
  const viewportHeight =
    gridViewport.height > 0
      ? gridViewport.height
      : Math.max(cellHeight, gridViewportHeight);
  const totalUnifiedRows = Math.max(1, layers.length + 1);
  const unifiedGridHeight = Math.max(totalUnifiedRows * cellHeight, viewportHeight);
  const unifiedGridWidth = timelineLength * cellWidth;
  const unifiedBodyMinWidth = LAYER_PANEL_WIDTH_PX + unifiedGridWidth;
  const shouldVirtualizeLayerRows = layers.length >= VIRTUALIZATION_LAYER_THRESHOLD;
  const shouldVirtualizeFrames = timelineLength >= VIRTUALIZATION_FRAME_THRESHOLD;
  const visibleLayerStart =
    layers.length === 0
      ? 0
      : shouldVirtualizeLayerRows
        ? clampNumber(
          Math.floor(gridViewport.scrollTop / cellHeight) - VIRTUALIZATION_LAYER_OVERSCAN,
          0,
          maxLayerIndex,
        )
        : 0;
  const visibleLayerEnd =
    layers.length === 0
      ? -1
      : shouldVirtualizeLayerRows
        ? clampNumber(
          Math.ceil((gridViewport.scrollTop + viewportHeight) / cellHeight) +
          VIRTUALIZATION_LAYER_OVERSCAN,
          0,
          maxLayerIndex,
        )
        : maxLayerIndex;
  const visibleFrameStart = shouldVirtualizeFrames
    ? Math.max(
      1,
      Math.floor(gridViewport.scrollLeft / cellWidth) + 1 - VIRTUALIZATION_FRAME_OVERSCAN,
    )
    : 1;
  const visibleFrameEnd = shouldVirtualizeFrames
    ? Math.min(
      timelineLength,
      Math.ceil((gridViewport.scrollLeft + viewportWidth) / cellWidth) +
      VIRTUALIZATION_FRAME_OVERSCAN,
    )
    : timelineLength;
  const renderedLayers =
    visibleLayerEnd >= visibleLayerStart
      ? layers.slice(visibleLayerStart, visibleLayerEnd + 1)
      : [];
  const activeLayerIndex = clampNumber(
    Number(activeTimeline?.activeLayerIndex ?? 0),
    0,
    Math.max(0, layers.length - 1),
  );
  const activeLayer = layers[activeLayerIndex] ?? null;
  const selectedFrameAtPlayhead =
    activeLayer && project?.selection?.isObjectSelected
      ? (getFrameAtPlayhead(activeLayer, playheadPosition) as TimelineFrameLike | null)
      : null;
  const showSelectedFrameCellIndicator = Boolean(
    selectedFrameAtPlayhead &&
    project?.selection?.isObjectSelected?.(selectedFrameAtPlayhead),
  );
  const layerTopSpacerHeight = shouldVirtualizeLayerRows ? visibleLayerStart * cellHeight : 0;
  const layerBottomSpacerHeight =
    shouldVirtualizeLayerRows && visibleLayerEnd >= visibleLayerStart
      ? Math.max(0, layers.length - visibleLayerEnd - 1) * cellHeight
      : 0;

  const currentLayersHeight = layerTopSpacerHeight + renderedLayers.length * cellHeight + layerBottomSpacerHeight + cellHeight;
  const layerFillerHeight = Math.max(0, gridViewportHeight - currentLayersHeight);

  const focus = project?.focus;
  const isNestedTimeline = Boolean(focus && !focus.isRoot);
  const focusLabel =
    typeof focus?.identifier === "string" && focus.identifier.trim().length > 0
      ? focus.identifier
      : isNestedTimeline
        ? "Nested Clip"
        : "Scene 1";

  const fillGapsMode: TimelineFillGapsMode =
    activeTimeline?.fillGapsMethod === "auto_extend" ? "auto_extend" : "blank_frames";
  const insertMode: TimelineInsertMode = fillGapsMode === "auto_extend" ? "ripple" : "overwrite";

  const timelineMeta =
    frameRate > 0
      ? `Frame ${playheadPosition} | ${frameRate.toFixed(1)} fps`
      : `Frame ${playheadPosition}`;

  const requestRender = (): void => {
    setRenderTick((tick) => tick + 1);
  };

  const normalizeMarkerList = (input: TimelineMarker[] | null | undefined): TimelineMarker[] => {
    if (!Array.isArray(input)) {
      return [];
    }

    return input
      .map((marker, index) => {
        if (!marker || typeof marker !== "object") {
          return null;
        }

        const frame = Math.max(1, Math.round(Number(marker.frame ?? 1)));
        const id =
          typeof marker.id === "string" && marker.id.trim().length > 0
            ? marker.id
            : `marker-${Date.now()}-${index}`;
        const label =
          typeof marker.label === "string" && marker.label.trim().length > 0
            ? marker.label.trim()
            : `M${index + 1}`;
        const color =
          typeof marker.color === "string" && marker.color.trim().length > 0
            ? marker.color
            : DEFAULT_MARKER_COLORS[index % DEFAULT_MARKER_COLORS.length];

        return {
          id,
          frame,
          label,
          color,
        };
      })
      .filter((marker): marker is TimelineMarker => Boolean(marker))
      .sort((a, b) => a.frame - b.frame);
  };

  const normalizeWorkArea = (input: TimelineWorkArea | null | undefined): TimelineWorkArea => {
    const start = Math.max(1, Math.round(Number(input?.start ?? 1)));
    const end = Math.max(start, Math.round(Number(input?.end ?? Math.max(120, timelineLength))));
    return { start, end };
  };

  type TimelineMetadata = {
    editorUi?: {
      timelineUi?: {
        markers?: TimelineMarker[];
        workArea?: TimelineWorkArea;
      };
    };
  };

  type TimelineProject = {
    metadata?: TimelineMetadata;
  };

  const readTimelineUiState = (): { markers: TimelineMarker[]; workArea: TimelineWorkArea } => {
    const metadata = (project as TimelineProject | null)?.metadata;

    const timelineUi = metadata?.editorUi?.timelineUi;
    return {
      markers: normalizeMarkerList(timelineUi?.markers),
      workArea: normalizeWorkArea(timelineUi?.workArea),
    };
  };

  const persistTimelineUiState = (
    nextMarkers: TimelineMarker[],
    nextWorkArea: TimelineWorkArea,
    actionName?: string,
  ): void => {
    if (!project) {
      return;
    }

    const currentProject = project as TimelineProject;
    const metadata = currentProject.metadata && typeof currentProject.metadata === "object"
      ? currentProject.metadata
      : ({} as TimelineMetadata);
    const editorUi =
      metadata.editorUi && typeof metadata.editorUi === "object"
        ? metadata.editorUi
        : {};

    currentProject.metadata = {
      ...metadata,
      editorUi: {
        ...editorUi,
        timelineUi: {
          markers: normalizeMarkerList(nextMarkers),
          workArea: normalizeWorkArea(nextWorkArea),
        },
      },
    };

    if (actionName) {
      commitProjectChange(actionName);
    }
  };

  const safeSetPointerCapture = (target: EventTarget | null, pointerId: number): void => {
    const captureTarget = target as { setPointerCapture?: (id: number) => void } | null;
    if (!captureTarget || typeof captureTarget.setPointerCapture !== "function") {
      return;
    }

    try {
      captureTarget.setPointerCapture(pointerId);
    } catch {
      // Some synthetic pointer events (tests) cannot be captured; continue without capture.
    }
  };

  const isTransientFocusRenderError = (error: unknown): boolean => {
    const message =
      error && typeof error === "object" && "message" in error
        ? String((error as { message?: unknown }).message ?? "")
        : String(error ?? "");
    return (
      message.includes("Cannot read properties of null") &&
      (message.includes("isRoot") ||
        message.includes("timeline") ||
        message.includes("activeTimeline"))
    );
  };

  const softRender = (): void => {
    try {
      project?.view?.render?.();
    } catch (error) {
      if (!isTransientFocusRenderError(error)) {
        throw error;
      }
    }

    try {
      project?.guiElement?.draw?.();
    } catch (error) {
      if (!isTransientFocusRenderError(error)) {
        throw error;
      }
    }

    requestRender();
  };

  const commitProjectChange = (actionName: string): void => {
    props.projectDidChange({ actionName });
    requestRender();
  };

  const maybeAutoScrollPlayhead = (): void => {
    if (props.timelinePlaybackFollowMode !== "follow-playhead") {
      return;
    }

    try {
      project?.guiElement?.checkForPlayheadAutoscroll?.();
    } catch (error) {
      if (!isTransientFocusRenderError(error)) {
        throw error;
      }
    }
  };

  const resolveSnappedPlayhead = (
    inputPlayhead: number,
    snapMode: TimelineSnapMode,
  ): number => {
    const normalizedInput = Math.max(1, Math.round(inputPlayhead));
    if (snapMode !== "markers") {
      return normalizedInput;
    }

    if (markers.length === 0) {
      return normalizedInput;
    }

    const firstMarkerFrameValue = markers[0]?.frame;
    if (typeof firstMarkerFrameValue !== "number" || !Number.isFinite(firstMarkerFrameValue)) {
      return normalizedInput;
    }
    const firstMarkerFrame = firstMarkerFrameValue;

    return markers.reduce((closest, marker) => {
      if (Math.abs(marker.frame - normalizedInput) < Math.abs(closest - normalizedInput)) {
        return marker.frame;
      }
      return closest;
    }, firstMarkerFrame);
  };

  const reportRendererError = (error: unknown): void => {
    if (isTransientFocusRenderError(error)) {
      console.warn("TimelineDOM transient interaction race ignored", error);
      requestRender();
      return;
    }
    console.error("TimelineDOM interaction error", error);
    props.onRendererError?.(error);
  };

  const closeContextMenu = (): void => {
    setDoubleClickMenuContext(null);
    setInsertMenuTargetCell(null);
    setContextMenuPosition(null);
    setContextMenuTarget(null);
  };

  const setPlayhead = (
    nextPlayhead: number,
    options: {
      respectSnap?: boolean;
      autoScroll?: boolean;
    } = {},
  ): void => {
    if (!activeTimeline) {
      return;
    }

    const snapMode = options.respectSnap === false ? "none" : props.timelineSnapMode;
    const normalizedPlayhead = resolveSnappedPlayhead(nextPlayhead, snapMode);
    setFrameInputValue(String(normalizedPlayhead));

    if (activeTimeline.playheadPosition === normalizedPlayhead) {
      if (options.autoScroll !== false) {
        try {
          maybeAutoScrollPlayhead();
        } catch (error) {
          reportRendererError(error);
        }
      }
      requestRender();
      return;
    }

    activeTimeline.playheadPosition = normalizedPlayhead;

    if (options.autoScroll !== false) {
      try {
        maybeAutoScrollPlayhead();
      } catch (error) {
        reportRendererError(error);
      }
    }

    softRender();
  };

  const resolveGridLocation = (
    clientX: number,
    clientY: number,
  ): { layerIndex: number; playheadPosition: number; col: number; row: number } | null => {
    const workspace = workspaceRef.current;
    if (!workspace) {
      return null;
    }

    const rect = workspace.getBoundingClientRect();
    const localX = (clientX - rect.left) + workspace.scrollLeft - LAYER_PANEL_WIDTH_PX;
    const localY = (clientY - rect.top) + workspace.scrollTop - 68;

    const col = Math.floor(localX / cellWidth);
    const row = Math.floor(localY / cellHeight);

    const layerIndex = clampNumber(row, 0, Math.max(0, layers.length - 1));
    const playhead = Math.max(1, col + 1);

    return {
      layerIndex,
      playheadPosition: playhead,
      col,
      row,
    };
  };

  const resolveContextTarget = (
    clientX: number,
    clientY: number,
  ): TimelineContextTarget => {
    const defaultTarget: TimelineContextTarget = {
      area: "unknown",
      layerIndex: null,
      playheadPosition: null,
      frame: null,
      label: "Current Selection",
    };

    const location = resolveGridLocation(clientX, clientY);
    if (!location || layers.length === 0) {
      return defaultTarget;
    }

    const layer = layers[location.layerIndex];
    if (!layer) {
      return defaultTarget;
    }
    const frame = getFrameAtPlayhead(layer, location.playheadPosition);

    const label = `Layer ${location.layerIndex + 1} | Frame ${location.playheadPosition}`;

    return {
      area: "frame",
      layerIndex: location.layerIndex,
      playheadPosition: location.playheadPosition,
      frame,
      label,
    };
  };

  const getSelectedFrames = (): TimelineFrameLike[] => {
    return (project?.selection?.getSelectedObjects?.("Frame") ?? []) as TimelineFrameLike[];
  };

  const getSelectedTweens = (): TimelineTweenLike[] => {
    return (project?.selection?.getSelectedObjects?.("Tween") ?? []) as TimelineTweenLike[];
  };

  const isFrameSelected = (frame: TimelineFrameLike): boolean => {
    return Boolean(project?.selection?.isObjectSelected?.(frame));
  };

  const selectFrame = (
    frame: TimelineFrameLike,
    options: {
      append?: boolean;
      toggle?: boolean;
      setAnchor?: boolean;
      playheadPosition?: number;
    } = {},
  ): void => {
    const selection = project?.selection;
    if (!selection) {
      return;
    }

    if (!options.append) {
      selection.clear();
    }

    if (options.toggle && selection.isObjectSelected?.(frame)) {
      selection.deselect?.(frame);
    } else {
      selection.select(frame);
    }

    frame.parentLayer?.activate?.();
    const targetPlayhead = Math.max(
      1,
      Number(options.playheadPosition ?? frame.start ?? playheadPosition),
    );
    if (options.setAnchor !== false) {
      const anchorLayer = frame.parentLayer as TimelineLayerLike | undefined;
      selectionAnchorRef.current = {
        layerIndex: anchorLayer ? getLayerIndex(layers, anchorLayer) : Number(activeTimeline?.activeLayerIndex ?? 0),
        playheadPosition: targetPlayhead,
      };
    }
    setPlayhead(targetPlayhead);
    requestRender();
  };

  const selectFrameRangeFromAnchor = (
    frame: TimelineFrameLike,
    layerIndex: number,
  ): void => {
    const selection = project?.selection;
    if (!selection) {
      return;
    }

    const anchor = selectionAnchorRef.current;
    if (!anchor) {
      selectFrame(frame);
      return;
    }

    const targetLayer = layers[layerIndex] ?? frame.parentLayer;
    if (!targetLayer) {
      selectFrame(frame);
      return;
    }

    const targetPlayhead = Math.max(1, Number(frame.start ?? playheadPosition));
    const rangeStart = Math.min(anchor.playheadPosition, targetPlayhead);
    const rangeEnd = Math.max(anchor.playheadPosition, targetPlayhead);

    selection.clear();
    targetLayer.frames.forEach((candidate) => {
      if (frameInRange(candidate, rangeStart, rangeEnd)) {
        selection.select(candidate);
      }
    });
    targetLayer.activate?.();
    setPlayhead(targetPlayhead);
    requestRender();
  };

  const clearLongPressTimer = (): void => {
    if (longPressTimerRef.current !== null) {
      window.clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  const showShortcutIndicator = (label: string): void => {
    if (!label) {
      return;
    }

    setKeyPressIndicator(label);
    if (keyPressIndicatorTimerRef.current !== null) {
      window.clearTimeout(keyPressIndicatorTimerRef.current);
    }

    keyPressIndicatorTimerRef.current = window.setTimeout(() => {
      setKeyPressIndicator(null);
      keyPressIndicatorTimerRef.current = null;
    }, 900);
  };

  const resetInteraction = (): void => {
    interactionRef.current = null;
    workAreaDirtyRef.current = false;
    setDragPreview(null);
    setLayerReorderPreview(null);
    setDragCollisionMode(null);
    setPressFeedback(null);
    setSelectionBox(null);
    selectionBoxRef.current = null;
    layerReorderPreviewRef.current = null;
  };

  const finalizeFrameMove = (interaction: InteractionState): void => {
    if (!activeTimeline || interaction.frames.length === 0) {
      return;
    }

    if (interaction.moveCols === 0 && interaction.moveRows === 0) {
      return;
    }

    const movedFrames = interaction.frames;
    activeTimeline.playheadPosition = Math.max(1, activeTimeline.playheadPosition + interaction.moveCols);
    activeTimeline.deferFrameGapResolve?.();

    movedFrames.forEach((frame) => {
      (frame as { __wickOriginalLayerIndex?: number }).__wickOriginalLayerIndex = getLayerIndex(
        layers,
        frame.parentLayer as TimelineLayerLike,
      );
      frame.remove?.();
    });

    movedFrames.forEach((frame) => {
      frame.start = Number(frame.start ?? 1) + interaction.moveCols;
      frame.end = Number(frame.end ?? frame.start ?? 1) + interaction.moveCols;
      if (Number(frame.start) < 1) {
        const diff = 1 - Number(frame.start);
        frame.start = 1;
        frame.end = Number(frame.end ?? 1) + diff;
      }
    });

    movedFrames.forEach((frame) => {
      const originalLayerIndex = (frame as { __wickOriginalLayerIndex?: number }).__wickOriginalLayerIndex;
      const targetLayer =
        typeof originalLayerIndex === "number"
          ? layers[originalLayerIndex + interaction.moveRows]
          : frame.parentLayer;

      if (targetLayer?.addFrame) {
        targetLayer.addFrame(frame);
      }

      delete (frame as { __wickOriginalLayerIndex?: number }).__wickOriginalLayerIndex;
    });

    activeTimeline.resolveFrameGaps?.(movedFrames);
    commitProjectChange("Move Frames");
  };

  const finalizeFrameResize = (interaction: InteractionState): void => {
    if (interaction.frames.length === 0 || interaction.moveCols === 0) {
      return;
    }

    interaction.frames.forEach((frame) => {
      (frame as { __wickOriginalLayer?: TimelineLayerLike }).__wickOriginalLayer = frame.parentLayer;
      frame.remove?.();

      if (interaction.mode === "frame-resize-right") {
        frame.end = Number(frame.end ?? frame.start ?? 1) + interaction.moveCols;
      } else {
        frame.start = Number(frame.start ?? 1) + interaction.moveCols;
      }

      const start = Number(frame.start ?? 1);
      const end = Number(frame.end ?? start);
      if (end < start) {
        if (interaction.mode === "frame-resize-right") {
          frame.end = start;
        } else {
          frame.start = end;
        }
      }
    });

    interaction.frames.forEach((frame) => {
      const originalLayer = (frame as { __wickOriginalLayer?: TimelineLayerLike }).__wickOriginalLayer;
      originalLayer?.addFrame?.(frame);
      delete (frame as { __wickOriginalLayer?: TimelineLayerLike }).__wickOriginalLayer;
    });

    commitProjectChange(
      interaction.mode === "frame-resize-right" ? "Extend Frame (DOM)" : "Shrink Frame (DOM)",
    );
  };

  const finalizeTweenMove = (interaction: InteractionState): void => {
    if (!activeTimeline || interaction.tweens.length === 0 || interaction.moveCols === 0) {
      return;
    }

    activeTimeline.playheadPosition = Math.max(1, activeTimeline.playheadPosition + interaction.moveCols);

    interaction.tweens.forEach((tween) => {
      (tween as { __wickOriginalFrame?: TimelineFrameLike }).__wickOriginalFrame = tween.parentFrame;
      tween.remove?.();
    });

    interaction.tweens.forEach((tween) => {
      tween.playheadPosition = Math.max(1, Number(tween.playheadPosition ?? 1) + interaction.moveCols);
      (tween as { __wickOriginalFrame?: TimelineFrameLike }).__wickOriginalFrame?.addTween?.(tween);
      delete (tween as { __wickOriginalFrame?: TimelineFrameLike }).__wickOriginalFrame;
    });

    commitProjectChange("Move Tweens");
  };

  const finalizeSelectionBox = (box: SelectionBox): void => {
    const selection = project?.selection;
    if (!selection) {
      return;
    }

    const startCol = Math.min(box.startCol, box.endCol);
    const endCol = Math.max(box.startCol, box.endCol);
    const startRow = Math.min(box.startRow, box.endRow);
    const endRow = Math.max(box.startRow, box.endRow);

    selection.clear();

    layers.forEach((layer, layerIndex) => {
      if (layerIndex < startRow || layerIndex > endRow) {
        return;
      }

      layer.frames.forEach((frame) => {
        if (frameInRange(frame, startCol + 1, endCol + 1)) {
          selection.select(frame);
        }
      });
    });

    setPlayhead(endCol + 1);
    requestRender();
  };

  const detectFrameCollisionMode = (
    frames: TimelineFrameLike[],
    moveCols: number,
    moveRows: number,
  ): "overwrite" | "push" | null => {
    if (frames.length === 0) {
      return null;
    }

    const selectedFrames = new Set(frames);
    const hasCollision = frames.some((frame) => {
      const frameLength = normalizeFrameLength(frame);
      const sourceLayer = frame.parentLayer;
      if (!sourceLayer) {
        return false;
      }

      const sourceLayerIndex = getLayerIndex(layers, sourceLayer);
      const targetLayerIndex = clampNumber(
        sourceLayerIndex + moveRows,
        0,
        Math.max(0, layers.length - 1),
      );
      const targetLayer = layers[targetLayerIndex];
      if (!targetLayer) {
        return false;
      }

      const nextStart = Math.max(1, Number(frame.start ?? 1) + moveCols);
      const nextEnd = nextStart + frameLength - 1;

      return targetLayer.frames.some((candidate) => {
        if (selectedFrames.has(candidate)) {
          return false;
        }

        const candidateStart = Number(candidate.start ?? 1);
        const candidateEnd = Number(candidate.end ?? candidateStart);
        return nextStart <= candidateEnd && nextEnd >= candidateStart;
      });
    });

    if (!hasCollision) {
      return null;
    }

    return insertMode === "ripple" ? "push" : "overwrite";
  };

  const finalizeLayerReorder = (interaction: InteractionState): void => {
    const draggedLayer = interaction.layer;
    if (!activeTimeline || !draggedLayer) {
      return;
    }

    if (Math.abs(interaction.rawMoveRows) < 0.5) {
      return;
    }

    const currentIndex = getLayerIndex(layers, draggedLayer);
    const fallbackTargetIndex = clampNumber(
      currentIndex + interaction.moveRows,
      0,
      Math.max(0, layers.length - 1),
    );
    const targetIndex =
      layerReorderPreviewRef.current === null
        ? fallbackTargetIndex
        : clampNumber(layerReorderPreviewRef.current, 0, Math.max(0, layers.length - 1));

    if (targetIndex === currentIndex) {
      return;
    }

    activeTimeline.moveLayer?.(draggedLayer, targetIndex);
    draggedLayer.activate?.();
    commitProjectChange("Move Layer");
  };

  const updateInteractionFromPointer = (clientX: number, clientY: number): void => {
    const interaction = interactionRef.current;
    if (!interaction) {
      return;
    }

    const dx = clientX - interaction.startClientX;
    const dy = clientY - interaction.startClientY;

    let moveCols = Math.round(dx / cellWidth);
    let moveRows = Math.round(dy / cellHeight);
    const rawMoveRows = dy / cellHeight;

    if (interaction.pointerType === "touch") {
      if (
        !interaction.axisLock &&
        (Math.abs(dx) > TOUCH_AXIS_LOCK_THRESHOLD_PX ||
          Math.abs(dy) > TOUCH_AXIS_LOCK_THRESHOLD_PX)
      ) {
        interaction.axisLock = Math.abs(dx) >= Math.abs(dy) ? "x" : "y";
      }

      if (interaction.axisLock === "x") {
        moveRows = 0;
      } else if (interaction.axisLock === "y") {
        moveCols = 0;
      }
    }

    if (interaction.mode === "layer-reorder") {
      moveCols = 0;
      if (Math.abs(dy) < LAYER_REORDER_INTENT_THRESHOLD_PX) {
        moveRows = 0;
      }
    }

    if (interaction.mode === "frame-move") {
      if (Math.abs(dx) < FRAME_MOVE_INTENT_THRESHOLD_PX) {
        moveCols = 0;
        moveRows = 0;
      } else if (Math.abs(dy) < FRAME_VERTICAL_INTENT_THRESHOLD_PX) {
        moveRows = 0;
      }
    }

    if (interaction.mode === "tween-move") {
      moveRows = 0;
      // Clamp so no tween goes below playhead position 1
      const minPlayhead = interaction.tweens.reduce((min, tw) => {
        const pos = Number(tw.playheadPosition ?? 1);
        return Math.min(min, pos);
      }, Infinity);
      if (Number.isFinite(minPlayhead)) {
        moveCols = Math.max(moveCols, 1 - minPlayhead);
      }
    }

    if (interaction.mode === "frame-resize-right" || interaction.mode === "frame-resize-left") {
      moveRows = 0;
      const minMove = interaction.frames.reduce((min, frame) => {
        return Math.max(min, -normalizeFrameLength(frame) + 1);
      }, -Infinity);
      const maxMove = interaction.frames.reduce((max, frame) => {
        return Math.min(max, normalizeFrameLength(frame) - 1);
      }, Infinity);

      if (interaction.mode === "frame-resize-right") {
        moveCols = Math.max(moveCols, Number.isFinite(minMove) ? minMove : moveCols);
      } else {
        moveCols = Math.min(moveCols, Number.isFinite(maxMove) ? maxMove : moveCols);
      }
    }

    interaction.moveCols = moveCols;
    interaction.moveRows = moveRows;
    interaction.rawMoveRows = rawMoveRows;

    if (interaction.mode === "work-area-start" || interaction.mode === "work-area-end") {
      const location = resolveGridLocation(clientX, clientY);
      if (!location) {
        return;
      }

      setWorkArea((current) => {
        const next =
          interaction.mode === "work-area-start"
            ? {
              start: clampNumber(location.playheadPosition, 1, Math.max(1, current.end - 1)),
              end: current.end,
            }
            : {
              start: current.start,
              end: Math.max(current.start + 1, location.playheadPosition),
            };

        if (next.start !== current.start || next.end !== current.end) {
          workAreaDirtyRef.current = true;
        }

        return normalizeWorkArea(next);
      });
      return;
    }

    if (interaction.mode === "select-box") {
      const location = resolveGridLocation(clientX, clientY);
      if (location) {
        setSelectionBox((current) => {
          if (!current) {
            const next = {
              startCol: interaction.startCol,
              startRow: interaction.startRow,
              endCol: location.col,
              endRow: location.row,
            };
            selectionBoxRef.current = next;
            return next;
          }

          const next = {
            ...current,
            endCol: location.col,
            endRow: location.row,
          };
          selectionBoxRef.current = next;
          return next;
        });

        setPlayhead(location.playheadPosition);
      }
      return;
    }

    if (interaction.mode === "playhead") {
      const location = resolveGridLocation(clientX, clientY);
      if (location) {
        setPlayhead(location.playheadPosition);
      }
      return;
    }

    if (interaction.mode === "layer-reorder") {
      const previewIndex = clampNumber(
        interaction.startLayerIndex + moveRows,
        0,
        Math.max(0, layers.length - 1),
      );
      layerReorderPreviewRef.current = previewIndex;
      setLayerReorderPreview(previewIndex);
    }

    if (interaction.mode === "frame-move") {
      setDragCollisionMode(detectFrameCollisionMode(interaction.frames, moveCols, moveRows));
    } else {
      setDragCollisionMode(null);
    }

    setDragPreview({ moveCols, moveRows });
  };

  const finishInteraction = (): void => {
    try {
      const interaction = interactionRef.current;
      if (!interaction) {
        return;
      }

      if (interaction.mode === "frame-move") {
        finalizeFrameMove(interaction);
      } else if (
        interaction.mode === "frame-resize-left" ||
        interaction.mode === "frame-resize-right"
      ) {
        finalizeFrameResize(interaction);
      } else if (interaction.mode === "tween-move") {
        finalizeTweenMove(interaction);
      } else if (interaction.mode === "select-box" && selectionBoxRef.current) {
        finalizeSelectionBox(selectionBoxRef.current);
      } else if (interaction.mode === "layer-reorder") {
        finalizeLayerReorder(interaction);
      } else if (
        (interaction.mode === "work-area-start" || interaction.mode === "work-area-end") &&
        workAreaDirtyRef.current
      ) {
        persistTimelineUiState(markers, workArea, "Update Timeline Work Area");
      }
    } catch (error) {
      reportRendererError(error);
    } finally {
      resetInteraction();
    }
  };

  const pointerHandlersRef = useRef({
    handlePointerMove: (_event: PointerEvent) => { },
    handlePointerUp: (_event: PointerEvent) => { },
    handlePointerCancel: (_event: PointerEvent) => { },
  });

  pointerHandlersRef.current.handlePointerMove = (event: PointerEvent) => {
    try {
      const interaction = interactionRef.current;
      if (!interaction || interaction.pointerId !== event.pointerId) {
        return;
      }

      updateInteractionFromPointer(event.clientX, event.clientY);

      if (longPressStartRef.current) {
        const deltaX = Math.abs(event.clientX - longPressStartRef.current.x);
        const deltaY = Math.abs(event.clientY - longPressStartRef.current.y);
        if (deltaX > LONG_PRESS_CANCEL_DISTANCE_PX || deltaY > LONG_PRESS_CANCEL_DISTANCE_PX) {
          clearLongPressTimer();
          longPressStartRef.current = null;
          setPressFeedback(null);
        }
      }
    } catch (error) {
      reportRendererError(error);
    }
  };

  pointerHandlersRef.current.handlePointerUp = (event: PointerEvent) => {
    try {
      const interaction = interactionRef.current;
      if (!interaction || interaction.pointerId !== event.pointerId) {
        return;
      }

      if (longPressTriggeredRef.current) {
        longPressTriggeredRef.current = false;
        resetInteraction();
        return;
      }

      finishInteraction();
      clearLongPressTimer();
      longPressStartRef.current = null;
      setPressFeedback(null);
    } catch (error) {
      reportRendererError(error);
    }
  };

  pointerHandlersRef.current.handlePointerCancel = (event: PointerEvent) => {
    const interaction = interactionRef.current;
    if (!interaction || interaction.pointerId !== event.pointerId) {
      return;
    }

    clearLongPressTimer();
    longPressStartRef.current = null;
    setPressFeedback(null);
    resetInteraction();
  };

  useEffect(() => {
    const onMove = (e: PointerEvent) => pointerHandlersRef.current.handlePointerMove(e);
    const onUp = (e: PointerEvent) => pointerHandlersRef.current.handlePointerUp(e);
    const onCancel = (e: PointerEvent) => pointerHandlersRef.current.handlePointerCancel(e);

    window.addEventListener("pointermove", onMove, true);
    window.addEventListener("pointerup", onUp, true);
    window.addEventListener("pointercancel", onCancel, true);

    return () => {
      window.removeEventListener("pointermove", onMove, true);
      window.removeEventListener("pointerup", onUp, true);
      window.removeEventListener("pointercancel", onCancel, true);
    };
  }, []);

  useEffect(() => {
    return () => {
      clearLongPressTimer();
      if (keyPressIndicatorTimerRef.current !== null) {
        window.clearTimeout(keyPressIndicatorTimerRef.current);
        keyPressIndicatorTimerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const onWindowKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const tagName = target?.tagName?.toLowerCase();
      if (tagName === "input" || tagName === "textarea" || target?.isContentEditable) {
        return;
      }

      const timelineRoot = timelineRootRef.current;
      if (!timelineRoot) {
        return;
      }

      const activeElement = document.activeElement as HTMLElement | null;
      const eventInsideTimeline = target ? timelineRoot.contains(target) : false;
      const focusInsideTimeline = activeElement ? timelineRoot.contains(activeElement) : false;
      if (!eventInsideTimeline && !focusInsideTimeline && !interactionRef.current) {
        return;
      }

      const label = formatShortcutIndicator(event);
      showShortcutIndicator(label);
    };

    window.addEventListener("keydown", onWindowKeyDown, true);
    return () => {
      window.removeEventListener("keydown", onWindowKeyDown, true);
    };
  }, []);

  useEffect(() => {
    // Initial viewport sync
    if (workspaceRef.current) {
      setGridViewportHeight(Math.max(0, Math.floor(workspaceRef.current.clientHeight)));
      setGridViewport((current) => {
        const next = {
          width: Math.max(0, Math.floor(workspaceRef.current!.clientWidth)),
          height: Math.max(0, Math.floor(workspaceRef.current!.clientHeight)),
          scrollTop: Math.max(0, Math.floor(workspaceRef.current!.scrollTop)),
          scrollLeft: Math.max(0, Math.floor(workspaceRef.current!.scrollLeft)),
        };
        return current.width === next.width &&
          current.height === next.height &&
          current.scrollTop === next.scrollTop &&
          current.scrollLeft === next.scrollLeft
          ? current
          : next;
      });
    }
  }, []);

  useEffect(() => {
    setFrameInputValue(String(Math.max(1, Math.round(playheadPosition))));
  }, [playheadPosition, renderTick]);

  useEffect(() => {
    selectionBoxRef.current = selectionBox;
  }, [selectionBox]);

  useEffect(() => {
    layerReorderPreviewRef.current = layerReorderPreview;
  }, [layerReorderPreview]);

  useEffect(() => {
    const normalizedFps = frameRate > 0 ? frameRate : DEFAULT_FRAME_RATE;
    setFpsInputValue(normalizedFps.toFixed(1));
  }, [frameRate]);

  useEffect(() => {
    const timelineUiState = readTimelineUiState();
    setMarkers(timelineUiState.markers);
    setWorkArea(normalizeWorkArea(timelineUiState.workArea));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project]);

  useEffect(() => {
    setWorkAreaStartInput(String(workArea.start));
    setWorkAreaEndInput(String(workArea.end));
  }, [workArea.start, workArea.end]);

  useEffect(() => {
    setWorkArea((current) => {
      const next = normalizeWorkArea(current);
      if (next.end < timelineLength) {
        return {
          ...next,
          end: timelineLength,
        };
      }
      return next;
    });
  }, [timelineLength]);

  useEffect(() => {
    const canvas = unifiedGridCanvasRef.current;
    if (!canvas) {
      return;
    }

    const cssWidth = Math.max(1, unifiedGridWidth);
    const cssHeight = Math.max(1, unifiedGridHeight);
    const dpr = Math.max(1, window.devicePixelRatio || 1);

    const nextWidth = Math.round(cssWidth * dpr);
    const nextHeight = Math.round(cssHeight * dpr);

    if (canvas.width !== nextWidth || canvas.height !== nextHeight) {
      canvas.width = nextWidth;
      canvas.height = nextHeight;
    }
    canvas.style.width = `${cssWidth}px`;
    canvas.style.height = `${cssHeight}px`;
    canvas.style.left = `${LAYER_PANEL_WIDTH_PX}px`;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, cssWidth, cssHeight);

    const trackStartX = 0;
    const trackEndX = unifiedGridWidth;
    const isStrongGrid = gridContrastMode === "strong";
    const gridColor = isStrongGrid ? "rgba(255, 255, 255, 0.09)" : "rgba(255, 255, 255, 0.06)";
    const mediumGridColor = isStrongGrid ? "rgba(255, 255, 255, 0.16)" : "rgba(255, 255, 255, 0.10)";
    const majorGridColor = isStrongGrid ? "rgba(255, 255, 255, 0.24)" : "rgba(255, 255, 255, 0.16)";

    ctx.fillStyle = isStrongGrid ? "rgba(0, 0, 0, 0.06)" : "rgba(0, 0, 0, 0.04)";
    ctx.fillRect(trackStartX, 0, unifiedGridWidth, cssHeight);

    for (let decadeStart = 0; decadeStart < timelineLength; decadeStart += 10) {
      if (Math.floor(decadeStart / 10) % 2 === 1) {
        ctx.fillStyle = isStrongGrid ? "rgba(255, 255, 255, 0.03)" : "rgba(255, 255, 255, 0.015)";
        ctx.fillRect(trackStartX + decadeStart * cellWidth, 0, cellWidth * 10, cssHeight);
      }
    }

    for (let row = 0; row < totalUnifiedRows; row += 1) {
      if (row % 2 === 1) {
        ctx.fillStyle = isStrongGrid ? "rgba(255, 255, 255, 0.04)" : "rgba(255, 255, 255, 0.02)";
        ctx.fillRect(trackStartX, row * cellHeight, unifiedGridWidth, cellHeight);
      }
    }

    ctx.beginPath();
    for (let row = 0; row <= totalUnifiedRows; row += 1) {
      const y = row * cellHeight + 0.5;
      ctx.moveTo(trackStartX, y);
      ctx.lineTo(trackEndX, y);
    }
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    ctx.stroke();

    for (let col = 0; col <= timelineLength; col += 1) {
      const x = trackStartX + col * cellWidth + 0.5;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, cssHeight);
      ctx.strokeStyle = col % 10 === 0
        ? majorGridColor
        : col % 5 === 0
          ? mediumGridColor
          : gridColor;
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }, [
    cellHeight,
    cellWidth,
    timelineLength,
    totalUnifiedRows,
    gridContrastMode,
    unifiedGridHeight,
    unifiedGridWidth,
    viewportHeight,
  ]);

  useEffect(() => {
    const canvas = unifiedNumberLineCanvasRef.current;
    if (!canvas) return;

    const cssWidth = Math.max(1, timelineLength * cellWidth);
    const cssHeight = 34; // Set natively in SCSS
    const dpr = Math.max(1, window.devicePixelRatio || 1);

    const nextWidth = Math.round(cssWidth * dpr);
    const nextHeight = Math.round(cssHeight * dpr);

    if (canvas.width !== nextWidth || canvas.height !== nextHeight) {
      canvas.width = nextWidth;
      canvas.height = nextHeight;
    }

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = gridContrastMode === "strong" ? "#1A1A1A" : "#242424"; // editor-primary color
    ctx.fillRect(0, 0, cssWidth, cssHeight);

    ctx.fillStyle = "#A3A3A3"; // editor-secondary-text
    ctx.font = '700 11px "Nunito Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
    ctx.lineWidth = 1;

    ctx.beginPath();
    for (let i = 0; i < timelineLength; i++) {
      const frameNumber = i + 1;
      const x = i * cellWidth;
      const isMajorTick = i === 0 || i % 10 === 9;
      const highlight = i === 0 || i % 5 === 4;

      if (isMajorTick) {
        ctx.fillStyle = "rgba(255, 255, 255, 0.22)";
        ctx.fillRect(x + cellWidth - 1, 0, 1, cssHeight);
      } else {
        ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
        ctx.fillRect(x + cellWidth - 1, 0, 1, cssHeight);
      }

      if (frameSizeMode !== "small" || highlight) {
        ctx.fillStyle = highlight ? "#E0E0E0" : "#A3A3A3";
        ctx.fillText(String(frameNumber), x + cellWidth / 2, cssHeight / 2);
      }
    }

  }, [
    cellWidth,
    timelineLength,
    frameSizeMode,
    gridContrastMode
  ]);

  useEffect(() => {
    requestRender();
  }, [props.timelineSoftRenderTick]);

  useEffect(() => {
    if (props.timelinePlaybackFollowMode !== "follow-playhead") {
      return;
    }

    try {
      maybeAutoScrollPlayhead();
    } catch (error) {
      reportRendererError(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.timelinePlaybackFollowMode, playheadPosition, props.timelineSoftRenderTick]);

  useEffect(() => {
    if (!project?.playing || !loopWorkArea) {
      return;
    }

    if (playheadPosition > workArea.end || playheadPosition < workArea.start) {
      setPlayhead(workArea.start, { respectSnap: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loopWorkArea, project?.playing, playheadPosition, workArea.start, workArea.end]);

  useEffect(() => {
    const handleSoundHover = (event: Event) => {
      const customEvent = event as CustomEvent<SoundHoverDetail>;
      if (!customEvent.detail) {
        return;
      }

      const location = resolveGridLocation(customEvent.detail.x, customEvent.detail.y);
      if (!location) {
        setSoundHoverCell(null);
        return;
      }

      setSoundHoverCell({
        layerIndex: location.layerIndex,
        playheadPosition: location.playheadPosition,
      });
    };

    const clearSoundHover = () => {
      setSoundHoverCell(null);
    };

    window.addEventListener("wick:timeline-sound-hover", handleSoundHover as EventListener);
    window.addEventListener("wick:timeline-sound-clear", clearSoundHover);

    return () => {
      window.removeEventListener(
        "wick:timeline-sound-hover",
        handleSoundHover as EventListener,
      );
      window.removeEventListener("wick:timeline-sound-clear", clearSoundHover);
    };
  }, [layers, cellWidth, cellHeight]);

  const commitFrameInput = (): void => {
    const parsedFrame = Number.parseInt(frameInputValue, 10);
    if (!Number.isFinite(parsedFrame) || parsedFrame < 1) {
      setFrameInputValue(String(Math.max(1, Math.round(playheadPosition))));
      return;
    }

    const normalizedFrame = Math.max(1, Math.round(parsedFrame));
    setFrameInputValue(String(normalizedFrame));
    setPlayhead(normalizedFrame, { respectSnap: false });
  };

  const commitFpsInput = (): void => {
    const parsedFps = Number.parseFloat(fpsInputValue);
    if (!Number.isFinite(parsedFps)) {
      const fallbackFps = frameRate > 0 ? frameRate : DEFAULT_FRAME_RATE;
      setFpsInputValue(fallbackFps.toFixed(1));
      return;
    }

    const normalizedFps = Math.min(
      MAX_FRAME_RATE,
      Math.max(MIN_FRAME_RATE, Math.round(parsedFps * 10) / 10),
    );

    setFpsInputValue(normalizedFps.toFixed(1));
    if (!project || Number(project.framerate ?? 0) === normalizedFps) {
      return;
    }

    project.framerate = normalizedFps;
    commitProjectChange("Set Project Framerate");
  };

  const nudgeFps = (delta: number): void => {
    const parsedInputFps = Number.parseFloat(fpsInputValue);
    const baseFps =
      Number.isFinite(parsedInputFps) && parsedInputFps > 0
        ? parsedInputFps
        : Number.isFinite(frameRate) && frameRate > 0
          ? frameRate
          : DEFAULT_FRAME_RATE;

    const nextFps = baseFps + delta;
    const normalizedFps = Math.min(
      MAX_FRAME_RATE,
      Math.max(MIN_FRAME_RATE, Math.round(nextFps * 10) / 10),
    );

    setFpsInputValue(normalizedFps.toFixed(1));
    if (!project || Number(project.framerate ?? 0) === normalizedFps) {
      return;
    }

    project.framerate = normalizedFps;
    commitProjectChange("Set Project Framerate");
  };

  const setGapFillMode = (mode: TimelineFillGapsMode): void => {
    if (!activeTimeline || activeTimeline.fillGapsMethod === mode) {
      return;
    }

    activeTimeline.fillGapsMethod = mode;
    commitProjectChange(
      mode === "auto_extend"
        ? "Set Timeline Gap Fill Mode (Extend Frames)"
        : "Set Timeline Gap Fill Mode (Blank Frames)",
    );
  };

  const setInsertMode = (mode: TimelineInsertMode): void => {
    setGapFillMode(mode === "ripple" ? "auto_extend" : "blank_frames");
  };

  const insertBlankKeyframeAt = (
    layer: TimelineLayerLike,
    targetPlayheadPosition: number,
  ): void => {
    layer.activate?.();
    setPlayhead(targetPlayheadPosition, { respectSnap: false });
    const newFrame = layer.insertBlankFrame?.(targetPlayheadPosition);
    if (!newFrame) {
      return;
    }
    project?.selection?.clear?.();
    project?.selection?.select?.(newFrame);
    commitProjectChange("Insert Blank Frame");
    requestRender();
  };

  const duplicateLeftKeyframeAt = (
    layer: TimelineLayerLike,
    targetPlayheadPosition: number,
  ): boolean => {
    const duplicatedFrame = duplicateClosestLeftFrameAt(layer, targetPlayheadPosition);
    if (!duplicatedFrame) {
      return false;
    }
    project?.selection?.clear?.();
    project?.selection?.select?.(duplicatedFrame);
    commitProjectChange("Insert Keyframe");
    requestRender();
    return true;
  };

  const insertKeyframeAt = (
    layer: TimelineLayerLike,
    targetPlayheadPosition: number,
    options: { fallbackToBlank?: boolean } = {},
  ): void => {
    layer.activate?.();
    setPlayhead(targetPlayheadPosition, { respectSnap: false });

    const frameAtTarget = getFrameAtPlayhead(layer, targetPlayheadPosition);
    if (frameAtTarget) {
      project?.selection?.clear?.();
      project?.selection?.select?.(frameAtTarget);
      frameAtTarget.parentLayer?.activate?.();
      props.cutFrame();
      requestRender();
      return;
    }

    if (duplicateLeftKeyframeAt(layer, targetPlayheadPosition)) {
      return;
    }

    if (options.fallbackToBlank) {
      insertBlankKeyframeAt(layer, targetPlayheadPosition);
    }
  };

  const focusTweenStripLocation = (
    layer: TimelineLayerLike,
    targetPlayheadPosition: number,
  ): void => {
    layer.activate?.();
    setPlayhead(targetPlayheadPosition, { respectSnap: false });
  };

  const selectClosestLeftFrameForTweenStrip = (
    layer: TimelineLayerLike,
    targetPlayheadPosition: number,
  ): TimelineFrameLike | null => {
    focusTweenStripLocation(layer, targetPlayheadPosition);
    const sourceFrame = getClosestLeftFrame(layer, targetPlayheadPosition);
    if (!sourceFrame) {
      return null;
    }

    project?.selection?.clear?.();
    project?.selection?.select?.(sourceFrame);
    sourceFrame.parentLayer?.activate?.();
    requestRender();
    return sourceFrame;
  };

  const handleInsertMenuActivation = (
    location: { layerIndex: number; playheadPosition: number },
    clientX: number,
    clientY: number,
  ): void => {
    if (!activeTimeline || layers.length === 0) {
      return;
    }

    const fallbackLayerIndex = clampNumber(
      Number(activeTimeline.activeLayerIndex ?? 0),
      0,
      Math.max(0, layers.length - 1),
    );
    const targetLayerIndex = clampNumber(
      location.layerIndex,
      0,
      Math.max(0, layers.length - 1),
    );
    const layer = layers[targetLayerIndex] ?? layers[fallbackLayerIndex];
    if (!layer) {
      return;
    }

    const resolvedLayerIndex = Math.max(
      0,
      layers.indexOf(layer),
    );
    activeTimeline.activeLayerIndex = resolvedLayerIndex;

    const frame = getFrameAtPlayhead(layer, location.playheadPosition);
    if (frame) {
      insertKeyframeAt(layer, location.playheadPosition);
      return;
    }

    layer.activate?.();
    setPlayhead(location.playheadPosition, { respectSnap: false });

    setInsertMenuTargetCell({
      layerIndex: resolvedLayerIndex,
      playheadPosition: location.playheadPosition,
    });
    const closestLeftFrame = getClosestLeftFrame(layer, location.playheadPosition);
    const menuMode = resolveDoubleClickMenuMode(closestLeftFrame);

    if (shouldAutoRunDoubleClickInsert(menuMode)) {
      closeContextMenu();
      insertBlankKeyframeAt(layer, location.playheadPosition);
      return;
    }

    setDoubleClickMenuContext({
      layer,
      playheadPosition: location.playheadPosition,
      label: `Keyframe at ${location.playheadPosition}`,
      mode: menuMode,
    });
    setContextMenuPosition(clampContextMenuPosition(clientX, clientY));
  };

  const handleAddMarker = (): void => {
    const markerColor =
      DEFAULT_MARKER_COLORS[markers.length % DEFAULT_MARKER_COLORS.length] ??
      "#66B6FF";
    const nextMarker: TimelineMarker = {
      id: `marker-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      frame: Math.max(1, Math.round(playheadPosition)),
      label: `M${markers.length + 1}`,
      color: markerColor,
    };

    const nextMarkers = normalizeMarkerList(markers.concat(nextMarker));
    setMarkers(nextMarkers);
    persistTimelineUiState(nextMarkers, workArea, "Add Timeline Marker");
  };

  const handleDeleteMarker = (markerId: string): void => {
    const nextMarkers = markers.filter((marker) => marker.id !== markerId);
    setMarkers(nextMarkers);
    persistTimelineUiState(nextMarkers, workArea, "Delete Timeline Marker");
  };

  const handleEditMarker = (markerId: string): void => {
    const marker = markers.find((entry) => entry.id === markerId);
    if (!marker) {
      return;
    }

    const nextLabel = window.prompt("Marker label", marker.label);
    if (nextLabel === null) {
      return;
    }

    const normalizedLabel = nextLabel.trim();
    if (normalizedLabel.length === 0) {
      return;
    }

    const nextMarkers = markers.map((entry) =>
      entry.id === markerId
        ? {
          ...entry,
          label: normalizedLabel,
        }
        : entry,
    );

    setMarkers(nextMarkers);
    persistTimelineUiState(nextMarkers, workArea, "Rename Timeline Marker");
  };

  const moveMarkerToFrame = (markerId: string, frame: number, commit: boolean): void => {
    const nextMarkers = markers.map((marker) =>
      marker.id === markerId
        ? {
          ...marker,
          frame: Math.max(1, Math.round(frame)),
        }
        : marker,
    );

    setMarkers(normalizeMarkerList(nextMarkers));
    if (commit) {
      persistTimelineUiState(nextMarkers, workArea, "Move Timeline Marker");
    }
  };

  const jumpToMarker = (direction: "next" | "previous"): void => {
    if (markers.length === 0) {
      return;
    }

    const sortedMarkers = normalizeMarkerList(markers);
    if (sortedMarkers.length === 0) {
      return;
    }
    const fallback = direction === "next" ? sortedMarkers[0] : sortedMarkers[sortedMarkers.length - 1];
    const marker =
      direction === "next"
        ? sortedMarkers.find((entry) => entry.frame > playheadPosition) ?? fallback
        : [...sortedMarkers].reverse().find((entry) => entry.frame < playheadPosition) ?? fallback;

    if (marker) {
      setPlayhead(marker.frame, { respectSnap: false });
    }
  };

  const handleMarkerNavigationHotkeys = (event: ReactKeyboardEvent<HTMLElement>): void => {
    const target = event.target as HTMLElement | null;
    const tagName = target?.tagName?.toLowerCase();
    if (tagName === "input" || tagName === "textarea" || target?.isContentEditable) {
      return;
    }

    if (event.key === "]" || (event.altKey && event.key === "ArrowRight")) {
      event.preventDefault();
      jumpToMarker("next");
      return;
    }

    if (event.key === "[" || (event.altKey && event.key === "ArrowLeft")) {
      event.preventDefault();
      jumpToMarker("previous");
    }
  };

  const commitFrameJump = (): void => {
    const parsed = Number.parseInt(jumpFrameValue, 10);
    if (!Number.isFinite(parsed)) {
      return;
    }

    setPlayhead(parsed, { respectSnap: false });
  };

  const commitLayerJump = (): void => {
    const needle = jumpLayerValue.trim().toLowerCase();
    if (needle.length === 0 || !activeTimeline) {
      return;
    }

    const nextLayerIndex = layers.findIndex((layer) => {
      return String(layer.name ?? "").toLowerCase().includes(needle);
    });
    if (nextLayerIndex < 0) {
      return;
    }

    activeTimeline.activeLayerIndex = nextLayerIndex;
    layers[nextLayerIndex]?.activate?.();
    softRender();
  };

  const commitWorkAreaRange = (): void => {
    const parsedStart = Number.parseInt(workAreaStartInput, 10);
    const parsedEnd = Number.parseInt(workAreaEndInput, 10);
    if (!Number.isFinite(parsedStart) || !Number.isFinite(parsedEnd)) {
      return;
    }

    const clampedStart = Math.max(1, Math.round(parsedStart));
    const clampedEnd = Math.max(1, Math.round(parsedEnd));
    const nextWorkArea = normalizeWorkArea({
      start: Math.min(clampedStart, clampedEnd),
      end: Math.max(clampedStart, clampedEnd),
    });

    setWorkArea(nextWorkArea);
    persistTimelineUiState(markers, nextWorkArea, "Set Timeline Work Area");
    setWorkAreaStartInput(String(nextWorkArea.start));
    setWorkAreaEndInput(String(nextWorkArea.end));
  };

  const applyContextTarget = (
    target: TimelineContextTarget | null,
    options: {
      selectFrame?: boolean;
      clearSelectionWithoutFrame?: boolean;
    } = {},
  ): void => {
    if (!target || !activeTimeline) {
      return;
    }

    let didSoftUpdate = false;

    if (
      typeof target.playheadPosition === "number" &&
      activeTimeline.playheadPosition !== target.playheadPosition
    ) {
      activeTimeline.playheadPosition = target.playheadPosition;
      didSoftUpdate = true;
    }

    if (typeof target.layerIndex === "number" && activeTimeline.activeLayerIndex !== target.layerIndex) {
      activeTimeline.activeLayerIndex = target.layerIndex;
      didSoftUpdate = true;
    }

    const layer =
      typeof activeTimeline.activeLayerIndex === "number"
        ? layers[activeTimeline.activeLayerIndex]
        : null;
    const frameAtTarget =
      layer && typeof target.playheadPosition === "number"
        ? getFrameAtPlayhead(layer, target.playheadPosition)
        : null;

    if (options.selectFrame) {
      const selection = project?.selection;
      if (frameAtTarget && selection) {
        const selectedFrames = (selection.getSelectedObjects?.("Frame") ?? []) as TimelineFrameLike[];
        const alreadyOnlyFrame = selectedFrames.length === 1 && selectedFrames[0] === frameAtTarget;
        if (!alreadyOnlyFrame) {
          selection.clear();
          selection.select(frameAtTarget);
          frameAtTarget.parentLayer?.activate?.();
          didSoftUpdate = true;
        }
      } else if (options.clearSelectionWithoutFrame && project?.selection) {
        const selectedTimelineObjects = project.selection.getSelectedObjects?.("Timeline");
        if (Array.isArray(selectedTimelineObjects) && selectedTimelineObjects.length > 0) {
          project.selection.clear();
          didSoftUpdate = true;
        }
      }
    }

    if (didSoftUpdate) {
      softRender();
    }
  };

  const runContextualFrameAction = (
    action: () => void,
    options: {
      selectFrame?: boolean;
      clearSelectionWithoutFrame?: boolean;
    } = {},
  ): void => {
    applyContextTarget(contextMenuTarget, options);
    action();
  };

  const openContextMenu = (clientX: number, clientY: number): void => {
    setContextMenuTarget(resolveContextTarget(clientX, clientY));
    setContextMenuPosition(clampContextMenuPosition(clientX, clientY));
  };

  const runMenuAction = (action: () => void): void => {
    try {
      action();
      closeContextMenu();
    } catch (error) {
      reportRendererError(error);
    }
  };

  const hasTargetFrame = Boolean(contextMenuTarget?.frame);
  const canCreateTweenAtTarget = Boolean(contextMenuTarget?.frame?.contentful);
  const canMovePlayheadToTarget = typeof contextMenuTarget?.playheadPosition === "number";

  const timelineContextMenuItems: TimelineContextMenuItem[] = [
    {
      id: "set-playhead-here",
      label: "Set Playhead Here",
      icon: "timeline",
      action: () => applyContextTarget(contextMenuTarget),
      disabled: !canMovePlayheadToTarget,
    },
    {
      id: "previous-frame",
      label: "Previous Frame",
      glyph: "<",
      action: props.movePlayheadBackwards,
    },
    {
      id: "next-frame",
      label: "Next Frame",
      glyph: ">",
      action: props.movePlayheadForwards,
    },
    {
      id: "insert-keyframe",
      label: "Insert Keyframe",
      icon: "split",
      action: () =>
        runContextualFrameAction(props.cutFrame, {
          selectFrame: true,
          clearSelectionWithoutFrame: true,
        }),
      disabled: !hasTargetFrame,
    },
    {
      id: "insert-blank-keyframe",
      label: "Insert Blank Keyframe",
      icon: "create",
      action: () => runContextualFrameAction(props.insertBlankFrame),
    },
    {
      id: "add-tween-keyframe",
      label: "Add Tween Keyframe",
      icon: "layerTween",
      action: () => runContextualFrameAction(props.addTweenKeyframe),
      disabled: !hasTargetFrame,
    },
    {
      id: "create-tween",
      label: "Create Tween",
      icon: "tween",
      action: () =>
        runContextualFrameAction(props.createTween, {
          selectFrame: true,
          clearSelectionWithoutFrame: true,
        }),
      disabled: !canCreateTweenAtTarget,
    },
    {
      id: "delete-selection",
      label: "Delete Selected",
      icon: "delete",
      action: () =>
        runContextualFrameAction(props.deleteSelectedObjects, {
          selectFrame: true,
          clearSelectionWithoutFrame: true,
        }),
      disabled: !hasTargetFrame,
    },
  ];

  if (isNestedTimeline) {
    timelineContextMenuItems.unshift({
      id: "focus-parent",
      label: "Back to Parent Timeline",
      icon: "leaveUp",
      action: props.focusTimelineOfParentClip,
    });
  }

  const startInteraction = (nextInteraction: InteractionState): void => {
    interactionRef.current = nextInteraction;
  };

  const handleNumberLinePointerDown = (
    event: React.PointerEvent<HTMLDivElement>,
  ): void => {
    try {
      event.stopPropagation();
      if (!activeTimeline || event.button !== 0) {
        return;
      }

      const location = resolveGridLocation(event.clientX, event.clientY);
      if (!location) {
        return;
      }

      safeSetPointerCapture(event.currentTarget, event.pointerId);
      setPlayhead(location.playheadPosition);

      startInteraction({
        mode: "playhead",
        pointerId: event.pointerId,
        pointerType: event.pointerType,
        startClientX: event.clientX,
        startClientY: event.clientY,
        startCol: location.col,
        startRow: location.row,
        startLayerIndex: location.layerIndex,
        startPlayhead: playheadPosition,
        axisLock: null,
        moveCols: 0,
        moveRows: 0,
        rawMoveRows: 0,
        frames: [],
        tweens: [],
        layer: null,
        workArea: null,
      });
    } catch (error) {
      reportRendererError(error);
    }
  };

  const handleGridContextMenu = (
    event: React.MouseEvent<HTMLDivElement>,
  ): void => {
    event.preventDefault();
    openContextMenu(event.clientX, event.clientY);
  };

  const handleGridDoubleClick = (
    event: React.MouseEvent<HTMLDivElement>,
  ): void => {
    try {
      if (!activeTimeline || event.button !== 0) {
        return;
      }

      const eventTarget = event.target as HTMLElement | null;
      if (
        eventTarget?.closest(".timeline-unified-layer-controls") ||
        eventTarget?.closest(".timeline-unified-header")
      ) {
        return;
      }

      const location = resolveGridLocation(event.clientX, event.clientY);
      if (!location) {
        return;
      }

      handleInsertMenuActivation(location, event.clientX, event.clientY);
    } catch (error) {
      reportRendererError(error);
    }
  };

  const handleGridPointerDown = (
    event: React.PointerEvent<HTMLDivElement>,
  ): void => {
    try {
      if (!activeTimeline || event.button !== 0) {
        return;
      }

      const eventTarget = event.target as HTMLElement | null;
      if (
        eventTarget?.closest(".timeline-unified-layer-controls") ||
        eventTarget?.closest(".timeline-unified-header")
      ) {
        return;
      }

      const location = resolveGridLocation(event.clientX, event.clientY);
      if (!location) {
        return;
      }

      if (event.pointerType === "touch") {
        const now = Date.now();
        const lastTap = lastTouchTapRef.current;
        const isDoubleTap = Boolean(
          lastTap &&
          now - lastTap.time <= DOUBLE_TAP_MAX_DELAY_MS &&
          Math.abs(lastTap.x - event.clientX) <= DOUBLE_TAP_MAX_DISTANCE_PX &&
          Math.abs(lastTap.y - event.clientY) <= DOUBLE_TAP_MAX_DISTANCE_PX &&
          lastTap.layerIndex === location.layerIndex &&
          Math.abs(lastTap.playheadPosition - location.playheadPosition) <= 1,
        );

        lastTouchTapRef.current = {
          time: now,
          x: event.clientX,
          y: event.clientY,
          layerIndex: location.layerIndex,
          playheadPosition: location.playheadPosition,
        };

        if (isDoubleTap) {
          clearLongPressTimer();
          longPressTriggeredRef.current = false;
          longPressStartRef.current = null;
          setPressFeedback(null);
          handleInsertMenuActivation(location, event.clientX, event.clientY);
          return;
        }

        clearLongPressTimer();
        longPressTriggeredRef.current = false;
        longPressStartRef.current = { x: event.clientX, y: event.clientY };
        setPressFeedback({ x: event.clientX, y: event.clientY });

        longPressTimerRef.current = window.setTimeout(() => {
          longPressTimerRef.current = null;
          longPressTriggeredRef.current = true;
          setPressFeedback(null);
          openContextMenu(event.clientX, event.clientY);
        }, LONG_PRESS_MS);
      }
      safeSetPointerCapture(event.currentTarget, event.pointerId);

      const fallbackLayerIndex = clampNumber(
        Number(activeTimeline.activeLayerIndex ?? 0),
        0,
        Math.max(0, layers.length - 1),
      );
      const layer = layers[location.layerIndex] ?? layers[fallbackLayerIndex];
      if (!layer) {
        return;
      }
      const resolvedLayerIndex = Math.max(0, layers.indexOf(layer));
      const frame = getFrameAtPlayhead(layer, location.playheadPosition);

      if (!frame) {
        const nextSelectionBox = {
          startCol: location.col,
          startRow: location.row,
          endCol: location.col,
          endRow: location.row,
        };
        selectionBoxRef.current = nextSelectionBox;
        setSelectionBox(nextSelectionBox);

        startInteraction({
          mode: "select-box",
          pointerId: event.pointerId,
          pointerType: event.pointerType,
          startClientX: event.clientX,
          startClientY: event.clientY,
          startCol: location.col,
          startRow: location.row,
          startLayerIndex: resolvedLayerIndex,
          startPlayhead: playheadPosition,
          axisLock: null,
          moveCols: 0,
          moveRows: 0,
          rawMoveRows: 0,
          frames: [],
          tweens: [],
          layer: null,
          workArea: null,
        });
        return;
      }

      const frameStart = Number(frame.start ?? 1);
      const frameEnd = Number(frame.end ?? frameStart);
      const frameLeftPx = (frameStart - 1) * cellWidth;
      const frameRightPx = frameEnd * cellWidth;
      const gridElem = workspaceRef.current;
      const gridRect = gridElem?.getBoundingClientRect();
      const pointerLocalX =
        gridElem && gridRect
          ? event.clientX - gridRect.left + gridElem.scrollLeft - LAYER_PANEL_WIDTH_PX
          : location.col * cellWidth + cellWidth / 2;
      const pointerXInFrame = pointerLocalX - frameLeftPx;

      const handleWidth = event.pointerType === "touch"
        ? Math.max(22, Math.floor(cellWidth * 0.5))
        : Math.max(14, Math.floor(cellWidth * 0.36));
      const nearLeft = pointerXInFrame <= handleWidth;
      const nearRight = frameRightPx - pointerLocalX <= handleWidth;

      if (event.shiftKey) {
        selectFrameRangeFromAnchor(frame, resolvedLayerIndex);
        return;
      }

      const isToggleSelection = event.metaKey || event.ctrlKey;
      if (isToggleSelection) {
        selectFrame(frame, {
          append: true,
          toggle: true,
          setAnchor: true,
          playheadPosition: location.playheadPosition,
        });
        return;
      }

      const selectedFrames = getSelectedFrames();
      const frameSelection =
        selectedFrames.length > 0 && isFrameSelected(frame) ? selectedFrames : [frame];

      if (!isFrameSelected(frame)) {
        selectFrame(frame, {
          playheadPosition: location.playheadPosition,
        });
      } else {
        selectionAnchorRef.current = {
          layerIndex: resolvedLayerIndex,
          playheadPosition: location.playheadPosition,
        };
        setPlayhead(location.playheadPosition);
      }

      const mode: InteractionMode = nearLeft
        ? "frame-resize-left"
        : nearRight
          ? "frame-resize-right"
          : "frame-move";

      const resizeFrames =
        mode === "frame-resize-left"
          ? ((project?.selection?.getLeftmostFrames?.() ?? frameSelection) as TimelineFrameLike[])
          : mode === "frame-resize-right"
            ? ((project?.selection?.getRightmostFrames?.() ?? frameSelection) as TimelineFrameLike[])
            : frameSelection;

      startInteraction({
        mode,
        pointerId: event.pointerId,
        pointerType: event.pointerType,
        startClientX: event.clientX,
        startClientY: event.clientY,
        startCol: location.col,
        startRow: location.row,
        startLayerIndex: resolvedLayerIndex,
        startPlayhead: playheadPosition,
        axisLock: null,
        moveCols: 0,
        moveRows: 0,
        rawMoveRows: 0,
        frames: resizeFrames,
        tweens: [],
        layer: null,
        workArea: null,
      });
    } catch (error) {
      reportRendererError(error);
    }
  };

  const handleTweenPointerDown = (
    event: React.PointerEvent<HTMLButtonElement>,
    tween: TimelineTweenLike,
  ): void => {
    try {
      event.stopPropagation();
      if (event.button !== 0) {
        return;
      }
      safeSetPointerCapture(event.currentTarget, event.pointerId);

      const selectedTweens = getSelectedTweens();
      const parentFrame = tween.parentFrame as TimelineFrameLike | undefined;
      const isToggleSelection = event.metaKey || event.ctrlKey;
      if (isToggleSelection) {
        if (selectedTweens.includes(tween)) {
          project?.selection?.deselect?.(tween);
          if (parentFrame) {
            project?.selection?.deselect?.(parentFrame);
          }
        } else {
          if (parentFrame) {
            project?.selection?.select(parentFrame);
          }
          project?.selection?.select(tween);
        }
        tween.parentLayer?.activate?.();
        setPlayhead(Number(tween.playheadPosition ?? parentFrame?.start ?? playheadPosition), {
          respectSnap: false,
        });
        requestRender();
        return;
      }

      if (!event.shiftKey) {
        project?.selection?.clear();
      }

      if (parentFrame) {
        project?.selection?.select(parentFrame);
      }
      if (!selectedTweens.includes(tween)) {
        project?.selection?.select(tween);
      }
      tween.parentLayer?.activate?.();
      setPlayhead(Number(tween.playheadPosition ?? parentFrame?.start ?? playheadPosition), {
        respectSnap: false,
      });
      requestRender();

      const activeTweens = getSelectedTweens();
      if (activeTweens.length === 0) {
        return;
      }

      startInteraction({
        mode: "tween-move",
        pointerId: event.pointerId,
        pointerType: event.pointerType,
        startClientX: event.clientX,
        startClientY: event.clientY,
        startCol: 0,
        startRow: 0,
        startLayerIndex: getLayerIndex(layers, tween.parentLayer as TimelineLayerLike),
        startPlayhead: playheadPosition,
        axisLock: null,
        moveCols: 0,
        moveRows: 0,
        rawMoveRows: 0,
        frames: [],
        tweens: activeTweens,
        layer: null,
        workArea: null,
      });
    } catch (error) {
      reportRendererError(error);
    }
  };

  const handleLayerPointerDown = (
    event: React.PointerEvent<HTMLElement>,
    layer: TimelineLayerLike,
    layerIndex: number,
  ): void => {
    try {
      if (event.button !== 0) {
        return;
      }
      safeSetPointerCapture(event.currentTarget, event.pointerId);

      project?.selection?.clear();
      project?.selection?.select(layer);
      layer.activate?.();
      requestRender();

      startInteraction({
        mode: "layer-reorder",
        pointerId: event.pointerId,
        pointerType: event.pointerType,
        startClientX: event.clientX,
        startClientY: event.clientY,
        startCol: 0,
        startRow: layerIndex,
        startLayerIndex: layerIndex,
        startPlayhead: playheadPosition,
        axisLock: "y",
        moveCols: 0,
        moveRows: 0,
        rawMoveRows: 0,
        frames: [],
        tweens: [],
        layer,
        workArea: null,
      });
    } catch (error) {
      reportRendererError(error);
    }
  };

  const commitLayerRename = (): void => {
    try {
      if (!layerRename) {
        return;
      }

      const nextName = layerRename.value.trim();
      if (nextName.length === 0) {
        setLayerRename(null);
        return;
      }

      layerRename.layer.name = nextName;
      setLayerRename(null);
      commitProjectChange("Rename Layer");
    } catch (error) {
      reportRendererError(error);
    }
  };

  const handleLayerDelete = (layer: TimelineLayerLike): void => {
    try {
      layer.remove?.();
      commitProjectChange("Delete Layer");
    } catch (error) {
      reportRendererError(error);
    }
  };

  const handleAddLayer = (): void => {
    try {
      const newLayer = createTimelineLayer();
      if (!newLayer) {
        return;
      }
      activeTimeline?.addLayer?.(newLayer as TimelineLayerLike);
      newLayer.activate?.();
      project?.selection?.clear();
      project?.selection?.select(newLayer as TimelineLayerLike);
      commitProjectChange("Add Layer");
    } catch (error) {
      reportRendererError(error);
    }
  };

  const handleModeSwitch = (mode: "dom" | "classic"): void => {
    props.onTimelineRendererModeChange(mode);
  };

  const handleShortcutPresetSwitch = (preset: "wick" | "flash"): void => {
    props.onTimelineShortcutPresetChange(preset);
  };

  const handlePlaybackFollowModeSwitch = (mode: "off" | "follow-playhead"): void => {
    props.onTimelinePlaybackFollowModeChange(mode);
  };

  const handleSnapModeSwitch = (mode: TimelineSnapMode): void => {
    props.onTimelineSnapModeChange(mode);
  };

  const handleDensityModeSwitch = (mode: TimelineDensityMode): void => {
    props.onTimelineDensityModeChange(mode);
  };

  const handleWorkAreaHandlePointerDown = (
    event: React.PointerEvent<HTMLButtonElement>,
    mode: "work-area-start" | "work-area-end",
  ): void => {
    try {
      event.stopPropagation();
      if (event.button !== 0) {
        return;
      }
      safeSetPointerCapture(event.currentTarget, event.pointerId);
      startInteraction({
        mode,
        pointerId: event.pointerId,
        pointerType: event.pointerType,
        startClientX: event.clientX,
        startClientY: event.clientY,
        startCol: 0,
        startRow: 0,
        startLayerIndex: 0,
        startPlayhead: mode === "work-area-start" ? workArea.start : workArea.end,
        axisLock: "x",
        moveCols: 0,
        moveRows: 0,
        rawMoveRows: 0,
        frames: [],
        tweens: [],
        layer: null,
        workArea,
      });
    } catch (error) {
      reportRendererError(error);
    }
  };

  const handleMarkerPointerDown = (
    event: React.PointerEvent<HTMLButtonElement>,
    marker: TimelineMarker,
  ): void => {
    try {
      event.stopPropagation();
      if (event.button !== 0) {
        return;
      }

      const isToggleRemoval = event.metaKey || event.ctrlKey;
      if (isToggleRemoval) {
        event.preventDefault();
        handleDeleteMarker(marker.id);
        return;
      }

      safeSetPointerCapture(event.currentTarget, event.pointerId);
      setPlayhead(marker.frame, { respectSnap: false });

      if (event.detail >= 2) {
        handleEditMarker(marker.id);
        return;
      }

      startInteraction({
        mode: "playhead",
        pointerId: event.pointerId,
        pointerType: event.pointerType,
        startClientX: event.clientX,
        startClientY: event.clientY,
        startCol: marker.frame - 1,
        startRow: 0,
        startLayerIndex: 0,
        startPlayhead: marker.frame,
        axisLock: "x",
        moveCols: 0,
        moveRows: 0,
        rawMoveRows: 0,
        frames: [],
        tweens: [],
        layer: null,
        workArea: null,
      });

      if (event.pointerType === "touch") {
        clearLongPressTimer();
        longPressTriggeredRef.current = false;
        longPressStartRef.current = { x: event.clientX, y: event.clientY };
        setPressFeedback({ x: event.clientX, y: event.clientY });
        longPressTimerRef.current = window.setTimeout(() => {
          longPressTimerRef.current = null;
          longPressTriggeredRef.current = true;
          setPressFeedback(null);
          handleEditMarker(marker.id);
        }, LONG_PRESS_MS);
      }

      const startFrame = marker.frame;
      const markerId = marker.id;
      const moveMarker = (pointerEvent: PointerEvent) => {
        const location = resolveGridLocation(pointerEvent.clientX, pointerEvent.clientY);
        if (!location) {
          return;
        }
        moveMarkerToFrame(markerId, location.playheadPosition, false);
      };

      const commitMarker = (pointerEvent: PointerEvent) => {
        window.removeEventListener("pointermove", moveMarker, true);
        window.removeEventListener("pointerup", commitMarker, true);
        window.removeEventListener("pointercancel", cancelMarker, true);
        clearLongPressTimer();
        const location = resolveGridLocation(pointerEvent.clientX, pointerEvent.clientY);
        if (!location) {
          moveMarkerToFrame(markerId, startFrame, false);
          return;
        }
        moveMarkerToFrame(markerId, location.playheadPosition, true);
      };

      const cancelMarker = () => {
        window.removeEventListener("pointermove", moveMarker, true);
        window.removeEventListener("pointerup", commitMarker, true);
        window.removeEventListener("pointercancel", cancelMarker, true);
        clearLongPressTimer();
      };

      window.addEventListener("pointermove", moveMarker, true);
      window.addEventListener("pointerup", commitMarker, true);
      window.addEventListener("pointercancel", cancelMarker, true);
    } catch (error) {
      reportRendererError(error);
    }
  };

  useEffect(() => {
    if (!contextMenuPosition) {
      return;
    }

    const closeOnOutsideInteraction = (event: MouseEvent | TouchEvent) => {
      const menuElem = contextMenuRef.current;
      if (!menuElem) {
        closeContextMenu();
        return;
      }

      const target = event.target as Node | null;
      if (target && menuElem.contains(target)) {
        return;
      }

      closeContextMenu();
    };

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeContextMenu();
      }
    };

    window.addEventListener("mousedown", closeOnOutsideInteraction, true);
    window.addEventListener("touchstart", closeOnOutsideInteraction, true);
    window.addEventListener("keydown", closeOnEscape, true);

    return () => {
      window.removeEventListener("mousedown", closeOnOutsideInteraction, true);
      window.removeEventListener("touchstart", closeOnOutsideInteraction, true);
      window.removeEventListener("keydown", closeOnEscape, true);
    };
  }, [contextMenuPosition]);

  const contextMenuItems: TimelineContextMenuItem[] = doubleClickMenuContext
    ? (
      doubleClickMenuContext.mode === "tween-strip"
        ? [
          {
            id: "set-playhead-double-click",
            label: "Set Playhead Here",
            icon: "timeline",
            action: () => {
              closeContextMenu();
              const { layer, playheadPosition } = doubleClickMenuContext;
              focusTweenStripLocation(layer, playheadPosition);
            },
          },
          {
            id: "previous-frame-double-click",
            label: "Previous Frame",
            glyph: "<",
            action: () => {
              closeContextMenu();
              props.movePlayheadBackwards();
            },
          },
          {
            id: "next-frame-double-click",
            label: "Next Frame",
            glyph: ">",
            action: () => {
              closeContextMenu();
              props.movePlayheadForwards();
            },
          },
          {
            id: "insert-key-double-click",
            label: "Insert Keyframe",
            icon: "split",
            action: () => {
              closeContextMenu();
              const { layer, playheadPosition } = doubleClickMenuContext;
              insertKeyframeAt(layer, playheadPosition, { fallbackToBlank: true });
            },
          },
          {
            id: "insert-blank-double-click",
            label: "Insert Blank Keyframe",
            icon: "create",
            action: () => {
              closeContextMenu();
              const { layer, playheadPosition } = doubleClickMenuContext;
              insertBlankKeyframeAt(layer, playheadPosition);
            },
          },
          {
            id: "insert-tween-double-click",
            label: "Add Tween Keyframe",
            icon: "layerTween",
            action: () => {
              closeContextMenu();
              const { layer, playheadPosition } = doubleClickMenuContext;
              // Tween keyframes should duplicate left content first, not create an empty key.
              insertKeyframeAt(layer, playheadPosition, { fallbackToBlank: true });
              props.addTweenKeyframe();
              requestRender();
            },
          },
          {
            id: "create-tween-double-click",
            label: "Create Tween",
            icon: "tween",
            action: () => {
              closeContextMenu();
              const { layer, playheadPosition } = doubleClickMenuContext;
              insertKeyframeAt(layer, playheadPosition, { fallbackToBlank: true });
              props.createTween();
              requestRender();
            },
          },
          {
            id: "delete-selection-double-click",
            label: "Delete Selected",
            icon: "delete",
            action: () => {
              closeContextMenu();
              const { layer, playheadPosition } = doubleClickMenuContext;
              const sourceFrame = selectClosestLeftFrameForTweenStrip(layer, playheadPosition);
              if (!sourceFrame) {
                return;
              }
              props.deleteSelectedObjects();
              requestRender();
            },
          },
        ]
        : doubleClickMenuContext.mode === "blank-strip"
          ? [
            {
              id: "insert-blank-double-click",
              label: "Insert Blank Keyframe",
              icon: "create",
              action: () => {
                closeContextMenu();
                const { layer, playheadPosition } = doubleClickMenuContext;
                insertBlankKeyframeAt(layer, playheadPosition);
              },
            },
          ]
          : [
            {
              id: "insert-key-double-click",
              label: "Insert Keyframe (Duplicate Left)",
              icon: "split",
              action: () => {
                closeContextMenu();
                const { layer, playheadPosition } = doubleClickMenuContext;
                insertKeyframeAt(layer, playheadPosition, { fallbackToBlank: true });
              },
            },
            {
              id: "insert-blank-double-click",
              label: "Insert Blank Keyframe",
              icon: "create",
              action: () => {
                closeContextMenu();
                const { layer, playheadPosition } = doubleClickMenuContext;
                insertBlankKeyframeAt(layer, playheadPosition);
              },
            },
          ]
    )
    : timelineContextMenuItems;

  const timelineGlyphDensity =
    props.timelineDensityMode === "compact"
      ? { size: "7px", contrast: "0.9" }
      : props.timelineDensityMode === "standard"
        ? { size: "9px", contrast: "0.98" }
        : { size: "8px", contrast: "0.95" };

  return (
    <div
      ref={timelineRootRef}
      id="animation-timeline-container"
      className={TIMELINE_ROOT_CONTAINER_CLASSES}
      aria-label="Timeline"
      tabIndex={0}
      data-timeline-renderer-mode="dom"
      data-timeline-density-mode={props.timelineDensityMode}
      data-timeline-snap-mode={props.timelineSnapMode}
      data-timeline-follow-mode={props.timelinePlaybackFollowMode}
      data-timeline-grid-contrast={gridContrastMode}
      data-timeline-options-open={showHeaderOptions ? "true" : "false"}
      onKeyDownCapture={handleMarkerNavigationHotkeys}
    >
      {props.isOver && <div className="drag-drop-overlay" />}
      <div
        className={`${TIMELINE_SHELL_CLASSES} timeline-dom-shell timeline-density-${props.timelineDensityMode}`}
        style={{
          ["--timeline-cell-width" as string]: `${cellWidth}px`,
          ["--timeline-cell-height" as string]: `${cellHeight}px`,
          ["--timeline-keyframe-glyph-size" as string]: timelineGlyphDensity.size,
          ["--timeline-keyframe-glyph-contrast" as string]: timelineGlyphDensity.contrast,
        }}
      >
        <div className={TIMELINE_HEADER_CLASSES}>
          <div className={TIMELINE_BREADCRUMB_CLASSES}>
            {isNestedTimeline && (
              <ActionButton
                id="timeline-focus-parent"
                icon="leaveUp"
                color="tool"
                tooltip="Back to Parent Timeline"
                tooltipPlace="top"
                className={`${TIMELINE_ACTION_BUTTON_CLASSES} ${TIMELINE_BACK_BUTTON_CLASSES}`}
                action={props.focusTimelineOfParentClip}
              />
            )}
            <span className={TIMELINE_SCENE_LABEL_CLASSES}>Scene</span>
            <span className={TIMELINE_SCENE_NAME_CLASSES}>{focusLabel}</span>
          </div>
          <div className={TIMELINE_HEADER_RIGHT_CLASSES}>
            <div className={TIMELINE_HEADER_RIGHT_PRIMARY_CLASSES}>
              <div className={TIMELINE_META_CLASSES}>{timelineMeta}</div>
              <div
                className={TIMELINE_SHORTCUT_TOGGLE_CLASSES}
                role="group"
                aria-label="Timeline shortcut preset"
              >
                <button
                  type="button"
                  className={getTimelineShortcutToggleButtonClasses(
                    props.timelineShortcutPreset === "wick"
                  )}
                  aria-pressed={props.timelineShortcutPreset === "wick"}
                  onClick={() => handleShortcutPresetSwitch("wick")}
                >
                  Wick
                </button>
                <button
                  type="button"
                  className={getTimelineShortcutToggleButtonClasses(
                    props.timelineShortcutPreset === "flash"
                  )}
                  aria-pressed={props.timelineShortcutPreset === "flash"}
                  onClick={() => handleShortcutPresetSwitch("flash")}
                >
                  Flash
                </button>
              </div>
              <div
                className={TIMELINE_RENDERER_TOGGLE_CLASSES}
                role="group"
                aria-label="Timeline renderer"
              >
                <button
                  type="button"
                  className={getTimelineRendererToggleButtonClasses(
                    props.timelineRendererMode === "dom"
                  )}
                  aria-pressed={props.timelineRendererMode === "dom"}
                  onClick={() => handleModeSwitch("dom")}
                >
                  DOM
                </button>
                <button
                  type="button"
                  className={getTimelineRendererToggleButtonClasses(
                    props.timelineRendererMode === "classic"
                  )}
                  aria-pressed={props.timelineRendererMode === "classic"}
                  onClick={() => handleModeSwitch("classic")}
                >
                  Classic
                </button>
              </div>
              <button
                type="button"
                className={getTimelineHeaderOptionsButtonClasses(showHeaderOptions)}
                data-testid="timeline-options-toggle"
                aria-expanded={showHeaderOptions}
                aria-controls="timeline-header-options-panel"
                onClick={() => setShowHeaderOptions((current) => !current)}
              >
                {showHeaderOptions ? "Hide Options" : "Options"}
              </button>
            </div>
            <div
              id="timeline-header-options-panel"
              className={getTimelineHeaderRightAdvancedClasses(showHeaderOptions)}
              data-testid="timeline-options-panel"
              hidden={!showHeaderOptions}
            >
              <div
                className={TIMELINE_SHORTCUT_TOGGLE_CLASSES}
                role="group"
                aria-label="Playhead follow mode"
                data-testid="timeline-follow-mode-group"
              >
                <button
                  type="button"
                  className={getTimelineShortcutToggleButtonClasses(
                    props.timelinePlaybackFollowMode === "follow-playhead"
                  )}
                  aria-pressed={props.timelinePlaybackFollowMode === "follow-playhead"}
                  onClick={() => handlePlaybackFollowModeSwitch("follow-playhead")}
                >
                  Follow
                </button>
                <button
                  type="button"
                  className={getTimelineShortcutToggleButtonClasses(
                    props.timelinePlaybackFollowMode === "off"
                  )}
                  aria-pressed={props.timelinePlaybackFollowMode === "off"}
                  onClick={() => handlePlaybackFollowModeSwitch("off")}
                >
                  Free
                </button>
              </div>
              <div
                className={TIMELINE_SHORTCUT_TOGGLE_CLASSES}
                role="group"
                aria-label="Timeline snap mode"
              >
                <button
                  type="button"
                  className={getTimelineShortcutToggleButtonClasses(
                    props.timelineSnapMode === "none"
                  )}
                  aria-pressed={props.timelineSnapMode === "none"}
                  onClick={() => handleSnapModeSwitch("none")}
                >
                  No Snap
                </button>
                <button
                  type="button"
                  className={getTimelineShortcutToggleButtonClasses(
                    props.timelineSnapMode === "frames"
                  )}
                  aria-pressed={props.timelineSnapMode === "frames"}
                  onClick={() => handleSnapModeSwitch("frames")}
                >
                  Frames
                </button>
                <button
                  type="button"
                  className={getTimelineShortcutToggleButtonClasses(
                    props.timelineSnapMode === "markers"
                  )}
                  aria-pressed={props.timelineSnapMode === "markers"}
                  onClick={() => handleSnapModeSwitch("markers")}
                >
                  Markers
                </button>
              </div>
              <div
                className={TIMELINE_SHORTCUT_TOGGLE_CLASSES}
                role="group"
                aria-label="Timeline density mode"
                data-testid="timeline-density-mode-group"
              >
                <button
                  type="button"
                  className={getTimelineShortcutToggleButtonClasses(
                    props.timelineDensityMode === "compact"
                  )}
                  aria-pressed={props.timelineDensityMode === "compact"}
                  onClick={() => handleDensityModeSwitch("compact")}
                >
                  Compact
                </button>
                <button
                  type="button"
                  className={getTimelineShortcutToggleButtonClasses(
                    props.timelineDensityMode === "standard"
                  )}
                  aria-pressed={props.timelineDensityMode === "standard"}
                  onClick={() => handleDensityModeSwitch("standard")}
                >
                  Standard
                </button>
              </div>
              <div
                className={TIMELINE_SHORTCUT_TOGGLE_CLASSES}
                role="group"
                aria-label="Timeline insert mode"
              >
                <button
                  type="button"
                  className={getTimelineShortcutToggleButtonClasses(
                    insertMode === "overwrite"
                  )}
                  aria-pressed={insertMode === "overwrite"}
                  onClick={() => setInsertMode("overwrite")}
                >
                  Overwrite
                </button>
                <button
                  type="button"
                  className={getTimelineShortcutToggleButtonClasses(
                    insertMode === "ripple"
                  )}
                  aria-pressed={insertMode === "ripple"}
                  onClick={() => setInsertMode("ripple")}
                >
                  Ripple
                </button>
              </div>
              <div
                className={TIMELINE_SHORTCUT_TOGGLE_CLASSES}
                role="group"
                aria-label="Timeline grid contrast"
              >
                <button
                  type="button"
                  className={getTimelineShortcutToggleButtonClasses(
                    gridContrastMode === "soft"
                  )}
                  aria-pressed={gridContrastMode === "soft"}
                  onClick={() => setGridContrastMode("soft")}
                >
                  Soft Grid
                </button>
                <button
                  type="button"
                  className={getTimelineShortcutToggleButtonClasses(
                    gridContrastMode === "strong"
                  )}
                  aria-pressed={gridContrastMode === "strong"}
                  onClick={() => setGridContrastMode("strong")}
                >
                  Strong Grid
                </button>
              </div>
            </div>
          </div>
        </div>

        <div
          ref={workspaceRef}
          id="animation-timeline"
          className={`${TIMELINE_UNIFIED_WORKSPACE_CLASSES} ${TIMELINE_DOM_GRID_SCROLL_CLASSES}`}
          data-testid="timeline-grid-workspace"
          onScroll={() => {
            if (workspaceRef.current) {
              setGridViewportHeight(Math.max(0, Math.floor(workspaceRef.current.clientHeight)));
              setGridViewport((current) => {
                const next = {
                  width: Math.max(0, Math.floor(workspaceRef.current!.clientWidth)),
                  height: Math.max(0, Math.floor(workspaceRef.current!.clientHeight)),
                  scrollTop: Math.max(0, Math.floor(workspaceRef.current!.scrollTop)),
                  scrollLeft: Math.max(0, Math.floor(workspaceRef.current!.scrollLeft)),
                };
                return current.width === next.width &&
                  current.height === next.height &&
                  current.scrollTop === next.scrollTop &&
                  current.scrollLeft === next.scrollLeft
                  ? current
                  : next;
              });
            }
          }}
          onContextMenu={handleGridContextMenu}
          onDoubleClick={handleGridDoubleClick}
          onPointerDown={handleGridPointerDown}
        >
          <div className={TIMELINE_UNIFIED_HEADER_CLASSES}>
            <div className={TIMELINE_UNIFIED_CORNER_CLASSES}>
              <div className={TIMELINE_DOM_LAYERS_HEADER_CLASSES}>Layers</div>
              <div className={TIMELINE_DOM_LAYERS_SUBHEADER_CLASSES}>
                <div className={TIMELINE_HEADER_ACTIONS_CLASSES} role="toolbar" aria-label="Timeline Actions">
                  <ActionButton
                    id="timeline-step-backward"
                    text="<"
                    color="tool"
                    tooltip="Previous Frame"
                    tooltipPlace="bottom"
                    hasLongPressAction
                    className={`${TIMELINE_ACTION_BUTTON_CLASSES} ${TIMELINE_TEXT_ACTION_CLASSES}`}
                    action={() => {
                      props.movePlayheadBackwards();
                      requestRender();
                    }}
                  />
                  <ActionButton
                    id="timeline-step-forward"
                    text=">"
                    color="tool"
                    tooltip="Next Frame"
                    tooltipPlace="bottom"
                    hasLongPressAction
                    className={`${TIMELINE_ACTION_BUTTON_CLASSES} ${TIMELINE_TEXT_ACTION_CLASSES}`}
                    action={() => {
                      props.movePlayheadForwards();
                      requestRender();
                    }}
                  />
                  <ActionButton
                    id="timeline-insert-keyframe"
                    icon="split"
                    color="tool"
                    tooltip="Insert Keyframe"
                    tooltipPlace="bottom"
                    className={TIMELINE_ACTION_BUTTON_CLASSES}
                    action={props.cutFrame}
                  />
                  <ActionButton
                    id="timeline-insert-blank-keyframe"
                    icon="create"
                    color="tool"
                    tooltip="Insert Blank Keyframe"
                    tooltipPlace="bottom"
                    className={TIMELINE_ACTION_BUTTON_CLASSES}
                    action={props.insertBlankFrame}
                  />
                  <ActionButton
                    id="timeline-add-tween-keyframe"
                    icon="layerTween"
                    color="tool"
                    tooltip="Add Tween Keyframe"
                    tooltipPlace="bottom"
                    className={TIMELINE_ACTION_BUTTON_CLASSES}
                    action={props.addTweenKeyframe}
                  />
                  <ActionButton
                    id="timeline-create-tween"
                    icon="tween"
                    color="tool"
                    tooltip="Create Tween"
                    tooltipPlace="bottom"
                    className={TIMELINE_ACTION_BUTTON_CLASSES}
                    action={props.createTween}
                  />
                  <ActionButton
                    id="timeline-delete-selection"
                    icon="delete"
                    color="tool"
                    tooltip="Delete Selected Frames/Objects"
                    tooltipPlace="bottom"
                    className={TIMELINE_ACTION_BUTTON_CLASSES}
                    action={props.deleteSelectedObjects}
                  />
                </div>
              </div>
            </div>
            <div className={TIMELINE_UNIFIED_RULER_CLASSES}>
              <div className={TIMELINE_DOM_MARKER_ROW_CLASSES}>
                <div
                  className={TIMELINE_DOM_WORK_AREA_TRACK_CLASSES}
                  style={{
                    width: `${timelineLength * cellWidth}px`,
                    minWidth: `${timelineLength * cellWidth}px`,
                  }}
                >
                  <div
                    className={TIMELINE_DOM_WORK_AREA_SPAN_CLASSES}
                    style={{
                      left: `${(workArea.start - 1) * cellWidth}px`,
                      width: `${Math.max(cellWidth, (workArea.end - workArea.start + 1) * cellWidth)}px`,
                    }}
                  />
                  <button
                    type="button"
                    className={`${TIMELINE_DOM_WORK_AREA_HANDLE_CLASSES} timeline-dom-work-area-handle-start`}
                    style={{ left: `${(workArea.start - 1) * cellWidth}px` }}
                    aria-label="Adjust work area start"
                    title="Adjust work area start"
                    onPointerDown={(event) => handleWorkAreaHandlePointerDown(event, "work-area-start")}
                  />
                  <button
                    type="button"
                    className={`${TIMELINE_DOM_WORK_AREA_HANDLE_CLASSES} timeline-dom-work-area-handle-end`}
                    style={{ left: `${workArea.end * cellWidth}px` }}
                    aria-label="Adjust work area end"
                    title="Adjust work area end"
                    onPointerDown={(event) => handleWorkAreaHandlePointerDown(event, "work-area-end")}
                  />
                  {markers.map((marker) => (
                    <button
                      key={marker.id}
                      type="button"
                      className={TIMELINE_DOM_MARKER_CLASSES}
                      style={{
                        left: `${(marker.frame - 1) * cellWidth + Math.floor(cellWidth / 2)}px`,
                        borderColor: marker.color,
                        color: marker.color,
                      }}
                      title={`${marker.label} (${marker.frame})`}
                      onPointerDown={(event) => handleMarkerPointerDown(event, marker)}
                      onDoubleClick={(event) => {
                        event.preventDefault();
                        handleEditMarker(marker.id);
                      }}
                    >
                      <span className={TIMELINE_DOM_MARKER_LABEL_CLASSES}>{marker.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className={TIMELINE_DOM_NUMBERLINE_CLASSES} onPointerDown={handleNumberLinePointerDown}>
                <canvas
                  ref={unifiedNumberLineCanvasRef}
                  className={TIMELINE_UNIFIED_NUMBERLINE_CANVAS_CLASSES}
                  aria-hidden
                  style={{ width: `${timelineLength * cellWidth}px`, height: '100%' }}
                />
                <div
                  className={TIMELINE_DOM_PLAYHEAD_CAP_CLASSES}
                  style={{ left: `${(playheadPosition - 1) * cellWidth + Math.floor(cellWidth / 2)}px` }}
                  aria-hidden
                />
              </div>
            </div>
          </div>

          <div className={TIMELINE_UNIFIED_BODY_CLASSES} style={{ minWidth: `${unifiedBodyMinWidth}px` }}>
            <canvas
              ref={unifiedGridCanvasRef}
              className={TIMELINE_UNIFIED_GRID_CANVAS_CLASSES}
              aria-hidden
            />
            <div className={TIMELINE_UNIFIED_OVERLAYS_CLASSES} style={{ left: `${LAYER_PANEL_WIDTH_PX}px` }}>
              <div
                className={TIMELINE_DOM_PLAYHEAD_CLASSES}
                style={{ left: `${(playheadPosition - 1) * cellWidth + cellWidth / 2 - 1}px` }}
              />

              {showSelectedFrameCellIndicator && (
                <div
                  className={TIMELINE_DOM_PLAYHEAD_SELECTED_CELL_CLASSES}
                  style={{
                    left: `${(playheadPosition - 1) * cellWidth}px`,
                    top: `${activeLayerIndex * cellHeight}px`,
                    width: `${cellWidth}px`,
                    height: `${cellHeight}px`,
                  }}
                  aria-hidden
                />
              )}

              {selectionBox && (
                <div
                  className={TIMELINE_DOM_SELECTION_BOX_CLASSES}
                  style={{
                    left: `${Math.min(selectionBox.startCol, selectionBox.endCol) * cellWidth}px`,
                    top: `${Math.min(selectionBox.startRow, selectionBox.endRow) * cellHeight}px`,
                    width: `${(Math.abs(selectionBox.endCol - selectionBox.startCol) + 1) * cellWidth
                      }px`,
                    height: `${(Math.abs(selectionBox.endRow - selectionBox.startRow) + 1) * cellHeight
                      }px`,
                  }}
                />
              )}

              {layerReorderPreview !== null && (
                <div
                  className={TIMELINE_DOM_LAYER_REORDER_LINE_CLASSES}
                  style={{ top: `${layerReorderPreview * cellHeight}px` }}
                />
              )}

              <div
                className={TIMELINE_DOM_WORK_AREA_OVERLAY_CLASSES}
                style={{
                  left: `${(workArea.start - 1) * cellWidth}px`,
                  width: `${Math.max(cellWidth, (workArea.end - workArea.start + 1) * cellWidth)}px`,
                }}
              />
            </div>

            {layerTopSpacerHeight > 0 && (
              <div style={{ height: `${layerTopSpacerHeight}px` }} aria-hidden />
            )}

            {renderedLayers.map((layer, renderedLayerIndex) => {
              const layerIndex = visibleLayerStart + renderedLayerIndex;
              const isActive = layerIndex === activeTimeline?.activeLayerIndex;
              const isLayerSelected = Boolean(project?.selection?.isObjectSelected?.(layer));

              const previewRow =
                interactionRef.current?.mode === "frame-move" ||
                interactionRef.current?.mode === "frame-resize-left" ||
                interactionRef.current?.mode === "frame-resize-right";
              const renderedFrames = shouldVirtualizeFrames
                ? layer.frames.filter((frame) =>
                  frameInRange(frame, visibleFrameStart, visibleFrameEnd),
                )
                : layer.frames;
              const lastLayerFrameEnd = layer.frames.reduce((maxEnd, frame) => {
                const frameEnd = Number(frame.end ?? frame.start ?? 1);
                if (!Number.isFinite(frameEnd)) {
                  return maxEnd;
                }
                return Math.max(maxEnd, Math.round(frameEnd));
              }, 0);
              const trailingSpanStart = Math.max(1, lastLayerFrameEnd + 1);
              const trailingSpanVisibleStart = Math.max(trailingSpanStart, visibleFrameStart);
              const trailingSpanVisibleEnd = Math.min(timelineLength, visibleFrameEnd);
              const showTrailingSpan = trailingSpanVisibleEnd >= trailingSpanVisibleStart;
              const trailingSpanLeft = (trailingSpanVisibleStart - 1) * cellWidth;
              const trailingSpanWidth = Math.max(
                0,
                (trailingSpanVisibleEnd - trailingSpanVisibleStart + 1) * cellWidth - 1,
              );

              return (
                <div
                  key={`unified-row-${layer.uuid ?? layerIndex}`}
                  className={TIMELINE_UNIFIED_ROW_CLASSES}
                  style={{ height: `${cellHeight}px` }}
                >
                  <div className={TIMELINE_UNIFIED_LAYER_CONTROLS_CLASSES}>
                    <div
                      className={getTimelineDomLayerRowClasses(isActive, isLayerSelected)}
                      style={{ height: `${cellHeight}px`, width: '100%' }}
                    >
                      <div
                        className={TIMELINE_DOM_LAYER_MAIN_CLASSES}
                        onPointerDown={(event) => handleLayerPointerDown(event, layer, layerIndex)}
                        onDoubleClick={() =>
                          setLayerRename({ layer, value: String(layer.name ?? `Layer ${layerIndex + 1}`) })
                        }
                        role={layerRename?.layer === layer ? undefined : "button"}
                        tabIndex={0}
                        style={{ cursor: "pointer" }}
                      >
                        {layerRename?.layer === layer ? (
                          <input
                            className={TIMELINE_DOM_LAYER_NAME_INPUT_CLASSES}
                            autoFocus
                            value={layerRename.value}
                            aria-label="Rename Layer"
                            title="Rename Layer"
                            placeholder="Layer Name"
                            onChange={(event) =>
                              setLayerRename((current) =>
                                current
                                  ? {
                                    ...current,
                                    value: event.target.value,
                                  }
                                  : current,
                              )
                            }
                            onBlur={commitLayerRename}
                            onKeyDown={(event) => {
                              if (event.key === "Enter") {
                                commitLayerRename();
                              }
                              if (event.key === "Escape") {
                                setLayerRename(null);
                              }
                            }}
                          />
                        ) : (
                          <span className={TIMELINE_DOM_LAYER_NAME_CLASSES}>
                            {String(layer.name ?? `Layer ${layerIndex + 1}`)}
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        className={TIMELINE_DOM_LAYER_ICON_BUTTON_CLASSES}
                        onClick={() => {
                          layer.hidden = !layer.hidden;
                          layer.activate?.();
                          commitProjectChange("Toggle Layer Hidden");
                        }}
                        aria-label={layer.hidden ? "Show Layer" : "Hide Layer"}
                        title={layer.hidden ? "Show Layer" : "Hide Layer"}
                      >
                        <img className={TIMELINE_DOM_LAYER_BUTTON_ICON_CLASSES} src={layer.hidden ? iconHidden : iconShown} alt="" />
                      </button>
                      <button
                        type="button"
                        className={TIMELINE_DOM_LAYER_ICON_BUTTON_CLASSES}
                        onClick={() => {
                          layer.locked = !layer.locked;
                          layer.activate?.();
                          commitProjectChange("Toggle Layer Locked");
                        }}
                        aria-label={layer.locked ? "Unlock Layer" : "Lock Layer"}
                        title={layer.locked ? "Unlock Layer" : "Lock Layer"}
                      >
                        <img className={TIMELINE_DOM_LAYER_BUTTON_ICON_CLASSES} src={layer.locked ? iconLock : iconUnlock} alt="" />
                      </button>
                      <button
                        type="button"
                        className={TIMELINE_DOM_LAYER_DELETE_BUTTON_CLASSES}
                        onClick={() => handleLayerDelete(layer)}
                        aria-label="Delete Layer"
                        title="Delete Layer"
                      >
                        <img className={TIMELINE_DOM_LAYER_BUTTON_ICON_CLASSES} src={iconDelete} alt="" />
                      </button>
                    </div>
                  </div>

                  <div className={TIMELINE_UNIFIED_TRACK_CLASSES}>
                    <div
                      className={getTimelineDomGridRowStateClasses(isActive)}
                      style={{
                        height: `${cellHeight}px`,
                        position: 'relative', // Ensure relative for frames
                        width: '100%'
                      }}
                    >
                      {showTrailingSpan && trailingSpanWidth > 0 && (
                        <div
                          className={TIMELINE_DOM_IMPLICIT_TAIL_FRAME_CLASSES}
                          data-frame-state="span-blank"
                          aria-hidden
                          style={{
                            left: `${trailingSpanLeft}px`,
                            top: "0px",
                            width: `${trailingSpanWidth}px`,
                            height: `${cellHeight - 2}px`,
                          }}
                        />
                      )}
                      {doubleClickMenuContext &&
                        insertMenuTargetCell &&
                        insertMenuTargetCell.layerIndex === layerIndex && (
                          <div
                            className={TIMELINE_DOM_INSERT_TARGET_OUTLINE_CLASSES}
                            style={{
                              left: `${(insertMenuTargetCell.playheadPosition - 1) * cellWidth}px`,
                              top: "0px",
                              width: `${cellWidth}px`,
                              height: `${cellHeight - 2}px`,
                            }}
                            aria-hidden
                          />
                        )}

                      {renderedFrames.map((frame) => {
                        const frameStart = Number(frame.start ?? 1);
                        const frameLength = normalizeFrameLength(frame);
                        const frameVisualState = getFrameVisualState(frame);
                        const selected = isFrameSelected(frame);
                        const hasStartTween = Array.isArray(frame.tweens) && frame.tweens.some((t) => Number(t.playheadPosition ?? 1) === frameStart);
                        const left = (frameStart - 1) * cellWidth;
                        const width = Math.max(cellWidth, frameLength * cellWidth - 1);
                        //const isDraggedFrame = // REMOVE THIS
                        //  Boolean(
                        //    interactionRef.current?.frames.some((selectedFrame) => selectedFrame === frame),
                        //  ) && Boolean(previewRow && dragPreview);

                        // FIX: Re-declare isDraggedFrame in local scope if needed or just use logic inline
                        // To be safe and clean, let's just make sure it parses correctly.
                        // I will assume the original logic is correct.
                        const isDraggedFrame =
                          Boolean(
                            interactionRef.current?.frames.some((selectedFrame) => selectedFrame === frame),
                          ) && Boolean(previewRow && dragPreview);


                        let previewLeft = left;
                        let previewTop = 0;
                        let previewWidth = width;

                        if (isDraggedFrame && dragPreview) {
                          const mode = interactionRef.current?.mode;
                          if (mode === "frame-move") {
                            previewLeft = left + dragPreview.moveCols * cellWidth;
                            previewTop = dragPreview.moveRows * cellHeight;
                          } else if (mode === "frame-resize-left") {
                            const deltaWidth = dragPreview.moveCols * cellWidth;
                            previewLeft = left + deltaWidth;
                            previewWidth = Math.max(cellWidth, width - deltaWidth);
                          } else if (mode === "frame-resize-right") {
                            const deltaWidth = dragPreview.moveCols * cellWidth;
                            previewWidth = Math.max(cellWidth, width + deltaWidth);
                          }
                        }

                        return (
                          <div
                            key={frame.uuid ?? `${layerIndex}-${frameStart}-${frameLength}`}
                            className={getTimelineDomFrameClasses({
                              selected,
                              contentful: Boolean(frame.contentful),
                              frameState: frameVisualState,
                              hasStartTween,
                              dragging: isDraggedFrame,
                              dragCollisionMode: isDraggedFrame ? dragCollisionMode : null,
                            })}
                            data-frame-state={frameVisualState}
                            data-role="gridcell"
                            tabIndex={0}
                            aria-selected={selected}
                            style={{
                              left: `${previewLeft}px`,
                              top: `${previewTop}px`,
                              width: `${previewWidth}px`,
                              height: `${cellHeight - 2}px`,
                            }}
                            onPointerDown={(event) => {
                              event.stopPropagation();
                              handleGridPointerDown(event);
                            }}
                            onKeyDown={(event) => {
                              if (event.key !== "Enter" && event.key !== " ") {
                                return;
                              }
                              event.preventDefault();
                              if (event.shiftKey) {
                                selectFrameRangeFromAnchor(frame, layerIndex);
                                return;
                              }

                              const toggle = event.metaKey || event.ctrlKey;
                              selectFrame(frame, {
                                append: toggle,
                                toggle,
                              });
                            }}
                          >
                            <span className={TIMELINE_DOM_FRAME_LABEL_CLASSES}>{frame.identifier ?? ""}</span>
                            <div className={TIMELINE_DOM_FRAME_RESIZE_LEFT_CLASSES} aria-hidden />
                            <div className={TIMELINE_DOM_FRAME_RESIZE_RIGHT_CLASSES} aria-hidden />
                            {Array.isArray(frame.tweens) &&
                              frame.tweens.map((tween, index) => {
                                const absolutePos = Number(tween.playheadPosition ?? 1);
                                const localOffset = absolutePos - frameStart;
                                const isAtStart = localOffset === 0;

                                // Check if this tween is actively being dragged
                                const isTweenDragged = Boolean(
                                  interactionRef.current?.mode === "tween-move" &&
                                  dragPreview &&
                                  interactionRef.current.tweens.includes(tween),
                                );
                                const tweenDragCols = isTweenDragged ? (dragPreview?.moveCols ?? 0) : 0;

                                // Calculate the span for the tween arrow
                                const nextTween = frame.tweens[index + 1];
                                const nextAbsolutePos = nextTween ? Number(nextTween.playheadPosition ?? 1) : frameStart + frameLength;
                                const nextLocalOffset = nextAbsolutePos - frameStart;

                                // Use dragged offset for arrow calculation when this tween is dragged
                                const effectiveLocalOffset = localOffset + tweenDragCols;

                                // The arrow should start slightly past the diamond
                                const arrowStart = effectiveLocalOffset * cellWidth + cellWidth / 2 + 6;

                                // Check if next tween is also dragged (for accurate arrow end)
                                const isNextDragged = Boolean(
                                  nextTween &&
                                  interactionRef.current?.mode === "tween-move" &&
                                  dragPreview &&
                                  interactionRef.current.tweens.includes(nextTween),
                                );
                                const nextDragCols = isNextDragged ? (dragPreview?.moveCols ?? 0) : 0;
                                const effectiveNextOffset = nextLocalOffset + nextDragCols;

                                // The arrow stops just before the next diamond or near the end of the frame
                                const arrowEnd = nextTween
                                  ? (effectiveNextOffset * cellWidth + cellWidth / 2 - 8)
                                  : (frameLength * cellWidth - 5);

                                const arrowWidth = arrowEnd - arrowStart;

                                const tweenLeftPx = effectiveLocalOffset * cellWidth + cellWidth / 2 - 5;

                                return (
                                  <Fragment key={tween.uuid ?? `${frame.uuid}-tween-${absolutePos}`}>
                                    {isTweenDragged && tweenDragCols !== 0 && (
                                      <div
                                        className={TIMELINE_DOM_TWEEN_ORIGIN_GHOST_CLASSES}
                                        aria-hidden
                                        style={{ left: `${localOffset * cellWidth + cellWidth / 2 - 5}px` }}
                                      />
                                    )}
                                    {arrowWidth > 15 && (
                                      <div
                                        className={getTimelineDomTweenArrowClasses(isTweenDragged)}
                                        style={{
                                          left: `${arrowStart}px`,
                                          width: `${arrowWidth}px`
                                        }}
                                      >
                                        <div className={getTimelineDomTweenArrowLineClasses(isTweenDragged)} />
                                        <div className={getTimelineDomTweenArrowHeadClasses(isTweenDragged)} />
                                      </div>
                                    )}
                                    <button
                                      type="button"
                                      className={getTimelineDomTweenClasses({
                                        overlapsKeyframe: isAtStart && !isTweenDragged,
                                        dragging: Boolean(isTweenDragged),
                                      })}
                                      data-tween-state="tween-span"
                                      aria-label={isTweenDragged ? `Tween (moving ${tweenDragCols > 0 ? "+" : ""}${tweenDragCols})` : "Tween"}
                                      title={isTweenDragged ? `Move ${tweenDragCols > 0 ? "+" : ""}${tweenDragCols}` : "Tween"}
                                      style={{ left: `${tweenLeftPx}px` }}
                                      onPointerDown={(event) => handleTweenPointerDown(event, tween)}
                                    />
                                  </Fragment>
                                );
                              })}
                          </div>
                        );
                      })}

                      {soundHoverCell &&
                        soundHoverCell.layerIndex === layerIndex && (
                          <div
                            className={TIMELINE_DOM_SOUND_HOVER_CLASSES}
                            style={{
                              left: `${(soundHoverCell.playheadPosition - 1) * cellWidth}px`,
                              width: `${cellWidth}px`,
                            }}
                          />
                        )}
                    </div>
                  </div>
                </div>
              );
            })}

            {layerBottomSpacerHeight > 0 && (
              <div style={{ height: `${layerBottomSpacerHeight}px` }} aria-hidden />
            )}

            {layerFillerHeight > 0 && (
              <div
                className={TIMELINE_UNIFIED_EMPTY_COVER_CLASSES}
                style={{
                  top: `${currentLayersHeight}px`,
                  height: `${layerFillerHeight}px`,
                }}
                aria-hidden
              />
            )}

            <div className={TIMELINE_UNIFIED_ROW_CLASSES}>
              <div className={TIMELINE_UNIFIED_LAYER_CONTROLS_CLASSES}>
                <button
                  type="button"
                  className={TIMELINE_DOM_LAYER_ADD_CLASSES}
                  style={{ height: `${cellHeight}px` }}
                  onClick={handleAddLayer}
                >
                  + Layer
                </button>
                {layerFillerHeight > 0 && (
                  <div
                    className={TIMELINE_DOM_LAYER_FILLER_CLASSES}
                    style={{ height: `${layerFillerHeight}px` }}
                    aria-hidden
                  />
                )}
              </div>
              <div className={TIMELINE_UNIFIED_TRACK_CLASSES} />
            </div>

            {dragCollisionMode && (
              <div className={getTimelineDomDropModeClasses(dragCollisionMode)}
                style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 100 }}
              >
                {dragCollisionMode === "push" ? "Push on drop" : "Overwrite on drop"}
              </div>
            )}
          </div>
        </div>

        <div className={TIMELINE_FOOTER_CLASSES} role="toolbar" aria-label="Timeline Quick Controls">
          <div className={`${TIMELINE_FOOTER_GROUP_CLASSES} ${TIMELINE_FOOTER_FIELD_GROUP_CLASSES}`}>
            <span className={TIMELINE_FOOTER_LABEL_CLASSES}>Frame</span>
            <input
              className={TIMELINE_FOOTER_INPUT_CLASSES}
              type="number"
              min={1}
              step={1}
              value={frameInputValue}
              onChange={(event) => setFrameInputValue(event.target.value)}
              onBlur={commitFrameInput}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  commitFrameInput();
                }
              }}
              aria-label="Current Frame Number"
            />
            <button type="button" className={TIMELINE_FOOTER_BUTTON_CLASSES} onClick={commitFrameInput}>
              Go
            </button>
          </div>

          <div className={`${TIMELINE_FOOTER_GROUP_CLASSES} ${TIMELINE_FOOTER_FIELD_GROUP_CLASSES}`}>
            <span className={TIMELINE_FOOTER_LABEL_CLASSES}>FPS</span>
            <button
              type="button"
              className={TIMELINE_FOOTER_BUTTON_CLASSES}
              onClick={() => nudgeFps(-1)}
              aria-label="Decrease Framerate"
              title="Decrease Framerate"
            >
              -
            </button>
            <input
              className={`${TIMELINE_FOOTER_INPUT_CLASSES} ${TIMELINE_FOOTER_INPUT_FPS_CLASSES}`}
              type="number"
              min={MIN_FRAME_RATE}
              max={MAX_FRAME_RATE}
              step={0.1}
              value={fpsInputValue}
              onChange={(event) => setFpsInputValue(event.target.value)}
              onBlur={commitFpsInput}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  commitFpsInput();
                }
              }}
              aria-label="Project Framerate"
            />
            <button
              type="button"
              className={TIMELINE_FOOTER_BUTTON_CLASSES}
              onClick={() => nudgeFps(1)}
              aria-label="Increase Framerate"
              title="Increase Framerate"
            >
              +
            </button>
          </div>

          <div className={TIMELINE_FOOTER_GROUP_CLASSES}>
            <span className={`${TIMELINE_FOOTER_LABEL_CLASSES} ${TIMELINE_FOOTER_ICON_LABEL_CLASSES}`}>
              <img src={iconFrameSizeMenu} alt="" className={TIMELINE_FOOTER_ICON_CLASSES} />
              Frames
            </span>
            <button
              type="button"
              className={getTimelineFooterChoiceClasses(frameSizeMode === "small")}
              onClick={() => {
                setFrameSizeMode("small");
                softRender();
              }}
              aria-pressed={frameSizeMode === "small"}
            >
              <img src={iconSmallFrames} alt="" className={TIMELINE_FOOTER_CHOICE_ICON_CLASSES} />S
            </button>
            <button
              type="button"
              className={getTimelineFooterChoiceClasses(frameSizeMode === "normal")}
              onClick={() => {
                setFrameSizeMode("normal");
                softRender();
              }}
              aria-pressed={frameSizeMode === "normal"}
            >
              <img src={iconNormalFrames} alt="" className={TIMELINE_FOOTER_CHOICE_ICON_CLASSES} />M
            </button>
            <button
              type="button"
              className={getTimelineFooterChoiceClasses(frameSizeMode === "large")}
              onClick={() => {
                setFrameSizeMode("large");
                softRender();
              }}
              aria-pressed={frameSizeMode === "large"}
            >
              <img src={iconLargeFrames} alt="" className={TIMELINE_FOOTER_CHOICE_ICON_CLASSES} />L
            </button>
          </div>

          <div className={TIMELINE_FOOTER_GROUP_CLASSES}>
            <span className={`${TIMELINE_FOOTER_LABEL_CLASSES} ${TIMELINE_FOOTER_ICON_LABEL_CLASSES}`}>
              <img
                src={
                  insertMode === "ripple"
                    ? iconGapFillMenuExtendFrames
                    : iconGapFillMenuBlankFrames
                }
                alt=""
                className={TIMELINE_FOOTER_ICON_CLASSES}
              />
              Insert
            </span>
            <button
              type="button"
              className={getTimelineFooterChoiceClasses(insertMode === "overwrite")}
              onClick={() => setInsertMode("overwrite")}
              aria-pressed={insertMode === "overwrite"}
            >
              <img
                src={iconGapFillBlankFrames}
                alt=""
                className={TIMELINE_FOOTER_CHOICE_ICON_CLASSES}
              />
              Overwrite
            </button>
            <button
              type="button"
              className={getTimelineFooterChoiceClasses(insertMode === "ripple")}
              onClick={() => setInsertMode("ripple")}
              aria-pressed={insertMode === "ripple"}
            >
              <img
                src={iconGapFillExtendFrames}
                alt=""
                className={TIMELINE_FOOTER_CHOICE_ICON_CLASSES}
              />
              Ripple
            </button>
          </div>

          <div className={`${TIMELINE_FOOTER_GROUP_CLASSES} ${TIMELINE_FOOTER_FIELD_GROUP_CLASSES}`}>
            <span className={TIMELINE_FOOTER_LABEL_CLASSES}>Jump</span>
            <input
              className={`${TIMELINE_FOOTER_INPUT_CLASSES} ${TIMELINE_FOOTER_INPUT_JUMP_CLASSES}`}
              type="number"
              min={1}
              step={1}
              value={jumpFrameValue}
              onChange={(event) => setJumpFrameValue(event.target.value)}
              onBlur={commitFrameJump}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  commitFrameJump();
                }
              }}
              placeholder="Frame"
              aria-label="Jump to frame"
              title="Jump to frame"
            />
            <input
              className={`${TIMELINE_FOOTER_INPUT_CLASSES} ${TIMELINE_FOOTER_INPUT_JUMP_CLASSES}`}
              type="text"
              value={jumpLayerValue}
              onChange={(event) => setJumpLayerValue(event.target.value)}
              onBlur={commitLayerJump}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  commitLayerJump();
                }
              }}
              placeholder="Layer name"
              aria-label="Jump to layer"
              title="Jump to layer"
            />
          </div>

          <div className={TIMELINE_FOOTER_GROUP_CLASSES}>
            <span className={TIMELINE_FOOTER_LABEL_CLASSES}>Work Area</span>
            <span className={TIMELINE_FOOTER_READOUT_CLASSES}>
              {workArea.start}-{workArea.end}
            </span>
          </div>

          <div className={`${TIMELINE_FOOTER_GROUP_CLASSES} ${TIMELINE_FOOTER_FIELD_GROUP_CLASSES}`}>
            <span className={TIMELINE_FOOTER_LABEL_CLASSES}>Range</span>
            <input
              className={`${TIMELINE_FOOTER_INPUT_CLASSES} ${TIMELINE_FOOTER_INPUT_RANGE_CLASSES}`}
              type="number"
              min={1}
              step={1}
              value={workAreaStartInput}
              onChange={(event) => setWorkAreaStartInput(event.target.value)}
              onBlur={commitWorkAreaRange}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  commitWorkAreaRange();
                }
              }}
              aria-label="Work area start frame"
              title="Work area start frame"
            />
            <span className={TIMELINE_FOOTER_LABEL_CLASSES}>to</span>
            <input
              className={`${TIMELINE_FOOTER_INPUT_CLASSES} ${TIMELINE_FOOTER_INPUT_RANGE_CLASSES}`}
              type="number"
              min={1}
              step={1}
              value={workAreaEndInput}
              onChange={(event) => setWorkAreaEndInput(event.target.value)}
              onBlur={commitWorkAreaRange}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  commitWorkAreaRange();
                }
              }}
              aria-label="Work area end frame"
              title="Work area end frame"
            />
            <button
              type="button"
              className={TIMELINE_FOOTER_BUTTON_CLASSES}
              onClick={commitWorkAreaRange}
              aria-label="Set work area range"
              title="Set work area range"
            >
              Set
            </button>
          </div>

          <div className={TIMELINE_FOOTER_GROUP_CLASSES} data-testid="timeline-marker-actions">
            <span className={TIMELINE_FOOTER_LABEL_CLASSES}>Markers</span>
            <button
              type="button"
              className={TIMELINE_FOOTER_BUTTON_CLASSES}
              onClick={handleAddMarker}
              aria-label="Add marker at playhead"
              title="Add marker at playhead"
            >
              + Marker
            </button>
            <button
              type="button"
              className={TIMELINE_FOOTER_BUTTON_CLASSES}
              onClick={() => jumpToMarker("previous")}
              aria-label="Jump to previous marker"
              title="Jump to previous marker"
            >
              Prev
            </button>
            <button
              type="button"
              className={TIMELINE_FOOTER_BUTTON_CLASSES}
              onClick={() => jumpToMarker("next")}
              aria-label="Jump to next marker"
              title="Jump to next marker"
            >
              Next
            </button>
            <button
              type="button"
              className={getTimelineFooterChoiceClasses(loopWorkArea)}
              onClick={() => setLoopWorkArea((current) => !current)}
              aria-pressed={loopWorkArea}
            >
              Loop
            </button>
          </div>

          <div className={TIMELINE_FOOTER_HINT_CLASSES}>
            Right-click or long-press any frame for contextual actions. Ctrl/Cmd-click removes marker.
          </div>
          <div className={`${TIMELINE_FOOTER_HINT_CLASSES} ${TIMELINE_FOOTER_SHORTCUT_HINT_CLASSES}`}>
            {props.timelineShortcutPreset === "flash"
              ? "Flash Keys: F5 Extend, F6 Keyframe, F7 Blank, Shift+F5 Shrink"
              : "Wick Keys: Shift+. Extend, Shift+X Keyframe, Shift+8 Blank, Shift+, Shrink"}
          </div>
        </div>

        {keyPressIndicator && (
          <div className={TIMELINE_DOM_KEYPRESS_INDICATOR_CLASSES} aria-live="polite">
            {keyPressIndicator}
          </div>
        )}

        {pressFeedback && (
          <div
            className={TIMELINE_DOM_PRESS_FEEDBACK_CLASSES}
            style={{
              left: `${pressFeedback.x}px`,
              top: `${pressFeedback.y}px`,
            }}
            aria-hidden
          >
            <span className={TIMELINE_DOM_PRESS_FEEDBACK_RING_CLASSES} />
            <span className={TIMELINE_DOM_PRESS_FEEDBACK_BADGE_CLASSES}>Hold for menu</span>
          </div>
        )}

        {contextMenuPosition && (
          <div
            ref={contextMenuRef}
            className={TIMELINE_CONTEXT_MENU_CLASSES}
            role="menu"
            aria-label="Timeline frame actions"
            style={{
              left: `${contextMenuPosition.x}px`,
              top: `${contextMenuPosition.y}px`,
            }}
          >
            {contextMenuItems.map((item) => (
              <button
                key={item.id}
                type="button"
                className={TIMELINE_CONTEXT_MENU_ITEM_CLASSES}
                role="menuitem"
                onClick={() => runMenuAction(item.action)}
                disabled={item.disabled}
              >
                {item.icon ? (
                  <ToolIcon className={TIMELINE_CONTEXT_MENU_ICON_CLASSES} name={item.icon} />
                ) : (
                  <span className={TIMELINE_CONTEXT_MENU_GLYPH_CLASSES}>{item.glyph}</span>
                )}
                <span className={TIMELINE_CONTEXT_MENU_LABEL_CLASSES}>{item.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TimelineDOM;
