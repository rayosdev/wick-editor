import React, {
    useEffect,
    useMemo,
    useState,
    type KeyboardEvent as ReactKeyboardEvent,
    type MouseEvent as ReactMouseEvent,
} from "react";
import classNames from "classnames";

import { OutlinerObject } from "./OutlinerObject/OutlinerObject";
import OutlinerTitle from "./OutlinerTitle/OutlinerTitle";
import OutlinerFilterMenu from "./OutlinerFilterMenu/OutlinerFilterMenu";

type WickScriptEntry = {
    name?: string;
};

interface WickNode {
    uuid: string;
    classname: string;
    name?: string | null;
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
    classname?: string;
    parent?: WickNode | WickTimeline | null;
    isSelected?: boolean;
    playheadPosition: number;
    getChildren: () => WickNode[];
}
type DisplayKey = "path" | "button" | "clip" | "text" | "image";
type DisplayOptions = Record<DisplayKey, boolean>;
type OutlinerToggleProperty = "select" | "dropdown" | "locked" | "hidden";
type VisibleOutlinerEntry = {
    object: WickNode;
    indices: number[];
    depth: number;
    parent: WickNode | WickTimeline | null;
    hasVisibleChildren: boolean;
};

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
    const [isPointerInsideOutliner, setIsPointerInsideOutliner] = useState<boolean>(false);
    const [display, setDisplay] = useState<DisplayOptions>({
        path: true,
        button: true,
        clip: true,
        text: true,
        image: true,
    });
    const [collapsedUUIDs, setCollapsedUUIDs] = useState<Record<string, boolean>>({});
    const { project, className } = props;
    const timelineChildren = project.activeTimeline.getChildren();

    const toDisplayKey = (value: string): DisplayKey | null => {
        switch (value.toLowerCase()) {
            case "path":
            case "button":
            case "clip":
            case "text":
            case "image":
                return value.toLowerCase() as DisplayKey;
            default:
                return null;
        }
    };

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
            const pathKey = toDisplayKey(
                typeof object.pathType === "string" ? object.pathType : "path"
            ) ?? "path";
            return display[pathKey];
        }

        const key = toDisplayKey(
            typeof object.classname === "string" ? object.classname : ""
        );
        return key ? display[key] : false;
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

    const selectSingleObject = (object: WickNode): void => {
        props.clearSelection();
        props.selectObjects([object]);
        setHighlighted(object);
        setActiveLayerFromObject(object);
    };

    const getDisplayOrderedChildren = (parent: WickNode | WickTimeline): WickNode[] => {
        const children = parent.getChildren();
        if (parent.classname === "Frame") {
            return children.slice().reverse();
        }
        return children;
    };

    const getVisibleChildren = (parent: WickNode, depth: number): WickNode[] => {
        if (depth >= maxDepth) {
            return [];
        }
        return getDisplayOrderedChildren(parent).filter((child) => isActive(child));
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

    const visibleEntries = useMemo<VisibleOutlinerEntry[]>(() => {
        const entries: VisibleOutlinerEntry[] = [];
        const traverse = (
            object: WickNode,
            indices: number[],
            depth: number,
            parent: WickNode | WickTimeline | null
        ): void => {
            if (!isActive(object)) {
                return;
            }

            const visibleChildren = getVisibleChildren(object, depth);
            entries.push({
                object,
                indices,
                depth,
                parent,
                hasVisibleChildren: visibleChildren.length > 0,
            });

            if (collapsedUUIDs[object.uuid]) {
                return;
            }

            visibleChildren.forEach((child, childIndex) => {
                traverse(child, [...indices, childIndex], depth + 1, object);
            });
        };

        timelineChildren.forEach((layer, layerIndex) => {
            traverse(layer, [layerIndex], 1, project.activeTimeline);
        });

        return entries;
    }, [collapsedUUIDs, timelineChildren, project.activeTimeline, isActive]);

    useEffect(() => {
        if (!isPointerInsideOutliner) {
            return;
        }

        const isTextInputTarget = (target: EventTarget | null): boolean => {
            if (!(target instanceof HTMLElement)) {
                return false;
            }

            const tagName = target.tagName;
            return (
                tagName === "INPUT" ||
                tagName === "TEXTAREA" ||
                tagName === "SELECT" ||
                target.isContentEditable
            );
        };

        const handleKeyDown = (event: KeyboardEvent): void => {
            if (isTextInputTarget(event.target)) {
                return;
            }

            const key = event.key;
            const navKeys = new Set([
                "ArrowUp",
                "ArrowDown",
                "ArrowLeft",
                "ArrowRight",
                "Home",
                "End",
                "Enter",
                " ",
                "Spacebar",
            ]);

            if (!navKeys.has(key)) {
                return;
            }

            if (visibleEntries.length === 0) {
                return;
            }

            const currentIndex = visibleEntries.findIndex(
                (entry) =>
                    entry.object.uuid === highlighted?.uuid ||
                    Boolean(entry.object.isSelected)
            );
            const fallbackIndex = currentIndex >= 0 ? currentIndex : 0;
            const currentEntry = visibleEntries[fallbackIndex];
            if (!currentEntry) {
                return;
            }

            const selectEntry = (entry: VisibleOutlinerEntry): void => {
                select(
                    {
                        shiftKey: event.shiftKey,
                        ctrlKey: event.ctrlKey || event.metaKey,
                    } as ToggleEvent,
                    [...entry.indices]
                );
            };

            if (key === "ArrowUp") {
                const nextIndex = Math.max(0, fallbackIndex - 1);
                const entry = visibleEntries[nextIndex];
                if (entry) {
                    selectEntry(entry);
                }
            } else if (key === "ArrowDown") {
                const nextIndex = Math.min(visibleEntries.length - 1, fallbackIndex + 1);
                const entry = visibleEntries[nextIndex];
                if (entry) {
                    selectEntry(entry);
                }
            } else if (key === "Home") {
                const entry = visibleEntries[0];
                if (entry) {
                    selectEntry(entry);
                }
            } else if (key === "End") {
                const entry = visibleEntries[visibleEntries.length - 1];
                if (entry) {
                    selectEntry(entry);
                }
            } else if (key === "ArrowRight") {
                if (currentEntry.hasVisibleChildren) {
                    if (collapsedUUIDs[currentEntry.object.uuid]) {
                        setCollapsedUUIDs((prev) => {
                            const next = { ...prev };
                            delete next[currentEntry.object.uuid];
                            return next;
                        });
                    } else {
                        const childEntry = visibleEntries[fallbackIndex + 1];
                        if (
                            childEntry &&
                            childEntry.parent &&
                            "uuid" in childEntry.parent &&
                            childEntry.parent.uuid === currentEntry.object.uuid
                        ) {
                            selectSingleObject(childEntry.object);
                        }
                    }
                }
            } else if (key === "ArrowLeft") {
                if (currentEntry.hasVisibleChildren && !collapsedUUIDs[currentEntry.object.uuid]) {
                    setCollapsedUUIDs((prev) => ({
                        ...prev,
                        [currentEntry.object.uuid]: true,
                    }));
                } else if (currentEntry.parent && "uuid" in currentEntry.parent) {
                    const parent = currentEntry.parent as WickNode;
                    if (isActive(parent)) {
                        selectSingleObject(parent);
                    }
                }
            } else if (key === "Enter" || key === " ") {
                if (key === " " && currentEntry.hasVisibleChildren) {
                    if (collapsedUUIDs[currentEntry.object.uuid]) {
                        setCollapsedUUIDs((prev) => {
                            const next = { ...prev };
                            delete next[currentEntry.object.uuid];
                            return next;
                        });
                    } else {
                        setCollapsedUUIDs((prev) => ({
                            ...prev,
                            [currentEntry.object.uuid]: true,
                        }));
                    }
                } else {
                    selectSingleObject(currentEntry.object);
                }
            } else {
                return;
            }

            event.preventDefault();
            event.stopPropagation();
        };

        window.addEventListener("keydown", handleKeyDown, { capture: true });
        return () => {
            window.removeEventListener("keydown", handleKeyDown, { capture: true });
        };
    }, [
        collapsedUUIDs,
        highlighted?.uuid,
        isPointerInsideOutliner,
        isActive,
        select,
        selectSingleObject,
        visibleEntries,
    ]);

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
                    "relative z-20 flex items-center justify-between pr-2 shadow-[0px_2px_4px_black]"
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
                <div
                    className="h-full w-full"
                    onPointerEnter={() => setIsPointerInsideOutliner(true)}
                    onPointerLeave={() => setIsPointerInsideOutliner(false)}
                >
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
        </div>
    );
};

export default Outliner;

export type { WickNode, WickTimeline, DisplayKey, DisplayOptions };
