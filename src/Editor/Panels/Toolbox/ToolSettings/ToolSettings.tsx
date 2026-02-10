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

import React, { useMemo } from "react";

import ToolSettingsInput from "./ToolSettingsInput/ToolSettingsInput";
import PopupMenu from "Editor/Util/PopupMenu/PopupMenu";
import ToolIcon from "Editor/Util/ToolIcon/ToolIcon";

import "./_toolsettings.scss";
import classNames from "classnames";

interface ToolSettingsProps {
    renderSize: "small" | "medium" | "large";
    isMobile?: boolean;
    activeTool: string;
    getToolSetting: (setting: string) => string | number | boolean;
    setToolSetting: (setting: string, value: string | number | boolean) => void;
    getToolSettingRestrictions: (setting: string) => Record<string, unknown>; // Child components expect flexible shape
    toggleBrushModes: () => void;
    showBrushModes: boolean;
    previewPlaying?: boolean;
}

const ToolSettings: React.FC<ToolSettingsProps> = (props) => {
    const {
        renderSize,
        isMobile,
        activeTool,
        getToolSetting: getToolSettingProp,
        setToolSetting: setToolSettingProp,
        getToolSettingRestrictions,
        toggleBrushModes,
        showBrushModes,
        previewPlaying
    } = props;

    const renderCursorSettings = (): JSX.Element => {
        return <div className="settings-input-container" />;
    };

    const renderEnablePressure = (): JSX.Element => {
        return (
            <ToolSettingsInput
                renderSize={renderSize}
                name="Enable Pressure"
                icon="brushpressure"
                type="checkbox"
                value={Boolean(getToolSettingProp("pressureEnabled"))}
                onChange={() =>
                    setToolSettingProp(
                        "pressureEnabled",
                        !Boolean(getToolSettingProp("pressureEnabled"))
                    )
                }
            />
        );
    };

    const renderEnableRelativeBrushSize = (): JSX.Element => {
        return (
            <ToolSettingsInput
                renderSize={renderSize}
                name="Relative Brush Size"
                icon="brushrelativesize"
                type="checkbox"
                value={Boolean(getToolSettingProp("relativeBrushSize"))}
                onChange={() =>
                    setToolSettingProp(
                        "relativeBrushSize",
                        !Boolean(getToolSettingProp("relativeBrushSize"))
                    )
                }
            />
        );
    };

    const renderBrushMode = (): JSX.Element => {
        let brushModeIcon = "brushmodenone";
        const brushMode = getToolSettingProp("brushMode");
        const brushModes = [
            { value: "none", label: "None", icon: "brushmodenone" },
            { value: "inside", label: "Inside", icon: "brushmodeinside" },
            { value: "outside", label: "Outside", icon: "brushmodeoutside" },
        ] as const;

        if (brushMode === "inside") {
            brushModeIcon = "brushmodeinside";
        } else if (brushMode === "outside") {
            brushModeIcon = "brushmodeoutside";
        }

        return (
            <div id="brush-modes-popover-button">
                <ToolSettingsInput
                    renderSize={renderSize}
                    name="Brush Modes"
                    icon={brushModeIcon}
                    type="checkbox"
                    value={showBrushModes}
                    onChange={toggleBrushModes}
                />
                <PopupMenu
                    mobile={isMobile}
                    isOpen={showBrushModes && !previewPlaying}
                    toggle={toggleBrushModes}
                    target="brush-modes-popover-button"
                    className="tool-settings-menu-popover"
                >
                    <div className="brush-modes-widget">
                        <div className="tool-selector-menu-header">Brush Modes</div>
                        <div className="brush-modes-menu-list">
                            {brushModes.map((mode) => {
                                const active = brushMode === mode.value;
                                return (
                                    <button
                                        key={mode.value}
                                        type="button"
                                        className={classNames(
                                            "brush-modes-menu-item",
                                            { active }
                                        )}
                                        onClick={() =>
                                            setToolSettingProp("brushMode", mode.value)
                                        }
                                    >
                                        <ToolIcon
                                            className="brush-modes-menu-item-icon"
                                            name={mode.icon}
                                        />
                                        <span className="brush-modes-menu-item-label">
                                            {mode.label}
                                        </span>
                                        {active && (
                                            <ToolIcon
                                                className="brush-modes-menu-item-check"
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
    };

    const renderCornerRadius = (): JSX.Element => {
        return (
            <ToolSettingsInput
                renderSize={renderSize}
                isMobile={isMobile}
                name="Corner Radius"
                icon="cornerradius"
                type="numeric"
                value={Number(getToolSettingProp("cornerRadius"))}
                onChange={(val) => setToolSettingProp("cornerRadius", val)}
                inputRestrictions={getToolSettingRestrictions(
                    "cornerRadius"
                )}
            />
        );
    };

    const renderBrushSmoothing = (): JSX.Element => {
        return (
            <ToolSettingsInput
                renderSize={renderSize}
                isMobile={isMobile}
                name="Brush Smoothing"
                icon="brushsmoothness"
                type="numeric"
                value={Number(getToolSettingProp("brushStabilizerWeight"))}
                onChange={(val) => setToolSettingProp("brushStabilizerWeight", val)}
                inputRestrictions={getToolSettingRestrictions(
                    "brushStabilizerWeight"
                )}
            />
        );
    };

    const renderEraserSize = (): JSX.Element => {
        return (
            <ToolSettingsInput
                renderSize={renderSize}
                isMobile={isMobile}
                name="Eraser Size"
                icon="eraser"
                type="numeric"
                value={Number(getToolSettingProp("eraserSize"))}
                onChange={(val) => setToolSettingProp("eraserSize", val)}
                inputRestrictions={getToolSettingRestrictions(
                    "eraserSize"
                )}
            />
        );
    };

    const renderStrokeWidth = (): JSX.Element => {
        return (
            <ToolSettingsInput
                renderSize={renderSize}
                isMobile={isMobile}
                name="Stroke Width"
                icon="strokewidth"
                type="numeric"
                value={Number(getToolSettingProp("strokeWidth"))}
                onChange={(val) => setToolSettingProp("strokeWidth", val)}
                inputRestrictions={getToolSettingRestrictions(
                    "strokeWidth"
                )}
            />
        );
    };

    const renderBrushSize = (): JSX.Element => {
        return (
            <ToolSettingsInput
                renderSize={renderSize}
                isMobile={isMobile}
                name="Brush Size"
                icon="brushsize"
                type="numeric"
                value={Number(getToolSettingProp("brushSize"))}
                onChange={(val) => setToolSettingProp("brushSize", val)}
                inputRestrictions={getToolSettingRestrictions("brushSize")}
            />
        );
    };

    const renderGapFillAmount = (): JSX.Element => {
        return (
            <ToolSettingsInput
                name="Gap Fill Amount"
                icon="gapfillamount"
                type="numeric"
                value={Number(getToolSettingProp("gapFillAmount"))}
                onChange={(val) => setToolSettingProp("gapFillAmount", val)}
                inputRestrictions={getToolSettingRestrictions(
                    "gapFillAmount"
                )}
            />
        );
    };

    const renderBrushSettings = (): JSX.Element => {
        return (
            <div className="settings-input-container">
                {renderBrushSize()}
                {renderBrushSmoothing()}
                {renderEnablePressure()}
                {renderEnableRelativeBrushSize()}
                {renderBrushMode()}
            </div>
        );
    };

    const renderPencilSettings = (): JSX.Element => {
        return (
            <div className="settings-input-container">
                {renderStrokeWidth()}
            </div>
        );
    };

    const renderEraserSettings = (): JSX.Element => {
        return (
            <div className="settings-input-container">
                {renderEraserSize()}
            </div>
        );
    };

    const renderRectangleSettings = (): JSX.Element => {
        return (
            <div className="settings-input-container">
                {renderStrokeWidth()}
                {renderCornerRadius()}
            </div>
        );
    };

    const renderEllipseSettings = (): JSX.Element => {
        return (
            <div className="settings-input-container">
                {renderStrokeWidth()}
            </div>
        );
    };

    const renderLineSettings = (): JSX.Element => {
        return (
            <div className="settings-input-container">
                {renderStrokeWidth()}
            </div>
        );
    };

    const renderTextSettings = (): JSX.Element => {
        return <div className="settings-input-container" />;
    };

    const renderFillbucketSettings = (): JSX.Element => {
        return (
            <div className="settings-input-container">
                {renderGapFillAmount()}
            </div>
        );
    };

    const settingsFunctions = useMemo(() => ({
        cursor: renderCursorSettings,
        brush: renderBrushSettings,
        pencil: renderPencilSettings,
        eraser: renderEraserSettings,
        rectangle: renderRectangleSettings,
        ellipse: renderEllipseSettings,
        line: renderLineSettings,
        text: renderTextSettings,
        fillbucket: renderFillbucketSettings,
    }), []); // eslint-disable-line react-hooks/exhaustive-deps

    const renderSettings = (): JSX.Element => {
        const renderer = settingsFunctions[activeTool as keyof typeof settingsFunctions];
        if (renderer) {
            return renderer();
        }

        return <div className="default" />;
    };

    return <div id="settings-panel-container">{renderSettings()}</div>;
};

export default ToolSettings;
