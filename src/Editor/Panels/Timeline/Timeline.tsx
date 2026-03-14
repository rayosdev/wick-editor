/*
 * Copyright 2020 WICKLETS LLC
 *
 * This file is part of Wick Editor.
 *
 * Wick Editor is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Wick Editor is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Wick Editor.  If not, see <https://www.gnu.org/licenses/>.
 */

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  useDrop,
  type DropTargetMonitor,
} from "react-dnd";

import DragDropTypes from "Editor/DragDropTypes";

import TimelineClassic from "./TimelineClassic";
import TimelineDOM from "./TimelineDOM";
import { TIMELINE_DROP_TARGET_ROOT_CLASSES } from "./timelineControlClasses";
import type {
  DraggedSoundItem,
  TimelineFrameLike,
  TimelineLayerLike,
  TimelineOwnProps,
  TimelineRendererProps,
} from "./Timeline.types";

type DomFrameTarget = {
  frame: TimelineFrameLike;
  layer: TimelineLayerLike;
  layerIndex: number;
  playheadPosition: number;
};

type ErrorBoundaryProps = {
  children: React.ReactNode;
  onError: (error: unknown) => void;
  resetKey: string;
};

type ErrorBoundaryState = {
  hasError: boolean;
};

class DOMTimelineErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: unknown): void {
    this.props.onError(error);
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps): void {
    if (prevProps.resetKey !== this.props.resetKey && this.state.hasError) {
      this.setState({ hasError: false });
    }
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return null;
    }

    return this.props.children;
  }
}

const dispatchSoundHover = (x: number, y: number, uuid?: string): void => {
  window.dispatchEvent(
    new CustomEvent("wick:timeline-sound-hover", {
      detail: { x, y, uuid },
    }),
  );
};

const clearSoundHover = (): void => {
  window.dispatchEvent(new CustomEvent("wick:timeline-sound-clear"));
};

const resolveDomFrameTarget = (
  props: TimelineOwnProps,
  clientX: number,
  clientY: number,
): DomFrameTarget | null => {
  const project = props.project;
  const activeTimeline = project?.activeTimeline;
  if (!project || !activeTimeline) {
    return null;
  }

  const gridElement = document.querySelector<HTMLDivElement>("#animation-timeline");
  if (!gridElement) {
    return null;
  }

  const rect = gridElement.getBoundingClientRect();
  if (
    clientX < rect.left ||
    clientX > rect.right ||
    clientY < rect.top ||
    clientY > rect.bottom
  ) {
    return null;
  }

  const gui = window?.Wick?.GUIElement;
  const cellWidth = Number(gui?.GRID_DEFAULT_CELL_WIDTH ?? 38);
  const cellHeight = Number(gui?.GRID_DEFAULT_CELL_HEIGHT ?? 42);

  const localX = clientX - rect.left + gridElement.scrollLeft;
  const localY = clientY - rect.top + gridElement.scrollTop;

  const col = Math.max(0, Math.floor(localX / cellWidth));
  const row = Math.max(0, Math.floor(localY / cellHeight));

  const layers = activeTimeline.layers ?? [];
  if (layers.length === 0) {
    return null;
  }

  const layerIndex = Math.min(row, layers.length - 1);
  const playheadPosition = col + 1;
  const layer = layers[layerIndex];
  const frame = layer?.getFrameAtPlayheadPosition?.(playheadPosition) ?? null;

  if (!layer || !frame) {
    return null;
  }

  return {
    frame,
    layer,
    layerIndex,
    playheadPosition,
  };
};

const handleSoundDragForMode = (
  props: TimelineOwnProps,
  uuid: string,
  x: number,
  y: number,
  commit: boolean,
): void => {
  if (props.timelineRendererMode === "classic") {
    props.dragSoundOntoTimeline(uuid, x, y, commit);
    return;
  }

  const project = props.project;
  const asset = project?.getAssetByUUID?.(uuid);

  dispatchSoundHover(x, y, uuid);

  const target = resolveDomFrameTarget(props, x, y);
  if (!target || !asset) {
    if (commit) {
      clearSoundHover();
    }
    return;
  }

  const frame = target.frame;

  if (commit) {
    frame.sound = asset;
    props.projectDidChange({ actionName: "Add Sound to Frame" });
    clearSoundHover();
    return;
  }

  const previousSound = frame.sound;
  frame.sound = asset;
  project?.view?.render?.();
  project?.guiElement?.draw?.();

  if (previousSound) {
    frame.sound = previousSound;
  } else {
    frame.removeSound?.();
  }
};

const Timeline: React.FC<TimelineOwnProps> = (props) => {
  const [domRendererCrashed, setDomRendererCrashed] = useState(false);
  const [isPointerInsideTimeline, setIsPointerInsideTimeline] = useState(false);
  const dropTargetRootRef = useRef<HTMLDivElement | null>(null);
  const [{ isOver }, dropRef] = useDrop<DraggedSoundItem, void, { isOver: boolean }>({
      accept: DragDropTypes.TIMELINE,
      drop: (item: DraggedSoundItem, monitor: DropTargetMonitor) => {
        const dropLocation = monitor.getClientOffset();
        if (!dropLocation) {
          return;
        }

        if (!item?.uuid) {
          return;
        }

        handleSoundDragForMode(
          props,
          item.uuid,
          dropLocation.x,
          dropLocation.y,
          true,
        );
      },
      hover: (item: DraggedSoundItem, monitor: DropTargetMonitor) => {
        const dropLocation = monitor.getClientOffset();
        if (!dropLocation) {
          return;
        }

        if (!item?.uuid) {
          return;
        }

        handleSoundDragForMode(
          props,
          item.uuid,
          dropLocation.x,
          dropLocation.y,
          false,
        );
      },
      collect: (monitor: DropTargetMonitor) => ({
        isOver: monitor.isOver(),
      }),
    });

  const handleTimelineWheelCapture = useCallback(
    (event: React.WheelEvent<HTMLDivElement>): void => {
      // Keep canvas zoom gestures scoped to the canvas, even when timeline is hovered.
      if (event.ctrlKey || event.metaKey) {
        event.preventDefault();
        event.stopPropagation();
      }
    },
    [],
  );

  useEffect(() => {
    const handleWindowWheelCapture = (event: WheelEvent): void => {
      if (!(event.ctrlKey || event.metaKey)) {
        return;
      }

      const rootElement = dropTargetRootRef.current;
      if (!rootElement) {
        return;
      }

      const targetNode = event.target instanceof Node ? event.target : null;
      const startedInTimeline = targetNode ? rootElement.contains(targetNode) : false;

      if (!startedInTimeline && !isPointerInsideTimeline) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      if (typeof event.stopImmediatePropagation === "function") {
        event.stopImmediatePropagation();
      }
    };

    window.addEventListener("wheel", handleWindowWheelCapture, {
      capture: true,
      passive: false,
    });

    return () => {
      window.removeEventListener("wheel", handleWindowWheelCapture, true);
    };
  }, [isPointerInsideTimeline]);

  const notifyDomRendererFailure = useCallback(
    (error: unknown): void => {
      console.error("TimelineDOM crashed; switching to Classic renderer", error);

      if (!domRendererCrashed) {
        setDomRendererCrashed(true);
      }

      if (props.timelineRendererMode !== "classic") {
        props.onTimelineRendererModeChange("classic");
      }

      props.toast?.(
        "DOM timeline had an error and was switched to Classic.",
        "warning",
      );
    },
    [domRendererCrashed, props],
  );

  useEffect(() => {
    if (props.timelineRendererMode === "dom") {
      setDomRendererCrashed(false);
    }
  }, [props.timelineRendererMode]);

  useEffect(() => {
    return () => {
      clearSoundHover();
    };
  }, []);

  useEffect(() => {
    if (props.timelineRendererMode === "dom" && !isOver) {
      clearSoundHover();
    }
  }, [props.timelineRendererMode, isOver]);

  const shouldRenderDom = useMemo(() => {
    return props.timelineRendererMode === "dom" && !domRendererCrashed;
  }, [props.timelineRendererMode, domRendererCrashed]);

  const rendererProps: TimelineRendererProps = {
    ...props,
    isOver: Boolean(isOver),
    onRendererError: notifyDomRendererFailure,
  };

  const renderedTimeline = shouldRenderDom ? (
    <DOMTimelineErrorBoundary
      onError={notifyDomRendererFailure}
      resetKey={props.timelineRendererMode}
    >
      <TimelineDOM {...rendererProps} />
    </DOMTimelineErrorBoundary>
  ) : (
    <TimelineClassic {...rendererProps} />
  );

  const dropTargetRoot = (
    <div
      className={TIMELINE_DROP_TARGET_ROOT_CLASSES}
      ref={(node) => {
        dropTargetRootRef.current = node;
        dropRef(node);
      }}
      onPointerEnter={() => setIsPointerInsideTimeline(true)}
      onPointerLeave={() => setIsPointerInsideTimeline(false)}
      onWheelCapture={handleTimelineWheelCapture}
    >
      {renderedTimeline}
    </div>
  );

  return dropTargetRoot;
};

export type { TimelineOwnProps } from "./Timeline.types";

export default Timeline;
