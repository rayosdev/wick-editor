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

import { Fragment, type ComponentProps } from "react";

import "./_mobileinspector.scss";
import "../../Inspector/_inspectorselector.scss";

import type {
    Script,
    ScriptWindowScriptInfoInterface,
} from "Editor/types";

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

import type { WickAsset } from "Editor/types";

type SelectionAttributes = Record<string, unknown>; // Dynamic selection attributes - inherently flexible

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
type InspectorAction = ComponentProps<typeof InspectorActionButton>["action"];

interface MobileInspectorProps {
    getAllSelectionAttributes: () => SelectionAttributes;
    setSelectionAttribute: (attribute: string, value: unknown) => void; // Truly polymorphic
    colorPickerType: string;
    changeColorPickerType: (type: string) => void;
    updateLastColors: (color: string) => void;
    lastColorsUsed: string[];
    fontInfoInterface: FontInfoInterface;
    importFileAsAsset: (file: File, callback: () => void) => void;
    getSelectionType: () => string;
    getAllSoundAssets: () => WickAsset[];
    getClipAnimationTypes: () => ClipAnimationOption[];
    editorActions: Record<string, NonNullable<InspectorAction>>; // Action functions
    getToolSetting?: (name: string) => string | number | boolean;
    setToolSetting?: (name: string, value: string | number | boolean) => void;
    selectionIsScriptable?: () => boolean;
    project?: unknown; // Wick Engine project instance (not used in MobileInspector)
    script?: Script;
    scriptInfoInterface?: ScriptWindowScriptInfoInterface;
    deleteScript?: (script: Script, name: string) => void;
    editScript?: (name: string) => void;
}

const MobileInspector: React.FC<MobileInspectorProps> = (props) => {
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

    const tabsOptions: Record<string, TabOption> = {
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

    const getSelectionAttribute = <T = unknown>(attribute: string): T => {
        if (attribute === "fillColorOpacity") {
            return getSelectionFillColorOpacity() as T;
        }

        const attributes = props.getAllSelectionAttributes?.() ?? {};
        return (attributes as SelectionAttributes)[attribute] as T;
    };

    const getSelectionFillColorOpacity = (): number => {
        const fillColor = getSelectionAttribute("fillColor") as { alpha?: number } | undefined;
        return fillColor?.alpha ?? 1;
    };

    const setSelectionFillColorOpacity = (value: number): void => {
        const color = getSelectionAttribute("fillColor") as { alpha?: number } | undefined;
        if (!color) {
            return;
        }
        color.alpha = value;
        props.setSelectionAttribute("fillColor", color);
    };

    const inspectorTabs: Record<string, string[]> = {
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
            getSelectionAttribute("fontFamily") &&
                typeof getSelectionAttribute("fontFamily") !== "undefined"
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

    const setSelectionAttribute = (attribute: string, newValue: unknown): void => {
        if (attribute === "fillColorOpacity") {
            setSelectionFillColorOpacity(Number(newValue));
            return;
        }
        props.setSelectionAttribute(attribute, newValue);
    };

    const renderSelectionColor = (): JSX.Element => {
        const strokeColor = getSelectionAttribute<{ toCSS?: () => string } | undefined>("strokeColor");
        const fillColor = getSelectionAttribute<{ toCSS?: () => string } | undefined>("fillColor");

        return (
            <div className="mobile-inspector-item mobile-inspector-item-style">
                <div className="mobile-inspector-col-left">
                    <MobileInspectorColor
                        tooltip="Stroke"
                        val={strokeColor?.toCSS?.() ?? "#000000"}
                        onChange={(col) => setSelectionAttribute("strokeColor", col)}
                        id="mobile-inspector-selection-stroke-color"
                        stroke={true}
                        colorPickerType={props.colorPickerType}
                        changeColorPickerType={props.changeColorPickerType}
                        updateLastColors={props.updateLastColors}
                        lastColorsUsed={props.lastColorsUsed}
                    />

                    <MobileInspectorColor
                        tooltip="Fill"
                        val={fillColor?.toCSS?.() ?? "#000000"}
                        onChange={(col) => setSelectionAttribute("fillColor", col)}
                        id="mobile-inspector-selection-fill-color"
                        colorPickerType={props.colorPickerType}
                        changeColorPickerType={props.changeColorPickerType}
                        updateLastColors={props.updateLastColors}
                        lastColorsUsed={props.lastColorsUsed}
                    />
                </div>

                <div className="mobile-inspector-col-right">
                    <MobileInspectorNumericInput
                        tooltip="Stroke Weight"
                        icon={strokeIcon}
                        iconAlt="Strokeweight Icon"
                        val={getSelectionAttribute("strokeWidth") as number}
                        onChange={(val) => setSelectionAttribute("strokeWidth", val)}
                    />

                    {renderOpacity()}

                    <MobileInspectorNumericSlider
                        tooltip="Fill Opacity"
                        icon={fillOpacityIcon}
                        val={getSelectionAttribute("fillColorOpacity") as number}
                        onChange={(val) =>
                            setSelectionAttribute("fillColorOpacity", val)
                        }
                        inputProps={{ min: 0, max: 1, step: 0.01 }}
                    />
                </div>
            </div>
        );
    };

    const renderFontFamily = (): JSX.Element => {
        const getFontClass = (font: string): string => {
            const fontClass = "font-selector-" + font.split(" ").join("-");
            const existingClass = props.fontInfoInterface.isExistingFont(font)
                ? " existing-font"
                : "";
            return fontClass + existingClass;
        };

        const options: MobileInspectorSelectorOption[] = props.fontInfoInterface.allFontNames.map(
            (fontName) => ({
                value: fontName,
                label: fontName,
                className: getFontClass(fontName),
            })
        );

        return (
            <MobileInspectorSelector
                className="font-family"
                value={getSelectionAttribute("fontFamily")}
                tooltip="Font Family"
                type="select"
                isSearchable={true}
                options={options}
                onChange={(val) => {
                    const font = typeof val.value === "string" ? val.value : "";
                    if (!font) {
                        return;
                    }

                    if (props.fontInfoInterface.hasFont(font)) {
                        setSelectionAttribute("fontFamily", font);
                        return;
                    }

                    props.fontInfoInterface.getFontFile({
                        font,
                        callback: (blob) => {
                            const file = new File([blob], font + ".ttf", {
                                type: "font/ttf",
                            });
                            props.importFileAsAsset(file, () => {
                                setSelectionAttribute("fontFamily", font);
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

    const renderFontStyle = (): JSX.Element => {
        const options = [
            { value: "normal", label: "normal" },
            { value: "italic", label: "italic" },
        ];
        return (
            <MobileInspectorSelector
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

        const weight = Math.min(
            Math.max(getSelectionAttribute<number>("fontWeight"), 100),
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
                    setSelectionAttribute("fontWeight", newWeight);
                }}
            />
        );
    };

    const renderFontSize = (): JSX.Element => {
        return (
            <MobileInspectorNumericInput
                tooltip="Font Size"
                val={getSelectionAttribute("fontSize")}
                onChange={(val) => setSelectionAttribute("fontSize", val)}
            />
        );
    };

    const renderName = (): JSX.Element => {
        return (
            <div className="mobile-inspector-item mobile-inspector-name">
                <MobileInspectorTextInput
                    tooltip="Name"
                    val={getSelectionAttribute("name")}
                    onChange={(val) => {
                        setSelectionAttribute("name", val);
                    }}
                    placeholder="no_name"
                    id="inspector-name"
                    divider={false}
                />
            </div>
        );
    };

    const renderIdentifier = (): JSX.Element => {
        return (
            <div className="mobile-inspector-item mobile-inspector-name">
                <MobileInspectorTextInput
                    tooltip="Name"
                    val={getSelectionAttribute("identifier")}
                    onChange={(val) => {
                        setSelectionAttribute("identifier", val);
                    }}
                    placeholder="no_name"
                    id="mobile-inspector-identifier"
                    divider={false}
                />
            </div>
        );
    };

    const renderFilename = (): JSX.Element => {
        return (
            <div className="mobile-inspector-item">
                <MobileInspectorTextInput
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
        } else if (selectionType === "soundasset") {
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
            <div className="mobile-inspector-item">
                <MobileInspectorNumericInput
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
            <MobileInspectorDualNumericInput
                tooltip1="Origin X"
                tooltip2="Origin Y"
                icon1={xIcon}
                iconAlt1="x Icon"
                icon2={yIcon}
                iconAlt2="Y Icon"
                val1={getSelectionAttribute("originX")}
                val2={getSelectionAttribute("originY")}
                onChange1={(val) => setSelectionAttribute("originX", val)}
                onChange2={(val) => setSelectionAttribute("originY", val)}
                id="inspector-origin"
            />
        );
    };

    const renderSize = (): JSX.Element => {
        return (
            <MobileInspectorDualNumericInput
                tooltip1="Width"
                tooltip2="Height"
                icon1={wIcon}
                iconAlt1="Width Icon"
                icon2={hIcon}
                iconAlt2="Height Icon"
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
            <MobileInspectorDualNumericInput
                tooltip1="Scale W"
                tooltip2="Scale H"
                icon1={scaleWIcon}
                iconAlt1="Scale Width Icon"
                icon2={scaleHIcon}
                iconAlt2="Scale Height Icon"
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
            <MobileInspectorNumericInput
                tooltip="Rotation"
                icon={rotateIcon}
                iconAlt="Rotation Icon"
                val={getSelectionAttribute("rotation")}
                onChange={(val) => setSelectionAttribute("rotation", val)}
                id="inspector-rotation"
            />
        );
    };

    const renderOpacity = (): JSX.Element => {
        return (
            <MobileInspectorNumericSlider
                tooltip="Opacity"
                icon={opacityIcon}
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
            <div className="mobile-inspector-item">
                {renderPosition()}
                {renderSize()}
                {renderScale()}
                {renderRotation()}
            </div>
        );
    };

    const renderSelectionSoundAsset = (): JSX.Element => {
        let options: Array<{ value: unknown; label: string }> = [
            {
                value: null,
                label: "No Sound",
            },
        ];

        const mapAsset = (asset: WickAsset | undefined) => {
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

        options = options.concat(props.getAllSoundAssets().map(mapAsset));

        const value = getSelectionAttribute("sound");
        return (
            <MobileInspectorSelector
                tooltip="Sound"
                type="select"
                options={options}
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
            <MobileInspectorNumericInput
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
            <MobileInspectorNumericInput
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
        const hasSound = Boolean(getSelectionAttribute("sound"));
        return (
            <div className="mobile-inspector-item">
                {renderSelectionSoundAsset()}
                {hasSound && renderSelectionSoundVolume()}
                {hasSound && renderSelectionSoundStart()}
            </div>
        );
    };

    const renderAnimationType = (): JSX.Element => {
        return (
            <div className="mobile-inspector-item">
                <MobileInspectorSelector
                    tooltip="Animation"
                    type="select"
                    options={props.getClipAnimationTypes()}
                    value={getSelectionAttribute("animationType")}
                    isSearchable={true}
                    onChange={(val) => {
                        setSelectionAttribute("animationType", val.value);
                    }}
                />
                {Boolean(getSelectionAttribute("singleFrameNumber")) && (
                    <MobileInspectorNumericInput
                        tooltip="Frame"
                        val={getSelectionAttribute("singleFrameNumber")}
                        onChange={(val) =>
                            setSelectionAttribute("singleFrameNumber", val)
                        }
                    />
                )}
                {getSelectionAttribute("animationType") !== "single" && (
                    <MobileInspectorCheckbox
                        tooltip="Synced"
                        checked={Boolean(getSelectionAttribute("isSynced"))}
                        onChange={() =>
                            setSelectionAttribute(
                                "isSynced",
                                !Boolean(getSelectionAttribute("isSynced")),
                            )
                        }
                    />
                )}
            </div>
        );
    };

    const renderTweenEasingType = (): JSX.Element => {
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
            <div className="mobile-inspector-item">
                <MobileInspectorNumericInput
                    tooltip="Full Rotations"
                    val={getSelectionAttribute("fullRotations")}
                    onChange={(val) =>
                        setSelectionAttribute("fullRotations", val)
                    }
                    id="inspector-full-rotation"
                />
            </div>
        );
    };

    const renderFrame = (): JSX.Element => {
        return (
            <div className="inspector-content">
                {renderFrameLength()}
                {renderSoundContent()}
            </div>
        );
    };

    const renderTween = (): JSX.Element => {
        return (
            <div className="inspector-content">
                {renderTweenEasingType()}
                {renderTweenFullRotations()}
            </div>
        );
    };

    const renderFontContent = (): JSX.Element => {
        return (
            <div className="mobile-inspector-item">
                {renderFontFamily()}
                {renderFontStyle()}
                {renderFontWeight()}
                {renderFontSize()}
            </div>
        );
    };

    const renderAnimationSetting = (): JSX.Element => {
        return (
            <div className="inspector-content">
                {renderAnimationType()}
            </div>
        );
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

    const renderActionButton = (action: InspectorAction, i: number): JSX.Element => {
        return (
            <div key={i} className="mobile-inspector-item">
                <InspectorActionButton action={action} />
            </div>
        );
    };

    const getAllActions = (): string[] => {
        const actions: string[] = [];
        const selectionType = props.getSelectionType();

        Object.keys(actionRules).forEach((action) => {
            const actionList = actionRules[action] ?? [];
            if (actionList.includes(selectionType)) {
                actions.push(action);
            }
        });
        return actions;
    };

    const renderActions = (): JSX.Element => {
        const actions = getAllActions();

        return (
            <div className="inspector-content">
                {actions.map((action, i) => {
                    return renderActionButton(
                        props.editorActions[action],
                        i,
                    );
                })}
            </div>
        );
    };

    let selectionType = props.getSelectionType();
    if (!Object.keys(inspectorTabs).includes(selectionType)) {
        selectionType = "unknown";
    }

    const baseTabs = inspectorTabs[selectionType] ?? [];
    const tabNames = baseTabs.concat([]);
    const tabs = tabNames
        .filter((ele) => ele !== "name" && ele !== "identifier")
        .map((name) => tabsOptions[name])
        .filter((option): option is TabOption => Boolean(option));

    const actions = getAllActions();

    if (actions.length > 0) {
        tabNames.push("actions");
        const actionsTab = tabsOptions.actions;
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
                {inspectorTitles[selectionType]}

                {tabNames.includes("identifier")
                    ? renderIdentifier()
                    : tabNames.includes("name")
                        ? renderName()
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
                            {renderSelectionTransformProperties()}
                        </Fragment>
                    )}
                    {tabNames.includes("style") && (
                        <Fragment>{renderSelectionColor()}</Fragment>
                    )}
                    {tabNames.includes("font") && (
                        <Fragment>{renderFontContent()}</Fragment>
                    )}
                    {tabNames.includes("frameSettings") && (
                        <Fragment>{renderFrame()}</Fragment>
                    )}
                    {tabNames.includes("tweenSettings") && (
                        <Fragment>{renderTween()}</Fragment>
                    )}
                    {tabNames.includes("animationSettings") && (
                        <Fragment>
                            {renderAnimationSetting()}
                        </Fragment>
                    )}
                    {tabNames.includes("assetSettings") && (
                        <Fragment>{renderAsset()}</Fragment>
                    )}
                    {tabNames.includes("actions") && (
                        <Fragment>{renderActions()}</Fragment>
                    )}
                </MobileInspectorTabbedInterface>
            )}
        </div>
    );
};

export default MobileInspector;
