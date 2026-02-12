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

import React, { useEffect, useMemo, useState } from "react";

import ToolSettingsInput from "./ToolSettingsInput/ToolSettingsInput";
import PopupMenu from "Editor/Util/PopupMenu/PopupMenu";
import ToolIcon from "Editor/Util/ToolIcon/ToolIcon";
import ActionButton from "Editor/Util/ActionButton/ActionButton";

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

type ToolPresetItem = {
    id: string;
    label: string;
    icon: string;
    active: boolean;
    apply: () => void;
};

type ToolPresetMenuData = {
    title: string;
    subtitle: string;
    items: ToolPresetItem[];
};

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

    const [showToolPresets, setShowToolPresets] = useState(false);

    const toggleToolPresets = (): void => {
        setShowToolPresets((previous) => !previous);
    };

    useEffect(() => {
        setShowToolPresets(false);
    }, [activeTool, previewPlaying]);

    const getNumericToolSetting = (setting: string): number => {
        return Number(getToolSettingProp(setting));
    };

    const setNumericToolSetting = (setting: string, value: number): void => {
        setToolSettingProp(setting, value);
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
        const brushMode = String(getToolSettingProp("brushMode"));
        const brushModes = [
            { value: "none", label: "None", icon: "brushmodenone" },
            { value: "inside", label: "Inside", icon: "brushmodeinside" },
            { value: "behind", label: "Behind", icon: "brushmodeoutside" },
        ] as const;

        if (brushMode === "inside") {
            brushModeIcon = "brushmodeinside";
        } else if (brushMode === "behind" || brushMode === "outside") {
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
                        <div className="brush-modes-menu-list">
                            {brushModes.map((mode) => {
                                const active =
                                    mode.value === "behind"
                                        ? brushMode === "behind" || brushMode === "outside"
                                        : brushMode === mode.value;
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

    const getToolPresetMenuData = (): ToolPresetMenuData | null => {
        if (activeTool === "brush") {
            const brushSize = getNumericToolSetting("brushSize");
            const brushSmoothness = getNumericToolSetting("brushStabilizerWeight");
            const brushMode = String(getToolSettingProp("brushMode"));

            return {
                title: "Brush Presets",
                subtitle: "Quick setups for size, smoothing, and mode",
                items: [
                    {
                        id: "brush-size-small",
                        label: "Size 4",
                        icon: "brushsize",
                        active: brushSize === 4,
                        apply: () => setNumericToolSetting("brushSize", 4),
                    },
                    {
                        id: "brush-size-medium",
                        label: "Size 10",
                        icon: "brushsize",
                        active: brushSize === 10,
                        apply: () => setNumericToolSetting("brushSize", 10),
                    },
                    {
                        id: "brush-size-large",
                        label: "Size 20",
                        icon: "brushsize",
                        active: brushSize === 20,
                        apply: () => setNumericToolSetting("brushSize", 20),
                    },
                    {
                        id: "brush-smooth-loose",
                        label: "Smoothing 0",
                        icon: "brushsmoothness",
                        active: brushSmoothness === 0,
                        apply: () => setNumericToolSetting("brushStabilizerWeight", 0),
                    },
                    {
                        id: "brush-smooth-balanced",
                        label: "Smoothing 20",
                        icon: "brushsmoothness",
                        active: brushSmoothness === 20,
                        apply: () => setNumericToolSetting("brushStabilizerWeight", 20),
                    },
                    {
                        id: "brush-smooth-stable",
                        label: "Smoothing 60",
                        icon: "brushsmoothness",
                        active: brushSmoothness === 60,
                        apply: () => setNumericToolSetting("brushStabilizerWeight", 60),
                    },
                    {
                        id: "brush-mode-none",
                        label: "Mode: None",
                        icon: "brushmodenone",
                        active: brushMode === "none",
                        apply: () => setToolSettingProp("brushMode", "none"),
                    },
                    {
                        id: "brush-mode-behind",
                        label: "Mode: Behind",
                        icon: "brushmodeoutside",
                        active: brushMode === "behind" || brushMode === "outside",
                        apply: () => setToolSettingProp("brushMode", "behind"),
                    },
                    {
                        id: "brush-mode-inside",
                        label: "Mode: Inside",
                        icon: "brushmodeinside",
                        active: brushMode === "inside",
                        apply: () => setToolSettingProp("brushMode", "inside"),
                    },
                ],
            };
        }

        if (activeTool === "eraser") {
            const eraserSize = getNumericToolSetting("eraserSize");
            return {
                title: "Eraser Presets",
                subtitle: "Fast edge cleanup and broad erase modes",
                items: [
                    {
                        id: "eraser-size-small",
                        label: "Size 6",
                        icon: "eraser",
                        active: eraserSize === 6,
                        apply: () => setNumericToolSetting("eraserSize", 6),
                    },
                    {
                        id: "eraser-size-medium",
                        label: "Size 12",
                        icon: "eraser",
                        active: eraserSize === 12,
                        apply: () => setNumericToolSetting("eraserSize", 12),
                    },
                    {
                        id: "eraser-size-large",
                        label: "Size 24",
                        icon: "eraser",
                        active: eraserSize === 24,
                        apply: () => setNumericToolSetting("eraserSize", 24),
                    },
                ],
            };
        }

        if (
            activeTool === "pencil" ||
            activeTool === "line" ||
            activeTool === "ellipse" ||
            activeTool === "rectangle"
        ) {
            const strokeWidth = getNumericToolSetting("strokeWidth");
            const cornerRadius = getNumericToolSetting("cornerRadius");
            const showCornerRadiusPresets = activeTool === "rectangle";

            return {
                title: "Shape Presets",
                subtitle: showCornerRadiusPresets
                    ? "Stroke and corner presets for quick shape styling"
                    : "Stroke width presets for fast shape styling",
                items: [
                    {
                        id: "shape-stroke-thin",
                        label: "Stroke 1",
                        icon: "strokewidth",
                        active: strokeWidth === 1,
                        apply: () => setNumericToolSetting("strokeWidth", 1),
                    },
                    {
                        id: "shape-stroke-medium",
                        label: "Stroke 3",
                        icon: "strokewidth",
                        active: strokeWidth === 3,
                        apply: () => setNumericToolSetting("strokeWidth", 3),
                    },
                    {
                        id: "shape-stroke-bold",
                        label: "Stroke 6",
                        icon: "strokewidth",
                        active: strokeWidth === 6,
                        apply: () => setNumericToolSetting("strokeWidth", 6),
                    },
                    ...(showCornerRadiusPresets
                        ? [
                            {
                                id: "shape-corner-sharp",
                                label: "Corners 0",
                                icon: "cornerradius",
                                active: cornerRadius === 0,
                                apply: () => setNumericToolSetting("cornerRadius", 0),
                            },
                            {
                                id: "shape-corner-soft",
                                label: "Corners 8",
                                icon: "cornerradius",
                                active: cornerRadius === 8,
                                apply: () => setNumericToolSetting("cornerRadius", 8),
                            },
                            {
                                id: "shape-corner-round",
                                label: "Corners 20",
                                icon: "cornerradius",
                                active: cornerRadius === 20,
                                apply: () => setNumericToolSetting("cornerRadius", 20),
                            },
                        ]
                        : []),
                ],
            };
        }

        if (activeTool === "fillbucket") {
            const gapFillAmount = getNumericToolSetting("gapFillAmount");
            return {
                title: "Fill Presets",
                subtitle: "Control how aggressively gaps are treated",
                items: [
                    {
                        id: "fill-gap-tight",
                        label: "Gap Fill 0",
                        icon: "gapfillamount",
                        active: gapFillAmount === 0,
                        apply: () => setNumericToolSetting("gapFillAmount", 0),
                    },
                    {
                        id: "fill-gap-default",
                        label: "Gap Fill 1",
                        icon: "gapfillamount",
                        active: gapFillAmount === 1,
                        apply: () => setNumericToolSetting("gapFillAmount", 1),
                    },
                    {
                        id: "fill-gap-loose",
                        label: "Gap Fill 3",
                        icon: "gapfillamount",
                        active: gapFillAmount === 3,
                        apply: () => setNumericToolSetting("gapFillAmount", 3),
                    },
                    {
                        id: "fill-gap-wide",
                        label: "Gap Fill 5",
                        icon: "gapfillamount",
                        active: gapFillAmount === 5,
                        apply: () => setNumericToolSetting("gapFillAmount", 5),
                    },
                ],
            };
        }

        return null;
    };

    const presetMenuData = getToolPresetMenuData();

    const renderToolPresetMenu = (): JSX.Element | null => {
        if (!presetMenuData) {
            return null;
        }

        return (
            <div
                id="tool-settings-presets-popover-button"
                className="tool-settings-presets-anchor"
            >
                <ActionButton
                    id="tool-settings-presets-toggle"
                    icon="settings"
                    color="tool"
                    tooltip={presetMenuData.title}
                    className="tool-settings-presets-toggle"
                    action={toggleToolPresets}
                    isActive={() => showToolPresets}
                />
                <PopupMenu
                    mobile={isMobile}
                    isOpen={showToolPresets && !previewPlaying}
                    toggle={toggleToolPresets}
                    target="tool-settings-presets-popover-button"
                    className="tool-settings-menu-popover tool-settings-presets-menu-popover"
                >
                    <div className="tool-settings-presets-widget">
                        <div className="tool-settings-presets-list">
                            {presetMenuData.items.map((item) => (
                                <button
                                    key={item.id}
                                    type="button"
                                    className={classNames(
                                        "tool-settings-presets-item",
                                        { active: item.active }
                                    )}
                                    onClick={() => {
                                        item.apply();
                                        setShowToolPresets(false);
                                    }}
                                >
                                    <ToolIcon
                                        className="tool-settings-presets-item-icon"
                                        name={item.icon}
                                    />
                                    <span className="tool-settings-presets-item-label">
                                        {item.label}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </PopupMenu>
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

    return (
        <div id="settings-panel-container">
            {renderSettings()}
            {renderToolPresetMenu()}
        </div>
    );
};

export default ToolSettings;
