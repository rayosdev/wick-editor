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

import React from "react";

import "./_inspector.scss";
import "./_inspectorselector.scss";
import "bootstrap/dist/css/bootstrap.min.css";

import type { Script as ScriptType, ScriptWindowScriptInfoInterface } from "Editor/types";

import InspectorTitle from "./InspectorTitle/InspectorTitle";

import InspectorNumericSlider from "./InspectorRow/InspectorRowTypes/InspectorNumericSlider";
import InspectorTextInput from "./InspectorRow/InspectorRowTypes/InspectorTextInput";
import InspectorNumericInput from "./InspectorRow/InspectorRowTypes/InspectorNumericInput";
import InspectorDualNumericInput from "./InspectorRow/InspectorRowTypes/InspectorDualNumericInput";
import InspectorSelector from "./InspectorRow/InspectorRowTypes/InspectorSelector";
import InspectorColorNumericInput from "./InspectorRow/InspectorRowTypes/InspectorColorNumericInput";
import InspectorActionButton from "./InspectorActionButton/InspectorActionButton";
import InspectorImagePreview from "./InspectorPreview/InspectorPreviewTypes/InspectorImagePreview";
import InspectorSoundPreview from "./InspectorPreview/InspectorPreviewTypes/InspectorSoundPreview";
import InspectorScriptWindow from "./InspectorScriptWindow/InspectorScriptWindow";
import InspectorCheckbox from "./InspectorRow/InspectorRowTypes/InspectorCheckbox";

import type { WickAsset } from "Editor/types";

type SelectionAttributes = Record<string, any>; // Dynamic selection attributes - inherently flexible
type InspectorSelectorOption = {
    value: string | number | boolean | null | WickAsset; // Selector values can be primitives, null, or assets
    label: string;
    [key: string]: any; // Additional props inherently flexible
};

interface FontInfoInterface {
    allFontNames: string[];
    isExistingFont: (font: string) => boolean;
    hasFont: (font: string) => boolean;
    getFontFile: (options: {
        font: string;
        callback: (blob: Blob) => void;
        error: (error: unknown) => void;
    }) => void;
}

interface InspectorProps {
    getAllSelectionAttributes: () => SelectionAttributes;
    setSelectionAttribute: (attribute: string, value: unknown) => void; // Truly polymorphic
    getSelectionType: () => string;
    getSelectionInputProps?: (attribute: string) => Record<string, any> | undefined; // Dynamic props
    colorPickerType?: string;
    changeColorPickerType?: (type: string) => void;
    updateLastColors?: (color: string) => void;
    lastColorsUsed?: string[];
    fontInfoInterface: FontInfoInterface;
    importFileAsAsset: (file: File, onComplete: () => void) => void;
    getAllSoundAssets: () => WickAsset[];
    getClipAnimationTypes: () => Array<{ label: string; value: string }>;
    editorActions: Record<string, (...args: any[]) => void>; // Action functions
    selectionIsScriptable: () => boolean;
    script?: ScriptType;
    deleteScript?: (script: ScriptType, name: string) => void;
    editScript?: (name: string) => void;
    scriptInfoInterface?: ScriptWindowScriptInfoInterface;
}

declare global {
    interface Window {
        Wick: any;
    }
}

const Inspector: React.FC<InspectorProps> = (props) => {
    const getSelectionAttribute = (attribute: string): any => {
        if (attribute === "fillColorOpacity") {
            return getSelectionFillColorOpacity();
        }

        return props.getAllSelectionAttributes()[attribute];
    };

    const getSelectionFillColorOpacity = (): any => {
        return getSelectionAttribute("fillColor").alpha;
    };

    const setSelectionFillColorOpacity = (value: any): void => {
        const color = getSelectionAttribute("fillColor");
        color.alpha = value;
        setSelectionAttribute("fillColor", color);
    };

    const setSelectionAttribute = (attribute: string, newValue: any): void => {
        if (attribute === "fillColorOpacity") {
            setSelectionFillColorOpacity(newValue);
            return;
        }
        props.setSelectionAttribute(attribute, newValue);
    };

    const getSelectionInputProps = (
        attribute: string
    ): Record<string, any> | undefined => {
        return props.getSelectionInputProps?.(attribute);
    };

    const actionRules: Record<string, string[]> = {
        breakApart: ["clip", "button"],
        convertSelectionToButton: [
            "path",
            "text",
            "image",
            "multipath",
            "multiclip",
            "multicanvas",
        ],
        convertSelectionToClip: [
            "path",
            "text",
            "image",
            "multipath",
            "multiclip",
            "multicanvas",
        ],
        editTimeline: ["clip", "button"],
        addAssetToCanvas: ["imageasset"],
    };

    const inspectorTitles: Record<string, string> = {
        frame: "Frame",
        multiframe: "Multi-Frame",
        tween: "Tween",
        multitween: "Multi-Tween",
        clip: "Clip",
        button: "Button",
        path: "Path",
        text: "Text",
        image: "Image",
        multipath: "Multi-Path",
        multiclip: "Multi-Clip",
        multitimeline: "Multi-Timeline",
        multicanvas: "Multi-Canvas",
        imageasset: "Image Asset",
        soundasset: "Sound Asset",
        multiassetmixed: "Multi-Asset",
        multisoundasset: "Multi-Asset Sound",
        multiimageasset: "Multi-Asset Image",
        unknown: "",
    };

    const renderSelectionStrokeWidth = (): JSX.Element => {
        return (
            <InspectorNumericSlider
                tooltip="Stroke Width"
                val={getSelectionAttribute("strokeWidth")}
                onChange={(val) => setSelectionAttribute("strokeWidth", val)}
                divider={false}
                inputProps={getSelectionInputProps("strokeWidth")}
                id="inspector-selection-stroke-width"
            />
        );
    };

    const renderSelectionColor = (): JSX.Element => {
        return (
            <div className="inspector-item">
                <InspectorColorNumericInput
                    tooltip1="Fill"
                    tooltip2="Opacity"
                    val1={getSelectionAttribute("fillColor").toCSS()}
                    onChange1={(col) => setSelectionAttribute("fillColor", col)}
                    id={"inspector-selection-fill-color"}
                    val2={getSelectionAttribute("fillColorOpacity")}
                    onChange2={(val) => setSelectionAttribute("fillColorOpacity", val)}
                    divider={false}
                    colorPickerType={props.colorPickerType}
                    changeColorPickerType={props.changeColorPickerType}
                    updateLastColors={props.updateLastColors}
                    lastColorsUsed={props.lastColorsUsed}
                />
                <InspectorColorNumericInput
                    tooltip1="Stroke"
                    tooltip2="Weight"
                    val1={getSelectionAttribute("strokeColor").toCSS()}
                    onChange1={(col) => setSelectionAttribute("strokeColor", col)}
                    id={"inspector-selection-stroke-color"}
                    stroke={true}
                    val2={getSelectionAttribute("strokeWidth")}
                    onChange2={(val) => setSelectionAttribute("strokeWidth", val)}
                    divider={false}
                    colorPickerType={props.colorPickerType}
                    changeColorPickerType={props.changeColorPickerType}
                    updateLastColors={props.updateLastColors}
                    lastColorsUsed={props.lastColorsUsed}
                />
            </div>
        );
    };

    const renderFontFamily = (): JSX.Element => {
        const getFontClass = (font: string) => {
            const fontClass = "font-selector-" + font.split(" ").join("-");
            const existingClass = props.fontInfoInterface.isExistingFont(font)
                ? " existing-font"
                : "";
            return fontClass + existingClass;
        };

        const opts: InspectorSelectorOption[] = props.fontInfoInterface.allFontNames.map(
            (opt) => {
                return {
                    value: opt,
                    label: opt,
                    className: getFontClass(opt),
                };
            }
        );

        return (
            <InspectorSelector
                className="font-family"
                value={getSelectionAttribute("fontFamily")}
                tooltip="Font Family"
                type="select"
                isSearchable={true}
                options={opts}
                onChange={(val) => {
                    const font = val.value;

                    if (props.fontInfoInterface.hasFont(val.value)) {
                        setSelectionAttribute("fontFamily", font);
                        return;
                    }

                    props.fontInfoInterface.getFontFile({
                        font,
                        callback: (blob: Blob) => {
                            const file = new File([blob], font + ".ttf", { type: "font/ttf" });
                            props.importFileAsAsset(file, () => {
                                setSelectionAttribute("fontFamily", font);
                            });
                        },
                        error: (error: unknown) => {
                            console.error(error);
                        },
                    });
                }}
            ></InspectorSelector>
        );
    };

    const renderFontStyle = (): JSX.Element => {
        const options = [
            { value: "normal", label: "normal" },
            { value: "italic", label: "italic" },
        ];
        return (
            <InspectorSelector
                tooltip="Style"
                type="select"
                isSearchable={true}
                value={getSelectionAttribute("fontStyle")}
                options={options}
                onChange={(val) => {
                    setSelectionAttribute("fontStyle", val.value);
                }}
            />
        );
    };

    const renderFontWeight = (): JSX.Element => {
        const fontWeights = [
            { label: "thin", value: 100 },
            { label: "extra light", value: 200 },
            { label: "light", value: 300 },
            { label: "normal", value: 400 },
            { label: "medium", value: 500 },
            { label: "semi bold", value: 600 },
            { label: "bold", value: 700 },
            { label: "extra bold", value: 800 },
            { label: "black", value: 900 },
        ];

        const weight = Math.min(Math.max(getSelectionAttribute("fontWeight"), 100), 900);

        return (
            <InspectorSelector
                tooltip="Weight"
                type="select"
                isSearchable={true}
                value={weight}
                options={fontWeights}
                onChange={(val) => {
                    const newWeight = val.value || 400;
                    setSelectionAttribute("fontWeight", newWeight);
                }}
            />
        );
    };

    const renderFontSize = (): JSX.Element => {
        return (
            <InspectorNumericInput
                tooltip="Font Size"
                val={getSelectionAttribute("fontSize")}
                onChange={(val) => setSelectionAttribute("fontSize", val)}
            />
        );
    };

    const renderName = (): JSX.Element => {
        return (
            <div className="inspector-item">
                <InspectorTextInput
                    tooltip="Name"
                    val={getSelectionAttribute("name")}
                    onChange={(val) => {
                        setSelectionAttribute("name", val);
                    }}
                    placeholder="no_name"
                    id="inspector-name"
                />
            </div>
        );
    };

    const renderIdentifier = (): JSX.Element => {
        return (
            <div className="inspector-item">
                <InspectorTextInput
                    tooltip="Name"
                    val={getSelectionAttribute("identifier")}
                    onChange={(val) => {
                        setSelectionAttribute("identifier", val);
                    }}
                    placeholder="no_name"
                    id="inspector-name"
                />
            </div>
        );
    };

    const renderFilename = (): JSX.Element => {
        return (
            <div className="inspector-item">
                <InspectorTextInput
                    tooltip="File"
                    val={getSelectionAttribute("filename")}
                    readOnly={true}
                    id="inspector-file-name"
                />
            </div>
        );
    };

    const renderAssetPreview = (): JSX.Element | undefined => {
        const selectionType = props.getSelectionType();
        if (selectionType === "imageasset") {
            return (
                <InspectorImagePreview
                    src={getSelectionAttribute("src")}
                    id="inspector-image-preview"
                />
            );
        }
        if (selectionType === "soundasset") {
            return (
                <InspectorSoundPreview
                    src={getSelectionAttribute("src")}
                    id="inspector-sound-preview"
                />
            );
        }
        return undefined;
    };

    const renderFrameLength = (): JSX.Element => {
        return (
            <div className="inspector-item">
                <InspectorNumericInput
                    tooltip="Length"
                    val={getSelectionAttribute("frameLength")}
                    onChange={(val) => setSelectionAttribute("frameLength", val)}
                    id="inspector-frame-length"
                />
            </div>
        );
    };

    const renderPosition = (): JSX.Element => {
        return (
            <InspectorDualNumericInput
                tooltip1="Origin X"
                tooltip2="Origin Y"
                val1={getSelectionAttribute("originX")}
                val2={getSelectionAttribute("originY")}
                onChange1={(val) => setSelectionAttribute("originX", val)}
                onChange2={(val) => setSelectionAttribute("originY", val)}
                id="inspector-origin"
            />
        );
    };

    const renderOrigin = (): JSX.Element => {
        return (
            <InspectorDualNumericInput
                tooltip1="X"
                tooltip2="Y"
                val1={getSelectionAttribute("x")}
                val2={getSelectionAttribute("y")}
                onChange1={(val) => setSelectionAttribute("x", val)}
                onChange2={(val) => setSelectionAttribute("y", val)}
                id="inspector-position"
            />
        );
    };

    const renderSize = (): JSX.Element => {
        return (
            <InspectorDualNumericInput
                tooltip1="Width"
                tooltip2="Height"
                val1={getSelectionAttribute("width")}
                val2={getSelectionAttribute("height")}
                onChange1={(val) => setSelectionAttribute("width", val)}
                onChange2={(val) => setSelectionAttribute("height", val)}
                id="inspector-size"
            />
        );
    };

    const renderScale = (): JSX.Element => {
        return (
            <InspectorDualNumericInput
                tooltip1="Scale W"
                tooltip2="Scale H"
                val1={getSelectionAttribute("scaleX")}
                val2={getSelectionAttribute("scaleY")}
                onChange1={(val) => setSelectionAttribute("scaleX", val)}
                onChange2={(val) => setSelectionAttribute("scaleY", val)}
                id="inspector-scale"
            />
        );
    };

    const renderRotation = (): JSX.Element => {
        return (
            <InspectorNumericInput
                tooltip="Rotation"
                val={getSelectionAttribute("rotation")}
                onChange={(val) => setSelectionAttribute("rotation", val)}
                id="inspector-rotation"
            />
        );
    };

    const renderOpacity = (): JSX.Element => {
        return (
            <InspectorNumericSlider
                tooltip="Opacity"
                val={getSelectionAttribute("opacity")}
                onChange={(val) => setSelectionAttribute("opacity", val)}
                divider={false}
                inputProps={{ min: 0, max: 1, step: 0.01 }}
                id="inspector-opacity"
            />
        );
    };

    const renderSelectionTransformProperties = (): JSX.Element => {
        return (
            <div className="inspector-item">
                {renderPosition()}
                {renderOrigin()}
                {renderSize()}
                {renderScale()}
                {renderRotation()}
                {renderOpacity()}
            </div>
        );
    };

    const renderSelectionSoundAsset = (): JSX.Element => {
        const options: InspectorSelectorOption[] = [
            {
                value: null,
                label: "No Sound",
            },
        ];

        const mapAsset = (asset: any) => {
            if (!asset) {
                return {
                    value: "novalue",
                    label: "No Sound",
                };
            }
            return {
                value: asset,
                label: asset.name,
            };
        };

        const assetOptions = props.getAllSoundAssets().map(mapAsset);
        const resolvedOptions = options.concat(assetOptions);

        const value = getSelectionAttribute("sound");
        return (
            <InspectorSelector
                tooltip="Sound"
                type="select"
                options={resolvedOptions}
                value={value}
                isSearchable={true}
                onChange={(val) => {
                    setSelectionAttribute("sound", val.value);
                }}
            />
        );
    };

    const renderSelectionSoundVolume = (): JSX.Element => {
        return (
            <InspectorNumericInput
                tooltip="Volume"
                val={getSelectionAttribute("soundVolume")}
                onChange={(val) => {
                    setSelectionAttribute("soundVolume", val);
                }}
                id="inspector-sound-volume"
            />
        );
    };

    const renderSelectionSoundStart = (): JSX.Element => {
        return (
            <InspectorNumericInput
                tooltip="Start (ms)"
                type="numeric"
                val={getSelectionAttribute("soundStart")}
                onChange={(val) => {
                    setSelectionAttribute("soundStart", val);
                }}
            />
        );
    };

    const renderSoundContent = (): JSX.Element => {
        return (
            <div className="inspector-item">
                {renderSelectionSoundAsset()}
                {getSelectionAttribute("sound") && renderSelectionSoundVolume()}
                {getSelectionAttribute("sound") && renderSelectionSoundStart()}
            </div>
        );
    };

    const renderAnimationType = (): JSX.Element => {
        return (
            <div className="inspector-item">
                <InspectorSelector
                    tooltip="Animation"
                    type="select"
                    options={props.getClipAnimationTypes()}
                    value={getSelectionAttribute("animationType")}
                    isSearchable={true}
                    onChange={(val) => {
                        setSelectionAttribute("animationType", val.value);
                    }}
                />
                {getSelectionAttribute("singleFrameNumber") && (
                    <InspectorNumericInput
                        tooltip="Frame"
                        val={getSelectionAttribute("singleFrameNumber")}
                        onChange={(val) => setSelectionAttribute("singleFrameNumber", val)}
                    />
                )}
                {getSelectionAttribute("animationType") !== "single" && (
                    <InspectorCheckbox
                        tooltip="Synced"
                        checked={getSelectionAttribute("isSynced")}
                        onChange={() =>
                            setSelectionAttribute(
                                "isSynced",
                                !getSelectionAttribute("isSynced")
                            )
                        }
                    />
                )}
            </div>
        );
    };

    const renderTweenEasingType = (): JSX.Element => {
        const options = window.Wick.Tween.VALID_EASING_TYPES;
        const optionLabels: Array<{ label: string; value: string }> = [];
        options.forEach((option: string) => {
            optionLabels.push({ label: option, value: option });
        });
        return (
            <div className="inspector-item">
                <InspectorSelector
                    tooltip="Easing Type"
                    type="select"
                    options={optionLabels}
                    value={getSelectionAttribute("easingType")}
                    isSearchable={true}
                    onChange={(val) => {
                        setSelectionAttribute("easingType", val.value);
                    }}
                />
            </div>
        );
    };

    const renderTweenFullRotations = (): JSX.Element => {
        return (
            <div className="inspector-item">
                <InspectorNumericInput
                    tooltip="Full Rotations"
                    val={getSelectionAttribute("fullRotations")}
                    onChange={(val) => setSelectionAttribute("fullRotations", val)}
                    id="inspector-full-rotation"
                />
            </div>
        );
    };

    const renderFrame = (): JSX.Element => {
        return (
            <div className="inspector-content">
                {renderIdentifier()}
                {renderFrameLength()}
                {renderSoundContent()}
            </div>
        );
    };

    const renderLayer = (): JSX.Element => {
        return (
            <div className="inspector-content">{renderName()}</div>
        );
    };

    const renderMultiFrame = (): JSX.Element => {
        return <div className="inspector-content" />;
    };

    const renderMultiClip = (): JSX.Element => {
        return <div className="inspector-content" />;
    };

    const renderTween = (): JSX.Element => {
        return (
            <div className="inspector-content">
                {renderTweenEasingType()}
                {renderTweenFullRotations()}
            </div>
        );
    };

    const renderMultiTween = (): JSX.Element => {
        return (
            <div className="inspector-content">
                {renderTweenEasingType()}
                {renderTweenFullRotations()}
            </div>
        );
    };

    const renderGroupContent = (): JSX.Element => {
        return (
            <div className="inspector-content">
                {renderIdentifier()}
                {renderSelectionTransformProperties()}
            </div>
        );
    };

    const renderGroup = (): JSX.Element => {
        return renderGroupContent();
    };

    const renderMultiGroup = (): JSX.Element => {
        return renderGroupContent();
    };

    const renderClip = (): JSX.Element => {
        return renderGroupContent();
    };

    const renderButton = (): JSX.Element => {
        return renderGroupContent();
    };

    const renderFontContent = (): JSX.Element => {
        return (
            <div className="inspector-item">
                {renderFontFamily()}
                {renderFontStyle()}
                {renderFontWeight()}
                {renderFontSize()}
            </div>
        );
    };

    const renderPathContent = (): JSX.Element => {
        return (
            <div className="inspector-content">
                {renderSelectionTransformProperties()}
                {renderSelectionColor()}
            </div>
        );
    };

    const renderPath = (): JSX.Element => {
        return renderPathContent();
    };

    const renderText = (): JSX.Element => {
        return (
            <div className="inspector-content">
                {renderIdentifier()}
                {renderSelectionTransformProperties()}
                {renderSelectionColor()}
                {renderFontContent()}
            </div>
        );
    };

    const renderAnimationSetting = (): JSX.Element => {
        return (
            <div className="inspector-content">{renderAnimationType()}</div>
        );
    };

    const renderImage = (): JSX.Element => {
        return (
            <div className="inspector-content">
                {renderSelectionTransformProperties()}
            </div>
        );
    };

    const renderMultiPath = (): JSX.Element => {
        return (
            <div className="inspector-content">
                {renderSelectionTransformProperties()}
                {renderSelectionColor()}
                {getSelectionAttribute("fontFamily") && renderFontContent()}
            </div>
        );
    };

    const renderMultiCanvas = (): JSX.Element => {
        return renderSelectionTransformProperties();
    };

    const renderMultiTimeline = (): JSX.Element => {
        return <div></div>;
    };

    const renderAsset = (): JSX.Element => {
        return (
            <div className="inspector-content">
                {renderName()}
                {renderFilename()}
                {renderAssetPreview()}
            </div>
        );
    };

    const renderUnknown = (): JSX.Element => {
        return (
            <div>
                <div className="inspector-content"></div>
            </div>
        );
    };

    const inspectorContentRenderFunctions: Record<string, () => JSX.Element | null> = {
        frame: renderFrame,
        layer: renderLayer,
        multiframe: renderMultiFrame,
        tween: renderTween,
        multitween: renderMultiTween,
        clip: renderClip,
        button: renderButton,
        path: renderPath,
        text: renderText,
        image: renderImage,
        multipath: renderMultiPath,
        multiclip: renderMultiClip,
        multitimeline: renderMultiTimeline,
        multicanvas: renderMultiCanvas,
        imageasset: renderAsset,
        soundasset: renderAsset,
        multiassetmixed: renderAsset,
        multisoundasset: renderAsset,
        multiimageasset: renderAsset,
    };

    const renderDisplay = (selectionType: string): JSX.Element | null => {
        let renderFunction = inspectorContentRenderFunctions[selectionType];
        if (!renderFunction) {
            renderFunction = renderUnknown;
        }

        return renderFunction();
    };

    const renderActionButton = (action: any, i: number): JSX.Element => {
        return (
            <div key={i} className="inspector-item">
                <InspectorActionButton action={action} />
            </div>
        );
    };

    const renderActions = (): JSX.Element => {
        const actions: any[] = [];
        const selectionType = props.getSelectionType();

        Object.keys(actionRules).forEach((action) => {
            const actionList = actionRules[action] ?? [];
            if (actionList.indexOf(selectionType) > -1) actions.push(action);
        });

        return (
            <div className="inspector-content">
                {actions.map((action, i) => {
                    return renderActionButton(props.editorActions[action], i);
                })}
            </div>
        );
    };

    const renderScripts = (): JSX.Element => {
        const defaultScriptInfo: ScriptWindowScriptInfoInterface = {
            scriptsByType: {},
            scriptTypeColors: {},
        };

        return (
            <div className="inspector-item">
                <InspectorScriptWindow
                    script={props.script ?? { scripts: [] }}
                    deleteScript={
                        props.deleteScript ?? ((script) => {
                            console.warn("deleteScript handler missing", script);
                        })
                    }
                    editScript={
                        props.editScript ?? ((name) => {
                            console.warn("editScript handler missing", name);
                        })
                    }
                    scriptInfoInterface={props.scriptInfoInterface ?? defaultScriptInfo}
                />
            </div>
        );
    };

    const renderTitle = (selectionType: string): JSX.Element => {
        if (!(selectionType in inspectorTitles)) selectionType = "";

        return (
            <div className="inspector-title-container">
                <InspectorTitle
                    type={selectionType}
                    title={inspectorTitles[selectionType]}
                />
            </div>
        );
    };

    const selectionType = props.getSelectionType();
    return (
        <div className="docked-pane inspector" aria-label="Inspector Panel">
            {renderTitle(selectionType)}
            <div className="inspector-body">
                {renderDisplay(selectionType)}
                {renderActions()}
                {props.selectionIsScriptable() && renderScripts()}
                {selectionType === "clip" && renderAnimationSetting()}
            </div>
        </div>
    );
};

export default Inspector;
