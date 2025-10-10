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

import { Component, Fragment } from "react";

import "./_mobileinspector.scss";
import "../../Inspector/_inspectorselector.scss";
import "bootstrap/dist/css/bootstrap.min.css";

import MobileInspectorNumericSlider from "./MobileInspectorRow/MobileInspectorRowTypes/MobileInspectorNumericSlider";
import MobileInspectorTextInput from "./MobileInspectorRow/MobileInspectorRowTypes/MobileInspectorTextInput";
import MobileInspectorNumericInput from "./MobileInspectorRow/MobileInspectorRowTypes/MobileInspectorNumericInput";
import MobileInspectorDualNumericInput from "./MobileInspectorRow/MobileInspectorRowTypes/MobileInspectorDualNumericInput";
import MobileInspectorSelector, {
    type MobileInspectorSelectorOption,
} from "./MobileInspectorRow/MobileInspectorRowTypes/MobileInspectorSelector";
import InspectorActionButton from "../../Inspector/InspectorActionButton/InspectorActionButton";
import InspectorImagePreview from "../../Inspector/InspectorPreview/InspectorPreviewTypes/InspectorImagePreview";
import InspectorSoundPreview from "../../Inspector/InspectorPreview/InspectorPreviewTypes/InspectorSoundPreview";
import MobileInspectorCheckbox from "./MobileInspectorRow/MobileInspectorRowTypes/MobileInspectorCheckbox";
import MobileInspectorColor from "./MobileInspectorRow/MobileInspectorRowTypes/MobileInspectorColor";

import MobileInspectorTabbedInterface from "./MobileInpsectorTabbedInterface/MobileInspectorTabbedInterface";

import transformIcon from "resources/mobile-inspector-icons/transform-icon.svg";
import transformIconActive from "resources/mobile-inspector-icons/transform-icon-active.svg";
import styleIcon from "resources/mobile-inspector-icons/style-icon.svg";
import styleIconActive from "resources/mobile-inspector-icons/style-icon-active.svg";
import fontIcon from "resources/mobile-inspector-icons/font-icon.svg";
import fontIconActive from "resources/mobile-inspector-icons/font-icon-active.svg";
import settingsIcon from "resources/mobile-inspector-icons/settings-icon.svg";
import settingsIconActive from "resources/mobile-inspector-icons/settings-icon-active.svg";
import actionIcon from "resources/mobile-inspector-icons/action-icon.svg";
import actionIconActive from "resources/mobile-inspector-icons/action-icon-active.svg";

import xIcon from "resources/mobile-inspector-icons/x-icon.svg";
import yIcon from "resources/mobile-inspector-icons/y-icon.svg";
import wIcon from "resources/mobile-inspector-icons/w-icon.svg";
import hIcon from "resources/mobile-inspector-icons/h-icon.svg";
import scaleWIcon from "resources/mobile-inspector-icons/scaleW-icon.svg";
import scaleHIcon from "resources/mobile-inspector-icons/scaleH-icon.svg";
import rotateIcon from "resources/mobile-inspector-icons/rotate-icon.svg";
import strokeIcon from "resources/mobile-inspector-icons/strokewidth-icon.svg";
import opacityIcon from "resources/mobile-inspector-icons/opacity-icon.svg";
import fillOpacityIcon from "resources/mobile-inspector-icons/fillopacity-icon.svg";

type AnyFunction = (...args: any[]) => any;

type SelectionAttributes = Record<string, any>;

type FontInfoInterface = {
    allFontNames: string[];
    isExistingFont: (font: string) => boolean;
    hasFont: (font: string) => boolean;
    getFontFile: (options: {
        font: string;
        callback: (blob: Blob) => void;
        error: (error: unknown) => void;
    }) => void;
};

type AssetLike = {
    name?: string;
    [key: string]: any;
};

type TabOption = {
    label: string;
    icon: string;
    iconActive: string;
    alt: string;
};

type ClipAnimationOption = {
    label: string;
    value: string;
};

type EditorActionsMap = Record<string, any>;

declare global {
    interface Window {
        Wick: any;
    }
}

interface MobileInspectorProps {
    getAllSelectionAttributes: () => SelectionAttributes;
    setSelectionAttribute: (attribute: string, value: any) => void;
    colorPickerType: string;
    changeColorPickerType: (type: string) => void;
    updateLastColors: (color: string) => void;
    lastColorsUsed: string[];
    fontInfoInterface: FontInfoInterface;
    importFileAsAsset: (file: File, callback: () => void) => void;
    getSelectionType: () => string;
    getAllSoundAssets: () => AssetLike[];
    getClipAnimationTypes: () => ClipAnimationOption[];
    editorActions: EditorActionsMap;
    getToolSetting?: (name: string) => unknown;
    setToolSetting?: (name: string, value: unknown) => void;
    selectionIsScriptable?: () => boolean;
    project?: unknown;
    script?: unknown;
    scriptInfoInterface?: unknown;
    deleteScript?: AnyFunction;
    editScript?: AnyFunction;
    [key: string]: any;
}

type MobileInspectorState = Record<string, never>;

class MobileInspector extends Component<MobileInspectorProps, MobileInspectorState> {
    private actionRules: Record<string, string[]>;
    private inspectorTitles: Record<string, string>;
    private tabsOptions: Record<string, TabOption>;
    private inspectorTabs: Record<string, string[]>;

    constructor(props: MobileInspectorProps) {
        super(props);

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

        this.tabsOptions = {
            transform: {
                label: "transform",
                icon: transformIcon,
                iconActive: transformIconActive,
                alt: "transform icon",
            },
            style: {
                label: "style",
                icon: styleIcon,
                iconActive: styleIconActive,
                alt: "style icon",
            },
            font: {
                label: "font",
                icon: fontIcon,
                iconActive: fontIconActive,
                alt: "font icon",
            },
            frameSettings: {
                label: "frameSettings",
                icon: settingsIcon,
                iconActive: settingsIconActive,
                alt: "setting icon",
            },
            tweenSettings: {
                label: "tweenSsettings",
                icon: settingsIcon,
                iconActive: settingsIconActive,
                alt: "setting icon",
            },
            animationSettings: {
                label: "animationSettings",
                icon: settingsIcon,
                iconActive: settingsIconActive,
                alt: "setting icon",
            },
            assetSettings: {
                label: "assetSettings",
                icon: settingsIcon,
                iconActive: settingsIconActive,
                alt: "setting icon",
            },
            actions: {
                label: "actions",
                icon: actionIcon,
                iconActive: actionIconActive,
                alt: "action icon",
            },
        };

        this.inspectorTabs = {
            frame: ["frameSettings", "identifier"],
            layer: ["identifier"],
            multiframe: [],
            tween: ["tweenSettings"],
            multitween: ["tweenSettings"],
            clip: ["transform", "animationSettings", "identifier"],
            button: ["transform", "identifier"],
            path: ["transform", "style"],
            text: ["transform", "style", "font", "identifier"],
            image: ["transform"],
            multipath:
                this.getSelectionAttribute("fontFamily") &&
                    typeof this.getSelectionAttribute("fontFamily") !== "undefined"
                    ? ["transform", "style", "font"]
                    : ["transform", "style"],
            multiclip: ["transform"],
            multitimeline: [],
            multicanvas: ["transform"],
            imageasset: ["assetSettings", "name"],
            soundasset: ["assetSettings", "name"],
            multiassetmixed: ["assetSettings"],
            multisoundasset: ["assetSettings"],
            multiimageasset: ["assetSettings"],
            unknown: [],
        };

    }

    getSelectionAttribute = (attribute: string): any => {
        if (attribute === "fillColorOpacity") {
            return this.getSelectionFillColorOpacity();
        }

        const attributes = this.props.getAllSelectionAttributes?.() ?? {};
        return (attributes as SelectionAttributes)[attribute];
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

    renderSelectionColor = (): JSX.Element => {
        return (
            <div className="mobile-inspector-item mobile-inspector-item-style">
                <div className="mobile-inspector-col-left">
                    <MobileInspectorColor
                        tooltip="Stroke"
                        val={this.getSelectionAttribute("strokeColor").toCSS()}
                        onChange={(col) => this.setSelectionAttribute("strokeColor", col)}
                        id="mobile-inspector-selection-stroke-color"
                        stroke={true}
                        colorPickerType={this.props.colorPickerType}
                        changeColorPickerType={this.props.changeColorPickerType}
                        updateLastColors={this.props.updateLastColors}
                        lastColorsUsed={this.props.lastColorsUsed}
                    />

                    <MobileInspectorColor
                        tooltip="Fill"
                        val={this.getSelectionAttribute("fillColor").toCSS()}
                        onChange={(col) => this.setSelectionAttribute("fillColor", col)}
                        id="mobile-inspector-selection-fill-color"
                        colorPickerType={this.props.colorPickerType}
                        changeColorPickerType={this.props.changeColorPickerType}
                        updateLastColors={this.props.updateLastColors}
                        lastColorsUsed={this.props.lastColorsUsed}
                    />
                </div>

                <div className="mobile-inspector-col-right">
                    <MobileInspectorNumericInput
                        tooltip="Stroke Weight"
                        icon={strokeIcon}
                        iconAlt="Strokeweight Icon"
                        val={this.getSelectionAttribute("strokeWidth") as number}
                        onChange={(val) => this.setSelectionAttribute("strokeWidth", val)}
                    />

                    {this.renderOpacity()}

                    <MobileInspectorNumericSlider
                        tooltip="Fill Opacity"
                        icon={fillOpacityIcon}
                        val={this.getSelectionAttribute("fillColorOpacity") as number}
                        onChange={(val) =>
                            this.setSelectionAttribute("fillColorOpacity", val)
                        }
                        inputProps={{ min: 0, max: 1, step: 0.01 }}
                    />
                </div>
            </div>
        );
    };

    renderFontFamily = (): JSX.Element => {
        const getFontClass = (font: string): string => {
            const fontClass = "font-selector-" + font.split(" ").join("-");
            const existingClass = this.props.fontInfoInterface.isExistingFont(font)
                ? " existing-font"
                : "";
            return fontClass + existingClass;
        };

        const options: MobileInspectorSelectorOption[] = this.props.fontInfoInterface.allFontNames.map(
            (fontName) => ({
                value: fontName,
                label: fontName,
                className: getFontClass(fontName),
            })
        );

        return (
            <MobileInspectorSelector
                className="font-family"
                value={this.getSelectionAttribute("fontFamily")}
                tooltip="Font Family"
                type="select"
                isSearchable={true}
                options={options}
                onChange={(val) => {
                    const font = val.value as string;

                    if (this.props.fontInfoInterface.hasFont(val.value)) {
                        this.setSelectionAttribute("fontFamily", font);
                        return;
                    }

                    this.props.fontInfoInterface.getFontFile({
                        font,
                        callback: (blob) => {
                            const file = new File([blob], font + ".ttf", {
                                type: "font/ttf",
                            });
                            this.props.importFileAsAsset(file, () => {
                                this.setSelectionAttribute("fontFamily", font);
                            });
                        },
                        error: (error) => {
                            console.error(error);
                        },
                    });
                }}
            ></MobileInspectorSelector>
        );
    };

    renderFontStyle = (): JSX.Element => {
        const options = [
            { value: "normal", label: "normal" },
            { value: "italic", label: "italic" },
        ];
        return (
            <MobileInspectorSelector
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

        const weight = Math.min(
            Math.max(this.getSelectionAttribute("fontWeight"), 100),
            900,
        );

        return (
            <MobileInspectorSelector
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
            <MobileInspectorNumericInput
                tooltip="Font Size"
                val={this.getSelectionAttribute("fontSize")}
                onChange={(val) => this.setSelectionAttribute("fontSize", val)}
            />
        );
    };

    renderName = (): JSX.Element => {
        return (
            <div className="mobile-inspector-item mobile-inspector-name">
                <MobileInspectorTextInput
                    tooltip="Name"
                    val={this.getSelectionAttribute("name")}
                    onChange={(val) => {
                        this.setSelectionAttribute("name", val);
                    }}
                    placeholder="no_name"
                    id="inspector-name"
                    divider={false}
                />
            </div>
        );
    };

    renderIdentifier = (): JSX.Element => {
        return (
            <div className="mobile-inspector-item mobile-inspector-name">
                <MobileInspectorTextInput
                    tooltip="Name"
                    val={this.getSelectionAttribute("identifier")}
                    onChange={(val) => {
                        this.setSelectionAttribute("identifier", val);
                    }}
                    placeholder="no_name"
                    id="mobile-inspector-identifier"
                    divider={false}
                />
            </div>
        );
    };

    renderFilename = (): JSX.Element => {
        return (
            <div className="mobile-inspector-item">
                <MobileInspectorTextInput
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
        } else if (selectionType === "soundasset") {
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
            <div className="mobile-inspector-item">
                <MobileInspectorNumericInput
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
            <MobileInspectorDualNumericInput
                tooltip1="Origin X"
                tooltip2="Origin Y"
                icon1={xIcon}
                iconAlt1="x Icon"
                icon2={yIcon}
                iconAlt2="Y Icon"
                val1={this.getSelectionAttribute("originX")}
                val2={this.getSelectionAttribute("originY")}
                onChange1={(val) => this.setSelectionAttribute("originX", val)}
                onChange2={(val) => this.setSelectionAttribute("originY", val)}
                id="inspector-origin"
            />
        );
    };

    renderSize = (): JSX.Element => {
        return (
            <MobileInspectorDualNumericInput
                tooltip1="Width"
                tooltip2="Height"
                icon1={wIcon}
                iconAlt1="Width Icon"
                icon2={hIcon}
                iconAlt2="Height Icon"
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
            <MobileInspectorDualNumericInput
                tooltip1="Scale W"
                tooltip2="Scale H"
                icon1={scaleWIcon}
                iconAlt1="Scale Width Icon"
                icon2={scaleHIcon}
                iconAlt2="Scale Height Icon"
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
            <MobileInspectorNumericInput
                tooltip="Rotation"
                icon={rotateIcon}
                iconAlt="Rotation Icon"
                val={this.getSelectionAttribute("rotation")}
                onChange={(val) => this.setSelectionAttribute("rotation", val)}
                id="inspector-rotation"
            />
        );
    };

    renderOpacity = (): JSX.Element => {
        return (
            <MobileInspectorNumericSlider
                tooltip="Opacity"
                icon={opacityIcon}
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
            <div className="mobile-inspector-item">
                {this.renderPosition()}
                {this.renderSize()}
                {this.renderScale()}
                {this.renderRotation()}
            </div>
        );
    };

    renderSelectionSoundAsset = (): JSX.Element => {
        let options: Array<{ value: any; label: string }> = [
            {
                value: null,
                label: "No Sound",
            },
        ];

        const mapAsset = (asset: AssetLike | undefined) => {
            if (!asset) {
                return {
                    value: "novalue",
                    label: "No Sound",
                };
            }
            return {
                value: asset,
                label: asset.name ?? "",
            };
        };

        options = options.concat(this.props.getAllSoundAssets().map(mapAsset));

        const value = this.getSelectionAttribute("sound");
        return (
            <MobileInspectorSelector
                tooltip="Sound"
                type="select"
                options={options}
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
            <MobileInspectorNumericInput
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
            <MobileInspectorNumericInput
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
            <div className="mobile-inspector-item">
                {this.renderSelectionSoundAsset()}
                {this.getSelectionAttribute("sound") &&
                    this.renderSelectionSoundVolume()}
                {this.getSelectionAttribute("sound") &&
                    this.renderSelectionSoundStart()}
            </div>
        );
    };

    renderAnimationType = (): JSX.Element => {
        return (
            <div className="mobile-inspector-item">
                <MobileInspectorSelector
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
                    <MobileInspectorNumericInput
                        tooltip="Frame"
                        val={this.getSelectionAttribute("singleFrameNumber")}
                        onChange={(val) =>
                            this.setSelectionAttribute("singleFrameNumber", val)
                        }
                    />
                )}
                {this.getSelectionAttribute("animationType") !== "single" && (
                    <MobileInspectorCheckbox
                        tooltip="Synced"
                        checked={this.getSelectionAttribute("isSynced")}
                        onChange={() =>
                            this.setSelectionAttribute(
                                "isSynced",
                                !this.getSelectionAttribute("isSynced"),
                            )
                        }
                    />
                )}
            </div>
        );
    };

    renderTweenEasingType = (): JSX.Element => {
        const options = window.Wick.Tween.VALID_EASING_TYPES;
        const optionLabels = options.map((option: string) => ({
            label: option,
            value: option,
        }));
        return (
            <div className="mobile-inspector-item">
                <MobileInspectorSelector
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
            <div className="mobile-inspector-item">
                <MobileInspectorNumericInput
                    tooltip="Full Rotations"
                    val={this.getSelectionAttribute("fullRotations")}
                    onChange={(val) =>
                        this.setSelectionAttribute("fullRotations", val)
                    }
                    id="inspector-full-rotation"
                />
            </div>
        );
    };

    renderFrame = (): JSX.Element => {
        return (
            <div className="inspector-content">
                {this.renderFrameLength()}
                {this.renderSoundContent()}
            </div>
        );
    };

    renderTween = (): JSX.Element => {
        return (
            <div className="inspector-content">
                {this.renderTweenEasingType()}
                {this.renderTweenFullRotations()}
            </div>
        );
    };

    renderFontContent = (): JSX.Element => {
        return (
            <div className="mobile-inspector-item">
                {this.renderFontFamily()}
                {this.renderFontStyle()}
                {this.renderFontWeight()}
                {this.renderFontSize()}
            </div>
        );
    };

    renderAnimationSetting = (): JSX.Element => {
        return (
            <div className="inspector-content">
                {this.renderAnimationType()}
            </div>
        );
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

    renderActionButton = (action: any, i: number): JSX.Element => {
        return (
            <div key={i} className="mobile-inspector-item">
                <InspectorActionButton action={action} />
            </div>
        );
    };

    getAllActions = (): string[] => {
        const actions: string[] = [];
        const selectionType = this.props.getSelectionType();

        Object.keys(this.actionRules).forEach((action) => {
            const actionList = this.actionRules[action] ?? [];
            if (actionList.includes(selectionType)) {
                actions.push(action);
            }
        });
        return actions;
    };

    renderActions = (): JSX.Element => {
        const actions = this.getAllActions();

        return (
            <div className="inspector-content">
                {actions.map((action, i) => {
                    return this.renderActionButton(
                        this.props.editorActions[action],
                        i,
                    );
                })}
            </div>
        );
    };

    render(): JSX.Element {
        let selectionType = this.props.getSelectionType();
        if (!Object.keys(this.inspectorTabs).includes(selectionType)) {
            selectionType = "unknown";
        }

        const baseTabs = this.inspectorTabs[selectionType] ?? [];
        const tabNames = baseTabs.concat([]);
        const tabs = tabNames
            .filter((ele) => ele !== "name" && ele !== "identifier")
            .map((name) => this.tabsOptions[name])
            .filter((option): option is TabOption => Boolean(option));

        const actions = this.getAllActions();

        if (actions.length > 0) {
            tabNames.push("actions");
            const actionsTab = this.tabsOptions.actions;
            if (actionsTab) {
                tabs.push(actionsTab);
            }
        }

        return (
            <div className="mobile-inspector" aria-label="Inspector Panel">
                <div className="mobile-inspector-title">
                    <span className="mobile-inspector-title-prefix">
                        Inspect:
                    </span>
                    {this.inspectorTitles[selectionType]}

                    {tabNames.includes("identifier")
                        ? this.renderIdentifier()
                        : tabNames.includes("name")
                            ? this.renderName()
                            : undefined}
                </div>
                {selectionType === "unknown" && (
                    <div className="mobile-inspector-unknown-selection">
                        Unknown Selection
                    </div>
                )}

                {tabs.length > 0 && (
                    <MobileInspectorTabbedInterface tabs={tabs}>
                        {tabNames.includes("transform") && (
                            <Fragment>
                                {this.renderSelectionTransformProperties()}
                            </Fragment>
                        )}
                        {tabNames.includes("style") && (
                            <Fragment>{this.renderSelectionColor()}</Fragment>
                        )}
                        {tabNames.includes("font") && (
                            <Fragment>{this.renderFontContent()}</Fragment>
                        )}
                        {tabNames.includes("frameSettings") && (
                            <Fragment>{this.renderFrame()}</Fragment>
                        )}
                        {tabNames.includes("tweenSettings") && (
                            <Fragment>{this.renderTween()}</Fragment>
                        )}
                        {tabNames.includes("animationSettings") && (
                            <Fragment>
                                {this.renderAnimationSetting()}
                            </Fragment>
                        )}
                        {tabNames.includes("assetSettings") && (
                            <Fragment>{this.renderAsset()}</Fragment>
                        )}
                        {tabNames.includes("actions") && (
                            <Fragment>{this.renderActions()}</Fragment>
                        )}
                    </MobileInspectorTabbedInterface>
                )}
            </div>
        );
    }
}

export default MobileInspector;
