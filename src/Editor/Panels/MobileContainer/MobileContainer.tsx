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

import MobileTabbedInterface from "../../Util/MobileTabbedInterface/MobileTabbedInterface";
import Timeline from "../Timeline/Timeline";
import MobileInspector from "./MobileInspector/MobileInspector";
import MobileAssetLibrary from "./MobileAssetLibrary/MobileAssetLibrary";
import InspectorScriptWindow from "../Inspector/InspectorScriptWindow/InspectorScriptWindow";
import type {
    WickProject,
    WickClip,
    TimelineObject,
    OnionSkinOptions,
    ProjectDidChangeOptions,
    ToastType,
    ToastOptions,
} from "Editor/types";

import timelineIcon from "resources/mobile-container-icons/timeline-icon.svg";
import timelineIconActive from "resources/mobile-container-icons/timeline-icon-active.svg";
import inspectorIcon from "resources/mobile-container-icons/inspector-icon.svg";
import inspectorIconActive from "resources/mobile-container-icons/inspector-icon-active.svg";
import codeIcon from "resources/mobile-container-icons/code-icon.svg";
import codeIconActive from "resources/mobile-container-icons/code-icon-active.svg";
import assetIcon from "resources/mobile-container-icons/asset-icon.svg";
import assetIconActive from "resources/mobile-container-icons/asset-icon-active.svg";

type TimelineProps = ComponentProps<typeof Timeline>;
type InspectorScriptWindowProps = ComponentProps<typeof InspectorScriptWindow>;
type MobileAssetLibraryProps = ComponentProps<typeof MobileAssetLibrary>;
type MobileInspectorProps = ComponentProps<typeof MobileInspector>;

type AssetObject = MobileAssetLibraryProps["assets"][number];

interface MobileContainerProps {
    project: TimelineProps["project"];
    projectDidChange: (options: ProjectDidChangeOptions) => void;
    projectData: WickProject;
    getSelectedTimelineObjects: () => TimelineObject[];
    setOnionSkinOptions: (options: OnionSkinOptions) => void;
    getOnionSkinOptions: () => OnionSkinOptions;
    setFocusObject: (object: WickClip | WickProject) => void;
    addTweenKeyframe: () => void;
    createTween: () => void;
    cutFrame: () => void;
    insertBlankFrame: () => void;
    movePlayheadForwards: () => void;
    movePlayheadBackwards: () => void;
    focusTimelineOfParentClip: () => void;
    onRef: NonNullable<TimelineProps["onRef"]>;
    dragSoundOntoTimeline: (uuid: string, x: number, y: number, commit: boolean) => void;
    timelineRendererMode: TimelineProps["timelineRendererMode"];
    onTimelineRendererModeChange: TimelineProps["onTimelineRendererModeChange"];
    timelineShortcutPreset: TimelineProps["timelineShortcutPreset"];
    onTimelineShortcutPresetChange: TimelineProps["onTimelineShortcutPresetChange"];
    timelinePlaybackFollowMode: TimelineProps["timelinePlaybackFollowMode"];
    onTimelinePlaybackFollowModeChange: TimelineProps["onTimelinePlaybackFollowModeChange"];
    timelineSnapMode: TimelineProps["timelineSnapMode"];
    onTimelineSnapModeChange: TimelineProps["onTimelineSnapModeChange"];
    timelineDensityMode: TimelineProps["timelineDensityMode"];
    onTimelineDensityModeChange: TimelineProps["onTimelineDensityModeChange"];
    timelineSoftRenderTick: TimelineProps["timelineSoftRenderTick"];
    getToolSetting: (name: string) => string | number | boolean;
    setToolSetting: (name: string, value: string | number | boolean) => void;
    getSelectionType: MobileInspectorProps["getSelectionType"];
    getAllSoundAssets: MobileInspectorProps["getAllSoundAssets"];
    getAllSelectionAttributes: MobileInspectorProps["getAllSelectionAttributes"];
    setSelectionAttribute: MobileInspectorProps["setSelectionAttribute"];
    editorActions: MobileInspectorProps["editorActions"];
    selectionIsScriptable: NonNullable<MobileInspectorProps["selectionIsScriptable"]>;
    script: InspectorScriptWindowProps["script"];
    scriptInfoInterface: InspectorScriptWindowProps["scriptInfoInterface"];
    deleteScript: InspectorScriptWindowProps["deleteScript"];
    editScript: InspectorScriptWindowProps["editScript"];
    fontInfoInterface: MobileInspectorProps["fontInfoInterface"];
    importFileAsAsset: MobileInspectorProps["importFileAsAsset"];
    colorPickerType: MobileInspectorProps["colorPickerType"];
    changeColorPickerType: MobileInspectorProps["changeColorPickerType"];
    updateLastColors: MobileInspectorProps["updateLastColors"];
    lastColorsUsed: MobileInspectorProps["lastColorsUsed"];
    getClipAnimationTypes: MobileInspectorProps["getClipAnimationTypes"];
    assets: AssetObject[];
    openModal: MobileAssetLibraryProps["openModal"];
    openImportAssetFileDialog: MobileAssetLibraryProps["openImportAssetFileDialog"];
    selectObjects: MobileAssetLibraryProps["selectObjects"];
    clearSelection: () => void;
    isObjectSelected: MobileAssetLibraryProps["isObjectSelected"];
    createAssets: MobileAssetLibraryProps["createAssets"];
    importProjectAsWickFile: MobileAssetLibraryProps["importProjectAsWickFile"];
    createImageFromAsset: MobileAssetLibraryProps["createImageFromAsset"];
    toast: (message: string, type?: ToastType, options?: ToastOptions) => void;
    deleteSelectedObjects: MobileAssetLibraryProps["deleteSelectedObjects"];
    addSoundToActiveFrame: MobileAssetLibraryProps["addSoundToActiveFrame"];
}

const MobileContainer: React.FC<MobileContainerProps> = (props) => {
    const renderTimeline = (): JSX.Element => {
        return (
            <Fragment>
                <Timeline
                    project={props.project}
                    projectDidChange={props.projectDidChange}
                    projectData={props.projectData}
                    getSelectedTimelineObjects={props.getSelectedTimelineObjects}
                    setOnionSkinOptions={props.setOnionSkinOptions}
                    getOnionSkinOptions={props.getOnionSkinOptions}
                    setFocusObject={props.setFocusObject}
                    addTweenKeyframe={props.addTweenKeyframe}
                    createTween={props.createTween}
                    cutFrame={props.cutFrame}
                    insertBlankFrame={props.insertBlankFrame}
                    movePlayheadForwards={props.movePlayheadForwards}
                    movePlayheadBackwards={props.movePlayheadBackwards}
                    focusTimelineOfParentClip={props.focusTimelineOfParentClip}
                    deleteSelectedObjects={props.deleteSelectedObjects}
                    onRef={props.onRef}
                    dragSoundOntoTimeline={props.dragSoundOntoTimeline}
                    timelineRendererMode={props.timelineRendererMode}
                    onTimelineRendererModeChange={props.onTimelineRendererModeChange}
                    timelineShortcutPreset={props.timelineShortcutPreset}
                    onTimelineShortcutPresetChange={props.onTimelineShortcutPresetChange}
                    timelinePlaybackFollowMode={props.timelinePlaybackFollowMode}
                    onTimelinePlaybackFollowModeChange={props.onTimelinePlaybackFollowModeChange}
                    timelineSnapMode={props.timelineSnapMode}
                    onTimelineSnapModeChange={props.onTimelineSnapModeChange}
                    timelineDensityMode={props.timelineDensityMode}
                    onTimelineDensityModeChange={props.onTimelineDensityModeChange}
                    timelineSoftRenderTick={props.timelineSoftRenderTick}
                    toast={props.toast}
                />
            </Fragment>
        );
    };

    const renderInpector = (): JSX.Element => {
        return (
            <Fragment>
                <MobileInspector
                    getToolSetting={props.getToolSetting}
                    setToolSetting={props.setToolSetting}
                    getSelectionType={props.getSelectionType}
                    getAllSoundAssets={props.getAllSoundAssets}
                    getAllSelectionAttributes={props.getAllSelectionAttributes}
                    setSelectionAttribute={props.setSelectionAttribute}
                    editorActions={props.editorActions}
                    selectionIsScriptable={props.selectionIsScriptable}
                    script={props.script}
                    scriptInfoInterface={props.scriptInfoInterface}
                    deleteScript={props.deleteScript}
                    editScript={props.editScript}
                    fontInfoInterface={props.fontInfoInterface}
                    project={props.project}
                    importFileAsAsset={props.importFileAsAsset}
                    colorPickerType={props.colorPickerType}
                    changeColorPickerType={props.changeColorPickerType}
                    updateLastColors={props.updateLastColors}
                    lastColorsUsed={props.lastColorsUsed}
                    getClipAnimationTypes={props.getClipAnimationTypes}
                />
            </Fragment>
        );
    };

    const renderCode = (): JSX.Element => {
        return (
            <Fragment>
                <InspectorScriptWindow
                    script={props.script}
                    deleteScript={props.deleteScript}
                    editScript={props.editScript}
                    scriptInfoInterface={props.scriptInfoInterface}
                />
            </Fragment>
        );
    };

    const renderAsset = (): JSX.Element => {
        return (
            <Fragment>
                <MobileAssetLibrary
                    projectData={props.projectData}
                    assets={props.assets}
                    openModal={props.openModal}
                    openImportAssetFileDialog={props.openImportAssetFileDialog}
                    selectObjects={props.selectObjects}
                    clearSelection={props.clearSelection}
                    isObjectSelected={props.isObjectSelected}
                    createAssets={props.createAssets}
                    importProjectAsWickFile={props.importProjectAsWickFile}
                    createImageFromAsset={props.createImageFromAsset}
                    toast={props.toast}
                    deleteSelectedObjects={props.deleteSelectedObjects}
                    addSoundToActiveFrame={props.addSoundToActiveFrame}
                />
            </Fragment>
        );
    };

    return (
        <MobileTabbedInterface
            className="mobile-container"
            tabs={[
                {
                    label: "timeline",
                    icon: timelineIcon,
                    iconActive: timelineIconActive,
                    alt: "timeline icon",
                },
                {
                    label: "inspector",
                    icon: inspectorIcon,
                    iconActive: inspectorIconActive,
                    alt: "inspector icon",
                },
                {
                    label: "code",
                    icon: codeIcon,
                    iconActive: codeIconActive,
                    alt: "code editor icon",
                },
                {
                    label: "asset",
                    icon: assetIcon,
                    iconActive: assetIconActive,
                    alt: "asset library icon",
                },
            ]}
        >
            {renderTimeline()}
            {renderInpector()}
            {props.selectionIsScriptable() ? (
                renderCode()
            ) : (
                <div className="mobile-inspector-unknown-selection">
                    <div>No Scriptable</div>
                    <div>Object Selected</div>
                </div>
            )}
            {renderAsset()}
        </MobileTabbedInterface>
    );
};

export default MobileContainer;
