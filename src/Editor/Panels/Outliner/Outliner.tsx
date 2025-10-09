import { Component, type KeyboardEvent as ReactKeyboardEvent, type MouseEvent as ReactMouseEvent } from "react";
import classNames from "classnames";

import { OutlinerObject } from "./OutlinerObject/OutlinerObject";
import OutlinerTitle from "./OutlinerTitle/OutlinerTitle";
import OutlinerDisplay from "./OutlinerRow/OutlinerRowTypes/OutlinerDisplay";

import "./_outliner.scss";

type WickNode = Record<string, any>;
type WickTimeline = Record<string, any>;
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

interface OutlinerState {
    dragging: boolean;
    highlighted: WickNode | null;
    display: DisplayOptions;
    collapsedUUIDs: Record<string, boolean>;
}

type ToggleEvent = ReactMouseEvent<Element, MouseEvent> | ReactKeyboardEvent<Element>;

class Outliner extends Component<OutlinerProps, OutlinerState> {
    private maxDepth = 3;

    constructor(props: OutlinerProps) {
        super(props);

        this.state = {
            dragging: false,
            highlighted: null,
            display: {
                path: true,
                button: true,
                clip: true,
                text: true,
                image: true,
            },
            collapsedUUIDs: {},
        };
    }

    private getDepth = (object: WickNode): number => {
        let depth = 0;
        let current: WickNode | undefined = object;
        while (current && current.parent) {
            current = current.parent;
            depth += 1;
        }
        return depth;
    };

    private getChildIndex = (parent: WickNode, child: WickNode): number => {
        const children = parent.getChildren();
        const rawIndex = children.indexOf(child);
        if (parent.classname === "Frame") {
            return children.length - 1 - rawIndex;
        }
        return rawIndex;
    };

    private getCommonAncestorIndices = (
        object1: WickNode,
        object2: WickNode
    ): { ancestor: WickNode; indices1: number[]; indices2: number[] } => {
        let ob1: WickNode | undefined = object1;
        let ob2: WickNode | undefined = object2;
        let depth1 = this.getDepth(object1);
        let depth2 = this.getDepth(object2);
        const indices1: number[] = [];
        const indices2: number[] = [];

        while (ob1 && depth1 > depth2) {
            const parent = ob1.parent as WickNode | undefined;
            if (!parent) break;
            indices1.unshift(this.getChildIndex(parent, ob1));
            ob1 = parent;
            depth1 -= 1;
        }

        while (ob2 && depth2 > depth1) {
            const parent = ob2.parent as WickNode | undefined;
            if (!parent) break;
            indices2.unshift(this.getChildIndex(parent, ob2));
            ob2 = parent;
            depth2 -= 1;
        }

        while (ob1 && ob2 && ob1 !== ob2) {
            const parent1 = ob1.parent as WickNode | undefined;
            const parent2 = ob2.parent as WickNode | undefined;
            if (!parent1 || !parent2) {
                break;
            }
            indices1.unshift(this.getChildIndex(parent1, ob1));
            indices2.unshift(this.getChildIndex(parent2, ob2));
            ob1 = parent1;
            ob2 = parent2;
        }

        return {
            ancestor: ob1 ?? object1,
            indices1,
            indices2,
        };
    };

    private getObjectAtIndices = (
        ancestor: WickTimeline,
        indices: number[],
        length: number
    ): WickNode | null => {
        let object: WickNode | WickTimeline = ancestor;
        for (let j = 0; j < length; j++) {
            const rawIndex = indices[j];
            if (typeof rawIndex !== "number") {
                return null;
            }
            const children = object.getChildren();
            if (rawIndex < 0 || rawIndex >= children.length) {
                return null;
            }
            const index =
                object.classname === "Frame"
                    ? children.length - 1 - rawIndex
                    : rawIndex;
            object = children[index];
        }
        return object as WickNode;
    };

    private indicesEqual = (a: number[], b: number[]): boolean => {
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

    private isActive = (object: WickNode | null): boolean => {
        if (!object) {
            return false;
        }

        if (object.classname === "Layer") {
            return true;
        }

        if (object.classname === "Frame") {
            const playhead = this.props.project.activeTimeline.playheadPosition;
            return (
                typeof object.start === "number" &&
                typeof object.end === "number" &&
                object.start <= playhead &&
                playhead <= object.end
            );
        }

        if (object.classname === "Path") {
            const pathKey = typeof object.pathType === "string" ? object.pathType : "path";
            return Boolean(this.state.display[pathKey] ?? false);
        }

        const key = typeof object.classname === "string" ? object.classname.toLowerCase() : "";
        return Boolean(this.state.display[key] ?? false);
    };

    private setActiveLayerFromObject = (object: WickNode): void => {
        const layerIndex =
            object.classname === "Layer"
                ? object.index
                : object.parentLayer && typeof object.parentLayer.index === "number"
                    ? object.parentLayer.index
                    : undefined;
        if (typeof layerIndex === "number") {
            this.props.setActiveLayerIndex(layerIndex);
        }
    };

    select = (event: ToggleEvent, indices: number[]): void => {
        if (!indices.length) {
            return;
        }

        const object = this.getObjectAtIndices(
            this.props.project.activeTimeline,
            indices,
            indices.length
        );

        if (!object) {
            return;
        }

        const keyboardOrMouseEvent = event as ReactMouseEvent<Element> & ReactKeyboardEvent<Element>;

        const highlighted = this.state.highlighted;
        const isSameDepth =
            highlighted && this.getDepth(highlighted) === this.getDepth(object);

        if (keyboardOrMouseEvent.shiftKey && highlighted && isSameDepth) {
            const { ancestor, indices1, indices2 } = this.getCommonAncestorIndices(highlighted, object);
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
                keepGoing = !this.indicesEqual(workingIndices1, workingIndices2);
                const candidate = this.getObjectAtIndices(ancestor, workingIndices1, workingIndices1.length);
                if (candidate && this.isActive(candidate)) {
                    toSelect.push(candidate);
                }
                const lastIndex = workingIndices1.length - 1;
                if (lastIndex < 0) {
                    break;
                }
                const currentValue = workingIndices1[lastIndex] ?? 0;
                workingIndices1[lastIndex] = currentValue + 1;
                for (let i = workingIndices1.length - 1; i >= 0; i -= 1) {
                    const container = this.getObjectAtIndices(ancestor, workingIndices1, i) ?? ancestor;
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
                this.props.selectObjects(toSelect);
            }
            this.setState({ highlighted: object });
            this.setActiveLayerFromObject(object);
            return;
        }

        if (keyboardOrMouseEvent.ctrlKey && highlighted && isSameDepth) {
            if (object.isSelected) {
                this.props.deselectObjects([object]);
            } else {
                this.props.selectObjects([object]);
                this.setActiveLayerFromObject(object);
            }
            this.setState({ highlighted: object });
            return;
        }

        this.props.clearSelection();
        this.props.selectObjects([object]);
        this.setState({ highlighted: object });
        this.setActiveLayerFromObject(object);
    };

    toggleDropdown = (_event: ToggleEvent, indices: number[]): void => {
        const object = this.getObjectAtIndices(
            this.props.project.activeTimeline,
            indices,
            indices.length
        );
        if (!object) {
            return;
        }
        this.setState((prevState) => {
            const next = { ...prevState.collapsedUUIDs };
            if (next[object.uuid]) {
                delete next[object.uuid];
            } else {
                next[object.uuid] = true;
            }
            return { collapsedUUIDs: next };
        });
    };

    render() {
        const { project, className } = this.props;

        const timelineChildren = project.activeTimeline.getChildren();

        return (
            <div className={classNames("docked-pane outliner", className)} aria-label="Outliner">
                <div className="outliner-title-container">
                    <OutlinerTitle />
                </div>

                <div className="outliner-body">
                    <div className="outliner-item">
                        <OutlinerDisplay
                            tooltip="Display"
                            display={this.state.display}
                            onChange={(display) => {
                                this.setState({ display });
                            }}
                        />
                    </div>

                    <div className="outliner-item">
                        {timelineChildren.map((layer: WickNode, index: number) => (
                            <OutlinerObject
                                key={layer.uuid}
                                clearSelection={this.props.clearSelection}
                                selectObjects={this.props.selectObjects}
                                editScript={this.props.editScript}
                                playhead={project.activeTimeline.playheadPosition}
                                depth={1}
                                maxDepth={this.maxDepth}
                                display={this.state.display}
                                highlighted={this.state.highlighted}
                                toggle={(toggleEvent: ToggleEvent, indices: number[], property: OutlinerToggleProperty) => {
                                    indices.unshift(index);
                                    if (property === "select") {
                                        this.select(toggleEvent, indices);
                                    } else if (property === "dropdown") {
                                        this.toggleDropdown(toggleEvent, indices);
                                    } else if (property === "locked" || property === "hidden") {
                                        const target = this.getObjectAtIndices(
                                            project.activeTimeline,
                                            indices,
                                            indices.length
                                        );
                                        if (target) {
                                            if (property === "locked") {
                                                this.props.toggleLocked(target);
                                            } else {
                                                this.props.toggleHidden(target);
                                            }
                                        }
                                    }
                                }}
                                data={layer}
                                isActive={this.isActive}
                                collapsedUUIDs={this.state.collapsedUUIDs}
                                dragging={this.state.dragging}
                                setDragging={(dragging: boolean) => {
                                    this.setState({ dragging });
                                }}
                                setFocusObject={this.props.setFocusObject}
                                setActiveLayerIndex={this.props.setActiveLayerIndex}
                                moveSelection={this.props.moveSelection}
                            />
                        ))}
                    </div>
                </div>
            </div>
        );
    }
}

export default Outliner;

export type { WickNode, WickTimeline, DisplayOptions };
