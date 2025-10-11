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

class ToolSettings extends Component<ToolSettingsProps> {
    private readonly settingsFunctions: Record<string, () => JSX.Element>;

    constructor(props: ToolSettingsProps) {
        super(props);

        this.settingsFunctions = {
            cursor: this.renderCursorSettings,
            brush: this.renderBrushSettings,
            pencil: this.renderPencilSettings,
            eraser: this.renderEraserSettings,
            rectangle: this.renderRectangleSettings,
            ellipse: this.renderEllipseSettings,
            line: this.renderLineSettings,
            text: this.renderTextSettings,
            fillbucket: this.renderFillbucketSettings,
        };
    }

    render(): JSX.Element {
        return <div id="settings-panel-container">{this.renderSettings()}</div>;
    }

    private renderSettings = (): JSX.Element => {
        const renderer = this.settingsFunctions[this.props.activeTool];
        if (renderer) {
            return renderer();
        }

        return <div className="default" />;
    };

    private renderCursorSettings = (): JSX.Element => {
        return <div className="settings-input-container" />;
    };

    private renderBrushSettings = (): JSX.Element => {
        return (
            <div className="settings-input-container">
                {this.renderBrushSize()}
                {this.renderBrushSmoothing()}
                {this.renderEnablePressure()}
                {this.renderEnableRelativeBrushSize()}
                {this.renderBrushMode()}
            </div>
        );
    };

    private renderPencilSettings = (): JSX.Element => {
        return (
            <div className="settings-input-container">
                {this.renderStrokeWidth()}
            </div>
        );
    };

    private renderEraserSettings = (): JSX.Element => {
        return (
            <div className="settings-input-container">
                {this.renderEraserSize()}
            </div>
        );
    };

    private renderRectangleSettings = (): JSX.Element => {
        return (
            <div className="settings-input-container">
                {this.renderStrokeWidth()}
                {this.renderCornerRadius()}
            </div>
        );
    };

    private renderEllipseSettings = (): JSX.Element => {
        return (
            <div className="settings-input-container">
                {this.renderStrokeWidth()}
            </div>
        );
    };

    private renderLineSettings = (): JSX.Element => {
        return (
            <div className="settings-input-container">
                {this.renderStrokeWidth()}
            </div>
        );
    };

    private renderTextSettings = (): JSX.Element => {
        return <div className="settings-input-container" />;
    };

    private renderFillbucketSettings = (): JSX.Element => {
        return (
            <div className="settings-input-container">
                {this.renderGapFillAmount()}
            </div>
        );
    };

    private renderEnablePressure = (): JSX.Element => {
        return (
            <ToolSettingsInput
                renderSize={this.props.renderSize}
                name="Enable Pressure"
                icon="brushpressure"
                type="checkbox"
                value={this.getToolSetting("pressureEnabled")}
                onChange={() =>
                    this.setToolSetting(
                        "pressureEnabled",
                        !this.getToolSetting("pressureEnabled")
                    )
                }
            />
        );
    };

    private renderEnableRelativeBrushSize = (): JSX.Element => {
        return (
            <ToolSettingsInput
                renderSize={this.props.renderSize}
                name="Relative Brush Size"
                icon="brushrelativesize"
                type="checkbox"
                value={this.getToolSetting("relativeBrushSize")}
                onChange={() =>
                    this.setToolSetting(
                        "relativeBrushSize",
                        !this.getToolSetting("relativeBrushSize")
                    )
                }
            />
        );
    };

    private renderBrushMode = (): JSX.Element => {
        let brushModeIcon = "brushmodenone";
        const brushMode = this.props.getToolSetting("brushMode");

        if (brushMode === "inside") {
            brushModeIcon = "brushmodeinside";
        } else if (brushMode === "outside") {
            brushModeIcon = "brushmodeoutside";
        }

        return (
            <div id="brush-modes-popover-button">
                <ToolSettingsInput
                    renderSize={this.props.renderSize}
                    name="Brush Modes"
                    icon={brushModeIcon}
                    type="checkbox"
                    value={this.props.showBrushModes}
                    onChange={this.props.toggleBrushModes}
                />
                <PopupMenu
                    mobile={this.props.isMobile}
                    isOpen={this.props.showBrushModes && !this.props.previewPlaying}
                    toggle={this.props.toggleBrushModes}
                    target="brush-modes-popover-button"
                    className={"more-canvas-actions-popover"}
                >
                    <div className="brush-modes-widget">
                        <div className="actions-container">
                            <ToolSettingsInput
                                renderSize={this.props.renderSize}
                                name="None"
                                icon="brushmodenone"
                                type="checkbox"
                                value={this.props.getToolSetting("brushMode") === "none"}
                                onChange={() => this.props.setToolSetting("brushMode", "none")}
                            />
                            <ToolSettingsInput
                                renderSize={this.props.renderSize}
                                name="Inside"
                                icon="brushmodeinside"
                                type="checkbox"
                                value={this.props.getToolSetting("brushMode") === "inside"}
                                onChange={() => this.props.setToolSetting("brushMode", "inside")}
                            />
                            <ToolSettingsInput
                                renderSize={this.props.renderSize}
                                name="Outside"
                                icon="brushmodeoutside"
                                type="checkbox"
                                value={this.props.getToolSetting("brushMode") === "outside"}
                                onChange={() => this.props.setToolSetting("brushMode", "outside")}
                            />
                        </div>
                    </div>
                </PopupMenu>
            </div>
        );
    };

    private renderCornerRadius = (): JSX.Element => {
        return (
            <ToolSettingsInput
                renderSize={this.props.renderSize}
                isMobile={this.props.isMobile}
                name="Corner Radius"
                icon="cornerradius"
                type="numeric"
                value={this.getToolSetting("cornerRadius")}
                onChange={(val) => this.setToolSetting("cornerRadius", val)}
                inputRestrictions={this.props.getToolSettingRestrictions(
                    "cornerRadius"
                )}
            />
        );
    };

    private renderBrushSmoothing = (): JSX.Element => {
        return (
            <ToolSettingsInput
                renderSize={this.props.renderSize}
                isMobile={this.props.isMobile}
                name="Brush Smoothing"
                icon="brushsmoothness"
                type="numeric"
                value={this.getToolSetting("brushStabilizerWeight")}
                onChange={(val) => this.setToolSetting("brushStabilizerWeight", val)}
                inputRestrictions={this.props.getToolSettingRestrictions(
                    "brushStabilizerWeight"
                )}
            />
        );
    };

    private renderEraserSize = (): JSX.Element => {
        return (
            <ToolSettingsInput
                renderSize={this.props.renderSize}
                isMobile={this.props.isMobile}
                name="Eraser Size"
                icon="eraser"
                type="numeric"
                value={this.getToolSetting("eraserSize")}
                onChange={(val) => this.setToolSetting("eraserSize", val)}
                inputRestrictions={this.props.getToolSettingRestrictions(
                    "eraserSize"
                )}
            />
        );
    };

    private renderStrokeWidth = (): JSX.Element => {
        return (
            <ToolSettingsInput
                renderSize={this.props.renderSize}
                isMobile={this.props.isMobile}
                name="Stroke Width"
                icon="strokewidth"
                type="numeric"
                value={this.getToolSetting("strokeWidth")}
                onChange={(val) => this.setToolSetting("strokeWidth", val)}
                inputRestrictions={this.props.getToolSettingRestrictions(
                    "strokeWidth"
                )}
            />
        );
    };

    private renderBrushSize = (): JSX.Element => {
        return (
            <ToolSettingsInput
                renderSize={this.props.renderSize}
                isMobile={this.props.isMobile}
                name="Brush Size"
                icon="brushsize"
                type="numeric"
                value={this.getToolSetting("brushSize")}
                onChange={(val) => this.setToolSetting("brushSize", val)}
                inputRestrictions={this.props.getToolSettingRestrictions("brushSize")}
            />
        );
    };

    private renderGapFillAmount = (): JSX.Element => {
        return (
            <ToolSettingsInput
                name="Gap Fill Amount"
                icon="gapfillamount"
                type="numeric"
                value={this.getToolSetting("gapFillAmount")}
                onChange={(val) => this.setToolSetting("gapFillAmount", val)}
                inputRestrictions={this.props.getToolSettingRestrictions(
                    "gapFillAmount"
                )}
            />
        );
    };

    private getToolSetting = (setting: string): any => {
        return this.props.getToolSetting(setting);
    };

    private setToolSetting = (setting: string, newValue: any): void => {
        this.props.setToolSetting(setting, newValue);
    };
}

export default ToolSettings;
