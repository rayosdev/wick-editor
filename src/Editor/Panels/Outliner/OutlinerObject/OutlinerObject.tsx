import {
    useRef,
    useState,
    type KeyboardEvent as ReactKeyboardEvent,
    type MouseEvent as ReactMouseEvent,
} from "react";
import classNames from "classnames";
import {
    DragPreviewImage,
    useDrag,
    useDrop,
    type DropTargetMonitor,
    type DragObjectWithType,
} from "react-dnd";

import DragDropTypes from "Editor/DragDropTypes";

import OutlinerDropdown from "./OutlinerDropdown/OutlinerDropdown";
import OutlinerWidget from "../OutlinerWidget/OutlinerWidget";

import layerIcon from "resources/object-icons/layer.svg";
import frameIcon from "resources/object-icons/frame.svg";
import pathIcon from "resources/object-icons/path.svg";
import buttonIcon from "resources/object-icons/button.svg";
import clipIcon from "resources/object-icons/clip.svg";
import textIcon from "resources/object-icons/text.svg";
import imageIcon from "resources/object-icons/image.svg";

import layerImage from "resources/object-icons/layer.png";
import frameImage from "resources/object-icons/frame.png";
import pathImage from "resources/object-icons/path.png";
import buttonImage from "resources/object-icons/button.png";
import clipImage from "resources/object-icons/clip.png";
import textImage from "resources/object-icons/text.png";
import imageImage from "resources/object-icons/image.png";

import scriptIcon from "resources/outliner-icons/script.svg";
import soundIcon from "resources/outliner-icons/sound.svg";

import type { DisplayOptions, WickNode, WickTimeline } from "../Outliner";

const icons: Record<string, string> = {
    layer: layerIcon,
    frame: frameIcon,
    path: pathIcon,
    button: buttonIcon,
    clip: clipIcon,
    text: textIcon,
    image: imageIcon,
};

const images: Record<string, string> = {
    layer: layerImage,
    frame: frameImage,
    path: pathImage,
    button: buttonImage,
    clip: clipImage,
    text: textImage,
    image: imageImage,
};

export type OutlinerToggleProperty = "select" | "dropdown" | "locked" | "hidden";

type ToggleEvent = ReactMouseEvent<Element, MouseEvent> | ReactKeyboardEvent<Element>;

type DragItem = DragObjectWithType & {
    type: string;
    uuid?: string;
    files?: File[] | FileList;
};

interface OutlinerObjectProps {
    clearSelection: () => void;
    selectObjects: (objects: WickNode[]) => void;
    editScript: (scriptName: string) => void;
    playhead: number;
    depth: number;
    maxDepth: number;
    display: DisplayOptions;
    highlighted: WickNode | null;
    toggle: (event: ToggleEvent, indices: number[], property: OutlinerToggleProperty) => void;
    data: WickNode;
    isActive: (object: WickNode | null) => boolean;
    collapsedUUIDs: Record<string, boolean>;
    dragging: boolean;
    setDragging: (dragging: boolean) => void;
    setFocusObject: (object: WickNode) => void;
    setActiveLayerIndex: (index: number) => void;
    moveSelection: (parent: WickNode | WickTimeline, index: number) => void;
}

export const OutlinerObject = ({
    clearSelection,
    selectObjects,
    editScript,
    playhead,
    depth,
    maxDepth,
    display,
    highlighted,
    toggle,
    data,
    isActive,
    collapsedUUIDs,
    dragging,
    setDragging,
    setFocusObject,
    setActiveLayerIndex,
    moveSelection,
}: OutlinerObjectProps) => {
    const ref = useRef<HTMLDivElement | null>(null);
    const [focused, setFocused] = useState(false);
    const [hoverLocation, setHoverLocation] = useState<"hover-top" | "hover-bottom" | "hover-middle" | null>(null);

    const sourceType = String(DragDropTypes.GET_OUTLINER_SOURCE({ data }));

    const [, drag, preview] = useDrag<DragItem, unknown, unknown>({
        item: { type: sourceType, uuid: data.uuid },
        begin: () => {
            setDragging(true);

            if (!data.isSelected) {
                clearSelection();
                selectObjects([data]);
                if (data.classname === "Layer" && typeof data.index === "number") {
                    setActiveLayerIndex(data.index);
                } else if (data.parentLayer && typeof data.parentLayer.index === "number") {
                    setActiveLayerIndex(data.parentLayer.index);
                }
            }

            return { type: sourceType, uuid: data.uuid };
        },
        end: () => {
            setDragging(false);
        },
    });

    const [dropCollected, dropRef] = useDrop<DragItem, void, { isOverCurrent: boolean }>({
        accept: DragDropTypes.GET_OUTLINER_TARGETS({ data }) as string[],
        drop: (item: DragItem, monitor: DropTargetMonitor) => {
            if (monitor.didDrop()) {
                return;
            }

            const type = String(DragDropTypes.GET_OUTLINER_SOURCE({ data }));
            const itemType = String(item.type);
            if (itemType === type) {
                if (!ref.current) {
                    return;
                }
                const hoverBoundingRect = ref.current.getBoundingClientRect();
                const hoverMiddle =
                    (hoverBoundingRect.bottom - hoverBoundingRect.top - (hoverLocation ? 5 : 0)) / 2;
                const clientOffset = monitor.getClientOffset();
                if (!clientOffset) {
                    return;
                }
                const hoverClientY = clientOffset.y - hoverBoundingRect.top;

                const parent = data.parent ?? null;
                if (!parent || !("getChildren" in parent)) {
                    return;
                }
                const parentChildren = parent.getChildren();
                const parentIndex = parentChildren.indexOf(data);

                if ((hoverClientY <= hoverMiddle) !== (type === "object")) {
                    moveSelection(parent as WickNode | WickTimeline, parentIndex);
                } else {
                    moveSelection(parent as WickNode | WickTimeline, parentIndex + 1);
                }
            } else if (type === "layer") {
                if (itemType === "object" && data.activeFrame) {
                    moveSelection(data.activeFrame, data.activeFrame.getChildren().length);
                }
            } else if (type === "frame") {
                if (itemType === "object") {
                    moveSelection(data, data.getChildren().length);
                }
            }
        },
        collect: (monitor: DropTargetMonitor) => ({
            isOverCurrent: monitor.isOver({ shallow: true }),
        }),
        hover: (item: DragItem, monitor: DropTargetMonitor) => {
            const types = ["object", "frame", "layer"];
            const targetType = String(DragDropTypes.GET_OUTLINER_SOURCE({ data }));
            const itemType = String(item.type);

            if (types.indexOf(itemType) === types.indexOf(targetType)) {
                if (!ref.current) {
                    return;
                }
                const hoverBoundingRect = ref.current.getBoundingClientRect();
                const hoverMiddle =
                    (hoverBoundingRect.bottom - hoverBoundingRect.top - (hoverLocation ? 5 : 0)) / 2;
                const clientOffset = monitor.getClientOffset();
                if (!clientOffset) {
                    return;
                }
                const hoverClientY = clientOffset.y - hoverBoundingRect.top;

                setHoverLocation(hoverClientY <= hoverMiddle ? "hover-top" : "hover-bottom");
            } else {
                setHoverLocation("hover-middle");
            }
        },
    });

    const { isOverCurrent } = dropCollected;
    const drop = dropRef;

    const objectName = data.classname === "Layer" ? data.name : data.identifier;

    let empty = true;
    const children: WickNode[] = data.getChildren();
    if (depth < maxDepth) {
        for (let i = 0; i < children.length; i += 1) {
            const childNode = children[i];
            if (childNode && isActive(childNode)) {
                empty = false;
                break;
            }
        }
    }

    const iconKey = data.classname === "Path" ? (data.pathType ?? "path") : data.classname.toLowerCase();
    const typeIcon = icons[iconKey] ?? icons.path;
    const typeDragImage = (images[iconKey] ?? images.path) ?? "";
    const isDraggingSelection =
        dragging &&
        (data.isSelected ||
            data.parent?.isSelected ||
            (data.parent && "parent" in data.parent && (data.parent as WickNode).parent?.isSelected));

    drop(ref);

    return (
        <>
            <DragPreviewImage connect={preview} src={typeDragImage} />
            <div
                ref={ref}
                className={classNames(
                    "outliner-object-container",
                    "relative h-full w-full",
                    hoverLocation !== "hover-middle" && isOverCurrent && hoverLocation,
                    hoverLocation === "hover-top" &&
                        isOverCurrent &&
                        "border-t-2 border-solid border-[#00ADEF]",
                    hoverLocation === "hover-bottom" &&
                        isOverCurrent &&
                        "border-b-2 border-solid border-[#00ADEF]"
                )}
            >
                <div
                    className={classNames(
                        "outliner-object",
                        "relative z-0 box-border flex h-[20px] items-center border-y border-solid border-y-editor-primary bg-editor-secondary leading-[20px] has-hover:cursor-pointer has-hover:bg-editor-tertiary",
                        { "object-selected": data.isSelected && !focused },
                        { "!border !border-solid !border-wick-green": data.isSelected && !focused },
                        { "object-dragging": isDraggingSelection },
                        { highlighted: highlighted === data },
                        { "opacity-50": isDraggingSelection },
                        { "bg-editor-tertiary": highlighted === data },
                        hoverLocation === "hover-middle" && isOverCurrent && hoverLocation,
                        hoverLocation === "hover-middle" &&
                            isOverCurrent &&
                            "bg-[#00ADEF]"
                    )}
                >
                    <button
                        aria-label="select outliner object"
                        ref={drag}
                        className="outliner-object-selector absolute left-0 top-0 h-[20px] w-full border-none bg-transparent"
                        onClick={(event: ReactMouseEvent<Element>) => {
                            toggle(event, [], "select");
                        }}
                        onFocus={() => setFocused(true)}
                        onBlur={() => setFocused(false)}
                        onKeyPress={(event) => {
                            if (event.which === 13 && event.ctrlKey) {
                                toggle(event, [], "select");
                            }
                        }}
                    />
                    <OutlinerDropdown
                        empty={empty}
                        collapsed={Boolean(collapsedUUIDs[data.uuid])}
                        toggle={() => toggle({} as ToggleEvent, [], "dropdown")}
                    />

                    <img
                        className="row-icon relative z-[-1] ml-1 w-[14px]"
                        src={typeIcon}
                        alt={data.classname}
                    />

                    {objectName && (
                        <span className="outliner-name relative z-[-1] ml-2 text-[14px] text-editor-text-primary">
                            {objectName}
                        </span>
                    )}

                    <span className="outliner-buttons-container relative z-0 ml-auto flex h-full flex-row items-center">
                        {data.classname === "Layer" && (
                            <OutlinerWidget
                                onClick={() => {
                                    toggle({} as ToggleEvent, [], "hidden");
                                }}
                                on={!data.hidden}
                                icon="outliner-hide"
                                tooltip="Hide Layer"
                            />
                        )}
                        {data.classname === "Layer" && (
                            <OutlinerWidget
                                onClick={() => {
                                    toggle({} as ToggleEvent, [], "locked");
                                }}
                                on={!data.locked}
                                icon="outliner-lock"
                                tooltip="Lock Layer"
                            />
                        )}
                        {(data.classname === "Button" || data.classname === "Clip") && (
                            <OutlinerWidget
                                onClick={() => {
                                    setFocusObject(data);
                                }}
                                icon="edit-timeline"
                                tooltip="Edit Timeline"
                            />
                        )}
                        {Boolean(data.sound) && (
                            <img
                                className="outliner-sound-icon mr-1 mt-0 h-5 align-top"
                                src={soundIcon}
                                alt="sound"
                            />
                        )}
                        {data.hasContentfulScripts && (
                            <input
                                type="image"
                                className="outliner-script-icon mt-0 h-[14px]"
                                src={scriptIcon}
                                alt="script"
                                onClick={() => {
                                    clearSelection();
                                    selectObjects([data]);
                                    if (data.classname === "Layer" && typeof data.index === "number") {
                                        setActiveLayerIndex(data.index);
                                    } else if (data.parentLayer && typeof data.parentLayer.index === "number") {
                                        setActiveLayerIndex(data.parentLayer.index);
                                    }
                                    const scriptName = data.scripts?.[0]?.name;
                                    if (scriptName) {
                                        editScript(scriptName);
                                    }
                                }}
                            />
                        )}
                    </span>
                </div>

                {!empty && !collapsedUUIDs[data.uuid] && (
                    <div className="indentation origin-top animate-outliner-expand pl-5">
                        {children.map((child: WickNode, index: number) => {
                            const object =
                                data.classname === "Frame"
                                    ? children[children.length - index - 1]
                                    : child;

                            if (!object) {
                                return null;
                            }

                            return (
                                isActive(object) && (
                                    <OutlinerObject
                                        key={object.uuid}
                                        clearSelection={clearSelection}
                                        selectObjects={selectObjects}
                                        editScript={editScript}
                                        playhead={playhead}
                                        depth={depth + 1}
                                        maxDepth={maxDepth}
                                        display={display}
                                        highlighted={highlighted}
                                        toggle={(event, indices, property) => {
                                            indices.unshift(index);
                                            toggle(event, indices, property);
                                        }}
                                        data={object}
                                        isActive={isActive}
                                        collapsedUUIDs={collapsedUUIDs}
                                        dragging={dragging}
                                        setDragging={setDragging}
                                        setFocusObject={setFocusObject}
                                        setActiveLayerIndex={setActiveLayerIndex}
                                        moveSelection={moveSelection}
                                    />
                                )
                            );
                        })}
                    </div>
                )}
            </div>
        </>
    );
};

export default OutlinerObject;
