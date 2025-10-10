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

import { Component, Fragment, type ComponentProps } from "react";

import "./_mobilecontainer.scss";

import MobileTabbedInterface from "../../Util/MobileTabbedInterface/MobileTabbedInterface";
import Timeline from "../Timeline/Timeline";
import MobileInspector from "./MobileInspector/MobileInspector";
import MobileAssetLibrary from "./MobileAssetLibrary/MobileAssetLibrary";
import InspectorScriptWindow from "../Inspector/InspectorScriptWindow/InspectorScriptWindow";

import timelineIcon from "resources/mobile-container-icons/timeline-icon.svg";
import timelineIconActive from "resources/mobile-container-icons/timeline-icon-active.svg";
import inspectorIcon from "resources/mobile-container-icons/inspector-icon.svg";
import inspectorIconActive from "resources/mobile-container-icons/inspector-icon-active.svg";
import codeIcon from "resources/mobile-container-icons/code-icon.svg";
import codeIconActive from "resources/mobile-container-icons/code-icon-active.svg";
import assetIcon from "resources/mobile-container-icons/asset-icon.svg";
import assetIconActive from "resources/mobile-container-icons/asset-icon-active.svg";

type VoidHandler = (...args: unknown[]) => void;

type InspectorScriptWindowProps = ComponentProps<typeof InspectorScriptWindow>;
type MobileAssetLibraryProps = ComponentProps<typeof MobileAssetLibrary>;
type MobileInspectorProps = ComponentProps<typeof MobileInspector>;

type AssetObject = MobileAssetLibraryProps["assets"][number];

interface MobileContainerProps {
    project: unknown;
    projectDidChange: (options: { actionName: string;[key: string]: unknown }) => void;
    projectData: unknown;
    getSelectedTimelineObjects: VoidHandler;
    setOnionSkinOptions: VoidHandler;
    getOnionSkinOptions: () => unknown;
    setFocusObject: VoidHandler;
    addTweenKeyframe: VoidHandler;
    onRef: (instance: unknown) => void;
    dragSoundOntoTimeline: VoidHandler;
    getToolSetting: (name: string) => unknown;
    setToolSetting: (name: string, value: unknown) => void;
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
    toast: (...args: unknown[]) => void;
    deleteSelectedObjects: MobileAssetLibraryProps["deleteSelectedObjects"];
    addSoundToActiveFrame: MobileAssetLibraryProps["addSoundToActiveFrame"];
}

type MobileContainerState = Record<string, never>;

class MobileContainer extends Component<MobileContainerProps, MobileContainerState> {
    state: MobileContainerState = {};

    renderTimeline = (props: MobileContainerProps): JSX.Element => {
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
                    onRef={props.onRef}
                    dragSoundOntoTimeline={props.dragSoundOntoTimeline}
                />
            </Fragment>
        );
    };

    renderInpector = (props: MobileContainerProps): JSX.Element => {
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

    renderCode = (props: MobileContainerProps): JSX.Element => {
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

    renderAsset = (props: MobileContainerProps): JSX.Element => {
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

    render(): JSX.Element {
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
                {this.renderTimeline(this.props)}
                {this.renderInpector(this.props)}
                {this.props.selectionIsScriptable() ? (
                    this.renderCode(this.props)
                ) : (
                    <div className="mobile-inspector-unknown-selection">
                        <div>No Scriptable</div>
                        <div>Object Selected</div>
                    </div>
                )}
                {this.renderAsset(this.props)}
            </MobileTabbedInterface>
        );
    }
}

export default MobileContainer;
