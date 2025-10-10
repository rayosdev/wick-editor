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

import { Component } from "react";
import classNames from "classnames";

import "./_toolbox.scss";
import "bootstrap/dist/css/bootstrap.min.css";

import WickInput from "Editor/Util/WickInput/WickInput";
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
    getToolSetting: (setting: string) => any;
    setToolSetting: (setting: string, value: any) => void;
    getToolSettingRestrictions: (setting: string) => any;
    toggleBrushModes: () => void;
    showBrushModes: boolean;
    colorPickerType: string;
    changeColorPickerType: (type: string) => void;
    updateLastColors: (color: string) => void;
    lastColorsUsed: string[];
}

interface ToolboxState {
    dropdownSelector: string | null;
}

type ToolDropdownConfig =
    | ToolName
    | {
        active: ToolName;
        options: ToolName[];
    };

class Toolbox extends Component<ToolboxProps, ToolboxState> {
    private toolDropdowns: Record<ToolDropdownKey, ToolDropdownConfig> = {
        cursors: { active: "cursor", options: ["cursor", "pathcursor"] },
        brushes: { active: "brush", options: ["brush", "pencil"] },
        eraser: "eraser",
        shapes: {
            active: "rectangle",
            options: ["rectangle", "ellipse", "line", "text"],
        },
        tools: { active: "fillbucket", options: ["fillbucket", "eyedropper"] },
    };

    constructor(props: ToolboxProps) {
        super(props);

        this.state = {
            dropdownSelector: null,
        };
    }

    render(): JSX.Element {
        return (
            <div className="tool-box-container" aria-label="Toolbox">
                {this.props.renderSize === "large"
                    ? this.renderLargeToolbox()
                    : this.props.renderSize === "medium"
                        ? this.renderMediumToolbox()
                        : this.renderSmallToolbox()}
            </div>
        );
    }

    private getToolButtonBaseProps(): Pick<
        ToolButtonProps,
        "setActiveTool" | "className" | "getActiveToolName" | "keyMap"
    > {
        return {
            setActiveTool: this.props.setActiveTool,
            className: classNames("toolbox-item", {
                mobile: this.props.renderSize === "small",
            }),
            getActiveToolName: this.props.getActiveToolName,
            keyMap: this.props.keyMap,
        };
    }

    private getToolTooltip = (toolName: string): string => {
        return isToolName(toolName) ? TOOL_TITLES[toolName] : toolName;
    };

    private renderToolButtonFromAction = (
        action: ToolboxAction
    ): JSX.Element => {
        const baseProps = this.getToolButtonBaseProps();
        return (
            <ToolButton
                {...baseProps}
                action={action.action}
                name={action.icon}
                tooltip={action.tooltip}
            />
        );
    };

    private renderToolButtons = (): JSX.Element => {
        const baseProps = this.getToolButtonBaseProps();

        return (
            <div className="tool-collection-container">
                {TOOL_NAMES.map((tool) => (
                    <ToolButton
                        key={tool}
                        {...baseProps}
                        name={tool}
                        tooltip={this.getToolTooltip(tool)}
                    />
                ))}
            </div>
        );
    };

    private renderColorPickers = (): JSX.Element => {
        const fillColor = this.props.getToolSetting("fillColor");
        const strokeColor = this.props.getToolSetting("strokeColor");

        return (
            <div className="tool-collection-container">
                <div
                    className="color-container toolbox-item"
                    id="fill-color-picker-container"
                >
                    <WickInput
                        type="color"
                        color={fillColor?.rgba}
                        onChange={(color) => {
                            this.props.setToolSetting(
                                "fillColor",
                                new (window as any).Wick.Color(color)
                            );
                        }}
                        id="tool-box-fill-color"
                        tooltipID="tool-box-fill-color"
                        tooltip="Fill Color"
                        placement="bottom"
                        colorPickerType={this.props.colorPickerType}
                        changeColorPickerType={this.props.changeColorPickerType}
                        updateLastColors={this.props.updateLastColors}
                        lastColorsUsed={this.props.lastColorsUsed}
                    />
                </div>
                <div
                    className="color-container toolbox-item"
                    id="stroke-color-picker-container"
                >
                    <WickInput
                        type="color"
                        color={strokeColor?.rgba}
                        onChange={(color) => {
                            this.props.setToolSetting(
                                "strokeColor",
                                new (window as any).Wick.Color(color)
                            );
                        }}
                        id="tool-box-stroke-color"
                        tooltipID="tool-box-stroke-color"
                        tooltip="Stroke Color"
                        placement="bottom"
                        stroke={true}
                        colorPickerType={this.props.colorPickerType}
                        changeColorPickerType={this.props.changeColorPickerType}
                        lastColorsUsed={this.props.lastColorsUsed}
                    />
                </div>
            </div>
        );
    };

    private renderCanvasActions = (): JSX.Element => {
        return (
            <div className="toolbox-actions-right-container">
                <div className="toolbox-actions-right">
                    <div id="more-canvas-actions-popover-button">
                        {this.renderToolButtonFromAction(
                            this.props.editorActions.showMoreCanvasActions
                        )}
                        <CanvasActions
                            renderSize={this.props.renderSize}
                            editorActions={this.props.editorActions}
                            showCanvasActions={this.props.showCanvasActions}
                            toggleCanvasActions={this.props.toggleCanvasActions}
                            previewPlaying={this.props.previewPlaying}
                        />
                    </div>

                    {this.renderToolButtonFromAction(this.props.editorActions.delete)}
                    {this.renderToolButtonFromAction(this.props.editorActions.copy)}
                    {this.renderToolButtonFromAction(this.props.editorActions.paste)}
                    {this.renderToolButtonFromAction(this.props.editorActions.undo)}
                    {this.renderToolButtonFromAction(this.props.editorActions.redo)}
                </div>
            </div>
        );
    };

    private renderLargeToolbox = (): JSX.Element => {
        return (
            <div className={classNames("tool-box", "tool-box-large")}>
                {this.renderToolButtons()}

                <ToolboxBreak />

                {this.renderColorPickers()}

                <ToolboxBreak />

                <ToolSettings
                    renderSize={this.props.renderSize as "small" | "medium" | "large"}
                    activeTool={this.props.activeToolName}
                    getToolSetting={this.props.getToolSetting}
                    setToolSetting={this.props.setToolSetting}
                    getToolSettingRestrictions={this.props.getToolSettingRestrictions}
                    toggleBrushModes={this.props.toggleBrushModes}
                    showBrushModes={this.props.showBrushModes}
                    previewPlaying={this.props.previewPlaying}
                />

                {this.renderCanvasActions()}
            </div>
        );
    };

    private renderMediumToolbox = (): JSX.Element => {
        return (
            <div className={classNames("tool-box", "tool-box-medium")}>
                <div className="medium-toolbox-row">
                    {this.renderToolButtons()}
                    <ToolboxBreak />
                    {this.renderColorPickers()}
                    <ToolboxBreak />
                </div>
                <div className="medium-toolbox-row">
                    <ToolSettings
                        renderSize={this.props.renderSize as "small" | "medium" | "large"}
                        activeTool={this.props.activeToolName}
                        getToolSetting={this.props.getToolSetting}
                        setToolSetting={this.props.setToolSetting}
                        getToolSettingRestrictions={this.props.getToolSettingRestrictions}
                        toggleBrushModes={this.props.toggleBrushModes}
                        showBrushModes={this.props.showBrushModes}
                        previewPlaying={this.props.previewPlaying}
                    />
                    {this.renderCanvasActions()}
                </div>
            </div>
        );
    };

    private renderSmallToolbox = (): JSX.Element => {
        return (
            <div className={classNames("tool-box", "tool-box-medium")}>
                <div className="medium-toolbox-row">
                    {this.renderToolButtonsMobile()}
                    <ToolboxBreak className={classNames("toolbox-break", "mobile")} />
                    {this.renderCanvasActionsMobile()}
                </div>
                <div className="medium-toolbox-row">
                    {this.renderColorPickers()}
                    <ToolboxBreak className={classNames("toolbox-break", "mobile")} />
                    <ToolSettings
                        renderSize={this.props.renderSize as "small" | "medium" | "large"}
                        isMobile={true}
                        activeTool={this.props.activeToolName}
                        getToolSetting={this.props.getToolSetting}
                        setToolSetting={this.props.setToolSetting}
                        getToolSettingRestrictions={this.props.getToolSettingRestrictions}
                        toggleBrushModes={this.props.toggleBrushModes}
                        showBrushModes={this.props.showBrushModes}
                        previewPlaying={this.props.previewPlaying}
                    />
                </div>
            </div>
        );
    };

    private renderToolButtonsMobile = (): JSX.Element => {
        const activeToolName = this.props.getActiveToolName();
    const dropdownKeys = TOOL_DROPDOWN_KEYS;
        dropdownKeys.forEach((key) => {
            const dropdownConfig = this.toolDropdowns[key];
            if (!dropdownConfig || typeof dropdownConfig === "string") {
                return;
            }

            if (isToolName(activeToolName) && dropdownConfig.options.includes(activeToolName)) {
                dropdownConfig.active = activeToolName;
            }
        });

        const baseProps = this.getToolButtonBaseProps();

        return (
            <div className="tool-collection-container">
                {dropdownKeys.map((key) => {
                    const dropdownConfig = this.toolDropdowns[key];
                    if (!dropdownConfig) {
                        return null;
                    }

                    if (typeof dropdownConfig === "string") {
                        const tooltip = this.getToolTooltip(dropdownConfig);
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
                    const tooltip = this.getToolTooltip(dropdownConfig.active);
                    return (
                        <div key={key} id={id}>
                            <ToolButton
                                {...baseProps}
                                className={classNames("toolbox-item", "mobile")}
                                action={() => this.props.setActiveTool(dropdownConfig.active)}
                                secondaryAction={() => this.toggleDropdownSelector(key)}
                                name={dropdownConfig.active}
                                tooltip={tooltip}
                                dropdown={true}
                            />
                            <PopupMenu
                                mobile={true}
                                isOpen={this.state.dropdownSelector === key}
                                toggle={() => this.toggleDropdownSelector(key)}
                                target={id}
                                className={"more-canvas-actions-popover"}
                            >
                                <div className="tool-selector-popout">
                                    {dropdownConfig.options.map((option) => {
                                        if (option === dropdownConfig.active) {
                                            return null;
                                        }

                                        return (
                                            <ToolButton
                                                key={option}
                                                {...baseProps}
                                                action={() => {
                                                    dropdownConfig.active = option;
                                                    this.props.setActiveTool(option);
                                                    this.toggleDropdownSelector(key);
                                                }}
                                                className="tool-selector-item"
                                                name={option}
                                                tooltip={this.getToolTooltip(option)}
                                            />
                                        );
                                    })}
                                </div>
                            </PopupMenu>
                        </div>
                    );
                })}
            </div>
        );
    };

    private toggleDropdownSelector = (value: string): void => {
        this.setState((previous) => ({
            dropdownSelector: previous.dropdownSelector === value ? null : value,
        }));
    };

    private renderCanvasActionsMobile = (): JSX.Element => {
        return (
            <div className="toolbox-actions-right-container">
                <div className="toolbox-actions-right">
                    {this.renderToolButtonFromAction(this.props.editorActions.undo)}
                    {this.renderToolButtonFromAction(this.props.editorActions.redo)}
                    <div id="more-canvas-actions-popover-button">
                        {this.renderToolButtonFromAction(
                            this.props.editorActions.showMoreCanvasActions
                        )}
                        <CanvasActions
                            renderSize={this.props.renderSize}
                            editorActions={this.props.editorActions}
                            showCanvasActions={this.props.showCanvasActions}
                            toggleCanvasActions={this.props.toggleCanvasActions}
                            previewPlaying={this.props.previewPlaying}
                        />
                    </div>
                </div>
            </div>
        );
    };
}

export default Toolbox;
