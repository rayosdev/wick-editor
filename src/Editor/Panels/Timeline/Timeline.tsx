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

import { useRef, useEffect, useState, type ComponentType } from "react";
import {
    DropTarget,
    type ConnectDropTarget,
    type DropTargetConnector,
    type DropTargetMonitor,
} from "react-dnd";

import DragDropTypes from "Editor/DragDropTypes";
import type {
    WickProject,
    WickClip,
    TimelineObject,
    OnionSkinOptions,
} from "Editor/types";
import ActionButton from "Editor/Util/ActionButton/ActionButton";
import ToolIcon from "Editor/Util/ToolIcon/ToolIcon";

import "./_timeline.scss";
import "bootstrap/dist/css/bootstrap.min.css";

import iconLock from "resources/timeline-icons/locked.png";
import iconUnlock from "resources/timeline-icons/unlocked.png";
import iconHidden from "resources/timeline-icons/hidden.png";
import iconShown from "resources/timeline-icons/shown.png";
import iconCopyForward from "resources/timeline-icons/copyForward.png";
import iconSplit from "resources/timeline-icons/cut_frame.png";
import iconLayerTween from "resources/timeline-icons/layerTween.png";
import iconDelete from "resources/timeline-icons/delete.png";
import iconSmallFrames from "resources/timeline-icons/framesSmall.png";
import iconNormalFrames from "resources/timeline-icons/framesNormal.png";
import iconLargeFrames from "resources/timeline-icons/framesLarge.png";
import iconFrameSizeMenu from "resources/timeline-icons/frameSizeMenu.png";
import iconGapFillMenuBlankFrames from "resources/timeline-icons/gapFillMenuBlankFrames.png";
import iconGapFillMenuExtendFrames from "resources/timeline-icons/gapFillMenuExtendFrames.png";
import iconGapFillBlankFrames from "resources/timeline-icons/gapFillBlankFrames.png";
import iconGapFillExtendFrames from "resources/timeline-icons/gapFillExtendFrames.png";

type TimelineFrameLike = {
    contentful?: boolean;
};

type TimelineLayerLike = {
    getFrameAtPlayheadPosition?: (playheadPosition: number) => TimelineFrameLike | null;
    activate?: () => void;
};

type TimelineFrameSizeMode = "small" | "normal" | "large";

type TimelineFillGapsMode = "auto_extend" | "blank_frames";

type TimelineActiveLike = {
    layers: TimelineLayerLike[];
    activeLayerIndex: number;
    playheadPosition: number;
    fillGapsMethod?: TimelineFillGapsMode;
};

type TimelineSelectionLike = {
    clear: () => void;
    select: (object: TimelineFrameLike) => void;
    getSelectedObjects?: (type?: string) => unknown[];
};

type TimelineGuiLike = {
    onProjectModified?: (callback: () => void) => void;
    onProjectSoftModified?: (callback: () => void) => void;
    canvasContainer?: HTMLDivElement | null;
    draw?: () => void;
    _canvas?: {
        getBoundingClientRect?: () => DOMRect;
    };
    checkForPlayheadAutoscroll?: () => void;
    scrollX?: number;
    scrollY?: number;
};

type TimelineProject = {
    focus?: {
        isRoot?: boolean;
        identifier?: string | null;
    };
    framerate?: number;
    view?: {
        render?: () => void;
    };
    guiElement?: TimelineGuiLike;
    activeTimeline?: TimelineActiveLike;
    selection?: TimelineSelectionLike;
};

interface TimelineOwnProps {
    project: TimelineProject | null;
    projectDidChange: (options: { actionName: string;[key: string]: unknown }) => void;
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
}

interface InjectedProps {
    connectDropTarget: ConnectDropTarget;
    isOver: boolean;
}

type TimelineProps = TimelineOwnProps & InjectedProps;

type DraggedSoundItem = {
    uuid: string;
};

type TimelineContextMenuPosition = {
    x: number;
    y: number;
};

type TimelineContextMenuItem = {
    id: string;
    label: string;
    icon?: string;
    glyph?: string;
    action: () => void;
    disabled?: boolean;
};

type TimelineContextTargetArea = "frame" | "layer" | "numberLine" | "unknown";

type TimelineContextTarget = {
    area: TimelineContextTargetArea;
    layerIndex: number | null;
    playheadPosition: number | null;
    frame: TimelineFrameLike | null;
    label: string;
};

const Timeline: React.FC<TimelineProps> = (props) => {
    const DEFAULT_FRAME_RATE = 12;
    const MIN_FRAME_RATE = 1;
    const MAX_FRAME_RATE = 60;
    const LONG_PRESS_MS = 450;
    const LONG_PRESS_CANCEL_DISTANCE_PX = 12;
    const CONTEXT_MENU_WIDTH_PX = 220;
    const CONTEXT_MENU_HEIGHT_PX = 320;
    const CONTEXT_MENU_MARGIN_PX = 8;

    const canvasContainer = useRef<HTMLDivElement>(null);
    const currentAttachedProject = useRef<TimelineProject | null>(null);
    const contextMenuRef = useRef<HTMLDivElement>(null);
    const longPressTimerRef = useRef<number | null>(null);
    const longPressStartRef = useRef<{ x: number; y: number } | null>(null);
    const longPressTriggeredRef = useRef(false);
    const [playheadRenderTick, setPlayheadRenderTick] = useState(0);
    const [contextMenuPosition, setContextMenuPosition] = useState<TimelineContextMenuPosition | null>(null);
    const [contextMenuTarget, setContextMenuTarget] = useState<TimelineContextTarget | null>(null);

    const focus = props.project?.focus;
    const isNestedTimeline = Boolean(focus && !focus.isRoot);
    const focusLabel =
        typeof focus?.identifier === "string" && focus.identifier.trim().length > 0
            ? focus.identifier
            : isNestedTimeline
                ? "Nested Clip"
                : "Scene 1";
    const playheadPosition = Number(props.project?.activeTimeline?.playheadPosition ?? 1);
    const frameRate = Number(props.project?.framerate ?? 0);
    const timelineMeta =
        frameRate > 0
            ? `Frame ${playheadPosition} | ${frameRate.toFixed(1)} fps`
            : `Frame ${playheadPosition}`;
    const [frameInputValue, setFrameInputValue] = useState(String(playheadPosition));
    const [fpsInputValue, setFpsInputValue] = useState(
        (frameRate > 0 ? frameRate : DEFAULT_FRAME_RATE).toFixed(1)
    );

    const getCurrentFrameSizeMode = (): TimelineFrameSizeMode => {
        const guiElement = window?.Wick?.GUIElement;
        if (!guiElement) {
            return "normal";
        }

        const currentWidth = Number(guiElement.GRID_DEFAULT_CELL_WIDTH);
        if (currentWidth === Number(guiElement.GRID_SMALL_CELL_WIDTH)) {
            return "small";
        }
        if (currentWidth === Number(guiElement.GRID_LARGE_CELL_WIDTH)) {
            return "large";
        }
        return "normal";
    };

    const frameSizeMode = getCurrentFrameSizeMode();
    const fillGapsMode: TimelineFillGapsMode =
        props.project?.activeTimeline?.fillGapsMethod === "auto_extend"
            ? "auto_extend"
            : "blank_frames";
    const initializeIcons = (): void => {
        const Icons = window?.Wick?.GUIElement?.Icons;

        if (!Icons) {
            return;
        }

        Icons.loadIcon("hide_layer", iconShown);
        Icons.loadIcon("show_layer", iconHidden);
        Icons.loadIcon("lock_layer", iconUnlock);
        Icons.loadIcon("unlock_layer", iconLock);
        Icons.loadIcon("copy_frame_forward", iconCopyForward);
        Icons.loadIcon("cut_frame", iconSplit);
        Icons.loadIcon("delete_frame", iconDelete);
        Icons.loadIcon("add_tween", iconLayerTween);
        Icons.loadIcon("small_frames", iconSmallFrames);
        Icons.loadIcon("normal_frames", iconNormalFrames);
        Icons.loadIcon("large_frames", iconLargeFrames);
        Icons.loadIcon("frame_size_menu", iconFrameSizeMenu);
        Icons.loadIcon("gap_fill_menu_blank_frames", iconGapFillMenuBlankFrames);
        Icons.loadIcon("gap_fill_menu_extend_frames", iconGapFillMenuExtendFrames);
        Icons.loadIcon("gap_fill_empty_frames", iconGapFillBlankFrames);
        Icons.loadIcon("gap_fill_extend_frames", iconGapFillExtendFrames);
    };

    const onProjectModified = (): void => {
        props.projectDidChange({ actionName: "Timeline Action" });
    };

    const onProjectSoftModified = (): void => {
        if (props.project && props.project.view) {
            props.project.view.render?.();
        }
    };

    const detachCurrentProject = (): void => {
        if (currentAttachedProject.current && currentAttachedProject.current.guiElement) {
            currentAttachedProject.current.guiElement.onProjectModified = () => { };
            currentAttachedProject.current.guiElement.onProjectSoftModified = () => { };
        }

        currentAttachedProject.current = null;
    };

    const attachProject = (): void => {
        const { project } = props;
        const canvasContainerElem = canvasContainer.current;

        if (!project || !project.guiElement || !canvasContainerElem) {
            return;
        }

        if (project !== currentAttachedProject.current) {
            initializeIcons();
            detachCurrentProject();
            currentAttachedProject.current = project;

            if (typeof project.guiElement.onProjectModified === "function") {
                project.guiElement.onProjectModified(onProjectModified);
            } else {
                project.guiElement.onProjectModified = onProjectModified;
            }

            if (typeof project.guiElement.onProjectSoftModified === "function") {
                project.guiElement.onProjectSoftModified(onProjectSoftModified);
            } else {
                project.guiElement.onProjectSoftModified = onProjectSoftModified;
            }
        }

        project.guiElement.canvasContainer = canvasContainerElem;

        if (typeof project.guiElement.draw === "function") {
            project.guiElement.draw();
        }
    };

    useEffect(() => {
        attachProject();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        attachProject();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.project]);

    useEffect(() => {
        return () => {
            detachCurrentProject();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setFrameInputValue(String(Math.max(1, Math.round(playheadPosition))));
    }, [playheadPosition]);

    useEffect(() => {
        const normalizedFps = frameRate > 0 ? frameRate : DEFAULT_FRAME_RATE;
        setFpsInputValue(normalizedFps.toFixed(1));
    }, [frameRate]);

    const { connectDropTarget, isOver } = props;

    const closeContextMenu = (): void => {
        setContextMenuPosition(null);
        setContextMenuTarget(null);
    };

    const clearLongPressTimer = (): void => {
        if (longPressTimerRef.current !== null) {
            window.clearTimeout(longPressTimerRef.current);
            longPressTimerRef.current = null;
        }
    };

    const clearLongPressState = (): void => {
        clearLongPressTimer();
        longPressStartRef.current = null;
    };

    const clampContextMenuPosition = (
        clientX: number,
        clientY: number
    ): TimelineContextMenuPosition => {
        if (typeof window === "undefined") {
            return { x: clientX, y: clientY };
        }

        const maxX = Math.max(
            CONTEXT_MENU_MARGIN_PX,
            window.innerWidth - CONTEXT_MENU_WIDTH_PX - CONTEXT_MENU_MARGIN_PX
        );
        const maxY = Math.max(
            CONTEXT_MENU_MARGIN_PX,
            window.innerHeight - CONTEXT_MENU_HEIGHT_PX - CONTEXT_MENU_MARGIN_PX
        );

        return {
            x: Math.min(Math.max(CONTEXT_MENU_MARGIN_PX, clientX), maxX),
            y: Math.min(Math.max(CONTEXT_MENU_MARGIN_PX, clientY), maxY),
        };
    };

    const resolveContextTarget = (
        clientX: number,
        clientY: number
    ): TimelineContextTarget => {
        const defaultTarget: TimelineContextTarget = {
            area: "unknown",
            layerIndex: null,
            playheadPosition: null,
            frame: null,
            label: "Current Selection",
        };

        const projectGUI = props.project?.guiElement;
        const activeTimeline = props.project?.activeTimeline;
        const rect = projectGUI?._canvas?.getBoundingClientRect?.();

        if (!projectGUI || !activeTimeline || !rect) {
            return defaultTarget;
        }

        const guiElement = window?.Wick?.GUIElement;
        const gridCellWidth = Number(guiElement?.GRID_DEFAULT_CELL_WIDTH ?? 38);
        const gridCellHeight = Number(guiElement?.GRID_DEFAULT_CELL_HEIGHT ?? 42);
        const layersWidth = Number(guiElement?.LAYERS_CONTAINER_WIDTH ?? 160);
        const breadcrumbsHeight = Number(guiElement?.BREADCRUMBS_HEIGHT ?? 30);
        const numberLineHeight = Number(guiElement?.NUMBER_LINE_HEIGHT ?? 35);
        const scrollX = Number(projectGUI.scrollX ?? 0);
        const scrollY = Number(projectGUI.scrollY ?? 0);

        const canvasX = clientX - rect.left;
        const canvasY = clientY - rect.top;
        const timelineRowsY = canvasY - breadcrumbsHeight - numberLineHeight + scrollY;

        let area: TimelineContextTargetArea = "unknown";
        let layerIndex: number | null = null;
        let playheadPosition: number | null = null;

        const inNumberLine =
            canvasY >= breadcrumbsHeight &&
            canvasY < breadcrumbsHeight + numberLineHeight &&
            canvasX >= layersWidth;

        const inTimelineRows = canvasY >= breadcrumbsHeight + numberLineHeight;

        if (inNumberLine) {
            area = "numberLine";
            playheadPosition = Math.max(
                1,
                Math.floor((canvasX - layersWidth + scrollX) / gridCellWidth) + 1
            );
        } else if (inTimelineRows) {
            const candidateRow = Math.floor(timelineRowsY / gridCellHeight);
            if (candidateRow >= 0 && candidateRow < activeTimeline.layers.length) {
                layerIndex = candidateRow;
            }

            if (canvasX < layersWidth) {
                area = "layer";
            } else {
                area = "frame";
                playheadPosition = Math.max(
                    1,
                    Math.floor((canvasX - layersWidth + scrollX) / gridCellWidth) + 1
                );
            }
        }

        const resolvedLayerIndex =
            layerIndex !== null ? layerIndex : Number(activeTimeline.activeLayerIndex ?? 0);
        const resolvedLayer = activeTimeline.layers?.[resolvedLayerIndex];
        const frameAtTarget =
            playheadPosition !== null &&
            resolvedLayer &&
            typeof resolvedLayer.getFrameAtPlayheadPosition === "function"
                ? resolvedLayer.getFrameAtPlayheadPosition(playheadPosition)
                : null;

        const labelParts: string[] = [];
        if (layerIndex !== null) {
            labelParts.push(`Layer ${layerIndex + 1}`);
        }
        if (playheadPosition !== null) {
            labelParts.push(`Frame ${playheadPosition}`);
        }

        return {
            area,
            layerIndex,
            playheadPosition,
            frame: frameAtTarget,
            label: labelParts.length > 0 ? labelParts.join(" | ") : "Current Selection",
        };
    };

    const applyContextTarget = (
        target: TimelineContextTarget | null,
        options: {
            selectFrame?: boolean;
            clearSelectionWithoutFrame?: boolean;
        } = {}
    ): void => {
        if (!target || !props.project?.activeTimeline) {
            return;
        }

        const activeTimeline = props.project.activeTimeline;
        const selection = props.project.selection;
        let didSoftUpdate = false;

        if (
            typeof target.playheadPosition === "number" &&
            activeTimeline.playheadPosition !== target.playheadPosition
        ) {
            activeTimeline.playheadPosition = target.playheadPosition;
            didSoftUpdate = true;
        }

        if (
            typeof target.layerIndex === "number" &&
            activeTimeline.activeLayerIndex !== target.layerIndex
        ) {
            activeTimeline.activeLayerIndex = target.layerIndex;
            didSoftUpdate = true;
        }

        const activeLayer = activeTimeline.layers?.[activeTimeline.activeLayerIndex];
        const frameAtTarget =
            typeof target.playheadPosition === "number" &&
            activeLayer &&
            typeof activeLayer.getFrameAtPlayheadPosition === "function"
                ? activeLayer.getFrameAtPlayheadPosition(target.playheadPosition)
                : null;

        if (options.selectFrame) {
            if (frameAtTarget && selection) {
                const selectedFrames = selection.getSelectedObjects?.("Frame") ?? [];
                const frameAlreadySelected =
                    selectedFrames.length === 1 && selectedFrames[0] === frameAtTarget;

                if (!frameAlreadySelected) {
                    selection.clear();
                    selection.select(frameAtTarget);
                    activeLayer?.activate?.();
                    didSoftUpdate = true;
                }
            } else if (options.clearSelectionWithoutFrame && selection) {
                const selectedTimelineObjects =
                    selection.getSelectedObjects?.("Timeline") ?? [];
                if (selectedTimelineObjects.length > 0) {
                    selection.clear();
                    didSoftUpdate = true;
                }
            }
        }

        if (didSoftUpdate) {
            props.project.view?.render?.();
            props.project.guiElement?.draw?.();
            setPlayheadRenderTick((tick) => tick + 1);
        }
    };

    const openContextMenu = (clientX: number, clientY: number): void => {
        setContextMenuTarget(resolveContextTarget(clientX, clientY));
        setContextMenuPosition(clampContextMenuPosition(clientX, clientY));
    };

    const runMenuAction = (action: () => void): void => {
        action();
        closeContextMenu();
    };

    const setPlayheadPosition = (nextPosition: number): void => {
        const activeTimeline = props.project?.activeTimeline;
        if (!activeTimeline) {
            return;
        }

        const normalizedPosition = Math.max(1, Math.round(nextPosition));
        if (activeTimeline.playheadPosition === normalizedPosition) {
            return;
        }

        activeTimeline.playheadPosition = normalizedPosition;
        props.project?.guiElement?.checkForPlayheadAutoscroll?.();
        props.project?.view?.render?.();
        props.project?.guiElement?.draw?.();
        setPlayheadRenderTick((tick) => tick + 1);
    };

    const commitFrameInput = (): void => {
        const parsedFrame = Number.parseInt(frameInputValue, 10);
        if (!Number.isFinite(parsedFrame) || parsedFrame < 1) {
            setFrameInputValue(String(Math.max(1, Math.round(playheadPosition))));
            return;
        }

        const normalizedFrame = Math.max(1, Math.round(parsedFrame));
        setFrameInputValue(String(normalizedFrame));
        setPlayheadPosition(normalizedFrame);
    };

    const setTimelineFrameSizeMode = (mode: TimelineFrameSizeMode): void => {
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

        props.project?.view?.render?.();
        props.project?.guiElement?.draw?.();
        setPlayheadRenderTick((tick) => tick + 1);
    };

    const setTimelineGapFillMode = (mode: TimelineFillGapsMode): void => {
        const activeTimeline = props.project?.activeTimeline;
        if (!activeTimeline || activeTimeline.fillGapsMethod === mode) {
            return;
        }

        activeTimeline.fillGapsMethod = mode;
        props.projectDidChange({
            actionName:
                mode === "auto_extend"
                    ? "Set Timeline Gap Fill Mode (Extend Frames)"
                    : "Set Timeline Gap Fill Mode (Blank Frames)",
        });
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
            Math.max(MIN_FRAME_RATE, Math.round(parsedFps * 10) / 10)
        );
        setFpsInputValue(normalizedFps.toFixed(1));

        if (!props.project || Number(props.project.framerate ?? 0) === normalizedFps) {
            return;
        }

        props.project.framerate = normalizedFps;
        props.projectDidChange({ actionName: "Set Project Framerate" });
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
            Math.max(MIN_FRAME_RATE, Math.round(nextFps * 10) / 10)
        );
        setFpsInputValue(normalizedFps.toFixed(1));

        if (!props.project || Number(props.project.framerate ?? 0) === normalizedFps) {
            return;
        }

        props.project.framerate = normalizedFps;
        props.projectDidChange({ actionName: "Set Project Framerate" });
    };

    const stepPlayheadBackwards = (): void => {
        props.movePlayheadBackwards();
        setPlayheadRenderTick((tick) => tick + 1);
    };

    const stepPlayheadForwards = (): void => {
        props.movePlayheadForwards();
        setPlayheadRenderTick((tick) => tick + 1);
    };

    const focusParentTimeline = (): void => {
        props.focusTimelineOfParentClip();
        setPlayheadRenderTick((tick) => tick + 1);
    };

    const runContextualFrameAction = (
        action: () => void,
        options: {
            selectFrame?: boolean;
            clearSelectionWithoutFrame?: boolean;
        } = {}
    ): void => {
        applyContextTarget(contextMenuTarget, options);
        action();
    };

    const hasTargetFrame = Boolean(contextMenuTarget?.frame);
    const canCreateTweenAtTarget = Boolean(contextMenuTarget?.frame?.contentful);
    const canMovePlayheadToTarget =
        contextMenuTarget?.playheadPosition !== null &&
        typeof contextMenuTarget?.playheadPosition === "number";

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
            action: stepPlayheadBackwards,
        },
        {
            id: "next-frame",
            label: "Next Frame",
            glyph: ">",
            action: stepPlayheadForwards,
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
            action: focusParentTimeline,
        });
    }

    const handleTimelineContextMenu = (
        event: React.MouseEvent<HTMLDivElement>
    ): void => {
        event.preventDefault();
        openContextMenu(event.clientX, event.clientY);
    };

    const handleTimelineTouchStart = (
        event: React.TouchEvent<HTMLDivElement>
    ): void => {
        if (event.touches.length !== 1) {
            clearLongPressState();
            return;
        }

        const touch = event.touches.item(0);
        if (!touch) {
            clearLongPressState();
            return;
        }
        const touchX = touch.clientX;
        const touchY = touch.clientY;
        longPressTriggeredRef.current = false;
        longPressStartRef.current = {
            x: touchX,
            y: touchY,
        };
        clearLongPressTimer();

        longPressTimerRef.current = window.setTimeout(() => {
            longPressTimerRef.current = null;
            longPressTriggeredRef.current = true;
            openContextMenu(touchX, touchY);
        }, LONG_PRESS_MS);
    };

    const handleTimelineTouchMove = (
        event: React.TouchEvent<HTMLDivElement>
    ): void => {
        if (!longPressStartRef.current || event.touches.length !== 1) {
            clearLongPressState();
            return;
        }

        const touch = event.touches.item(0);
        if (!touch) {
            clearLongPressState();
            return;
        }
        const deltaX = Math.abs(touch.clientX - longPressStartRef.current.x);
        const deltaY = Math.abs(touch.clientY - longPressStartRef.current.y);

        if (
            deltaX > LONG_PRESS_CANCEL_DISTANCE_PX ||
            deltaY > LONG_PRESS_CANCEL_DISTANCE_PX
        ) {
            clearLongPressState();
        }
    };

    const handleTimelineTouchEnd = (
        event: React.TouchEvent<HTMLDivElement>
    ): void => {
        if (longPressTriggeredRef.current) {
            event.preventDefault();
            longPressTriggeredRef.current = false;
        }

        clearLongPressState();
    };

    const handleTimelineTouchCancel = (): void => {
        longPressTriggeredRef.current = false;
        clearLongPressState();
    };

    useEffect(() => {
        return () => {
            clearLongPressState();
        };
    }, []);

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

    const timeline = (
        <div id="animation-timeline-container" aria-label="Timeline">
            {isOver && <div className="drag-drop-overlay" />}
            <div className="timeline-flash-shell" data-playhead-render-tick={playheadRenderTick}>
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
                                action={focusParentTimeline}
                            />
                        )}
                        <span className="timeline-flash-scene-label">Scene</span>
                        <span className="timeline-flash-scene-name">{focusLabel}</span>
                    </div>
                    <div className="timeline-flash-meta">{timelineMeta}</div>
                </div>

                <div className="timeline-flash-actions" role="toolbar" aria-label="Timeline Actions">
                    <ActionButton
                        id="timeline-step-backward"
                        text="<"
                        color="tool"
                        tooltip="Previous Frame"
                        tooltipPlace="top"
                        className="timeline-flash-action-button timeline-flash-text-action"
                        action={stepPlayheadBackwards}
                    />
                    <ActionButton
                        id="timeline-step-forward"
                        text=">"
                        color="tool"
                        tooltip="Next Frame"
                        tooltipPlace="top"
                        className="timeline-flash-action-button timeline-flash-text-action"
                        action={stepPlayheadForwards}
                    />
                    <ActionButton
                        id="timeline-insert-keyframe"
                        icon="split"
                        color="tool"
                        tooltip="Insert Keyframe"
                        tooltipPlace="top"
                        className="timeline-flash-action-button"
                        action={props.cutFrame}
                    />
                    <ActionButton
                        id="timeline-insert-blank-keyframe"
                        icon="create"
                        color="tool"
                        tooltip="Insert Blank Keyframe"
                        tooltipPlace="top"
                        className="timeline-flash-action-button"
                        action={props.insertBlankFrame}
                    />
                    <ActionButton
                        id="timeline-add-tween-keyframe"
                        icon="layerTween"
                        color="tool"
                        tooltip="Add Tween Keyframe"
                        tooltipPlace="top"
                        className="timeline-flash-action-button"
                        action={props.addTweenKeyframe}
                    />
                    <ActionButton
                        id="timeline-create-tween"
                        icon="tween"
                        color="tool"
                        tooltip="Create Tween"
                        tooltipPlace="top"
                        className="timeline-flash-action-button"
                        action={props.createTween}
                    />
                    <ActionButton
                        id="timeline-delete-selection"
                        icon="delete"
                        color="tool"
                        tooltip="Delete Selected Frames/Objects"
                        tooltipPlace="top"
                        className="timeline-flash-action-button"
                        action={props.deleteSelectedObjects}
                    />
                </div>

                <div
                    id="animation-timeline"
                    ref={canvasContainer}
                    onContextMenu={handleTimelineContextMenu}
                    onTouchStart={handleTimelineTouchStart}
                    onTouchMove={handleTimelineTouchMove}
                    onTouchEnd={handleTimelineTouchEnd}
                    onTouchCancel={handleTimelineTouchCancel}
                    aria-label="Animation timeline grid"
                />

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
                        <button
                            type="button"
                            className="timeline-flash-footer-button"
                            onClick={commitFrameInput}
                        >
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
                            onClick={() => setTimelineFrameSizeMode("small")}
                            aria-pressed={frameSizeMode === "small"}
                        >
                            <img src={iconSmallFrames} alt="" className="timeline-flash-footer-choice-icon" />
                            S
                        </button>
                        <button
                            type="button"
                            className={`timeline-flash-footer-choice ${frameSizeMode === "normal" ? "active" : ""}`}
                            onClick={() => setTimelineFrameSizeMode("normal")}
                            aria-pressed={frameSizeMode === "normal"}
                        >
                            <img src={iconNormalFrames} alt="" className="timeline-flash-footer-choice-icon" />
                            M
                        </button>
                        <button
                            type="button"
                            className={`timeline-flash-footer-choice ${frameSizeMode === "large" ? "active" : ""}`}
                            onClick={() => setTimelineFrameSizeMode("large")}
                            aria-pressed={frameSizeMode === "large"}
                        >
                            <img src={iconLargeFrames} alt="" className="timeline-flash-footer-choice-icon" />
                            L
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
                            onClick={() => setTimelineGapFillMode("auto_extend")}
                            aria-pressed={fillGapsMode === "auto_extend"}
                        >
                            <img
                                src={iconGapFillExtendFrames}
                                alt=""
                                className="timeline-flash-footer-choice-icon"
                            />
                            Extend
                        </button>
                        <button
                            type="button"
                            className={`timeline-flash-footer-choice ${fillGapsMode === "blank_frames" ? "active" : ""}`}
                            onClick={() => setTimelineGapFillMode("blank_frames")}
                            aria-pressed={fillGapsMode === "blank_frames"}
                        >
                            <img
                                src={iconGapFillBlankFrames}
                                alt=""
                                className="timeline-flash-footer-choice-icon"
                            />
                            Blank
                        </button>
                    </div>

                    <div className="timeline-flash-footer-hint">
                        Right-click or long-press any frame for contextual actions
                    </div>
                </div>

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
                                    <ToolIcon
                                        className="timeline-context-menu-item-icon"
                                        name={item.icon}
                                    />
                                ) : (
                                    <span className="timeline-context-menu-item-glyph">
                                        {item.glyph}
                                    </span>
                                )}
                                <span className="timeline-context-menu-item-label">
                                    {item.label}
                                </span>
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

    if (connectDropTarget) {
        const wrapped = connectDropTarget(timeline);
        return (wrapped ?? timeline) as JSX.Element;
    }

    return timeline;
};

const timelineTarget = {
    drop(props: TimelineProps, monitor: DropTargetMonitor) {
        const dropLocation = monitor.getClientOffset();
        if (!dropLocation) {
            return;
        }

        const draggedItem = monitor.getItem() as DraggedSoundItem | null;
        if (!draggedItem?.uuid) {
            return;
        }

        props.dragSoundOntoTimeline(
            draggedItem.uuid,
            dropLocation.x,
            dropLocation.y,
            true
        );
    },
    hover(props: TimelineProps, monitor: DropTargetMonitor) {
        const dropLocation = monitor.getClientOffset();
        if (!dropLocation) {
            return;
        }

        const draggedItem = monitor.getItem() as DraggedSoundItem | null;
        if (!draggedItem?.uuid) {
            return;
        }

        props.dragSoundOntoTimeline(
            draggedItem.uuid,
            dropLocation.x,
            dropLocation.y,
            false
        );
    },
};

function collect(
    connect: DropTargetConnector,
    monitor: DropTargetMonitor
): InjectedProps {
    return {
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver(),
    };
}

const DroppableTimeline = DropTarget(
    DragDropTypes.TIMELINE,
    timelineTarget,
    collect
)(Timeline);

export type { TimelineOwnProps };

export default DroppableTimeline as ComponentType<TimelineOwnProps>;
