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

import "./_toolsettings.scss";

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

    const getToolSetting = (setting: string): any => {
        return getToolSettingProp(setting);
    };

    const setToolSetting = (setting: string, newValue: any): void => {
        setToolSettingProp(setting, newValue);
    };

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
                value={getToolSetting("pressureEnabled")}
                onChange={() =>
                    setToolSetting(
                        "pressureEnabled",
                        !getToolSetting("pressureEnabled")
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
                value={getToolSetting("relativeBrushSize")}
                onChange={() =>
                    setToolSetting(
                        "relativeBrushSize",
                        !getToolSetting("relativeBrushSize")
                    )
                }
            />
        );
    };

    const renderBrushMode = (): JSX.Element => {
        let brushModeIcon = "brushmodenone";
        const brushMode = getToolSettingProp("brushMode");

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
                    className={"more-canvas-actions-popover"}
                >
                    <div className="brush-modes-widget">
                        <div className="actions-container">
                            <ToolSettingsInput
                                renderSize={renderSize}
                                name="None"
                                icon="brushmodenone"
                                type="checkbox"
                                value={getToolSettingProp("brushMode") === "none"}
                                onChange={() => setToolSettingProp("brushMode", "none")}
                            />
                            <ToolSettingsInput
                                renderSize={renderSize}
                                name="Inside"
                                icon="brushmodeinside"
                                type="checkbox"
                                value={getToolSettingProp("brushMode") === "inside"}
                                onChange={() => setToolSettingProp("brushMode", "inside")}
                            />
                            <ToolSettingsInput
                                renderSize={renderSize}
                                name="Outside"
                                icon="brushmodeoutside"
                                type="checkbox"
                                value={getToolSettingProp("brushMode") === "outside"}
                                onChange={() => setToolSettingProp("brushMode", "outside")}
                            />
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
                value={getToolSetting("cornerRadius")}
                onChange={(val) => setToolSetting("cornerRadius", val)}
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
                value={getToolSetting("brushStabilizerWeight")}
                onChange={(val) => setToolSetting("brushStabilizerWeight", val)}
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
                value={getToolSetting("eraserSize")}
                onChange={(val) => setToolSetting("eraserSize", val)}
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
                value={getToolSetting("strokeWidth")}
                onChange={(val) => setToolSetting("strokeWidth", val)}
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
                value={getToolSetting("brushSize")}
                onChange={(val) => setToolSetting("brushSize", val)}
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
                value={getToolSetting("gapFillAmount")}
                onChange={(val) => setToolSetting("gapFillAmount", val)}
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
