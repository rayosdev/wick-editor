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

import { useRef, useEffect, useImperativeHandle, forwardRef } from "react";
import {
    DropTarget,
    type ConnectDropTarget,
    type DropTargetMonitor,
} from "react-dnd";
import type { XYCoord } from "react-dnd";
import DragDropTypes from "Editor/DragDropTypes";

import "./_canvas.scss";
import styles from "../../_wickbrand.module.scss";

type CanvasEventHandler = (...args: unknown[]) => void;

type CanvasViewLike = {
    canvasBGColor: string;
    canvasContainer: HTMLElement | null;
    resize: () => void;
    on: (event: string, handler: CanvasEventHandler) => void;
};

type WickProjectLike = {
    view: CanvasViewLike & {
        canvas?: HTMLCanvasElement | null;
    };
};

interface CanvasExternalProps {
    project: WickProjectLike;
    onRef: (instance: CanvasHandle | null) => void;
    projectDidChange: (options: { actionName: string }) => void;
    onEyedropperPickedColor: (event: unknown) => void;
    importProjectAsWickFile: (file: File) => void;
    createAssets: (
        files: File[],
        data: unknown[],
        options?: { create?: boolean; location?: XYCoord | null }
    ) => void;
    createImageFromAsset: (
        uuid: string,
        x: number,
        y: number,
        center?: boolean
    ) => void;
}

interface CanvasCollectedProps {
    connectDropTarget?: ConnectDropTarget;
    isOver?: boolean;
}

type CanvasProps = CanvasExternalProps & CanvasCollectedProps;

export interface CanvasHandle {
    // Empty for now - methods can be exposed here if needed
}

const Canvas = forwardRef<CanvasHandle, CanvasProps>((props, ref) => {
    const canvasContainer = useRef<HTMLDivElement>(null);
    const currentAttachedProject = useRef<WickProjectLike>();

    useImperativeHandle(ref, () => ({}), []);

    const attachProjectToComponent = (project: WickProjectLike): void => {
        if (!project || project === currentAttachedProject.current) {
            return;
        }

        currentAttachedProject.current = project;
        const view = project.view;

        const borderColor = styles.editorCanvasBorder;
        if (borderColor) {
            view.canvasBGColor = borderColor;
        }
        view.canvasContainer = canvasContainer.current;
        view.resize();

        view.on("canvasModified", (_event: unknown, actionName?: unknown) => {
            const label = typeof actionName === "string" ? actionName : "";
            props.projectDidChange({
                actionName: label
                    ? `Canvas Modified ${label}`
                    : "Canvas Modified",
            });
        });

        view.on("eyedropperPickedColor", (event: unknown) => {
            props.onEyedropperPickedColor(event);
        });
    };

    const updateCanvas = (project: WickProjectLike): void => {
        attachProjectToComponent(project);
    };

    useEffect(() => {
        attachProjectToComponent(props.project);
        updateCanvas(props.project);
        props.onRef(ref as any);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        updateCanvas(props.project);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.project]);

    const renderNode = (
        <div
            id="canvas-container-wrapper"
            style={{ width: "100%", height: "100%" }}
            aria-label="Canvas"
        >
            {props.isOver && <div className="drag-drop-overlay" />}
            <div id="wick-canvas-container" ref={canvasContainer}></div>
        </div>
    );

    if (props.connectDropTarget) {
        const connected = props.connectDropTarget(renderNode);
        if (connected) {
            return connected;
        }
    }

    return renderNode;
});

const canvasTarget = {
    drop(props: CanvasProps, monitor: DropTargetMonitor) {
        const dropLocation = monitor.getClientOffset();
        if (!dropLocation) {
            return;
        }

        const draggedItem = monitor.getItem() as {
            files?: File[] | FileList;
            uuid?: string;
        };

        const files = draggedItem?.files;
        if (files && "length" in files && files.length > 0) {
            const fileList = Array.from(files as FileList | File[]);
            const [firstFile] = fileList;

            if (firstFile && firstFile.name.endsWith(".wick")) {
                props.importProjectAsWickFile(firstFile);
            } else {
                props.createAssets(fileList, [], {
                    create: true,
                    location: dropLocation,
                });
            }
        } else if (draggedItem?.uuid) {
            props.createImageFromAsset(
                draggedItem.uuid,
                dropLocation.x,
                dropLocation.y
            );
        }
    },
};

function collect(connect: any, monitor: DropTargetMonitor): CanvasCollectedProps {
    return {
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver(),
    };
}

export default DropTarget(DragDropTypes.CANVAS, canvasTarget, collect)(Canvas);
