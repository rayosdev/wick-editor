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

import { useState } from "react";
import classNames from "classnames";

import HotKeyInterface from "Editor/hotKeyMap";
import WickInputV2LegacyAdapter from "Editor/Util/WickInputV2/WickInputV2LegacyAdapter";
import ToolIcon from "Editor/Util/ToolIcon/ToolIcon";
import ToolboxBreak from "./ToolboxBreak/ToolboxBreak";
import ToolButton, { ToolButtonProps } from "./ToolButton/ToolButton";
import ToolSettings from "./ToolSettings/ToolSettings";
import CanvasActions, {
    CanvasActionsProps,
    CanvasAction,
    EditorActions,
} from "./CanvasActions/CanvasActions";
import PopupMenu from "Editor/Util/PopupMenu/PopupMenu";
import type { HotKeyMap } from "Editor/types/hotkeys";
import type { ToolSettingRestrictions } from "Editor/types";
import { createWickColor } from "Editor/Util/wickRuntime";

const TOOL_NAMES = [
    "cursor",
    "brush",
    "pencil",
    "eraser",
    "rectangle",
    "ellipse",
    "line",
    "pathcursor",
    "text",
    "fillbucket",
    "eyedropper",
] as const;

type ToolName = typeof TOOL_NAMES[number];
type ToolSettingValue = string | number | boolean | { rgba: string };

function createToolColorValue(color: string): ToolSettingValue {
    const wickColor = createWickColor(color);

    if (typeof wickColor === "string") {
        return wickColor;
    }

    if (typeof wickColor.rgba === "string") {
        return { rgba: wickColor.rgba };
    }

    return color;
}

const TOOL_TITLES: Record<ToolName, string> = {
    cursor: "Cursor",
    brush: "Brush",
    pencil: "Pencil",
    eraser: "Eraser",
    rectangle: "Rectangle",
    ellipse: "Ellipse",
    line: "Line",
    pathcursor: "Path Cursor",
    text: "Text",
    fillbucket: "Fill Bucket",
    eyedropper: "Eyedropper",
};

const TOOL_HOTKEY_ACTIONS: Record<ToolName, string> = {
    cursor: "activate-cursor",
    brush: "activate-brush",
    pencil: "activate-pencil",
    eraser: "activate-eraser",
    rectangle: "activate-rectangle",
    ellipse: "activate-ellipse",
    line: "activate-line",
    pathcursor: "activate-path-cursor",
    text: "activate-text",
    fillbucket: "activate-fillbucket",
    eyedropper: "activate-eyedropper",
};

const TOOL_DROPDOWN_KEYS = [
    "cursors",
    "brushes",
    "eraser",
    "shapes",
    "tools",
] as const;

type ToolDropdownKey = typeof TOOL_DROPDOWN_KEYS[number];

const isToolName = (value: string): value is ToolName =>
    (TOOL_NAMES as readonly string[]).includes(value);

interface ToolboxAction extends CanvasAction { }

type ToolboxEditorActions = Record<string, ToolboxAction>;

interface ToolboxProps
    extends Omit<CanvasActionsProps, "editorActions"> {
    renderSize: CanvasActionsProps["renderSize"];
    editorActions: ToolboxEditorActions;
    setActiveTool: (name: string) => void;
    getActiveToolName: () => string;
    activeToolName: string;
    keyMap: HotKeyMap;
    getToolSetting: (setting: string) => ToolSettingValue;
    setToolSetting: (setting: string, value: ToolSettingValue) => void;
    getToolSettingRestrictions: (setting: string) => ToolSettingRestrictions;
    toggleBrushModes: () => void;
    showBrushModes: boolean;
    colorPickerType: string;
    changeColorPickerType: (type: string) => void;
    updateLastColors: (color: string) => void;
    lastColorsUsed: string[];
}

type ToolDropdownConfig =
    | ToolName
    | {
        active: ToolName;
        options: ToolName[];
    };

const TOOL_BOX_CONTAINER_CLASSES =
    "tool-box-container h-full w-full overflow-hidden " +
    "[&_#tool-box-stroke-color-button]:rounded-[20px] [&_#tool-box-fill-color-button]:rounded-[20px]";
const TOOL_BOX_BASE_CLASSES =
    "tool-box flex h-full w-full overflow-x-hidden border-b-[4px] border-l-[4px] [border-bottom-style:solid] [border-left-style:solid] border-b-[#191919] border-l-[#191919] bg-editor-primary pl-[2px] pr-1";
const TOOL_BOX_LARGE_CLASSES =
    "tool-box tool-box-large flex-row items-center overflow-hidden";
const TOOL_BOX_MEDIUM_CLASSES =
    "tool-box tool-box-medium h-20 flex-col overflow-hidden";
const MEDIUM_TOOLBOX_ROW_CLASSES =
    "medium-toolbox-row flex h-1/2 w-full flex-row items-center border-b-[3px] [border-bottom-style:solid] border-b-[#191919] last:border-b-0";
const TOOL_COLLECTION_CONTAINER_CLASSES =
    "tool-collection-container flex h-full flex-row items-center";
const TOOLBOX_ITEM_CLASSES =
    "toolbox-item h-[30px] w-[30px] max-w-[30px] ml-[3px] mr-[3px]";
const TOOLBOX_DROPDOWN_ANCHOR_CLASSES = "tool-dropdown-anchor relative";
const TOOL_SELECTOR_POPOUT_CLASSES =
    "tool-selector-popout flex min-w-[180px] flex-col gap-[6px] bg-editor-primary p-[6px]";
const TOOL_SELECTOR_MENU_LIST_CLASSES =
    "tool-selector-menu-list flex flex-col gap-1";
const TOOL_SELECTOR_MENU_ITEM_CLASSES =
    "tool-selector-menu-item flex min-h-[34px] items-center gap-2 rounded-[4px] border-0 bg-transparent px-2 py-[6px] text-left font-nunito text-[12px] font-bold text-editor-text-primary has-hover:bg-[#4a4a4a] active:bg-editor-modal-gray [&.active]:!bg-[#4a4a4a] max-[800px]:min-h-10 max-[800px]:text-[13px]";
const TOOL_SELECTOR_MENU_ITEM_ICON_CLASSES =
    "tool-selector-menu-item-icon !h-4 !w-4 shrink-0";
const TOOL_SELECTOR_MENU_ITEM_LABEL_CLASSES =
    "tool-selector-menu-item-label flex-1";
const TOOL_SELECTOR_MENU_ITEM_HOTKEY_CLASSES =
    "tool-selector-menu-item-hotkey ml-[6px] font-nunito text-[10px] font-bold tracking-[0.02em] text-editor-text-secondary";
const COLOR_CONTAINER_CLASSES =
    "color-container toolbox-item float-left flex h-[25.5px] w-[25.5px] min-w-[25.5px] cursor-pointer items-center overflow-hidden ml-[3px] mr-[3px]";
const TOOLBOX_ACTIONS_RIGHT_CONTAINER_CLASSES =
    "toolbox-actions-right-container ml-auto flex h-full flex-row items-center";
const TOOLBOX_ACTIONS_RIGHT_CLASSES =
    "toolbox-actions-right flex flex-row items-center justify-center";
const BUMP_UP_NO_DROPDOWN_ICON_CLASSES = "bump-up-no-dropdown mb-[2.5px]";
const NOOP_TOOLBOX_ACTION: ToolboxAction = {
    icon: "none",
    tooltip: "",
    action: () => { },
};

const getEditorAction = (
    editorActions: ToolboxEditorActions,
    actionName: string
): ToolboxAction => {
    const action = editorActions[actionName];
    return action ?? NOOP_TOOLBOX_ACTION;
};

const getToolboxItemClassName = (isMobile: boolean): string =>
    classNames(TOOLBOX_ITEM_CLASSES, {
        mobile: isMobile,
        "mr-0": isMobile,
    });

const Toolbox: React.FC<ToolboxProps> = (props) => {
    const [dropdownSelector, setDropdownSelector] = useState<string | null>(null);

    const toolDropdowns: Record<ToolDropdownKey, ToolDropdownConfig> = {
        cursors: { active: "cursor", options: ["cursor", "pathcursor"] },
        brushes: { active: "brush", options: ["brush", "pencil"] },
        eraser: "eraser",
        shapes: {
            active: "rectangle",
            options: ["rectangle", "ellipse", "line", "text"],
        },
        tools: { active: "fillbucket", options: ["fillbucket", "eyedropper"] },
    };

    const getToolButtonBaseProps = (): Pick<
        ToolButtonProps,
        "setActiveTool" | "className" | "getActiveToolName" | "keyMap"
    > => {
        return {
            setActiveTool: props.setActiveTool,
            className: getToolboxItemClassName(props.renderSize === "small"),
            getActiveToolName: props.getActiveToolName,
            keyMap: props.keyMap,
        };
    };

    const getToolTooltip = (toolName: string): string => {
        return isToolName(toolName) ? TOOL_TITLES[toolName] : toolName;
    };

    const getPrimitiveToolSetting = (
        setting: string
    ): string | number | boolean => {
        const value = props.getToolSetting(setting);
        if (
            typeof value === "string" ||
            typeof value === "number" ||
            typeof value === "boolean"
        ) {
            return value;
        }

        if (
            typeof value === "object" &&
            value !== null &&
            "rgba" in value &&
            typeof (value as { rgba?: unknown }).rgba === "string"
        ) {
            return (value as { rgba: string }).rgba;
        }

        return "";
    };

    const setPrimitiveToolSetting = (
        setting: string,
        value: string | number | boolean
    ): void => {
        props.setToolSetting(setting, value);
    };

    const getToolSettingRestrictionsRecord = (
        setting: string
    ): Record<string, unknown> => {
        return props.getToolSettingRestrictions(setting) as Record<string, unknown>;
    };

    const renderToolButtonFromAction = (
        action: ToolboxAction
    ): JSX.Element => {
        const baseProps = getToolButtonBaseProps();
        return (
            <ToolButton
                {...baseProps}
                action={action.action}
                name={action.icon}
                tooltip={action.tooltip}
            />
        );
    };

    const getToolHotkey = (tool: ToolName): string => {
        const actionName = TOOL_HOTKEY_ACTIONS[tool];
        type HotKeyMapForLookup = Parameters<typeof HotKeyInterface.getHotKey>[0];
        const rawHotkey = HotKeyInterface.getHotKey(
            props.keyMap as HotKeyMapForLookup,
            actionName
        );
        if (!rawHotkey) {
            return "";
        }

        return HotKeyInterface.replaceKeys(rawHotkey).toUpperCase();
    };

    const getResolvedDropdownConfig = (
        dropdownConfig: ToolDropdownConfig,
        activeToolName: string
    ): { active: ToolName; options: ToolName[] } | null => {
        if (typeof dropdownConfig === "string") {
            return null;
        }

        const active =
            isToolName(activeToolName) && dropdownConfig.options.includes(activeToolName)
                ? activeToolName
                : dropdownConfig.active;

        return {
            active,
            options: dropdownConfig.options,
        };
    };

    const toggleDropdownSelector = (value: string): void => {
        setDropdownSelector((previous) =>
            previous === value ? null : value
        );
    };

    const renderToolButtons = (isMobile = false): JSX.Element => {
        const activeToolName = props.getActiveToolName();
        const baseProps = getToolButtonBaseProps();

        return (
            <div className={TOOL_COLLECTION_CONTAINER_CLASSES}>
                {TOOL_DROPDOWN_KEYS.map((key) => {
                    const dropdownConfig = toolDropdowns[key];
                    if (!dropdownConfig) {
                        return null;
                    }

                    if (typeof dropdownConfig === "string") {
                        const tooltip = getToolTooltip(dropdownConfig);
                        return (
                            <ToolButton
                                key={key}
                                {...baseProps}
                                iconClassName={BUMP_UP_NO_DROPDOWN_ICON_CLASSES}
                                className={getToolboxItemClassName(isMobile)}
                                name={dropdownConfig}
                                tooltip={tooltip}
                            />
                        );
                    }

                    const resolvedConfig = getResolvedDropdownConfig(
                        dropdownConfig,
                        activeToolName
                    );
                    if (!resolvedConfig) {
                        return null;
                    }

                    const selectorId = `${isMobile ? "mobile" : "desktop"}-more-${key}-popover-button`;
                    const selectorKey = `${isMobile ? "mobile" : "desktop"}-${key}`;
                    const tooltip = getToolTooltip(resolvedConfig.active);
                    return (
                        <div
                            key={key}
                            id={selectorId}
                            className={TOOLBOX_DROPDOWN_ANCHOR_CLASSES}
                        >
                            <ToolButton
                                {...baseProps}
                                className={getToolboxItemClassName(isMobile)}
                                action={() => {
                                    if (activeToolName === resolvedConfig.active) {
                                        toggleDropdownSelector(selectorKey);
                                        return;
                                    }

                                    setDropdownSelector(null);
                                    props.setActiveTool(resolvedConfig.active);
                                }}
                                secondaryAction={() => toggleDropdownSelector(selectorKey)}
                                name={resolvedConfig.active}
                                tooltip={tooltip}
                                dropdown={true}
                            />
                            <PopupMenu
                                mobile={isMobile}
                                isOpen={dropdownSelector === selectorKey}
                                toggle={() => toggleDropdownSelector(selectorKey)}
                                target={selectorId}
                                className={classNames(
                                    "tool-selector-menu-popover",
                                    { desktop: !isMobile }
                                )}
                            >
                                <div className={TOOL_SELECTOR_POPOUT_CLASSES}>
                                    <div className={TOOL_SELECTOR_MENU_LIST_CLASSES}>
                                        {resolvedConfig.options.map((option) => {
                                            const optionIsActive =
                                                activeToolName === option ||
                                                resolvedConfig.active === option;
                                            const hotkey = getToolHotkey(option);

                                            return (
                                                <button
                                                    key={option}
                                                    type="button"
                                                    className={classNames(
                                                        TOOL_SELECTOR_MENU_ITEM_CLASSES,
                                                        {
                                                            active: optionIsActive,
                                                            "!bg-[#4a4a4a]": optionIsActive,
                                                        }
                                                    )}
                                                    onClick={() => {
                                                        props.setActiveTool(option);
                                                        toggleDropdownSelector(selectorKey);
                                                    }}
                                                >
                                                    <ToolIcon
                                                        className={TOOL_SELECTOR_MENU_ITEM_ICON_CLASSES}
                                                        name={option}
                                                    />
                                                    <span
                                                        className={TOOL_SELECTOR_MENU_ITEM_LABEL_CLASSES}
                                                    >
                                                        {getToolTooltip(option)}
                                                    </span>
                                                    {hotkey && (
                                                        <span
                                                            className={TOOL_SELECTOR_MENU_ITEM_HOTKEY_CLASSES}
                                                        >
                                                            {hotkey}
                                                        </span>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </PopupMenu>
                        </div>
                    );
                })}
            </div>
        );
    };

    const renderColorPickers = (): JSX.Element => {
        const getColorValue = (settingName: string): string | undefined => {
            const setting = props.getToolSetting(settingName);
            if (
                typeof setting === "object" &&
                setting !== null &&
                "rgba" in setting &&
                typeof (setting as { rgba?: unknown }).rgba === "string"
            ) {
                return (setting as { rgba: string }).rgba;
            }

            return typeof setting === "string" ? setting : undefined;
        };

        const fillColor = getColorValue("fillColor");
        const strokeColor = getColorValue("strokeColor");

        return (
            <div className={TOOL_COLLECTION_CONTAINER_CLASSES}>
                <div
                    className={COLOR_CONTAINER_CLASSES}
                    id="fill-color-picker-container"
                >
                    <WickInputV2LegacyAdapter
                        type="color"
                        color={fillColor}
                        onChange={(color: string) => {
                            props.setToolSetting(
                                "fillColor",
                                createToolColorValue(color)
                            );
                        }}
                        id="tool-box-fill-color"
                        tooltipID="tool-box-fill-color"
                        tooltip="Fill Color"
                        placement="bottom"
                        colorPickerType={props.colorPickerType}
                        changeColorPickerType={props.changeColorPickerType}
                        updateLastColors={props.updateLastColors}
                        lastColorsUsed={props.lastColorsUsed}
                    />
                </div>
                <div
                    className={classNames(COLOR_CONTAINER_CLASSES, "box-border")}
                    id="stroke-color-picker-container"
                >
                    <WickInputV2LegacyAdapter
                        type="color"
                        color={strokeColor}
                        onChange={(color: string) => {
                            props.setToolSetting(
                                "strokeColor",
                                createToolColorValue(color)
                            );
                        }}
                        id="tool-box-stroke-color"
                        tooltipID="tool-box-stroke-color"
                        tooltip="Stroke Color"
                        placement="bottom"
                        stroke={true}
                        colorPickerType={props.colorPickerType}
                        changeColorPickerType={props.changeColorPickerType}
                        lastColorsUsed={props.lastColorsUsed}
                    />
                </div>
            </div>
        );
    };

    const renderCanvasActions = (): JSX.Element => {
        const canvasEditorActions: EditorActions = {
            sendToBack: getEditorAction(props.editorActions, "sendToBack"),
            sendBackward: getEditorAction(props.editorActions, "sendBackward"),
            sendForward: getEditorAction(props.editorActions, "sendForward"),
            sendToFront: getEditorAction(props.editorActions, "sendToFront"),
            flipHorizontal: getEditorAction(props.editorActions, "flipHorizontal"),
            flipVertical: getEditorAction(props.editorActions, "flipVertical"),
            booleanUnite: getEditorAction(props.editorActions, "booleanUnite"),
            booleanSubtract: getEditorAction(props.editorActions, "booleanSubtract"),
            booleanIntersect: getEditorAction(props.editorActions, "booleanIntersect"),
        };

        return (
            <div className={TOOLBOX_ACTIONS_RIGHT_CONTAINER_CLASSES}>
                <div className={TOOLBOX_ACTIONS_RIGHT_CLASSES}>
                    <div id="more-canvas-actions-popover-button">
                        {renderToolButtonFromAction(getEditorAction(props.editorActions, "showMoreCanvasActions"))}
                        <CanvasActions
                            renderSize={props.renderSize}
                            editorActions={canvasEditorActions}
                            showCanvasActions={props.showCanvasActions}
                            toggleCanvasActions={props.toggleCanvasActions}
                            previewPlaying={props.previewPlaying}
                        />
                    </div>

                    {renderToolButtonFromAction(getEditorAction(props.editorActions, "delete"))}
                    {renderToolButtonFromAction(getEditorAction(props.editorActions, "copy"))}
                    {renderToolButtonFromAction(getEditorAction(props.editorActions, "paste"))}
                    {renderToolButtonFromAction(getEditorAction(props.editorActions, "undo"))}
                    {renderToolButtonFromAction(getEditorAction(props.editorActions, "redo"))}
                </div>
            </div>
        );
    };

    const renderLargeToolbox = (): JSX.Element => {
        return (
            <div className={classNames(TOOL_BOX_BASE_CLASSES, TOOL_BOX_LARGE_CLASSES)}>
                {renderToolButtons(false)}

                <ToolboxBreak />

                {renderColorPickers()}

                <ToolboxBreak />

                <ToolSettings
                    renderSize={props.renderSize as "small" | "medium" | "large"}
                    activeTool={props.activeToolName}
                    getToolSetting={getPrimitiveToolSetting}
                    setToolSetting={setPrimitiveToolSetting}
                    getToolSettingRestrictions={getToolSettingRestrictionsRecord}
                    toggleBrushModes={props.toggleBrushModes}
                    showBrushModes={props.showBrushModes}
                    previewPlaying={props.previewPlaying}
                />

                {renderCanvasActions()}
            </div>
        );
    };

    const renderMediumToolbox = (): JSX.Element => {
        return (
            <div className={classNames(TOOL_BOX_BASE_CLASSES, TOOL_BOX_MEDIUM_CLASSES)}>
                <div className={MEDIUM_TOOLBOX_ROW_CLASSES}>
                    {renderToolButtons(false)}
                    <ToolboxBreak />
                    {renderColorPickers()}
                    <ToolboxBreak />
                </div>
                <div className={MEDIUM_TOOLBOX_ROW_CLASSES}>
                    <ToolSettings
                        renderSize={props.renderSize as "small" | "medium" | "large"}
                        activeTool={props.activeToolName}
                        getToolSetting={getPrimitiveToolSetting}
                        setToolSetting={setPrimitiveToolSetting}
                        getToolSettingRestrictions={getToolSettingRestrictionsRecord}
                        toggleBrushModes={props.toggleBrushModes}
                        showBrushModes={props.showBrushModes}
                        previewPlaying={props.previewPlaying}
                    />
                    {renderCanvasActions()}
                </div>
            </div>
        );
    };

    const renderSmallToolbox = (): JSX.Element => {
        return (
            <div className={classNames(TOOL_BOX_BASE_CLASSES, TOOL_BOX_MEDIUM_CLASSES)}>
                <div className={MEDIUM_TOOLBOX_ROW_CLASSES}>
                    {renderToolButtons(true)}
                    <ToolboxBreak className={classNames("toolbox-break", "mobile")} />
                    {renderCanvasActionsMobile()}
                </div>
                <div className={MEDIUM_TOOLBOX_ROW_CLASSES}>
                    {renderColorPickers()}
                    <ToolboxBreak className={classNames("toolbox-break", "mobile")} />
                    <ToolSettings
                        renderSize={props.renderSize as "small" | "medium" | "large"}
                        isMobile={true}
                        activeTool={props.activeToolName}
                        getToolSetting={getPrimitiveToolSetting}
                        setToolSetting={setPrimitiveToolSetting}
                        getToolSettingRestrictions={getToolSettingRestrictionsRecord}
                        toggleBrushModes={props.toggleBrushModes}
                        showBrushModes={props.showBrushModes}
                        previewPlaying={props.previewPlaying}
                    />
                </div>
            </div>
        );
    };

    const renderCanvasActionsMobile = (): JSX.Element => {
        const canvasEditorActions: EditorActions = {
            sendToBack: getEditorAction(props.editorActions, "sendToBack"),
            sendBackward: getEditorAction(props.editorActions, "sendBackward"),
            sendForward: getEditorAction(props.editorActions, "sendForward"),
            sendToFront: getEditorAction(props.editorActions, "sendToFront"),
            flipHorizontal: getEditorAction(props.editorActions, "flipHorizontal"),
            flipVertical: getEditorAction(props.editorActions, "flipVertical"),
            booleanUnite: getEditorAction(props.editorActions, "booleanUnite"),
            booleanSubtract: getEditorAction(props.editorActions, "booleanSubtract"),
            booleanIntersect: getEditorAction(props.editorActions, "booleanIntersect"),
        };

        return (
            <div className={TOOLBOX_ACTIONS_RIGHT_CONTAINER_CLASSES}>
                <div className={TOOLBOX_ACTIONS_RIGHT_CLASSES}>
                    {renderToolButtonFromAction(getEditorAction(props.editorActions, "undo"))}
                    {renderToolButtonFromAction(getEditorAction(props.editorActions, "redo"))}
                    <div id="more-canvas-actions-popover-button">
                        {renderToolButtonFromAction(getEditorAction(props.editorActions, "showMoreCanvasActions"))}
                        <CanvasActions
                            renderSize={props.renderSize}
                            editorActions={canvasEditorActions}
                            showCanvasActions={props.showCanvasActions}
                            toggleCanvasActions={props.toggleCanvasActions}
                            previewPlaying={props.previewPlaying}
                        />
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className={TOOL_BOX_CONTAINER_CLASSES} aria-label="Toolbox">
            {props.renderSize === "large"
                ? renderLargeToolbox()
                : props.renderSize === "medium"
                    ? renderMediumToolbox()
                    : renderSmallToolbox()}
        </div>
    );
};

export default Toolbox;
