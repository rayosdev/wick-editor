import { useEffect, useMemo, useRef, useState } from "react";

import ActionButton from "Editor/Util/ActionButton/ActionButton";
import ToolIcon from "Editor/Util/ToolIcon/ToolIcon";

import "./_timeline.scss";
import "bootstrap/dist/css/bootstrap.min.css";

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
  TimelineFrameVisualState,
  TimelineFillGapsMode,
  TimelineFrameLike,
  TimelineFrameSizeMode,
  TimelineLayerLike,
  TimelineRendererProps,
  TimelineTweenLike,
} from "./Timeline.types";

type InteractionMode =
  | "playhead"
  | "select-box"
  | "frame-move"
  | "frame-resize-left"
  | "frame-resize-right"
  | "tween-move"
  | "layer-reorder";

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
const TOUCH_AXIS_LOCK_THRESHOLD_PX = 14;
const CONTEXT_MENU_WIDTH_PX = 220;
const CONTEXT_MENU_HEIGHT_PX = 320;
const CONTEXT_MENU_MARGIN_PX = 8;

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
  const gridScrollRef = useRef<HTMLDivElement>(null);
  const layersScrollRef = useRef<HTMLDivElement>(null);
  const contextMenuRef = useRef<HTMLDivElement>(null);
  const interactionRef = useRef<InteractionState | null>(null);
  const selectionBoxRef = useRef<SelectionBox | null>(null);
  const layerReorderPreviewRef = useRef<number | null>(null);
  const longPressTimerRef = useRef<number | null>(null);
  const longPressStartRef = useRef<{ x: number; y: number } | null>(null);
  const longPressTriggeredRef = useRef(false);
  const [renderTick, setRenderTick] = useState(0);
  const [frameInputValue, setFrameInputValue] = useState("1");
  const [fpsInputValue, setFpsInputValue] = useState(DEFAULT_FRAME_RATE.toFixed(1));
  const [selectionBox, setSelectionBox] = useState<SelectionBox | null>(null);
  const [contextMenuPosition, setContextMenuPosition] =
    useState<TimelineContextMenuPosition | null>(null);
  const [contextMenuTarget, setContextMenuTarget] = useState<TimelineContextTarget | null>(null);
  const [dragPreview, setDragPreview] = useState<{ moveCols: number; moveRows: number } | null>(
    null,
  );
  const [layerRename, setLayerRename] = useState<{ layer: TimelineLayerLike; value: string } | null>(
    null,
  );
  const [layerReorderPreview, setLayerReorderPreview] = useState<number | null>(null);
  const [dragCollisionMode, setDragCollisionMode] = useState<"overwrite" | "push" | null>(null);
  const [isTouchInteracting, setIsTouchInteracting] = useState(false);
  const [pressFeedback, setPressFeedback] = useState<{ x: number; y: number } | null>(null);
  const [soundHoverCell, setSoundHoverCell] =
    useState<{ layerIndex: number; playheadPosition: number } | null>(null);

  const project = props.project;
  const activeTimeline = project?.activeTimeline;
  const layers = activeTimeline?.layers ?? [];
  const playheadPosition = Number(activeTimeline?.playheadPosition ?? 1);
  const frameRate = Number(project?.framerate ?? 0);
  const frameSizeMode = getFrameSizeMode();
  const { cellWidth, cellHeight } = getGridMetrics();
  const timelineLength = useMemo(() => {
    return Math.max(getTimelineLength(layers) + 24, 48);
  }, [layers, renderTick, frameSizeMode]);

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

  const timelineMeta =
    frameRate > 0
      ? `Frame ${playheadPosition} | ${frameRate.toFixed(1)} fps`
      : `Frame ${playheadPosition}`;

  const requestRender = (): void => {
    setRenderTick((tick) => tick + 1);
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
    if (!(error instanceof TypeError)) {
      return false;
    }

    const message = String(error.message ?? "");
    return (
      message.includes("Cannot read properties of null") &&
      (message.includes("isRoot") || message.includes("timeline"))
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

  const reportRendererError = (error: unknown): void => {
    console.error("TimelineDOM interaction error", error);
    props.onRendererError?.(error);
  };

  const closeContextMenu = (): void => {
    setContextMenuPosition(null);
    setContextMenuTarget(null);
  };

  const setPlayhead = (nextPlayhead: number): void => {
    if (!activeTimeline) {
      return;
    }

    const normalizedPlayhead = Math.max(1, Math.round(nextPlayhead));
    if (activeTimeline.playheadPosition === normalizedPlayhead) {
      return;
    }

    activeTimeline.playheadPosition = normalizedPlayhead;
    const focus = project?.focus as { timeline?: unknown } | null | undefined;
    if (focus && typeof focus === "object" && "timeline" in focus && focus.timeline) {
      try {
        project?.guiElement?.checkForPlayheadAutoscroll?.();
      } catch {
        // Ignore autoscroll if focus changed during a scrub gesture.
      }
    }
    softRender();
  };

  const resolveGridLocation = (
    clientX: number,
    clientY: number,
  ): { layerIndex: number; playheadPosition: number; col: number; row: number } | null => {
    const gridElem = gridScrollRef.current;
    if (!gridElem) {
      return null;
    }

    const rect = gridElem.getBoundingClientRect();
    const localX = clientX - rect.left + gridElem.scrollLeft;
    const localY = clientY - rect.top + gridElem.scrollTop;

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
    options: { append?: boolean; toggle?: boolean } = {},
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
    setPlayhead(Number(frame.start ?? playheadPosition));
    requestRender();
  };

  const clearLongPressTimer = (): void => {
    if (longPressTimerRef.current !== null) {
      window.clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  const resetInteraction = (): void => {
    interactionRef.current = null;
    setDragPreview(null);
    setLayerReorderPreview(null);
    setDragCollisionMode(null);
    setIsTouchInteracting(false);
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

    return fillGapsMode === "auto_extend" ? "push" : "overwrite";
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
      }
    } catch (error) {
      reportRendererError(error);
    } finally {
      resetInteraction();
    }
  };

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
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

    const handlePointerUp = (event: PointerEvent) => {
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

    const handlePointerCancel = (event: PointerEvent) => {
      const interaction = interactionRef.current;
      if (!interaction || interaction.pointerId !== event.pointerId) {
        return;
      }

      clearLongPressTimer();
      longPressStartRef.current = null;
      setPressFeedback(null);
      resetInteraction();
    };

    window.addEventListener("pointermove", handlePointerMove, true);
    window.addEventListener("pointerup", handlePointerUp, true);
    window.addEventListener("pointercancel", handlePointerCancel, true);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove, true);
      window.removeEventListener("pointerup", handlePointerUp, true);
      window.removeEventListener("pointercancel", handlePointerCancel, true);
    };
  }, []);

  useEffect(() => {
    return () => {
      clearLongPressTimer();
    };
  }, []);

  useEffect(() => {
    const gridElem = gridScrollRef.current;
    const layersElem = layersScrollRef.current;

    if (!gridElem || !layersElem) {
      return;
    }

    const syncFromGrid = () => {
      layersElem.scrollTop = gridElem.scrollTop;
    };

    gridElem.addEventListener("scroll", syncFromGrid, { passive: true });

    return () => {
      gridElem.removeEventListener("scroll", syncFromGrid);
    };
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
    requestRender();
  }, [props.timelineSoftRenderTick]);

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
    setPlayhead(normalizedFrame);
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
        const selectedTimelineObjects =
          (project.selection.getSelectedObjects?.("Timeline") ?? []) as unknown[];
        if (selectedTimelineObjects.length > 0) {
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
    setIsTouchInteracting(nextInteraction.pointerType === "touch");
  };

  const handleNumberLinePointerDown = (
    event: React.PointerEvent<HTMLDivElement>,
  ): void => {
    try {
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

  const handleGridPointerDown = (
    event: React.PointerEvent<HTMLDivElement>,
  ): void => {
    try {
      if (!activeTimeline || event.button !== 0) {
        return;
      }

      if (event.pointerType === "touch") {
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

      const location = resolveGridLocation(event.clientX, event.clientY);
      if (!location) {
        return;
      }
      safeSetPointerCapture(event.currentTarget, event.pointerId);

      const layer = layers[location.layerIndex];
      if (!layer) {
        return;
      }
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
          startLayerIndex: location.layerIndex,
          startPlayhead: playheadPosition,
          axisLock: null,
          moveCols: 0,
          moveRows: 0,
          rawMoveRows: 0,
          frames: [],
          tweens: [],
          layer: null,
        });
        return;
      }

      const frameStart = Number(frame.start ?? 1);
      const frameEnd = Number(frame.end ?? frameStart);
      const frameLeftPx = (frameStart - 1) * cellWidth;
      const frameRightPx = frameEnd * cellWidth;
      const localLocation = resolveGridLocation(event.clientX, event.clientY);
      const localCol = localLocation?.col ?? location.col;
      const pointerXInFrame = localCol * cellWidth + cellWidth / 2 - frameLeftPx;

      const handleWidth = Math.max(14, Math.floor(cellWidth * 0.36));
      const nearLeft = pointerXInFrame <= handleWidth;
      const nearRight = frameRightPx - frameLeftPx - pointerXInFrame <= handleWidth;

      if (event.shiftKey) {
        const selection = project?.selection;
        if (selection?.isObjectSelected?.(frame)) {
          selection.deselect?.(frame);
        } else {
          selection?.select(frame);
        }
        frame.parentLayer?.activate?.();
        setPlayhead(frameStart);
        requestRender();
        return;
      }

      const selectedFrames = getSelectedFrames();
      const frameSelection =
        selectedFrames.length > 0 && isFrameSelected(frame) ? selectedFrames : [frame];

      if (!isFrameSelected(frame)) {
        selectFrame(frame);
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
        startLayerIndex: location.layerIndex,
        startPlayhead: playheadPosition,
        axisLock: null,
        moveCols: 0,
        moveRows: 0,
        rawMoveRows: 0,
        frames: resizeFrames,
        tweens: [],
        layer: null,
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
      if (!selectedTweens.includes(tween)) {
        if (!event.shiftKey) {
          project?.selection?.clear();
        }
        project?.selection?.select(tween);
        tween.parentLayer?.activate?.();
        requestRender();
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
        tweens: selectedTweens.length > 0 ? selectedTweens : [tween],
        layer: null,
      });
    } catch (error) {
      reportRendererError(error);
    }
  };

  const handleLayerPointerDown = (
    event: React.PointerEvent<HTMLButtonElement>,
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
      const newLayer = new window.Wick.Layer();
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

  return (
    <div id="animation-timeline-container" aria-label="Timeline" data-timeline-renderer-mode="dom">
      {props.isOver && <div className="drag-drop-overlay" />}
      <div className="timeline-flash-shell timeline-dom-shell">
        <div className="timeline-flash-header">
          <div className="timeline-flash-breadcrumb">
            {isNestedTimeline && (
              <ActionButton
                id="timeline-focus-parent"
                icon="leaveUp"
                color="tool"
                tooltip="Back to Parent Timeline"
                tooltipPlace="top"
                className="timeline-flash-action-button timeline-flash-back-button"
                action={props.focusTimelineOfParentClip}
              />
            )}
            <span className="timeline-flash-scene-label">Scene</span>
            <span className="timeline-flash-scene-name">{focusLabel}</span>
          </div>
          <div className="timeline-flash-header-right">
            <div className="timeline-flash-meta">{timelineMeta}</div>
            <div className="timeline-shortcut-toggle" role="group" aria-label="Timeline shortcut preset">
              <button
                type="button"
                className={`timeline-shortcut-toggle-button ${props.timelineShortcutPreset === "wick" ? "active" : ""}`}
                aria-pressed={props.timelineShortcutPreset === "wick"}
                onClick={() => handleShortcutPresetSwitch("wick")}
              >
                Wick
              </button>
              <button
                type="button"
                className={`timeline-shortcut-toggle-button ${props.timelineShortcutPreset === "flash" ? "active" : ""}`}
                aria-pressed={props.timelineShortcutPreset === "flash"}
                onClick={() => handleShortcutPresetSwitch("flash")}
              >
                Flash
              </button>
            </div>
            <div className="timeline-renderer-toggle" role="group" aria-label="Timeline renderer">
              <button
                type="button"
                className={`timeline-renderer-toggle-button ${props.timelineRendererMode === "dom" ? "active" : ""}`}
                aria-pressed={props.timelineRendererMode === "dom"}
                onClick={() => handleModeSwitch("dom")}
              >
                DOM
              </button>
              <button
                type="button"
                className={`timeline-renderer-toggle-button ${props.timelineRendererMode === "classic" ? "active" : ""}`}
                aria-pressed={props.timelineRendererMode === "classic"}
                onClick={() => handleModeSwitch("classic")}
              >
                Classic
              </button>
            </div>
          </div>
          <div className="timeline-flash-header-actions" role="toolbar" aria-label="Timeline Actions">
            <ActionButton
              id="timeline-step-backward"
              text="<"
              color="tool"
              tooltip="Previous Frame"
              tooltipPlace="bottom"
              className="timeline-flash-action-button timeline-flash-text-action"
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
              className="timeline-flash-action-button timeline-flash-text-action"
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
              className="timeline-flash-action-button"
              action={props.cutFrame}
            />
            <ActionButton
              id="timeline-insert-blank-keyframe"
              icon="create"
              color="tool"
              tooltip="Insert Blank Keyframe"
              tooltipPlace="bottom"
              className="timeline-flash-action-button"
              action={props.insertBlankFrame}
            />
            <ActionButton
              id="timeline-add-tween-keyframe"
              icon="layerTween"
              color="tool"
              tooltip="Add Tween Keyframe"
              tooltipPlace="bottom"
              className="timeline-flash-action-button"
              action={props.addTweenKeyframe}
            />
            <ActionButton
              id="timeline-create-tween"
              icon="tween"
              color="tool"
              tooltip="Create Tween"
              tooltipPlace="bottom"
              className="timeline-flash-action-button"
              action={props.createTween}
            />
            <ActionButton
              id="timeline-delete-selection"
              icon="delete"
              color="tool"
              tooltip="Delete Selected Frames/Objects"
              tooltipPlace="bottom"
              className="timeline-flash-action-button"
              action={props.deleteSelectedObjects}
            />
          </div>
        </div>

        <div className="timeline-dom-workspace">
          <div className="timeline-dom-layers-panel">
            <div className="timeline-dom-layers-header">Layers</div>
            <div className="timeline-dom-layers-scroll" ref={layersScrollRef}>
              {layers.map((layer, layerIndex) => {
                const isActive = layerIndex === activeTimeline?.activeLayerIndex;
                const isLayerSelected = Boolean(project?.selection?.isObjectSelected?.(layer));

                return (
                  <div
                    key={layer.uuid ?? `layer-${layerIndex}`}
                    className={`timeline-dom-layer-row ${isActive ? "active" : ""} ${
                      isLayerSelected ? "selected" : ""
                    }`}
                    style={{ height: `${cellHeight}px` }}
                  >
                    <button
                      type="button"
                      className="timeline-dom-layer-main"
                      onPointerDown={(event) => handleLayerPointerDown(event, layer, layerIndex)}
                      onDoubleClick={() =>
                        setLayerRename({ layer, value: String(layer.name ?? `Layer ${layerIndex + 1}`) })
                      }
                    >
                      {layerRename?.layer === layer ? (
                        <input
                          className="timeline-dom-layer-name-input"
                          autoFocus
                          value={layerRename.value}
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
                        <span className="timeline-dom-layer-name">
                          {String(layer.name ?? `Layer ${layerIndex + 1}`)}
                        </span>
                      )}
                    </button>
                    <button
                      type="button"
                      className="timeline-dom-layer-icon-button"
                      onClick={() => {
                        layer.hidden = !layer.hidden;
                        layer.activate?.();
                        commitProjectChange("Toggle Layer Hidden");
                      }}
                      aria-label={layer.hidden ? "Show Layer" : "Hide Layer"}
                    >
                      <img src={layer.hidden ? iconHidden : iconShown} alt="" />
                    </button>
                    <button
                      type="button"
                      className="timeline-dom-layer-icon-button"
                      onClick={() => {
                        layer.locked = !layer.locked;
                        layer.activate?.();
                        commitProjectChange("Toggle Layer Locked");
                      }}
                      aria-label={layer.locked ? "Unlock Layer" : "Lock Layer"}
                    >
                      <img src={layer.locked ? iconLock : iconUnlock} alt="" />
                    </button>
                    <button
                      type="button"
                      className="timeline-dom-layer-delete-button"
                      onClick={() => handleLayerDelete(layer)}
                      aria-label="Delete Layer"
                    >
                      <img src={iconDelete} alt="" />
                    </button>
                  </div>
                );
              })}

              <button
                type="button"
                className="timeline-dom-layer-add"
                style={{ height: `${cellHeight}px` }}
                onClick={handleAddLayer}
              >
                + Layer
              </button>
            </div>
          </div>

          <div className="timeline-dom-grid-panel">
            <div className="timeline-dom-numberline" onPointerDown={handleNumberLinePointerDown}>
              {Array.from({ length: timelineLength }, (_, index) => {
                const frameNumber = index + 1;
                const isPlayhead = frameNumber === playheadPosition;
                const highlight = index === 0 || index % 5 === 4;
                return (
                  <button
                    key={`frame-number-${frameNumber}`}
                    type="button"
                    className={`timeline-dom-numberline-cell ${highlight ? "highlight" : ""} ${
                      isPlayhead ? "playhead" : ""
                    }`}
                    style={{ width: `${cellWidth}px` }}
                    onClick={() => setPlayhead(frameNumber)}
                  >
                    {frameSizeMode !== "small" || highlight ? frameNumber : ""}
                  </button>
                );
              })}
            </div>

            <div
              id="animation-timeline"
              ref={gridScrollRef}
              className={`timeline-dom-grid-scroll ${isTouchInteracting ? "touch-interacting" : ""}`}
              onContextMenu={handleGridContextMenu}
              onPointerDown={handleGridPointerDown}
              aria-label="Animation timeline grid"
            >
              <div
                className="timeline-dom-grid-canvas"
                style={{
                  width: `${timelineLength * cellWidth}px`,
                  height: `${Math.max(1, layers.length) * cellHeight}px`,
                  ["--timeline-cell-width" as string]: `${cellWidth}px`,
                  ["--timeline-cell-height" as string]: `${cellHeight}px`,
                }}
              >
                {layers.map((layer, layerIndex) => {
                  const previewRow =
                    interactionRef.current?.mode === "frame-move" ||
                    interactionRef.current?.mode === "frame-resize-left" ||
                    interactionRef.current?.mode === "frame-resize-right";

                  return (
                    <div
                      key={`grid-row-${layer.uuid ?? layerIndex}`}
                      className={`timeline-dom-grid-row ${
                        layerIndex === activeTimeline?.activeLayerIndex ? "active" : ""
                      }`}
                      style={{
                        height: `${cellHeight}px`,
                        top: `${layerIndex * cellHeight}px`,
                      }}
                    >
                      {layer.frames.map((frame) => {
                        const frameStart = Number(frame.start ?? 1);
                        const frameLength = normalizeFrameLength(frame);
                        const frameVisualState = getFrameVisualState(frame);
                        const selected = isFrameSelected(frame);
                        const left = (frameStart - 1) * cellWidth;
                        const width = Math.max(cellWidth, frameLength * cellWidth - 1);
                        const isDraggedFrame =
                          Boolean(
                            interactionRef.current?.frames.some((selectedFrame) => selectedFrame === frame),
                          ) && Boolean(previewRow && dragPreview);

                        const previewLeft =
                          isDraggedFrame && dragPreview
                            ? left + dragPreview.moveCols * cellWidth
                            : left;
                        const previewTop =
                          isDraggedFrame && dragPreview
                            ? layerIndex * cellHeight + dragPreview.moveRows * cellHeight
                            : layerIndex * cellHeight;

                        return (
                          <div
                            key={frame.uuid ?? `${layerIndex}-${frameStart}-${frameLength}`}
                            className={`timeline-dom-frame ${selected ? "selected" : ""} ${
                              frame.contentful ? "contentful" : "blank"
                            } ${isDraggedFrame ? "dragging" : ""} ${
                              isDraggedFrame && dragCollisionMode
                                ? `drag-collision-${dragCollisionMode}`
                                : ""
                            }`}
                            data-frame-state={frameVisualState}
                            role="button"
                            tabIndex={0}
                            aria-pressed={selected}
                            style={{
                              left: `${previewLeft}px`,
                              top: `${previewTop}px`,
                              width: `${width}px`,
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
                              selectFrame(frame, {
                                append: event.shiftKey,
                                toggle: event.shiftKey,
                              });
                            }}
                          >
                            <span className="timeline-dom-frame-label">{frame.identifier ?? ""}</span>
                            {Array.isArray(frame.tweens) &&
                              frame.tweens.map((tween) => {
                                const tweenOffset = Number(tween.playheadPosition ?? 1) - 1;
                                return (
                                  <button
                                    key={tween.uuid ?? `${frame.uuid}-tween-${tweenOffset}`}
                                    type="button"
                                    className="timeline-dom-tween"
                                    data-tween-state="tween-span"
                                    style={{ left: `${tweenOffset * cellWidth + cellWidth / 2 - 7}px` }}
                                    onPointerDown={(event) => handleTweenPointerDown(event, tween)}
                                  />
                                );
                              })}
                          </div>
                        );
                      })}

                      {soundHoverCell &&
                        soundHoverCell.layerIndex === layerIndex && (
                          <div
                            className="timeline-dom-sound-hover"
                            style={{
                              left: `${(soundHoverCell.playheadPosition - 1) * cellWidth}px`,
                              width: `${cellWidth}px`,
                            }}
                          />
                        )}
                    </div>
                  );
                })}

                <div
                  className="timeline-dom-playhead"
                  style={{ left: `${(playheadPosition - 1) * cellWidth + cellWidth / 2 - 1}px` }}
                />

                {selectionBox && (
                  <div
                    className="timeline-dom-selection-box"
                    style={{
                      left: `${Math.min(selectionBox.startCol, selectionBox.endCol) * cellWidth}px`,
                      top: `${Math.min(selectionBox.startRow, selectionBox.endRow) * cellHeight}px`,
                      width: `${
                        (Math.abs(selectionBox.endCol - selectionBox.startCol) + 1) * cellWidth
                      }px`,
                      height: `${
                        (Math.abs(selectionBox.endRow - selectionBox.startRow) + 1) * cellHeight
                      }px`,
                    }}
                  />
                )}

                {layerReorderPreview !== null && (
                  <div
                    className="timeline-dom-layer-reorder-line"
                    style={{ top: `${layerReorderPreview * cellHeight}px` }}
                  />
                )}

                {dragCollisionMode && (
                  <div className={`timeline-dom-drop-mode ${dragCollisionMode}`}>
                    {dragCollisionMode === "push" ? "Push on drop" : "Overwrite on drop"}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="timeline-flash-footer" role="toolbar" aria-label="Timeline Quick Controls">
          <div className="timeline-flash-footer-group timeline-flash-footer-field">
            <span className="timeline-flash-footer-label">Frame</span>
            <input
              className="timeline-flash-footer-input"
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
            <button type="button" className="timeline-flash-footer-button" onClick={commitFrameInput}>
              Go
            </button>
          </div>

          <div className="timeline-flash-footer-group timeline-flash-footer-field">
            <span className="timeline-flash-footer-label">FPS</span>
            <button
              type="button"
              className="timeline-flash-footer-button"
              onClick={() => nudgeFps(-1)}
              aria-label="Decrease Framerate"
            >
              -
            </button>
            <input
              className="timeline-flash-footer-input timeline-flash-footer-input-fps"
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
              className="timeline-flash-footer-button"
              onClick={() => nudgeFps(1)}
              aria-label="Increase Framerate"
            >
              +
            </button>
          </div>

          <div className="timeline-flash-footer-group">
            <span className="timeline-flash-footer-label timeline-flash-footer-icon-label">
              <img src={iconFrameSizeMenu} alt="" className="timeline-flash-footer-icon" />
              Frames
            </span>
            <button
              type="button"
              className={`timeline-flash-footer-choice ${frameSizeMode === "small" ? "active" : ""}`}
              onClick={() => {
                setFrameSizeMode("small");
                softRender();
              }}
              aria-pressed={frameSizeMode === "small"}
            >
              <img src={iconSmallFrames} alt="" className="timeline-flash-footer-choice-icon" />S
            </button>
            <button
              type="button"
              className={`timeline-flash-footer-choice ${frameSizeMode === "normal" ? "active" : ""}`}
              onClick={() => {
                setFrameSizeMode("normal");
                softRender();
              }}
              aria-pressed={frameSizeMode === "normal"}
            >
              <img src={iconNormalFrames} alt="" className="timeline-flash-footer-choice-icon" />M
            </button>
            <button
              type="button"
              className={`timeline-flash-footer-choice ${frameSizeMode === "large" ? "active" : ""}`}
              onClick={() => {
                setFrameSizeMode("large");
                softRender();
              }}
              aria-pressed={frameSizeMode === "large"}
            >
              <img src={iconLargeFrames} alt="" className="timeline-flash-footer-choice-icon" />L
            </button>
          </div>

          <div className="timeline-flash-footer-group">
            <span className="timeline-flash-footer-label timeline-flash-footer-icon-label">
              <img
                src={
                  fillGapsMode === "auto_extend"
                    ? iconGapFillMenuExtendFrames
                    : iconGapFillMenuBlankFrames
                }
                alt=""
                className="timeline-flash-footer-icon"
              />
              Gaps
            </span>
            <button
              type="button"
              className={`timeline-flash-footer-choice ${fillGapsMode === "auto_extend" ? "active" : ""}`}
              onClick={() => setGapFillMode("auto_extend")}
              aria-pressed={fillGapsMode === "auto_extend"}
            >
              <img src={iconGapFillExtendFrames} alt="" className="timeline-flash-footer-choice-icon" />
              Extend
            </button>
            <button
              type="button"
              className={`timeline-flash-footer-choice ${fillGapsMode === "blank_frames" ? "active" : ""}`}
              onClick={() => setGapFillMode("blank_frames")}
              aria-pressed={fillGapsMode === "blank_frames"}
            >
              <img src={iconGapFillBlankFrames} alt="" className="timeline-flash-footer-choice-icon" />
              Blank
            </button>
          </div>

          <div className="timeline-flash-footer-hint">
            Right-click or long-press any frame for contextual actions
          </div>
          <div className="timeline-flash-footer-hint timeline-flash-footer-shortcuts">
            {props.timelineShortcutPreset === "flash"
              ? "Flash Keys: F5 Extend, F6 Keyframe, F7 Blank, Shift+F5 Shrink"
              : "Wick Keys: Shift+. Extend, Shift+C Keyframe, Shift+8 Blank, Shift+, Shrink"}
          </div>
        </div>

        {pressFeedback && (
          <div
            className="timeline-dom-press-feedback"
            style={{
              left: `${pressFeedback.x}px`,
              top: `${pressFeedback.y}px`,
            }}
            aria-hidden
          >
            <span className="timeline-dom-press-feedback-ring" />
            <span className="timeline-dom-press-feedback-badge">Hold for menu</span>
          </div>
        )}

        {contextMenuPosition && (
          <div
            ref={contextMenuRef}
            className="timeline-context-menu"
            role="menu"
            aria-label="Timeline frame actions"
            style={{
              left: `${contextMenuPosition.x}px`,
              top: `${contextMenuPosition.y}px`,
            }}
          >
            <div className="timeline-context-menu-target">
              {contextMenuTarget?.label ?? "Current Selection"}
            </div>
            {timelineContextMenuItems.map((item) => (
              <button
                key={item.id}
                type="button"
                className="timeline-context-menu-item"
                role="menuitem"
                onClick={() => runMenuAction(item.action)}
                disabled={item.disabled}
              >
                {item.icon ? (
                  <ToolIcon className="timeline-context-menu-item-icon" name={item.icon} />
                ) : (
                  <span className="timeline-context-menu-item-glyph">{item.glyph}</span>
                )}
                <span className="timeline-context-menu-item-label">{item.label}</span>
              </button>
            ))}
            <div className="timeline-context-menu-hint">
              Context actions for selected timeline location
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimelineDOM;
