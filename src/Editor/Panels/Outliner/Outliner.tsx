import React, { useState, type KeyboardEvent as ReactKeyboardEvent, type MouseEvent as ReactMouseEvent } from "react";
import classNames from "classnames";

import { OutlinerObject } from "./OutlinerObject/OutlinerObject";
import OutlinerTitle from "./OutlinerTitle/OutlinerTitle";
import OutlinerFilterMenu from "./OutlinerFilterMenu/OutlinerFilterMenu";

type WickScriptEntry = {
    name?: string;
};

interface WickNode {
    [key: string]: unknown;
    uuid: string;
    classname: string;
    name?: string;
    identifier?: string | null;
    parent?: WickNode | WickTimeline | null;
    parentLayer?: {
        index?: number;
    } | null;
    index?: number;
    start?: number;
    end?: number;
    pathType?: string;
    isSelected?: boolean;
    hidden?: boolean;
    locked?: boolean;
    activeFrame?: WickNode;
    sound?: unknown;
    hasContentfulScripts?: boolean;
    scripts?: WickScriptEntry[];
    getChildren: () => WickNode[];
}

interface WickTimeline {
    [key: string]: unknown;
    classname?: string;
    parent?: WickNode | WickTimeline | null;
    playheadPosition: number;
    getChildren: () => WickNode[];
}
type DisplayOptions = {
    path: boolean;
    button: boolean;
    clip: boolean;
    text: boolean;
    image: boolean;
    [key: string]: boolean;
};
type OutlinerToggleProperty = "select" | "dropdown" | "locked" | "hidden";

interface OutlinerProps {
    project: { activeTimeline: WickTimeline };
    selectObjects: (objects: WickNode[]) => void;
    deselectObjects: (objects: WickNode[]) => void;
    clearSelection: () => void;
    editScript: (scriptName: string) => void;
    setFocusObject: (object: WickNode) => void;
    setActiveLayerIndex: (index: number) => void;
    moveSelection: (parent: WickNode | WickTimeline, index: number) => void;
    toggleHidden: (layer: WickNode) => void;
    toggleLocked: (layer: WickNode) => void;
    className?: string;
}

type ToggleEvent = ReactMouseEvent<Element, MouseEvent> | ReactKeyboardEvent<Element>;

const Outliner: React.FC<OutlinerProps> = (props) => {
    const maxDepth = 3;

    const [dragging, setDragging] = useState<boolean>(false);
    const [highlighted, setHighlighted] = useState<WickNode | null>(null);
    const [display, setDisplay] = useState<DisplayOptions>({
        path: true,
        button: true,
        clip: true,
        text: true,
        image: true,
    });
    const [collapsedUUIDs, setCollapsedUUIDs] = useState<Record<string, boolean>>({});

    const getDepth = (object: WickNode): number => {
        let depth = 0;
        let current: WickNode | WickTimeline | undefined = object;
        while (current && current.parent) {
            current = current.parent;
            depth += 1;
        }
        return depth;
    };

    const getChildIndex = (parent: WickNode, child: WickNode): number => {
        const children = parent.getChildren();
        const rawIndex = children.indexOf(child);
        if (parent.classname === "Frame") {
            return children.length - 1 - rawIndex;
        }
        return rawIndex;
    };

    const getCommonAncestorIndices = (
        object1: WickNode,
        object2: WickNode
    ): { ancestor: WickNode | WickTimeline; indices1: number[]; indices2: number[] } => {
        let ob1: WickNode | undefined = object1;
        let ob2: WickNode | undefined = object2;
        let depth1 = getDepth(object1);
        let depth2 = getDepth(object2);
        const indices1: number[] = [];
        const indices2: number[] = [];

        while (ob1 && depth1 > depth2) {
            const parent = ob1.parent as WickNode | undefined;
            if (!parent) break;
            indices1.unshift(getChildIndex(parent, ob1));
            ob1 = parent;
            depth1 -= 1;
        }

        while (ob2 && depth2 > depth1) {
            const parent = ob2.parent as WickNode | undefined;
            if (!parent) break;
            indices2.unshift(getChildIndex(parent, ob2));
            ob2 = parent;
            depth2 -= 1;
        }

        while (ob1 && ob2 && ob1 !== ob2) {
            const parent1 = ob1.parent as WickNode | undefined;
            const parent2 = ob2.parent as WickNode | undefined;
            if (!parent1 || !parent2) {
                break;
            }
            indices1.unshift(getChildIndex(parent1, ob1));
            indices2.unshift(getChildIndex(parent2, ob2));
            ob1 = parent1;
            ob2 = parent2;
        }

        return {
            ancestor: ob1 ?? object1,
            indices1,
            indices2,
        };
    };

    const getObjectAtIndices = (
        ancestor: WickNode | WickTimeline,
        indices: number[],
        length: number
    ): WickNode | null => {
        let object: WickNode | WickTimeline = ancestor;
        for (let j = 0; j < length; j++) {
            const rawIndex = indices[j];
            if (typeof rawIndex !== "number") {
                return null;
            }
            const children: WickNode[] = object.getChildren();
            if (rawIndex < 0 || rawIndex >= children.length) {
                return null;
            }
            const index: number =
                object.classname === "Frame"
                    ? children.length - 1 - rawIndex
                    : rawIndex;
            const nextObject = children[index];
            if (!nextObject) {
                return null;
            }
            object = nextObject;
        }
        return object as WickNode;
    };

    const indicesEqual = (a: number[], b: number[]): boolean => {
        if (a.length !== b.length) {
            return false;
        }
        for (let i = 0; i < a.length; i += 1) {
            if (a[i] !== b[i]) {
                return false;
            }
        }
        return true;
    };

    const isActive = (object: WickNode | null): boolean => {
        if (!object) {
            return false;
        }

        if (object.classname === "Layer") {
            return true;
        }

        if (object.classname === "Frame") {
            const playhead = props.project.activeTimeline.playheadPosition;
            return (
                typeof object.start === "number" &&
                typeof object.end === "number" &&
                object.start <= playhead &&
                playhead <= object.end
            );
        }

        if (object.classname === "Path") {
            const pathKey = typeof object.pathType === "string" ? object.pathType : "path";
            return Boolean(display[pathKey] ?? false);
        }

        const key = typeof object.classname === "string" ? object.classname.toLowerCase() : "";
        return Boolean(display[key] ?? false);
    };

    const setActiveLayerFromObject = (object: WickNode): void => {
        const layerIndex =
            object.classname === "Layer"
                ? object.index
                : object.parentLayer && typeof object.parentLayer.index === "number"
                    ? object.parentLayer.index
                    : undefined;
        if (typeof layerIndex === "number") {
            props.setActiveLayerIndex(layerIndex);
        }
    };

    const select = (event: ToggleEvent, indices: number[]): void => {
        if (!indices.length) {
            return;
        }

        const object = getObjectAtIndices(
            props.project.activeTimeline,
            indices,
            indices.length
        );

        if (!object) {
            return;
        }

        const keyboardOrMouseEvent = event as ReactMouseEvent<Element> & ReactKeyboardEvent<Element>;

        const highlightedObject = highlighted;
        const isSameDepth =
            highlightedObject && getDepth(highlightedObject) === getDepth(object);

        if (keyboardOrMouseEvent.shiftKey && highlightedObject && isSameDepth) {
            const { ancestor, indices1, indices2 } = getCommonAncestorIndices(highlightedObject, object);
            if (!indices1.length || !indices2.length) {
                return;
            }

            let workingIndices1 = [...indices1];
            let workingIndices2 = [...indices2];

            if ((workingIndices1[0] ?? 0) > (workingIndices2[0] ?? 0)) {
                [workingIndices1, workingIndices2] = [workingIndices2, workingIndices1];
            }

            if (!workingIndices1.length) {
                workingIndices1.push(0);
            }
            if (!workingIndices2.length) {
                workingIndices2.push(0);
            }

            const toSelect: WickNode[] = [];
            let keepGoing = true;
            while (keepGoing) {
                keepGoing = !indicesEqual(workingIndices1, workingIndices2);
                const candidate = getObjectAtIndices(ancestor, workingIndices1, workingIndices1.length);
                if (candidate && isActive(candidate)) {
                    toSelect.push(candidate);
                }
                const lastIndex = workingIndices1.length - 1;
                if (lastIndex < 0) {
                    break;
                }
                const currentValue = workingIndices1[lastIndex] ?? 0;
                workingIndices1[lastIndex] = currentValue + 1;
                for (let i = workingIndices1.length - 1; i >= 0; i -= 1) {
                    const container = getObjectAtIndices(ancestor, workingIndices1, i) ?? ancestor;
                    const childCount = container.getChildren?.().length ?? 0;
                    const candidateIndex = workingIndices1[i] ?? 0;
                    if (candidateIndex >= childCount) {
                        workingIndices1[i] = 0;
                        if (i - 1 >= 0) {
                            const parentValue = workingIndices1[i - 1] ?? 0;
                            workingIndices1[i - 1] = parentValue + 1;
                        }
                    } else {
                        break;
                    }
                }
            }

            if (toSelect.length) {
                props.selectObjects(toSelect);
            }
            setHighlighted(object);
            setActiveLayerFromObject(object);
            return;
        }

        if (keyboardOrMouseEvent.ctrlKey && highlightedObject && isSameDepth) {
            if (object.isSelected) {
                props.deselectObjects([object]);
            } else {
                props.selectObjects([object]);
                setActiveLayerFromObject(object);
            }
            setHighlighted(object);
            return;
        }

        props.clearSelection();
        props.selectObjects([object]);
        setHighlighted(object);
        setActiveLayerFromObject(object);
    };

    const toggleDropdown = (_event: ToggleEvent, indices: number[]): void => {
        const object = getObjectAtIndices(
            props.project.activeTimeline,
            indices,
            indices.length
        );
        if (!object) {
            return;
        }
        setCollapsedUUIDs((prevCollapsedUUIDs) => {
            const next = { ...prevCollapsedUUIDs };
            if (next[object.uuid]) {
                delete next[object.uuid];
            } else {
                next[object.uuid] = true;
            }
            return next;
        });
    };

    const { project, className } = props;

    const timelineChildren = project.activeTimeline.getChildren();

    return (
        <div
            className={classNames(
                "docked-pane outliner box-border h-full w-full overflow-hidden border-r-[4px] border-solid border-[#191919] bg-editor-primary font-['Nunito_Sans'] [&.popout-outliner]:border-r-0",
                className
            )}
            aria-label="Outliner"
        >
            <div
                className={classNames(
                    "outliner-title-container",
                    "relative z-0 flex items-center justify-between pr-2 shadow-[0px_2px_4px_black]"
                )}
            >
                <OutlinerTitle />
                <OutlinerFilterMenu
                    display={display}
                    onChange={(display) => {
                        setDisplay(display);
                    }}
                />
            </div>

            <div className="outliner-body h-[calc(100%-28px)] w-full overflow-hidden text-editor-text-primary has-hover:overflow-y-auto">
                <div className="outliner-item flex flex-col border-b border-solid border-[#191919] px-[6px] py-[3px]">
                    {timelineChildren.map((layer: WickNode, index: number) => (
                        <OutlinerObject
                            key={layer.uuid}
                            clearSelection={props.clearSelection}
                            selectObjects={props.selectObjects}
                            editScript={props.editScript}
                            playhead={project.activeTimeline.playheadPosition}
                            depth={1}
                            maxDepth={maxDepth}
                            display={display}
                            highlighted={highlighted}
                            toggle={(toggleEvent: ToggleEvent, indices: number[], property: OutlinerToggleProperty) => {
                                indices.unshift(index);
                                if (property === "select") {
                                    select(toggleEvent, indices);
                                } else if (property === "dropdown") {
                                    toggleDropdown(toggleEvent, indices);
                                } else if (property === "locked" || property === "hidden") {
                                    const target = getObjectAtIndices(
                                        project.activeTimeline,
                                        indices,
                                        indices.length
                                    );
                                    if (target) {
                                        if (property === "locked") {
                                            props.toggleLocked(target);
                                        } else {
                                            props.toggleHidden(target);
                                        }
                                    }
                                }
                            }}
                            data={layer}
                            isActive={isActive}
                            collapsedUUIDs={collapsedUUIDs}
                            dragging={dragging}
                            setDragging={(dragging: boolean) => {
                                setDragging(dragging);
                            }}
                            setFocusObject={props.setFocusObject}
                            setActiveLayerIndex={props.setActiveLayerIndex}
                            moveSelection={props.moveSelection}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Outliner;

export type { WickNode, WickTimeline, DisplayOptions };
