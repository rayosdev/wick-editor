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

import { useRef, useEffect, type ComponentType } from "react";
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

interface TimelineOwnProps {
    project: any;
    projectDidChange: (options: { actionName: string;[key: string]: unknown }) => void;
    projectData: WickProject;
    getSelectedTimelineObjects: () => TimelineObject[];
    setOnionSkinOptions: (options: OnionSkinOptions) => void;
    getOnionSkinOptions: () => OnionSkinOptions;
    setFocusObject: (object: WickClip | WickProject) => void;
    addTweenKeyframe: (frame: number) => void;
    onRef?: (instance: any) => void;
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

declare global {
    interface Window {
        Wick: any;
    }
}

const Timeline: React.FC<TimelineProps> = (props) => {
    const canvasContainer = useRef<HTMLDivElement>(null);
    const currentAttachedProject = useRef<any>(null);

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
            props.project.view.render();
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

    const { connectDropTarget, isOver } = props;

    const timeline = (
        <div id="animation-timeline-container" aria-label="Timeline">
            {isOver && <div className="drag-drop-overlay" />}
            <div id="animation-timeline" ref={canvasContainer} />
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
