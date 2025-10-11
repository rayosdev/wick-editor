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

class Inspector extends Component<InspectorProps> {
    private inspectorContentRenderFunctions: Record<string, () => JSX.Element | null>;

    private actionRules: Record<string, string[]>;

    private inspectorTitles: Record<string, string>;

    constructor(props: InspectorProps) {
        super(props);

        this.inspectorContentRenderFunctions = {
            frame: this.renderFrame,
            layer: this.renderLayer,
            multiframe: this.renderMultiFrame,
            tween: this.renderTween,
            multitween: this.renderMultiTween,
            clip: this.renderClip,
            button: this.renderButton,
            path: this.renderPath,
            text: this.renderText,
            image: this.renderImage,
            multipath: this.renderMultiPath,
            multiclip: this.renderMultiClip,
            multitimeline: this.renderMultiTimeline,
            multicanvas: this.renderMultiCanvas,
            imageasset: this.renderAsset,
            soundasset: this.renderAsset,
            multiassetmixed: this.renderAsset,
            multisoundasset: this.renderAsset,
            multiimageasset: this.renderAsset,
        };

        this.actionRules = {
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

        this.inspectorTitles = {
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
    }

    getSelectionAttribute = (attribute: string): any => {
        if (attribute === "fillColorOpacity") {
            return this.getSelectionFillColorOpacity();
        }

        return this.props.getAllSelectionAttributes()[attribute];
    };

    getSelectionFillColorOpacity = (): any => {
        return this.getSelectionAttribute("fillColor").alpha;
    };

    setSelectionFillColorOpacity = (value: any): void => {
        const color = this.getSelectionAttribute("fillColor");
        color.alpha = value;
        this.setSelectionAttribute("fillColor", color);
    };

    setSelectionAttribute = (attribute: string, newValue: any): void => {
        if (attribute === "fillColorOpacity") {
            this.setSelectionFillColorOpacity(newValue);
            return;
        }
        this.props.setSelectionAttribute(attribute, newValue);
    };

    getSelectionInputProps = (
        attribute: string
    ): Record<string, any> | undefined => {
        return this.props.getSelectionInputProps?.(attribute);
    };

    renderSelectionStrokeWidth = (): JSX.Element => {
        return (
            <InspectorNumericSlider
                tooltip="Stroke Width"
                val={this.getSelectionAttribute("strokeWidth")}
                onChange={(val) => this.setSelectionAttribute("strokeWidth", val)}
                divider={false}
                inputProps={this.getSelectionInputProps("strokeWidth")}
                id="inspector-selection-stroke-width"
            />
        );
    };

    renderSelectionColor = (): JSX.Element => {
        return (
            <div className="inspector-item">
                <InspectorColorNumericInput
                    tooltip1="Fill"
                    tooltip2="Opacity"
                    val1={this.getSelectionAttribute("fillColor").toCSS()}
                    onChange1={(col) => this.setSelectionAttribute("fillColor", col)}
                    id={"inspector-selection-fill-color"}
                    val2={this.getSelectionAttribute("fillColorOpacity")}
                    onChange2={(val) => this.setSelectionAttribute("fillColorOpacity", val)}
                    divider={false}
                    colorPickerType={this.props.colorPickerType}
                    changeColorPickerType={this.props.changeColorPickerType}
                    updateLastColors={this.props.updateLastColors}
                    lastColorsUsed={this.props.lastColorsUsed}
                />
                <InspectorColorNumericInput
                    tooltip1="Stroke"
                    tooltip2="Weight"
                    val1={this.getSelectionAttribute("strokeColor").toCSS()}
                    onChange1={(col) => this.setSelectionAttribute("strokeColor", col)}
                    id={"inspector-selection-stroke-color"}
                    stroke={true}
                    val2={this.getSelectionAttribute("strokeWidth")}
                    onChange2={(val) => this.setSelectionAttribute("strokeWidth", val)}
                    divider={false}
                    colorPickerType={this.props.colorPickerType}
                    changeColorPickerType={this.props.changeColorPickerType}
                    updateLastColors={this.props.updateLastColors}
                    lastColorsUsed={this.props.lastColorsUsed}
                />
            </div>
        );
    };

    renderFontFamily = (): JSX.Element => {
        const getFontClass = (font: string) => {
            const fontClass = "font-selector-" + font.split(" ").join("-");
            const existingClass = this.props.fontInfoInterface.isExistingFont(font)
                ? " existing-font"
                : "";
            return fontClass + existingClass;
        };

        const opts: InspectorSelectorOption[] = this.props.fontInfoInterface.allFontNames.map(
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
                value={this.getSelectionAttribute("fontFamily")}
                tooltip="Font Family"
                type="select"
                isSearchable={true}
                options={opts}
                onChange={(val) => {
                    const font = val.value;

                    if (this.props.fontInfoInterface.hasFont(val.value)) {
                        this.setSelectionAttribute("fontFamily", font);
                        return;
                    }

                    this.props.fontInfoInterface.getFontFile({
                        font,
                        callback: (blob: Blob) => {
                            const file = new File([blob], font + ".ttf", { type: "font/ttf" });
                            this.props.importFileAsAsset(file, () => {
                                this.setSelectionAttribute("fontFamily", font);
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

    renderFontStyle = (): JSX.Element => {
        const options = [
            { value: "normal", label: "normal" },
            { value: "italic", label: "italic" },
        ];
        return (
            <InspectorSelector
                tooltip="Style"
                type="select"
                isSearchable={true}
                value={this.getSelectionAttribute("fontStyle")}
                options={options}
                onChange={(val) => {
                    this.setSelectionAttribute("fontStyle", val.value);
                }}
            />
        );
    };

    renderFontWeight = (): JSX.Element => {
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

        const weight = Math.min(Math.max(this.getSelectionAttribute("fontWeight"), 100), 900);

        return (
            <InspectorSelector
                tooltip="Weight"
                type="select"
                isSearchable={true}
                value={weight}
                options={fontWeights}
                onChange={(val) => {
                    const newWeight = val.value || 400;
                    this.setSelectionAttribute("fontWeight", newWeight);
                }}
            />
        );
    };

    renderFontSize = (): JSX.Element => {
        return (
            <InspectorNumericInput
                tooltip="Font Size"
                val={this.getSelectionAttribute("fontSize")}
                onChange={(val) => this.setSelectionAttribute("fontSize", val)}
            />
        );
    };

    renderName = (): JSX.Element => {
        return (
            <div className="inspector-item">
                <InspectorTextInput
                    tooltip="Name"
                    val={this.getSelectionAttribute("name")}
                    onChange={(val) => {
                        this.setSelectionAttribute("name", val);
                    }}
                    placeholder="no_name"
                    id="inspector-name"
                />
            </div>
        );
    };

    renderIdentifier = (): JSX.Element => {
        return (
            <div className="inspector-item">
                <InspectorTextInput
                    tooltip="Name"
                    val={this.getSelectionAttribute("identifier")}
                    onChange={(val) => {
                        this.setSelectionAttribute("identifier", val);
                    }}
                    placeholder="no_name"
                    id="inspector-name"
                />
            </div>
        );
    };

    renderFilename = (): JSX.Element => {
        return (
            <div className="inspector-item">
                <InspectorTextInput
                    tooltip="File"
                    val={this.getSelectionAttribute("filename")}
                    readOnly={true}
                    id="inspector-file-name"
                />
            </div>
        );
    };

    renderAssetPreview = (): JSX.Element | undefined => {
        const selectionType = this.props.getSelectionType();
        if (selectionType === "imageasset") {
            return (
                <InspectorImagePreview
                    src={this.getSelectionAttribute("src")}
                    id="inspector-image-preview"
                />
            );
        }
        if (selectionType === "soundasset") {
            return (
                <InspectorSoundPreview
                    src={this.getSelectionAttribute("src")}
                    id="inspector-sound-preview"
                />
            );
        }
        return undefined;
    };

    renderFrameLength = (): JSX.Element => {
        return (
            <div className="inspector-item">
                <InspectorNumericInput
                    tooltip="Length"
                    val={this.getSelectionAttribute("frameLength")}
                    onChange={(val) => this.setSelectionAttribute("frameLength", val)}
                    id="inspector-frame-length"
                />
            </div>
        );
    };

    renderPosition = (): JSX.Element => {
        return (
            <InspectorDualNumericInput
                tooltip1="Origin X"
                tooltip2="Origin Y"
                val1={this.getSelectionAttribute("originX")}
                val2={this.getSelectionAttribute("originY")}
                onChange1={(val) => this.setSelectionAttribute("originX", val)}
                onChange2={(val) => this.setSelectionAttribute("originY", val)}
                id="inspector-origin"
            />
        );
    };

    renderOrigin = (): JSX.Element => {
        return (
            <InspectorDualNumericInput
                tooltip1="X"
                tooltip2="Y"
                val1={this.getSelectionAttribute("x")}
                val2={this.getSelectionAttribute("y")}
                onChange1={(val) => this.setSelectionAttribute("x", val)}
                onChange2={(val) => this.setSelectionAttribute("y", val)}
                id="inspector-position"
            />
        );
    };

    renderSize = (): JSX.Element => {
        return (
            <InspectorDualNumericInput
                tooltip1="Width"
                tooltip2="Height"
                val1={this.getSelectionAttribute("width")}
                val2={this.getSelectionAttribute("height")}
                onChange1={(val) => this.setSelectionAttribute("width", val)}
                onChange2={(val) => this.setSelectionAttribute("height", val)}
                id="inspector-size"
            />
        );
    };

    renderScale = (): JSX.Element => {
        return (
            <InspectorDualNumericInput
                tooltip1="Scale W"
                tooltip2="Scale H"
                val1={this.getSelectionAttribute("scaleX")}
                val2={this.getSelectionAttribute("scaleY")}
                onChange1={(val) => this.setSelectionAttribute("scaleX", val)}
                onChange2={(val) => this.setSelectionAttribute("scaleY", val)}
                id="inspector-scale"
            />
        );
    };

    renderRotation = (): JSX.Element => {
        return (
            <InspectorNumericInput
                tooltip="Rotation"
                val={this.getSelectionAttribute("rotation")}
                onChange={(val) => this.setSelectionAttribute("rotation", val)}
                id="inspector-rotation"
            />
        );
    };

    renderOpacity = (): JSX.Element => {
        return (
            <InspectorNumericSlider
                tooltip="Opacity"
                val={this.getSelectionAttribute("opacity")}
                onChange={(val) => this.setSelectionAttribute("opacity", val)}
                divider={false}
                inputProps={{ min: 0, max: 1, step: 0.01 }}
                id="inspector-opacity"
            />
        );
    };

    renderSelectionTransformProperties = (): JSX.Element => {
        return (
            <div className="inspector-item">
                {this.renderPosition()}
                {this.renderOrigin()}
                {this.renderSize()}
                {this.renderScale()}
                {this.renderRotation()}
                {this.renderOpacity()}
            </div>
        );
    };

    renderSelectionSoundAsset = (): JSX.Element => {
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

        const assetOptions = this.props.getAllSoundAssets().map(mapAsset);
        const resolvedOptions = options.concat(assetOptions);

        const value = this.getSelectionAttribute("sound");
        return (
            <InspectorSelector
                tooltip="Sound"
                type="select"
                options={resolvedOptions}
                value={value}
                isSearchable={true}
                onChange={(val) => {
                    this.setSelectionAttribute("sound", val.value);
                }}
            />
        );
    };

    renderSelectionSoundVolume = (): JSX.Element => {
        return (
            <InspectorNumericInput
                tooltip="Volume"
                val={this.getSelectionAttribute("soundVolume")}
                onChange={(val) => {
                    this.setSelectionAttribute("soundVolume", val);
                }}
                id="inspector-sound-volume"
            />
        );
    };

    renderSelectionSoundStart = (): JSX.Element => {
        return (
            <InspectorNumericInput
                tooltip="Start (ms)"
                type="numeric"
                val={this.getSelectionAttribute("soundStart")}
                onChange={(val) => {
                    this.setSelectionAttribute("soundStart", val);
                }}
            />
        );
    };

    renderSoundContent = (): JSX.Element => {
        return (
            <div className="inspector-item">
                {this.renderSelectionSoundAsset()}
                {this.getSelectionAttribute("sound") && this.renderSelectionSoundVolume()}
                {this.getSelectionAttribute("sound") && this.renderSelectionSoundStart()}
            </div>
        );
    };

    renderAnimationType = (): JSX.Element => {
        return (
            <div className="inspector-item">
                <InspectorSelector
                    tooltip="Animation"
                    type="select"
                    options={this.props.getClipAnimationTypes()}
                    value={this.getSelectionAttribute("animationType")}
                    isSearchable={true}
                    onChange={(val) => {
                        this.setSelectionAttribute("animationType", val.value);
                    }}
                />
                {this.getSelectionAttribute("singleFrameNumber") && (
                    <InspectorNumericInput
                        tooltip="Frame"
                        val={this.getSelectionAttribute("singleFrameNumber")}
                        onChange={(val) => this.setSelectionAttribute("singleFrameNumber", val)}
                    />
                )}
                {this.getSelectionAttribute("animationType") !== "single" && (
                    <InspectorCheckbox
                        tooltip="Synced"
                        checked={this.getSelectionAttribute("isSynced")}
                        onChange={() =>
                            this.setSelectionAttribute(
                                "isSynced",
                                !this.getSelectionAttribute("isSynced")
                            )
                        }
                    />
                )}
            </div>
        );
    };

    renderTweenEasingType = (): JSX.Element => {
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
                    value={this.getSelectionAttribute("easingType")}
                    isSearchable={true}
                    onChange={(val) => {
                        this.setSelectionAttribute("easingType", val.value);
                    }}
                />
            </div>
        );
    };

    renderTweenFullRotations = (): JSX.Element => {
        return (
            <div className="inspector-item">
                <InspectorNumericInput
                    tooltip="Full Rotations"
                    val={this.getSelectionAttribute("fullRotations")}
                    onChange={(val) => this.setSelectionAttribute("fullRotations", val)}
                    id="inspector-full-rotation"
                />
            </div>
        );
    };

    renderFrame = (): JSX.Element => {
        return (
            <div className="inspector-content">
                {this.renderIdentifier()}
                {this.renderFrameLength()}
                {this.renderSoundContent()}
            </div>
        );
    };

    renderLayer = (): JSX.Element => {
        return (
            <div className="inspector-content">{this.renderName()}</div>
        );
    };

    renderMultiFrame = (): JSX.Element => {
        return <div className="inspector-content" />;
    };

    renderMultiClip = (): JSX.Element => {
        return <div className="inspector-content" />;
    };

    renderTween = (): JSX.Element => {
        return (
            <div className="inspector-content">
                {this.renderTweenEasingType()}
                {this.renderTweenFullRotations()}
            </div>
        );
    };

    renderMultiTween = (): JSX.Element => {
        return (
            <div className="inspector-content">
                {this.renderTweenEasingType()}
                {this.renderTweenFullRotations()}
            </div>
        );
    };

    renderGroupContent = (): JSX.Element => {
        return (
            <div className="inspector-content">
                {this.renderIdentifier()}
                {this.renderSelectionTransformProperties()}
            </div>
        );
    };

    renderGroup = (): JSX.Element => {
        return this.renderGroupContent();
    };

    renderMultiGroup = (): JSX.Element => {
        return this.renderGroupContent();
    };

    renderClip = (): JSX.Element => {
        return this.renderGroupContent();
    };

    renderButton = (): JSX.Element => {
        return this.renderGroupContent();
    };

    renderFontContent = (): JSX.Element => {
        return (
            <div className="inspector-item">
                {this.renderFontFamily()}
                {this.renderFontStyle()}
                {this.renderFontWeight()}
                {this.renderFontSize()}
            </div>
        );
    };

    renderPathContent = (): JSX.Element => {
        return (
            <div className="inspector-content">
                {this.renderSelectionTransformProperties()}
                {this.renderSelectionColor()}
            </div>
        );
    };

    renderPath = (): JSX.Element => {
        return this.renderPathContent();
    };

    renderText = (): JSX.Element => {
        return (
            <div className="inspector-content">
                {this.renderIdentifier()}
                {this.renderSelectionTransformProperties()}
                {this.renderSelectionColor()}
                {this.renderFontContent()}
            </div>
        );
    };

    renderAnimationSetting = (): JSX.Element => {
        return (
            <div className="inspector-content">{this.renderAnimationType()}</div>
        );
    };

    renderImage = (): JSX.Element => {
        return (
            <div className="inspector-content">
                {this.renderSelectionTransformProperties()}
            </div>
        );
    };

    renderMultiPath = (): JSX.Element => {
        return (
            <div className="inspector-content">
                {this.renderSelectionTransformProperties()}
                {this.renderSelectionColor()}
                {this.getSelectionAttribute("fontFamily") && this.renderFontContent()}
            </div>
        );
    };

    renderMultiCanvas = (): JSX.Element => {
        return this.renderSelectionTransformProperties();
    };

    renderMultiTimeline = (): JSX.Element => {
        return <div></div>;
    };

    renderAsset = (): JSX.Element => {
        return (
            <div className="inspector-content">
                {this.renderName()}
                {this.renderFilename()}
                {this.renderAssetPreview()}
            </div>
        );
    };

    renderUnknown = (): JSX.Element => {
        return (
            <div>
                <div className="inspector-content"></div>
            </div>
        );
    };

    renderDisplay = (selectionType: string): JSX.Element | null => {
        let renderFunction = this.inspectorContentRenderFunctions[selectionType];
        if (!renderFunction) {
            renderFunction = this.renderUnknown;
        }

        return renderFunction();
    };

    renderActionButton = (action: any, i: number): JSX.Element => {
        return (
            <div key={i} className="inspector-item">
                <InspectorActionButton action={action} />
            </div>
        );
    };

    renderActions = (): JSX.Element => {
        const actions: any[] = [];
        const selectionType = this.props.getSelectionType();

        Object.keys(this.actionRules).forEach((action) => {
            const actionList = this.actionRules[action] ?? [];
            if (actionList.indexOf(selectionType) > -1) actions.push(action);
        });

        return (
            <div className="inspector-content">
                {actions.map((action, i) => {
                    return this.renderActionButton(this.props.editorActions[action], i);
                })}
            </div>
        );
    };

    renderScripts = (): JSX.Element => {
        const defaultScriptInfo: ScriptWindowScriptInfoInterface = {
            scriptsByType: {},
            scriptTypeColors: {},
        };

        return (
            <div className="inspector-item">
                <InspectorScriptWindow
                    script={this.props.script ?? { scripts: [] }}
                    deleteScript={
                        this.props.deleteScript ?? ((script) => {
                            console.warn("deleteScript handler missing", script);
                        })
                    }
                    editScript={
                        this.props.editScript ?? ((name) => {
                            console.warn("editScript handler missing", name);
                        })
                    }
                    scriptInfoInterface={this.props.scriptInfoInterface ?? defaultScriptInfo}
                />
            </div>
        );
    };

    renderTitle = (selectionType: string): JSX.Element => {
        if (!(selectionType in this.inspectorTitles)) selectionType = "";

        return (
            <div className="inspector-title-container">
                <InspectorTitle
                    type={selectionType}
                    title={this.inspectorTitles[selectionType]}
                />
            </div>
        );
    };

    render(): JSX.Element {
        const selectionType = this.props.getSelectionType();
        return (
            <div className="docked-pane inspector" aria-label="Inspector Panel">
                {this.renderTitle(selectionType)}
                <div className="inspector-body">
                    {this.renderDisplay(selectionType)}
                    {this.renderActions()}
                    {this.props.selectionIsScriptable() && this.renderScripts()}
                    {selectionType === "clip" && this.renderAnimationSetting()}
                </div>
            </div>
        );
    }
}

export default Inspector;
