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

import "./_toolbox.scss";
import "bootstrap/dist/css/bootstrap.min.css";

import WickInput from "Editor/Util/WickInput/WickInput";
import ToolIcon from "Editor/Util/ToolIcon/ToolIcon";
import ToolboxBreak from "./ToolboxBreak/ToolboxBreak";
import ToolButton, { ToolButtonProps } from "./ToolButton/ToolButton";
import ToolSettings from "./ToolSettings/ToolSettings";
import CanvasActions, {
    CanvasActionsProps,
    CanvasAction,
    EditorActions as CanvasEditorActions,
} from "./CanvasActions/CanvasActions";
import PopupMenu from "Editor/Util/PopupMenu/PopupMenu";
import type { HotKeyMap } from "Editor/types/hotkeys";
import type { ToolSettingRestrictions } from "Editor/types";

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

interface ToolboxEditorActions extends CanvasEditorActions {
    showMoreCanvasActions: ToolboxAction;
    delete: ToolboxAction;
    copy: ToolboxAction;
    paste: ToolboxAction;
    undo: ToolboxAction;
    redo: ToolboxAction;
}

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
            className: classNames("toolbox-item", {
                mobile: props.renderSize === "small",
            }),
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

    const renderToolButtons = (): JSX.Element => {
        const baseProps = getToolButtonBaseProps();

        return (
            <div className="tool-collection-container">
                {TOOL_NAMES.map((tool) => (
                    <ToolButton
                        key={tool}
                        {...baseProps}
                        name={tool}
                        tooltip={getToolTooltip(tool)}
                    />
                ))}
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
            <div className="tool-collection-container">
                <div
                    className="color-container toolbox-item"
                    id="fill-color-picker-container"
                >
                    <WickInput
                        type="color"
                        color={fillColor}
                        onChange={(color: string) => {
                            props.setToolSetting(
                                "fillColor",
                                new window.Wick.Color(color)
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
                    className="color-container toolbox-item"
                    id="stroke-color-picker-container"
                >
                    <WickInput
                        type="color"
                        color={strokeColor}
                        onChange={(color: string) => {
                            props.setToolSetting(
                                "strokeColor",
                                new window.Wick.Color(color)
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
        return (
            <div className="toolbox-actions-right-container">
                <div className="toolbox-actions-right">
                    <div id="more-canvas-actions-popover-button">
                        {renderToolButtonFromAction(
                            props.editorActions.showMoreCanvasActions
                        )}
                        <CanvasActions
                            renderSize={props.renderSize}
                            editorActions={props.editorActions}
                            showCanvasActions={props.showCanvasActions}
                            toggleCanvasActions={props.toggleCanvasActions}
                            previewPlaying={props.previewPlaying}
                        />
                    </div>

                    {renderToolButtonFromAction(props.editorActions.delete)}
                    {renderToolButtonFromAction(props.editorActions.copy)}
                    {renderToolButtonFromAction(props.editorActions.paste)}
                    {renderToolButtonFromAction(props.editorActions.undo)}
                    {renderToolButtonFromAction(props.editorActions.redo)}
                </div>
            </div>
        );
    };

    const renderLargeToolbox = (): JSX.Element => {
        return (
            <div className={classNames("tool-box", "tool-box-large")}>
                {renderToolButtons()}

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
            <div className={classNames("tool-box", "tool-box-medium")}>
                <div className="medium-toolbox-row">
                    {renderToolButtons()}
                    <ToolboxBreak />
                    {renderColorPickers()}
                    <ToolboxBreak />
                </div>
                <div className="medium-toolbox-row">
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
            <div className={classNames("tool-box", "tool-box-medium")}>
                <div className="medium-toolbox-row">
                    {renderToolButtonsMobile()}
                    <ToolboxBreak className={classNames("toolbox-break", "mobile")} />
                    {renderCanvasActionsMobile()}
                </div>
                <div className="medium-toolbox-row">
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

    const renderToolButtonsMobile = (): JSX.Element => {
        const activeToolName = props.getActiveToolName();
        const dropdownKeys = TOOL_DROPDOWN_KEYS;
        dropdownKeys.forEach((key) => {
            const dropdownConfig = toolDropdowns[key];
            if (!dropdownConfig || typeof dropdownConfig === "string") {
                return;
            }

            if (isToolName(activeToolName) && dropdownConfig.options.includes(activeToolName)) {
                dropdownConfig.active = activeToolName;
            }
        });

        const baseProps = getToolButtonBaseProps();

        return (
            <div className="tool-collection-container">
                {dropdownKeys.map((key) => {
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
                                iconClassName="bump-up-no-dropdown"
                                className={classNames("toolbox-item", "mobile")}
                                name={dropdownConfig}
                                tooltip={tooltip}
                            />
                        );
                    }

                    const id = `more-${key}-popover-button`;
                    const tooltip = getToolTooltip(dropdownConfig.active);
                    return (
                        <div key={key} id={id} className="tool-dropdown-anchor">
                            <ToolButton
                                {...baseProps}
                                className={classNames("toolbox-item", "mobile")}
                                action={() => props.setActiveTool(dropdownConfig.active)}
                                secondaryAction={() => toggleDropdownSelector(key)}
                                name={dropdownConfig.active}
                                tooltip={tooltip}
                                dropdown={true}
                            />
                            <PopupMenu
                                mobile={true}
                                isOpen={dropdownSelector === key}
                                toggle={() => toggleDropdownSelector(key)}
                                target={id}
                                className={"tool-selector-menu-popover"}
                            >
                                <div className="tool-selector-popout">
                                    <div className="tool-selector-menu-header">
                                        {getToolTooltip(dropdownConfig.active)}
                                    </div>
                                    <div className="tool-selector-menu-list">
                                        {dropdownConfig.options.map((option) => {
                                            const optionIsActive =
                                                activeToolName === option ||
                                                dropdownConfig.active === option;

                                            return (
                                                <button
                                                    key={option}
                                                    type="button"
                                                    className={classNames(
                                                        "tool-selector-menu-item",
                                                        { active: optionIsActive }
                                                    )}
                                                    onClick={() => {
                                                        dropdownConfig.active = option;
                                                        props.setActiveTool(option);
                                                        toggleDropdownSelector(key);
                                                    }}
                                                >
                                                    <ToolIcon
                                                        className="tool-selector-menu-item-icon"
                                                        name={option}
                                                    />
                                                    <span className="tool-selector-menu-item-label">
                                                        {getToolTooltip(option)}
                                                    </span>
                                                    {optionIsActive && (
                                                        <ToolIcon
                                                            className="tool-selector-menu-item-check"
                                                            name="check"
                                                        />
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

    const toggleDropdownSelector = (value: string): void => {
        setDropdownSelector((previous) =>
            previous === value ? null : value
        );
    };

    const renderCanvasActionsMobile = (): JSX.Element => {
        return (
            <div className="toolbox-actions-right-container">
                <div className="toolbox-actions-right">
                    {renderToolButtonFromAction(props.editorActions.undo)}
                    {renderToolButtonFromAction(props.editorActions.redo)}
                    <div id="more-canvas-actions-popover-button">
                        {renderToolButtonFromAction(
                            props.editorActions.showMoreCanvasActions
                        )}
                        <CanvasActions
                            renderSize={props.renderSize}
                            editorActions={props.editorActions}
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
        <div className="tool-box-container" aria-label="Toolbox">
            {props.renderSize === "large"
                ? renderLargeToolbox()
                : props.renderSize === "medium"
                    ? renderMediumToolbox()
                    : renderSmallToolbox()}
        </div>
    );
};

export default Toolbox;
