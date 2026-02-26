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
import type { EditorCoreUIState } from "./types/EditorCore.types";
import queryString from "query-string";
import { localforageAdapter as localforage, ProjectStorage } from "../storage";
import { CurrentProjectRecordSchema } from "../storage/schemas";
import VideoExport from "./export/VideoExport";
import GIFExport from "./export/GIFExport";
import GIFImport from "./import/GIFImport";
import AudioExport from "./export/AudioExport";
import type {
  WickClip,
  WickFrame,
  WickPath,
  WickTween,
  CanvasObject,
  TimelineObject,
  ScriptableObject,
  SelectableObject,
  LocalFileEntry,
} from "./types";
import type {
  WickProject as WickProjectEngine,
  WickAsset as WickAssetEngine,
  WickClip as WickClipEngine,
  WickFrame as WickFrameEngine,
  WickLayer as WickLayerEngine,
  SerializedProject,
  AutosaveData,
  WickToolName,
} from "./types/engine.types";
import type { CurrentProjectRecord as StoredCurrentProjectRecord } from "../storage/schemas";

type EditorCoreProps = Record<string, never>;
type EditorCoreState = EditorCoreUIState & Record<string, unknown>;
type AutosaveEntry = { uuid: string; lastModified?: number };
type ExportMediaArgs = {
  name?: string;
  width?: number;
  height?: number;
};
type AutosaveCallback = () => void;
type LoadCurrentProjectCallback = (didLoadProject: boolean) => void;
type WickScriptError = {
  uuid?: string;
  name?: string;
  message?: string;
  lineNumber?: number;
};
type EyedropperEvent = { color: string };
type WickFileInputEvent = {
  target: {
    files: FileList | File[] | null;
  };
};
type BrowserFileAPI = {
  saveFileFromWick?: (
    file: Blob,
    name: string,
    extension: string,
    successCallback?: () => void,
    failureCallback?: () => void,
  ) => void;
  loadWickFileEntry?: (
    fileEntry: LocalFileEntry,
    callback: (blob: File) => void,
  ) => void;
  deleteLocalWickFile?: (
    fileEntry: LocalFileEntry,
    successCallback?: () => void,
    failureCallback?: () => void,
  ) => void;
  getSavedWickFiles?: (callback: (files: unknown[]) => void) => void;
};

const AUTOSAVE_PERF_LOG_KEY = "wickEditor_autosave_perf";

function toAutosaveData(input: {
  projectData: unknown;
  objectsData: unknown[];
  lastModified: number;
}): AutosaveData {
  return {
    projectData: input.projectData as SerializedProject,
    objectsData: input.objectsData as AutosaveData["objectsData"],
    lastModified: input.lastModified,
  };
}

function parseCurrentProjectRecordMaybe(
  input: unknown,
): StoredCurrentProjectRecord | null {
  const parsed = CurrentProjectRecordSchema.safeParse(input);
  return parsed.success ? parsed.data : null;
}

function chooseMostRecentCurrentProject(
  primary: StoredCurrentProjectRecord | null,
  secondary: StoredCurrentProjectRecord | null,
): StoredCurrentProjectRecord | null {
  if (primary && secondary) {
    return primary.lastModified >= secondary.lastModified ? primary : secondary;
  }
  return primary ?? secondary ?? null;
}

function chooseMostRecentAutosave(
  dexieAutosave: AutosaveData | null,
  legacyAutosave: AutosaveEntry | null,
): "dexie" | "legacy" | null {
  if (dexieAutosave && legacyAutosave) {
    const legacyLastModified =
      typeof legacyAutosave.lastModified === "number"
        ? legacyAutosave.lastModified
        : 0;
    return legacyLastModified > dexieAutosave.lastModified ? "legacy" : "dexie";
  }

  if (dexieAutosave) {
    return "dexie";
  }

  if (legacyAutosave) {
    return "legacy";
  }

  return null;
}

function getPerfNowMs(): number {
  if (typeof performance !== "undefined" && typeof performance.now === "function") {
    return performance.now();
  }

  return Date.now();
}

function isAutosavePerfLoggingEnabled(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    const value = window.localStorage?.getItem(AUTOSAVE_PERF_LOG_KEY);
    return value === "1" || value === "true";
  } catch {
    return false;
  }
}

function logAutosavePerf(
  event: string,
  startMs: number,
  details: Record<string, unknown> = {},
): void {
  if (!isAutosavePerfLoggingEnabled()) {
    return;
  }

  const elapsedMs = Math.round((getPerfNowMs() - startMs) * 100) / 100;
  console.debug("[AutosavePerf]", event, {
    elapsedMs,
    ...details,
  });
}

class EditorCore extends Component<EditorCoreProps, EditorCoreState> {
  project!: WickProjectEngine;
  declare lastUsedTool: WickToolName;
  declare builtinPreviews: Record<
    string,
    {
      blob?: Blob;
      src?: string;
      [key: string]: unknown;
    }
  >;
  declare _onEyedropperPickedColor: (color: string) => void;
  declare _lastAutosave: number;
  declare processingAction: boolean;

  declare toggleBrushModes: (state?: boolean) => void;
  declare projectDidChange: (options?: Record<string, unknown>) => void;
  declare toast: (
    message: string,
    type?: string,
    options?: Record<string, unknown>,
  ) => number | string | void;
  declare updateToast: (
    id: unknown,
    options?: Record<string, unknown>,
  ) => void;
  declare openWarningModal: (args: Record<string, unknown>) => void;
  declare toggleCodeEditor: (state?: boolean) => void;
  declare openModal: (name: string | null) => void;
  declare queueModal: (name: string | null) => void;
  declare showWaitOverlay: (message?: string) => void;
  declare hideWaitOverlay: () => void;
  declare resetEditorForLoad: () => void;
  protected notifyTimelineSoftRender?: () => void;
  protected _autosaveDebounceTimeoutID?: number;

  protected triggerTimelineSoftRender = (): void => {
    this.notifyTimelineSoftRender?.();
  };

  protected selectionObjectsOfType = <T,>(type: string): T[] => {
    return this.project.selection.getSelectedObjects(type) as T[];
  };

  protected selectionObjectAs = <T,>(): T | null => {
    return this.project.selection.getSelectedObject() as T | null;
  };

  /**
   * Returns the name of the active tool.
   * @returns {string} The string representation active tool name.
   */
  getActiveTool = (): WickToolName => {
    const activeTool = this.project.activeTool;

    if (!activeTool) {
      this.project.activeTool = "cursor";
      return "cursor";
    }

    if (typeof activeTool === "string") {
      return activeTool as WickToolName;
    }

    if (
      typeof activeTool === "object" &&
      "name" in activeTool &&
      typeof (activeTool as { name?: string }).name === "string"
    ) {
      return (activeTool as { name: WickToolName }).name;
    }

    return "cursor";
  };

  /**
   * Change the active tool.
   * @param {string} newTool - The string representation of the tool to switch to.
   */
  setActiveTool = (newTool: string) => {
    if (newTool !== this.getActiveTool()) {
      this.lastUsedTool = this.getActiveTool();
      this.project.activeTool = newTool as WickToolName;

      this._onEyedropperPickedColor = (color: string) => {
        this.project.toolSettings.setSetting(
          "fillColor",
          new window.Wick.Color(color),
        );
      };

      // We must manually close the brush modes popup here, because otherwise the page
      // will crash because the popup can no longer find the brush modes toggle button
      // on the page.
      // See: https://github.com/reactstrap/reactstrap/issues/894
      this.toggleBrushModes(false);

      this.projectDidChange({ actionName: "Set Active Tool: " + newTool });
    }
  };

  /**
   * Toggles highlighted clip borders.
   */
  toggleClipBorders = (): void => {
    this.project.showClipBorders = !this.project.showClipBorders;
    this.projectDidChange({ actionName: "Toggle Clip Borders" });
  };

  /**
   * Activates the tool that was used before the current tool was activated.
   */
  activateLastTool = (): void => {
    this.project.activeTool = this.lastUsedTool;
    this.projectDidChange({ actionName: "Activate Last Tool" });
  };

  /**
   * Undo the last action that was done.
   */
  undoAction = (): void => {
    if (!this.project.undo()) {
      this.toast("Nothing to undo.", "warning");
    } else {
      this.projectDidChange({ skipHistory: true, actionName: "Undo" });
    }
  };

  /**
   * Recover the state of the project from before the last action was done.
   */
  redoAction = (): void => {
    if (!this.project.redo()) {
      this.toast("Nothing to redo.", "warning");
    } else {
      this.projectDidChange({ skipHistory: true, actionName: "Redo" });
    }
  };

  /**
   * Recenters the canvas.
   */
  recenterCanvas = (): void => {
    this.project.recenter();
    this.projectDidChange({ skipHistory: true, actionName: "recenterCanvas" });
  };

  /**
   * Zooms in the canvas.
   */
  zoomIn = (): void => {
    this.project.zoomIn();
    this.project.view.render();
  };

  /**
   * Zooms out the canvas.
   */
  zoomOut = (): void => {
    this.project.zoomOut();
    this.project.view.render();
  };

  /**
   * Returns an object containing the tool settings.
   * @returns {object} The object containing the tool settings.
   */
  getToolSetting = (name: string): string | number | boolean => {
    return this.project.toolSettings.getSetting(name);
  };

  /**
   * Updates the tool settings state.
   * @param {object} newToolSettings - An object of key-value pairs where the keys represent tool settings and the values represent the values to change those settings to.
   */
  setToolSetting = (name: string, value: string | number | boolean): void => {
    this.project.toolSettings.setSetting(name, value);
    this.projectDidChange({
      actionName: "Change Tool Setting " + name + ":" + value,
    });
  };

  /**
   *
   */
  getToolSettingRestrictions = (
    name: string,
  ): { min?: number; max?: number; step?: number; options?: string[] } => {
    return this.project.toolSettings.getSettingRestrictions(name);
  };

  /**
   * Returns all animation types available
   * @returns {Object[]} - Animation types listed as objects with label and value keys.
   */
  getClipAnimationTypes = (): Array<{ label: string; value: string }> => {
    let outputTypes: Array<{ label: string; value: string }> = [];
    Object.keys(window.Wick.Clip.animationTypes).forEach((key) => {
      outputTypes.push({
        label: window.Wick.Clip.animationTypes[key],
        value: key,
      });
    });
    return outputTypes;
  };

  /**
   * Shrinks the brush/eraser size by a given amount.
   */
  changeBrushSize = (amt: number): void => {
    const tool = this.getActiveTool();
    let option: string | undefined;
    if (tool === "brush") {
      option = "brushSize";
    } else if (tool === "eraser") {
      option = "eraserSize";
    } else {
      return;
    }

    const brushSize = Number(this.getToolSetting(option) ?? 0);
    const newBrushSize = brushSize + amt;

    this.setToolSetting(option, newBrushSize);
  };

  /**
   * Moves the active timeline's playhead forward one frame.
   */
  movePlayheadForwards = (): void => {
    const focus = this.project.focus;
    if (!focus || typeof focus !== "object" || !("timeline" in focus)) {
      return;
    }
    (focus as { timeline: { playheadPosition: number } }).timeline
      .playheadPosition++;
    this.project.guiElement.checkForPlayheadAutoscroll?.();
    this.project.view.render();
    this.project.guiElement.draw();
    this.triggerTimelineSoftRender();
  };

  /**
   * Moves the active timeline's playhead backwards one frame.
   */
  movePlayheadBackwards = (): void => {
    const focus = this.project.focus;
    if (!focus || typeof focus !== "object" || !("timeline" in focus)) {
      return;
    }
    (focus as { timeline: { playheadPosition: number } }).timeline
      .playheadPosition--;
    this.project.guiElement.checkForPlayheadAutoscroll?.();
    this.project.view.render();
    this.project.guiElement.draw();
    this.triggerTimelineSoftRender();
  };

  /**
   * Finishes a playhead moving operation.
   */
  finishMovingPlayhead = (): void => {
    this.projectDidChange({ actionName: "Finish Moving Playhead" });
  };

  /**
   * Determines the type of the object/objects that are in the selection state.
   * @returns {string} The string representation of the type of object/objects selected
   */
  getSelectionType = (): string => {
    return this.project.selection.selectionType;
  };

  /**
   * Returns true if the selection is scriptable.
   * @return {boolean} True if the selection is scriptable.
   */
  selectionIsScriptable = (): boolean => {
    return this.project.selection.isScriptable;
  };

  /**
   * The selected scriptable object.
   * @return {Wick.Frame|Wick.Clip} object - the scriptable object that is selected
   */
  getSelectedObjectScript = (): ScriptableObject | null => {
    if (this.selectionIsScriptable()) {
      return this.selectionObjectAs<ScriptableObject>();
    } else {
      return null;
    }
  };

  /**
   * Returns all selected objects on the timeline.
   * @returns {(<Wick.Frame>|<Wick.Tween>)[]} An array containing the selected
   * tweens and frames
   */
  getSelectedTimelineObjects = (): TimelineObject[] => {
    return this.selectionObjectsOfType<TimelineObject>("Timeline");
  };

  /**
   * Returns all selected frames.
   * @returns {<Wick.Frame>)[]} An array containing the selected frames.
   */
  getSelectedFrames = (): WickFrame[] => {
    return this.selectionObjectsOfType<WickFrame>("Frame");
  };

  /**
   * Returns all selected tweens.
   * @returns {<Wick.Tween>)[]} An array containing the selected tweens.
   */
  getSelectedTweens = (): WickTween[] => {
    return this.selectionObjectsOfType<WickTween>("Tween");
  };

  /**
   * Returns all selected objects on the timeline.
   * @returns {(<Wick.Path>|<Wick.Clip>|<Wick.Button>)[]} An array containing
   * the selected clips and paths
   */
  getSelectedCanvasObjects = (): CanvasObject[] => {
    return this.selectionObjectsOfType<CanvasObject>("Canvas");
  };

  /**
   * Returns all selected paths.
   * @returns {<Wick.Path>)[]} An array containing the selected paths.
   */
  getSelectedPaths = (): WickPath[] => {
    return this.selectionObjectsOfType<WickPath>("Path");
  };

  /**
   * Returns all selected clips.
   * @returns {<Wick.Clip>)[]} An array containing the selected clips.
   */
  getSelectedClips = (): WickClip[] => {
    return this.selectionObjectsOfType<WickClip>("Clip");
  };

  /**
   * Returns all selected buttons.
   * @returns {<Wick.Button>)[]} An array containing the selected buttons.
   */
  getSelectedButtons = (): WickClip[] => {
    return this.selectionObjectsOfType<WickClip>("Button");
  };

  /**
   * Returns all selected objects in the asset library.
   * @returns {(<Wick.ImageAsset>|<Wick.SoundAsset>)[]} An array containing the
   * selected assets
   */
  getSelectedAssetLibraryObjects = (): WickAssetEngine[] => {
    return this.selectionObjectsOfType<WickAssetEngine>("AssetLibrary");
  };

  /**
   * Returns all selected sound assets from the asset library.
   * @returns {(<Wick.SoundAsset>)[]} An array containing the selected sound
   * assets.
   */
  getSelectedSoundAssets = (): WickAssetEngine[] => {
    return this.selectionObjectsOfType<WickAssetEngine>("SoundAsset");
  };

  /**
   * Returns all selected image assets from the asset library.
   * @returns {(<Wick.ImageAsset>)[]} An array containing the selected image
   * assets.
   */
  getSelectedImageAssets = (): WickAssetEngine[] => {
    return this.selectionObjectsOfType<WickAssetEngine>("ImageAsset");
  };

  /**
   * Returns the selected scriptable object if selection is a single scriptable
   * object.
   * @return {object|null} selected scriptable object.
   */
  getSelectedScriptableObject = (): ScriptableObject | null => {
    const selected =
      this.selectionObjectAs<ScriptableObject & { isScriptable?: boolean }>();
    return selected && selected.isScriptable
      ? selected
      : null;
  };

  /**
   * Returns the number of objects selected on the canvas.
   * @return {number} Number of canvas objects selected.
   */
  getNumCanvasObjectsSelected = (): number => {
    return this.project.selection.numObjects;
  };

  /**
   * Sets the active layer
   * @param {number} index The index to set as active
   */
  setActiveLayerIndex = (index: number): void => {
    this.project.activeTimeline.activeLayerIndex = index;
    this.projectDidChange({ actionName: "Set Active Layer" });
  };

  /**
   * Toggles layer hidden
   * @param {object} layer The layer to toggle
   */
  toggleHidden = (layer: { hidden: boolean }): void => {
    layer.hidden = !layer.hidden;
    this.projectDidChange({ actionName: "Toggle Layer Hidden" });
  };

  /**
   * Toggles layer locked
   * @param {object} layer The layer to toggle
   */
  toggleLocked = (layer: { locked: boolean }): void => {
    layer.locked = !layer.locked;
    this.projectDidChange({ actionName: "Toggle Layer Locked" });
  };

  /**
   * Moves selection into target at index
   * @param {object} target The object to insert into
   * @param {number} index The index to insert at
   */
  moveSelection = (
    target: WickFrameEngine | WickLayerEngine,
    index: number,
  ): void => {
    if (this.project.moveSelection(target, index)) {
      this.projectDidChange({ actionName: "Moved Selection" });
    }
  };

  /**
   * Adds the given object to the selection.
   * @param {object} object - The object to add to the selection.
   */
  selectObject = (object: SelectableObject): void => {
    this.project.selection.select(object as { [key: string]: unknown });
    this.projectDidChange({ actionName: "Select Object" });
  };

  /**
   * Adds the given objects to the selection. No
   * changes will be made if the selection does not change.
   * @param {object[]} objects - The objects to add to the selection.
   */
  selectObjects = (objects: SelectableObject[]): void => {
    this.project.selection.selectMultipleObjects(
      objects as Array<{ [key: string]: unknown }>,
    );
    this.projectDidChange({ actionName: "Select Multiple Objects" });
  };

  /**
   * Removes the given objects from the selection. No
   * changes will be made if the selection does not change.
   * @param {object[]} objects - The objects to remove from the selection.
   */
  deselectObjects = (objects: SelectableObject[]): void => {
    objects.forEach((object) => {
      this.project.selection.deselect(object as { [key: string]: unknown });
    });
    this.projectDidChange({ actionName: "Deselect Multiple Objects" });
  };

  /**
   * Clears the selection.
   */
  clearSelection = (): void => {
    this.project.selection.clear();
    this.projectDidChange({ actionName: "Clear Selection" });
  };

  /**
   * Selects everything on the canvas.
   */
  selectAll = (): void => {
    this.project.selectAll();
    this.projectDidChange({ actionName: "Select All" });
  };

  /**
   * Returns the value of a requested selection attribute.
   * @param  {string} attributeName Selection attribute to retrieve.
   * @return {string|number|boolean|object|null} Value of the selection attribute to
   * retrieve. Returns null if attribute does not exist or selection is empty.
   */
  getSelectionAttribute = (
    attributeName: string,
  ): string | number | boolean | object | null => {
    let attribute = this.project.selection[attributeName];

    if (attribute instanceof Array) {
      if (attribute.length === 0) {
        return null;
      } else if (attribute.length === 1) {
        return attribute[0];
      } else {
        // TODO: Should return info about "mixed" attributes, but just
        // return the attribute of the first object for now.
        return attribute[0];
      }
    } else {
      // Return primitives directly
      if (
        typeof attribute === "string" ||
        typeof attribute === "number" ||
        typeof attribute === "boolean"
      ) {
        return attribute;
      }
      // Return objects (like Wick.Color) directly if they exist
      if (
        attribute !== null &&
        attribute !== undefined &&
        typeof attribute === "object"
      ) {
        return attribute;
      }
      return null;
    }
  };

  /**
   * Returns the names of all possible selection attribute names.
   * @return {string[]} Array of selection attribute names.
   */
  getAllSelectionAttributeNames = (): string[] => {
    return this.project.selection.allAttributeNames;
  };

  /**
   * Returns the new selection Attributes.
   * @return {object} object with new attributes.
   */
  getAllSelectionAttributes = (): Record<string, unknown> => {
    const newAttributes: Record<string, unknown> = {};

    const selectionAttributeNames = this.getAllSelectionAttributeNames();

    selectionAttributeNames.forEach((name) => {
      newAttributes[name] = this.getSelectionAttribute(name);
    });

    return newAttributes;
  };

  /**
   * Updates the value of a selection attribute for the selected item in the editor.
   * @param {string} attribute Name of the attribute to update.
   * @param {string|number} newValue  New value of the attribute to update.
   */
  setSelectionAttribute = (
    attribute: string,
    newValue: string | number | boolean,
  ): void => {
    this.project.selection[attribute] = newValue;
    this.projectDidChange({
      actionName: "Set Selection Attribute: " + attribute + ":" + newValue,
    });
  };

  /**
   * Determines if a given object is selected.
   * @param {object} object - Selection object to check if it is selected
   * @returns {boolean} - True if the object is selected, false otherwise
   */
  isObjectSelected = (object: SelectableObject): boolean => {
    return this.project.selection.isObjectSelected(object as { [key: string]: unknown });
  };

  /**
   * Creates a new clip from the selected paths and clips and adds it to the project.
   * @param {string} name The name of the clip after creation.
   * @param {boolean} wrapSingularClip If the selection is just one Clip, should it be wrapped within another Clip?
   *    Default is true, to preserve existing script behavior.
   *    Calling this function with false ensures user doesn't accidentally wrap a Clip within another Clip.
   */
  createClipFromSelection = (name: string, wrapSingularClip = true): void => {
    if (this.project.selection.numObjects === 0) {
      console.log("No selection from which to create clips.");
      return;
    } else if (
      !wrapSingularClip &&
      this.project.selection.numObjects === 1 &&
      this.project.selection.types[0] === "Clip"
    ) {
      console.log("That's already a Clip.");
      return;
    }
    this.project.createClipFromSelection({
      identifier: name,
      type: "Clip",
    });
    this.projectDidChange({ actionName: "Create Clip From Selection" });
  };

  /**
   * Creates a new button from the selected paths and clips and adds it to the project.
   * @param {string} name The name of the button after creation.
   */
  createButtonFromSelection = (name: string): void => {
    this.project.createClipFromSelection({
      identifier: name,
      type: "Button",
    });
    this.projectDidChange({ actionName: "Create Button From Selection" });
  };

  /**
   * Creates a "group" from the current canvas selection.
   * In Wick, grouping maps to creating a clip without wrapping a single selected clip.
   */
  createGroupFromSelection = (): void => {
    const selection = this.project.selection;

    if (selection.numObjects === 0) {
      this.toast("Select objects to group.", "warning");
      return;
    }

    if (selection.numObjects === 1 && selection.types[0] === "Clip") {
      this.toast("Selection is already grouped.", "info");
      return;
    }

    this.project.createClipFromSelection({
      identifier: "Group",
      type: "Clip",
    });
    this.projectDidChange({ actionName: "Create Group From Selection" });
  };

  /**
   * Updates the focus object of the project.
   * @param {Wick.Clip} object Object to set as focus.
   */
  setFocusObject = (object: WickClipEngine | WickProjectEngine): void => {
    this.project.focus = object;
    this.projectDidChange({ actionName: "Set Focus Object" });
  };

  /**
   * Break apart the selected clip(s) and select the objects that were contained within those clip(s).
   */
  breakApartSelection = (): void => {
    //only break apart selections that have at least 1 clip or button
    //it might be better for these checks to go wherever project.breakApartSelection is defined
    var sel = this.project.selection;
    if (
      sel.numObjects === 0 ||
      (!sel.types.includes("Clip") && !sel.types.includes("Button"))
    ) {
      return;
    }
    this.project.breakApartSelection();
    this.projectDidChange({ actionName: "Break Apart Selection" });
  };

  /**
   * Deletes all selected objects.
   * @returns {object[]} The objects that were deleted.
   */
  deleteSelectedObjects = (): void => {
    if (this.project.selection.location === "AssetLibrary") {
      this.openWarningModal({
        description:
          "Any objects in the project using this asset will also be deleted.",
        title: "Delete this asset?",
        acceptAction: () => {
          this.project.deleteSelectedObjects();
          this.projectDidChange({ actionName: "Delete Selected Asset" });
        },
        cancelAction: () => {},
        finalAction: () => {},
        acceptText: "Delete",
        cancelText: "Cancel",
      });
    } else {
      this.project.deleteSelectedObjects();
      this.projectDidChange({ actionName: "Delete Selected Objects" });
    }
  };

  /**
   * Deletes a sub script from a script object.
   * @param {Object} scriptOwner Script owner to remove sub script from
   * @param {string} scriptName Name of the script to remove
   */
  deleteScript = (
    scriptOwner: { removeScript: (name: string) => void },
    scriptName: string,
  ): void => {
    let oldEditorState = this.state.codeEditorOpen;

    // Turn off code editor if necessary, then open warning modal.
    this.toggleCodeEditor(false);

    this.openWarningModal({
      description: 'Delete Script: "' + scriptName + '" from the object?',
      title: "Delete Script",
      acceptText: "Delete",
      cancelText: "Cancel",
      acceptAction: () => scriptOwner.removeScript(scriptName),
      finalAction: () => this.toggleCodeEditor(oldEditorState), // Reopen code editor if necessary.
    });
  };

  /**
   * Opens the code editor to the script name tab if that tab exists.
   * @param {string} scriptName Name of the script to open the tab of. Must be all lowercase.
   */
  editScript = (scriptName: string): void => {
    this.setState({
      scriptToEdit: scriptName,
      codeEditorOpen: true,
    });
  };

  /**
   * Moves the selected objects on the canvas to the back.
   */
  sendSelectionToBack = (): void => {
    this.project.selection.sendToBack();
    this.projectDidChange({ actionName: "Send Selection to Back" });
  };

  /**
   * Moves the selected objects on the canvas to the front.
   */
  sendSelectionToFront = (): void => {
    this.project.selection.bringToFront();
    this.projectDidChange({ actionName: "Bring Selection to Front" });
  };

  /**
   * Moves the selected objects on the canvas backwards.
   */
  moveSelectionBackwards = (): void => {
    this.project.selection.moveBackwards();
    this.projectDidChange({ actionName: "Move Selection Backwards" });
  };

  /**
   * Moves the selected objects on the canvas forwards.
   */
  moveSelectionForwards = (): void => {
    this.project.selection.moveForwards();
    this.projectDidChange({ actionName: "Move Selection Forwards" });
  };

  /**
   * Horizontally flips the canvas selection.
   */
  flipSelectedHorizontal = (): void => {
    this.project.selection.flipHorizontally();
    this.projectDidChange({ actionName: "Flip Selection Horizontal" });
  };

  /**
   * Vertically flips the canvas selection.
   */
  flipSelectedVertical = (): void => {
    this.project.selection.flipVertically();
    this.projectDidChange({ actionName: "Flip Selection Vertical" });
  };

  nudgeSelection = (x: number, y: number): void => {
    if (this.project.selection.numObjects === 0) return; // Ignore if no objects are selected.
    this.project.selection.x += x;
    this.project.selection.y += y;
    this.projectDidChange({
      skipHistory: true,
      actionName: "Nudge Selection",
      skipReactRender: true,
    });
  };

  /**
   * Moves the selected objects up 1 pixel.
   */
  nudgeSelectionUp = (): void => {
    this.nudgeSelection(0, -1);
  };

  /**
   * Moves the selected objects down 1 pixel.
   */
  nudgeSelectionDown = (): void => {
    this.nudgeSelection(0, 1);
  };

  /**
   * Moves the selected objects right 1 pixel.
   */
  nudgeSelectionRight = (): void => {
    this.nudgeSelection(1, 0);
  };

  /**
   * Moves the selected objects left 1 pixel.
   */
  nudgeSelectionLeft = (): void => {
    this.nudgeSelection(-1, 0);
  };

  /**
   * Moves the selected objects up 10 pixels.
   */
  nudgeSelectionUpMore = (): void => {
    this.nudgeSelection(0, -10);
  };

  /**
   * Moves the selected objects down 10 pixels.
   */
  nudgeSelectionDownMore = (): void => {
    this.nudgeSelection(0, 10);
  };

  /**
   * Moves the selected objects right 10 pixels.
   */
  nudgeSelectionRightMore = (): void => {
    this.nudgeSelection(10, 0);
  };

  /**
   * Moves the selected objects left 10 pixels.
   */
  nudgeSelectionLeftMore = (): void => {
    this.nudgeSelection(-10, 0);
  };

  /**
   * Finish the current nudging operation
   */
  finishNudgingObject = (): void => {
    this.projectDidChange({ actionName: "Nudge Elements" });
  };

  /**
   * Perform a boolean unite on the selected paths.
   */
  booleanUnite = (): void => {
    this.project.doBooleanOperationOnSelection("unite");
    this.projectDidChange({ actionName: "Boolean Unite" });
  };

  /**
   * Perform a boolean subtraction on the selected paths.
   */
  booleanSubtract = (): void => {
    this.project.doBooleanOperationOnSelection("subtract");
    this.projectDidChange({ actionName: "Boolean Subtract" });
  };

  /**
   * Perform a boolean intersection on the selected paths.
   */
  booleanIntersect = (): void => {
    this.project.doBooleanOperationOnSelection("intersect");
    this.projectDidChange({ actionName: "Boolean Intersect" });
  };

  /**
   * Updates the Wick Project settings with new values passed in as an object. Will make no changes if input is invalid or the same as the previous settings.
   * @param {object} newSettings an object containing all of the settings to update within the project. Accepts valid project settings such as 'name', 'width', 'height', 'framerate', and 'backgroundColor'.
   */
  updateProjectSettings = (
    newSettings: Partial<Record<string, unknown>>,
  ): void => {
    const validKeys = [
      "name",
      "width",
      "height",
      "backgroundColor",
      "framerate",
    ];
    let updated = false;

    Object.keys(newSettings).forEach((key) => {
      if (!validKeys.includes(key)) return;

      const newValue = newSettings[key];
      const oldValue = this.project[key];
      if (oldValue !== newValue) {
        this.project[key] = newValue;
        updated = true;
      }
    });

    if (updated) {
      this.projectDidChange({ actionName: "Update Project Settings" });
    }
  };

  /**
   * Sets the project focus to the timeline of the currently selected clip.
   */
  focusTimelineOfSelectedObject = (): void => {
    this.project.focusTimelineOfSelectedClip();
    this.projectDidChange({ actionName: "Focus Selected Object Timeline" });
  };

  /**
   * Sets the project focus to the parent timeline of the currently selected clip.
   */
  focusTimelineOfParentClip = (): void => {
    this.project.focusTimelineOfParentClip();
    this.projectDidChange({ actionName: "Focus Timeline of Parent Clip" });
  };

  /**
   * Creates an image from an asset's uuid and places it on the canvas.
   * @param {string} uuid - The UUID of the desired asset.
   * @param {number} x - The x location of the image after creation in relation to the window.
   * @param {number} y - The y location of the image after creation in relation to the window.
   * @param {boolean} isCanvasSpace - If not set to true, x and y will be converted from screen space to canvas space
   */
  createImageFromAsset = (
    uuid: string,
    x: number,
    y: number,
    isCanvasSpace?: boolean,
  ): void => {
    // convert screen position to wick project position
    const paper = this.project.view.paper;
    if (!paper) {
      return;
    }
    let dropPoint = new paper.Point();
    if (isCanvasSpace) {
      dropPoint = new paper.Point(x, y);
    } else {
      let canvasPosition = paper.project.view.element.getBoundingClientRect();
      x -= canvasPosition.x;
      y -= canvasPosition.y;
      dropPoint = paper.view.viewToProject(new window.paper.Point(x, y));
    }

    const obj = window.Wick.ObjectCache.getObjectByUUID(uuid);

    if (obj instanceof window.Wick.ImageAsset) {
      this.project.createImagePathFromAsset(
        window.Wick.ObjectCache.getObjectByUUID(uuid),
        dropPoint.x,
        dropPoint.y,
        () => {
          this.projectDidChange({ actionName: "Create Image Path From Asset" });
        },
      );
    } else if (obj instanceof window.Wick.ClipAsset) {
      this.project.createClipInstanceFromAsset(
        window.Wick.ObjectCache.getObjectByUUID(uuid),
        dropPoint.x,
        dropPoint.y,
        () => {
          this.projectDidChange({
            actionName: "Create Clip Instance From Asset",
          });
        },
      );
    } else if (obj instanceof window.Wick.SVGAsset) {
      this.project.createSVGInstanceFromAsset(
        window.Wick.ObjectCache.getObjectByUUID(uuid),
        dropPoint.x,
        dropPoint.y,
        () => {
          this.projectDidChange({
            actionName: "Create SVG Instance From Asset",
          });
        },
      );
    } else {
      console.error("object is not an ImageAsset or a ClipAsset");
    }
  };

  /**
   * Creates an instance of the selected asset at the center of the canvas
   */
  createInstanceOfSelectedAsset = (): void => {
    const uuid = this.project.selection.getSelectedObject().uuid;
    if (!uuid) {
      this.toast("No selected asset to create.", "warning");
      return;
    }
    this.createImageFromAsset(
      uuid,
      this.project.width / 2,
      this.project.height / 2,
      true,
    );
  };

  /**
   * Is called when a sound asset is dragged/dropped on the timeline element.
   * @param {string} uuid - The UUID of the desired asset.
   * @param {number} x - The x location of the image after creation in relation to the window.
   * @param {number} y - The y location of the image after creation in relation to the window.
   * @param {boolean} drop - If true, will drop the asset with the uuid onto the hovered frame, modifying the frame.
   */
  dragSoundOntoTimeline = (
    uuid: string,
    x: number,
    y: number,
    drop: boolean,
  ): void => {
    this.project.guiElement.dragAssetAtPosition?.(uuid, x, y, drop);
  };

  addSoundToActiveFrame = (soundAsset: WickAssetEngine): void => {
    const frame = this.project.activeFrame;
    if (frame !== null) {
      frame.sound = soundAsset;
      this.projectDidChange({ actionName: "Add Sound to Active Frame" });
    } else {
      this.toast("No active frame to add sound to.", "error");
    }
  };

  /**
   * Attempts to import an arbitrary asset to the project. Displays an error or success message
   * depending on if the action was successful.
   * @param {File} file - File object to create an asset of.
   * @param {Function} callback - (optional) Callback to return asset to. If the import was unsuccessful, null is sent to the callback.
   */
  importFileAsAsset = (
    file: File,
    callback?: (asset: WickAssetEngine | null) => void,
  ) => {
    this.project.importFile(file, (asset) => {
      if (callback) callback(asset);

      if (!asset) {
        this.toast("Could not add files to project: " + file.name, "error");
      } else {
        this.toast(`Imported ${file.name || "project"} successfully.`);
        this.projectDidChange({ actionName: "Import File As Asset" });
      }
    });
  };

  /**
   * Adds fetched file to builtinPreviews
   * @param {string} filename - name of file
   * @param {File} file - file to add
   */
  addFileToBuiltinPreviews = (filename: string, file: File): void => {
    this.builtinPreviews[filename] = { blob: file };

    let reader = new FileReader();

    reader.onload = () => {
      const preview = this.builtinPreviews[filename];
      const dataURL = reader.result;
      if (preview && typeof dataURL === "string") {
        preview.src = dataURL;
      }

      this.projectDidChange({
        skipHistory: true,
        actionName: "Import File To Builtin Previews",
      });
    };

    reader.readAsDataURL(file);
  };

  /**
   * Checks if an asset with filename filename exists
   * @param {string} filename - name of file
   */
  isAssetInLibrary = (filename: string): boolean => {
    let assets = this.project.getAssets();
    for (let i = 0; i < assets.length; i++) {
      const asset = assets[i];
      if (asset && asset.filename === filename) {
        return true;
      }
    }
    return false;
  };

  /**
   * Creates and imports Wick Assets from the acceptedFiles list, and displays an alert message for rejected files.
   * @param {File[]} acceptedFiles - Files uploaded by user with supported MIME types to import into the project
   * @param {File[]} rejectedFiles - Files uploaded by user with unsupported MIME types.
   * @param {object} options - optional flags. Can include "create", which if true will create an instance of the object on the canvas.
   */
  createAssets = (
    acceptedFiles: File[],
    rejectedFiles: File[],
    options?: { create?: boolean; location?: { x?: number; y?: number } },
  ) => {
    const resolvedOptions = options ?? {};
    const location = resolvedOptions.location ?? {};

    let toastID = this.toast("Importing files...", "info");

    // Error message for failed uploads
    if (rejectedFiles.length > 0) {
      let fileNamesRejected = rejectedFiles
        .map((file: File) => file.name)
        .join(", ");
      this.updateToast(toastID, {
        type: "error",
        text: "Could not import files: " + fileNamesRejected,
      });
    }

    let createCallback = (asset: WickAssetEngine | null) => {
      if (!asset) return;
      if (resolvedOptions.create)
        this.createImageFromAsset(asset.uuid, location.x ?? 0, location.y ?? 0);
    };

    // Add all successfully uploaded assets
    for (const file of acceptedFiles) {
      if (file.type === "image/gif") {
        GIFImport.importGIFIntoProject({
          gifFile: file,
          project: this.project,
          onProgress: (percent: number) => {
            console.log("GIFImport onProgress: " + percent);
          },
          onFinish: (gifAsset: WickAssetEngine) => {
            this.project.addAsset(gifAsset);
            this.projectDidChange({ actionName: "Add Asset" });
            if (resolvedOptions.create)
              this.createImageFromAsset(
                gifAsset.uuid,
                location.x ?? 0,
                location.y ?? 0,
              );
          },
        });
      } else {
        this.importFileAsAsset(file, createCallback);
      }
    }
  };

  /**
   * Begin interactive object creation process.
   */
  beginMakeInteractiveProcess = (): void => {
    this.openModal("MakeInteractive");
  };

  /**
   * Begin animated object creation process.
   */
  beginMakeAnimatedProcess = (): void => {
    this.openModal("MakeAnimated");
  };

  /**
   * Export the current project to a new window.
   */
  exportProjectToNewWindow = (): void => {
    this.showWaitOverlay();
    window.Wick.HTMLPreview.previewProject(
      this.project,
      (previewWindow: Window | null | undefined) => {
        this.hideWaitOverlay();
        if (previewWindow) {
          this.toast("Project preview window opened.", "info", {
            autoClose: false,
          });
        } else {
          // If pop ups are disabled, previewWindow will be null.
          this.toast(
            "Could not open a preview window. Try disabling your popup blocker!",
            "error",
            { autoClose: false },
          );
        }
      },
    );
  };

  /**
   * Export the current project as a Wick File using the save as dialog.
   */
  exportProjectAsWickFile = (): void => {
    this.showWaitOverlay();

    let toastID = this.toast("Exporting project as a .wick file...", "info", {
      autoClose: false,
    });

    window.Wick.WickFile.toWickFile(
      this.project,
      (file: BlobPart | ArrayBuffer | undefined) => {
        if (file === undefined) {
          this.updateToast(toastID, {
            type: "error",
            text: "Could not export .wick file.",
          });
          this.hideWaitOverlay();
          return;
        }

        let success = () => {
          this.updateToast(toastID, {
            type: "success",
            text: "Successfully saved .wick file.",
          });
        };

        let fail = () => {
          this.updateToast(toastID, {
            type: "error",
            text: "Error saving .wick file. Please try again.",
          });
        };

        const wickBlob = new Blob([file], { type: "application/wick" });
        window.saveFileFromWick?.(
          wickBlob,
          this.project.name,
          ".wick",
          success,
          fail,
        );

        this.hideWaitOverlay();
      },
    );
  };

  /**
   * Export the current project as an animated GIF.
   */
  exportProjectAsAnimatedGIF = (args: ExportMediaArgs = {}): void => {
    // Open export media loading bar modal.
    this.openModal("ExportMedia");
    this.setState({
      renderProgress: 0,
      renderType: "gif",
      renderStatusMessage: "Creating gif.",
    });

    // this.showWaitOverlay();
    const outputName = args.name ?? this.project.name;
    let toastID = this.toast("Exporting animated GIF...", "info");

    let onProgress = (message: string, progress: number) => {
      this.setState({
        renderStatusMessage: message,
        renderProgress: progress,
      });
    };

    let onError = (message?: string) => {
      console.error("Gif Render had an error with message: ", message);
    };

    let onFinish = (gifBlob: Blob) => {
      let success = () => {
        this.updateToast(toastID, {
          type: "success",
          text: "Successfully saved .gif file.",
        });
      };

      let fail = () => {
        this.updateToast(toastID, {
          type: "error",
          text: "Error saving .gif file. Please try again.",
        });
      };

      window.saveFileFromWick?.(gifBlob, outputName, ".gif", success, fail);

      this.setState({
        renderStatusMessage: "Finished creating GIF.",
        renderProgress: 100,
      });
    };

    GIFExport.createAnimatedGIFFromProject({
      width: args.width,
      height: args.height,
      project: this.project,
      onFinish: onFinish,
      onError: onError,
      onProgress: onProgress,
    });
  };

  /**
   * Export the current project as an image sequence
   */
  exportProjectAsImageSequence = (args: ExportMediaArgs = {}): void => {
    const { width, height } = args;
    this.openModal("ExportMedia");
    this.setState({
      renderProgress: 0,
      renderType: "image sequence",
      renderStatusMessage: "Creating image sequence.",
      exporting: true,
    });

    let toastID = this.toast("Exporting image sequence...", "info");

    let onProgress = (completed: number, maxFrames: number) => {
      let message = "Rendered " + completed + "/" + maxFrames + " frames";
      let percentage = 10 + 90 * (completed / maxFrames);
      this.setState({
        renderStatusMessage: message,
        renderProgress: percentage,
      });
    };

    let onError = (message?: string) => {
      console.error("Image Render had an error with message: ", message);
    };

    let onFinish = (sequenceBlobZip: Blob) => {
      let success = () => {
        this.updateToast(toastID, {
          type: "success",
          text: "Successfully saved image sequence.",
        });
      };

      let fail = () => {
        this.updateToast(toastID, {
          type: "error",
          text: "Error saving image sequence. Please try again.",
        });
      };

      window.saveFileFromWick?.(
        sequenceBlobZip,
        this.project.name + "_imageSequence",
        ".zip",
        success,
        fail,
      );

      this.setState({
        exporting: false,
      });
    };

    window.Wick.ImageSequence.toPNGSequence({
      project: this.project,
      width,
      height,
      onProgress: onProgress,
      onError: () => {
        this.hideWaitOverlay();
        onError();
      },
      onFinish: (file: Blob) => {
        this.hideWaitOverlay();
        onFinish(file);
      },
    });
  };

  /**
   * Export the current project as a video.
   */
  exportProjectAsVideo = (args: ExportMediaArgs = {}): void => {
    const { width, height } = args;
    // Open export media loading bar modal.
    this.openModal("ExportMedia");
    this.setState({
      renderProgress: 10,
      renderType: "video",
      renderStatusMessage: "Creating video.",
      exporting: true,
    });

    let toastID = this.toast("Exporting video...", "info");

    let onProgress = (message: string, progress: number) => {
      this.setState({
        renderStatusMessage: message,
        renderProgress: progress,
      });
    };

    let onError = (message?: string) => {
      console.error("Video Render had an error with message: ", message);
    };

    let onFinish = (message?: string) => {
      this.updateToast(toastID, {
        type: "success",
        text: "Successfully created .mp4 file.",
      });
      console.log("Video Render Complete: ", message);

      this.setState({
        exporting: false,
      });
    };

    // this.showWaitOverlay('Rendering video...');
    VideoExport.renderVideo({
      project: this.project,
      width,
      height,
      onProgress: onProgress,
      onError: () => {
        this.hideWaitOverlay();
        onError();
      },
      onFinish: () => {
        this.hideWaitOverlay();
        onFinish();
      },
    });
  };
  /**
   * Export the current project as a video.
   */

  exportProjectAsImageSVG = (name?: string): void => {
    // Open export media loading bar modal.
    this.openModal("ExportMedia");
    this.setState({
      renderProgress: 0,
      renderType: "svg",
      renderStatusMessage: "Creating svg.",
    });

    let toastID = this.toast("Exporting svg...", "info");

    let onError = (message?: string) => {
      console.error("SVG builder had an error with message: ", message);
    };

    let onFinish = (file: Blob) => {
      let success = () => {
        this.updateToast(toastID, {
          type: "success",
          text: "Successfully saved .svg file.",
        });
      };

      let fail = () => {
        this.updateToast(toastID, {
          type: "error",
          text: "Error saving .svg file. Please try again.",
        });
      };

      const outputName = name ?? this.project.name;
      window.saveFileFromWick?.(file, outputName, ".svg", success, fail);

      this.hideWaitOverlay();
    };

    // this.showWaitOverlay('Rendering video...');
    window.Wick.SVGFile.toSVGFile(
      this.project.activeTimeline,
      (message?: string) => {
        onError(message);
      },
      (file: Blob) => {
        this.hideWaitOverlay();
        onFinish(file);
      },
    );
  };

  /**
   * Export the current project as a bundled standalone ZIP that can be uploaded to itch/newgrounds/etc.
   */
  exportProjectAsStandaloneZip = (args: ExportMediaArgs = {}): void => {
    const toastID = this.toast("Exporting project as ZIP...", "info");
    const outputName = args.name ?? this.project.name;
    window.Wick.ZIPExport.bundleProject(this.project, (blob: Blob) => {
      let success = () => {
        this.updateToast(toastID, {
          type: "success",
          text: "Successfully saved .zip file.",
        });
      };

      let fail = () => {
        this.updateToast(toastID, {
          type: "error",
          text: "Error saving .zip file. Please try again.",
        });
      };

      window.saveFileFromWick?.(blob, outputName, ".zip", success, fail);
    });
  };

  /**
   * Export the current project as a bundled standalone HTML file.
   */
  exportProjectAsStandaloneHTML = (args: ExportMediaArgs = {}): void => {
    const toastID = this.toast("Exporting project as HTML...", "info");
    const outputName = args.name ?? this.project.name;
    window.Wick.HTMLExport.bundleProject(
      this.project,
      (html: BlobPart | ArrayBuffer) => {
        let file = new Blob([html], { type: "text/html" });

        let success = () => {
          this.updateToast(toastID, {
            type: "success",
            text: "Successfully saved .html file.",
          });
        };

        let fail = () => {
          this.updateToast(toastID, {
            type: "error",
            text: "Error saving .html file. Please try again.",
          });
        };

        window.saveFileFromWick?.(file, outputName, ".html", success, fail);
      },
    );
  };

  /**
   * Exports the audio of a Wick project's audio as a single track in an audio file.
   */
  exportProjectAsAudioTrack = (args: ExportMediaArgs = {}): void => {
    AudioExport.generateAudioFile({
      project: this.project,
    }).then((result) => {
      if (!result) {
        this.toast("Could not export audio track.", "error");
        return;
      }
      const outputName = args.name ?? "audiotrack";
      window.saveFileFromWick?.(
        new Blob([result.buffer as ArrayBuffer]),
        outputName,
        ".wav",
      );
    });
  };

  /**
   * Imports a wick file into the editor.
   * @param {File} file Zipped wick file to import.
   */
  importProjectAsWickFile = (file: File): void => {
    this.showWaitOverlay();
    window.Wick.WickFile.fromWickFile(file, (project: unknown) => {
      if (project) {
        this.setupNewProject(project as WickProjectEngine);
        this.toast(`Opened ${file.name || "project"} successfully.`, "success");
      } else {
        this.toast("Could not open project.", "error");
        this.hideWaitOverlay();
      }
    });
  };

  /**
   * Sets up a new project in the editor. This operation will remove the
   * history, selection, and all other ability to retrieve your project.
   * @param {Wick.Project} project - the project to load.
   */
  setupNewProject = (project?: WickProjectEngine): void => {
    // if (!project) return;
    this.resetEditorForLoad();

    // Ensure we have a proper Project object, not a string
    if (
      project &&
      typeof project === "object" &&
      project.classname === "Project"
    ) {
      this.project = project as typeof this.project;
    } else {
      this.project = new window.Wick.Project();
    }

    this.project.selection.clear();

    // Ensure activeTool is set (fix for loaded projects)
    if (!this.project.activeTool) {
      this.project.activeTool = "cursor";
    }

    // Attach error handling messages
    this.attachErrorHandlers();

    this.projectDidChange({ actionName: "Setup New Project" });
    this.hideWaitOverlay();

    this.project.prepareProjectForEditor();
  };

  openNewProjectConfirmation = (): void => {
    this.openWarningModal({
      description: "You will lose any unsaved changes.",
      title: "Create New Project?",
      acceptAction: () => {
        setTimeout(() => {
          this.setupNewProject();
        }, 100);
      },
      cancelAction: () => {},
      finalAction: () => {},
      acceptText: "Create",
      acceptIcon: "create",
      cancelText: "Cancel",
      cancelIcon: "cancel-white",
    });
  };

  showAutosavedProjects = (): void => {
    this.doesAutoSavedProjectExist((exists: boolean) => {
      if (exists) {
        this.queueModal("AutosaveWarning");
      }
    });
  };

  /**
   * Attempts to parse a url passed to the editor.
   *
   * if a url is passed to with the 'project' parameter, the editor will attempt to oad that project over https.
   * if a example file name is passed with the 'example' parameter, the editor will attempt to load the example locally.
   *
   * If the projects are not served over https, or do not exist, an error will be thrown.
   *
   * the example parameter takes precedence.
   */
  tryToParseProjectURL = (): boolean => {
    const urlParams = queryString.parse(window.location.search);

    const loadProjectFromURL = (url: string | URL) => {
      // Download and open the wick project.
      fetch(url)
        .then((resp) => resp.blob())
        .then((blob) => {
          window.Wick.WickFile.fromWickFile(
            blob,
            (loadedProject: unknown) => {
              this.setupNewProject(loadedProject as WickProjectEngine);
            },
            "blob",
          );
        })
        .catch((e) => {
          this.toast("Could not download project from URL.", "warning");
          console.error(
            "tryToParseProjectURL: Could not download Wick project.",
          );
          console.error(e);
        });
    };

    if (urlParams.example) {
      let url = window.location.origin + "/examples/" + urlParams.example;
      console.log("attempting to load project", url);
      loadProjectFromURL(url);
      return true;
    }

    const projectParam = urlParams.project;
    let projectLink = Array.isArray(projectParam)
      ? (projectParam[0] ?? "")
      : (projectParam ?? "");

    // No URL param, skip the download
    if (!projectLink) {
      return false;
    }

    if (!projectLink.startsWith("http")) {
      projectLink = "https://" + projectLink;
    }

    try {
      // Parse requested URL
      var url = new URL(projectLink);
    } catch {
      this.toast("Project URL is invalid!", "warning");
      return false;
    }

    // Check if the provided URL is allowed in the whitelist.
    var whitelist = [
      "wickeditor.com",
      "editor.wickeditor.com",
      "test.wickeditor.com",
      "aka.ms",
    ];

    if (whitelist.indexOf(url.hostname) === -1) {
      this.toast(
        "Could not open project from link! \n URL is not on whitelist.",
        "warning",
      );
      console.error("tryToParseProjectURL: URL is not in the whitelist.");
      return false;
    }

    loadProjectFromURL(url);

    return true;
  };

  /**
   * Attach toast messages to the engine error handler.
   */
  attachErrorHandlers = (): void => {
    // Release any messages we may have had while loading the project.
    if (this.project && this.project._internalErrorMessages) {
      let errors = this.project._internalErrorMessages.concat([]);
      for (let error of errors) {
        this.toast(error, "error", { autoClose: false }); // Show all errors that occurred while loading the project.
      }
    }

    this.project.onError((message: string) => {
      if (message === "OUT_OF_BOUNDS" || message === "LEAKY_HOLE") {
        this.toast("The shape you are trying to fill has a gap.", "warning");
      } else if (message === "FILL_EQUALS_HOLE") {
        this.toast("Error: Can't fill the same color.", "warning");
      } else if (message === "LOOPING") {
        this.toast("Fill bucket failed. Error: Looping. Try Again?", "warning");
      } else if (message === "NO_VALID_CROSSINGS") {
        this.toast("Fill bucket failed. Overlapping shape above?", "warning");
      } else if (message === "TOO_COMPLEX") {
        this.toast("Shape is too complex.", "warning");
      } else if (message === "NO_PATHS") {
        this.toast("There is no hole to fill.", "warning");
      } else if (message === "CLICK_NOT_ALLOWED_LAYER_LOCKED") {
        this.toast(
          "The layer you are trying to draw onto is locked.",
          "warning",
        );
      } else if (message === "CLICK_NOT_ALLOWED_LAYER_HIDDEN") {
        this.toast(
          "The layer you are trying to draw onto is hidden.",
          "warning",
        );
      } else if (message === "CLICK_NOT_ALLOWED_NO_FRAME") {
        this.toast("There is no frame to draw onto.", "warning");
      } else {
        this.toast(message, "warning");
      }
    });
  };

  /**
   * Requests an autosave after the user stops performing actions.
   * Debounces frequent changes to avoid excessive save operations.
   */
  requestAutosave = (): void => {
    if (this._autosaveDebounceTimeoutID !== undefined) {
      clearTimeout(this._autosaveDebounceTimeoutID);
      this._autosaveDebounceTimeoutID = undefined;
    }

    this._autosaveDebounceTimeoutID = window.setTimeout(() => {
      // Avoid any autosave state/render work while a brush stroke is active.
      // Rendering the canvas re-activates tools and can force brush strokes to finish early.
      if (this.isBrushStrokeInProgress()) {
        this._autosaveDebounceTimeoutID = undefined;
        this.requestAutosave();
        return;
      }

      this.setState({ isAutosaving: true });

      this.autoSaveProject(() => {
        this._lastAutosave = Date.now();
        this._autosaveDebounceTimeoutID = undefined;
        this.setState({ isAutosaving: false });
      });
    }, 2000);
  };

  private isBrushStrokeInProgress = (): boolean => {
    if (!this.project) {
      return false;
    }

    const brushTool = this.project.tools?.brush;
    if (typeof brushTool?.isInProgress !== "function") {
      return false;
    }

    return Boolean(brushTool.isInProgress());
  };

  /**
   * Save the current project using Dexie (with localforage fallback).
   */
  autoSaveProject = (callback: AutosaveCallback): void => {
    if (
      !this.project ||
      this.state.previewPlaying ||
      this.state.activeModalName !== null
    ) {
      this.setState({ isAutosaving: false });
      return;
    }

    if (this.isBrushStrokeInProgress()) {
      this.setState({ isAutosaving: false });
      this.requestAutosave();
      return;
    }

    const autosaveData = window.Wick.AutoSave.generateAutosaveData(
      this.project as WickProjectEngine,
    );

    ProjectStorage.saveAutosave(autosaveData)
      .then(() => ProjectStorage.saveCurrentProject(autosaveData))
      .then(() => ProjectStorage.cleanupOldAutosaves(10))
      .then(() => {
        window.Wick.AutoSave.saveAutosaveData(autosaveData, () => {
          ProjectStorage.recordLegacyAutosave({
            uuid: autosaveData.projectData.uuid,
            lastModified: autosaveData.lastModified,
          });
          callback();
        });
      })
      .catch((err) => {
        console.warn(
          "Failed to save with Dexie, falling back to localforage:",
          err,
        );
        window.Wick.AutoSave.saveAutosaveData(autosaveData, () => {
          ProjectStorage.recordLegacyAutosave({
            uuid: autosaveData.projectData.uuid,
            lastModified: autosaveData.lastModified,
          });
          this.saveCurrentProjectFromAutosaveData(autosaveData);
          callback();
        });
      });
  };

  /**
   * Save current project snapshot for quick recovery.
   */
  saveCurrentProjectFromAutosaveData = (autosaveData: AutosaveData): void => {
    ProjectStorage.saveCurrentProject(autosaveData).catch((err) => {
      console.warn("Failed to save current project with Dexie:", err);
      localforage
        .setItem("wickEditor_currentProject", {
          uuid: autosaveData.projectData.uuid,
          lastModified: Date.now(),
          autosaveData,
        })
        .catch((localErr) => {
          console.warn(
            "Failed to save current project with localforage:",
            localErr,
          );
        });
    });
  };

  /**
   * Save current project snapshot for quick recovery.
   */
  saveCurrentProject = (): void => {
    if (!this.project) {
      return;
    }

    try {
      const autosaveData = window.Wick.AutoSave.generateAutosaveData(
        this.project as WickProjectEngine,
      );
      this.saveCurrentProjectFromAutosaveData(autosaveData);
    } catch (error) {
      console.warn("Error saving current project:", error);
    }
  };

  /**
   * Synchronous save used before the page unloads.
   */
  autoSaveProjectSync = (): void => {
    if (!this.project) {
      return;
    }

    try {
      const autosaveData = window.Wick.AutoSave.generateAutosaveData(
        this.project as WickProjectEngine,
      );
      const dataToSave = {
        uuid: autosaveData.projectData.uuid,
        lastModified: Date.now(),
        autosaveData,
      };

      try {
        const serialized = JSON.stringify(dataToSave);
        if (serialized.length < 5_000_000) {
          localStorage.setItem("wickEditor_currentProject_backup", serialized);
        }
      } catch (storageError) {
        console.warn("Could not save to localStorage backup:", storageError);
      }

      localforage.setItem("wickEditor_currentProject", dataToSave).catch(() => {
        /* ignore */
      });
    } catch (error) {
      console.warn("Error in sync save:", error);
    }
  };

  /**
   * Returns the newest autosave entry from the legacy localforage-backed list.
   */
  getLegacyLatestAutosave = (): Promise<AutosaveEntry | null> => {
    return new Promise((resolve) => {
      try {
        window.Wick.AutoSave.getAutosavesList((autosaveList: AutosaveEntry[]) => {
          ProjectStorage.reconcileLegacyAutosaves(autosaveList);
          resolve(autosaveList[0] ?? null);
        });
      } catch {
        resolve(null);
      }
    });
  };

  /**
   * Resolves the latest autosave using Tinybase index metadata first.
   * Returns null when index data is stale or unavailable.
   */
  getMostRecentAutosaveSourceFromIndex = async (): Promise<
    | { source: "dexie"; autosave: AutosaveData }
    | { source: "legacy"; autosave: AutosaveEntry }
    | null
  > => {
    const perfStart = getPerfNowMs();
    const indexedAutosave = ProjectStorage.getLatestIndexedAutosave();
    if (!indexedAutosave) {
      logAutosavePerf("resolve_from_index", perfStart, {
        hit: false,
        reason: "no_index_entry",
      });
      return null;
    }

    if (indexedAutosave.source === "dexie") {
      const dexieAutosave = await ProjectStorage.getAutosaveByUUID(
        indexedAutosave.uuid,
      ).catch(() => null);

      if (!dexieAutosave) {
        logAutosavePerf("resolve_from_index", perfStart, {
          hit: false,
          reason: "stale_dexie_index",
          uuid: indexedAutosave.uuid,
        });
        return null;
      }

      logAutosavePerf("resolve_from_index", perfStart, {
        hit: true,
        source: "dexie",
        uuid: indexedAutosave.uuid,
      });
      return {
        source: "dexie",
        autosave: toAutosaveData(dexieAutosave),
      };
    }

    const legacyAutosave = await this.getLegacyLatestAutosave();
    if (!legacyAutosave || legacyAutosave.uuid !== indexedAutosave.uuid) {
      logAutosavePerf("resolve_from_index", perfStart, {
        hit: false,
        reason: "stale_legacy_index",
        uuid: indexedAutosave.uuid,
      });
      return null;
    }

    logAutosavePerf("resolve_from_index", perfStart, {
      hit: true,
      source: "legacy",
      uuid: indexedAutosave.uuid,
    });
    return {
      source: "legacy",
      autosave: legacyAutosave,
    };
  };

  /**
   * Resolves the most recent autosave source across Dexie and legacy stores.
   * Uses Tinybase index metadata first, then falls back to cross-store scan.
   */
  getMostRecentAutosaveSource = async (): Promise<
    | { source: "dexie"; autosave: AutosaveData }
    | { source: "legacy"; autosave: AutosaveEntry }
    | { source: null; autosave: null }
  > => {
    const perfStart = getPerfNowMs();
    const indexedResult = await this.getMostRecentAutosaveSourceFromIndex();
    if (indexedResult) {
      logAutosavePerf("resolve_latest_source", perfStart, {
        path: "index",
        source: indexedResult.source,
      });
      return indexedResult;
    }

    const [dexieAutosave, legacyAutosave] = await Promise.all([
      ProjectStorage.getLatestAutosave().catch(() => null),
      this.getLegacyLatestAutosave(),
    ]);

    const selectedSource = chooseMostRecentAutosave(
      dexieAutosave ? toAutosaveData(dexieAutosave) : null,
      legacyAutosave,
    );

    if (selectedSource === "dexie" && dexieAutosave) {
      logAutosavePerf("resolve_latest_source", perfStart, {
        path: "fallback_scan",
        source: "dexie",
      });
      return {
        source: "dexie",
        autosave: toAutosaveData(dexieAutosave),
      };
    }

    if (selectedSource === "legacy" && legacyAutosave) {
      logAutosavePerf("resolve_latest_source", perfStart, {
        path: "fallback_scan",
        source: "legacy",
      });
      return {
        source: "legacy",
        autosave: legacyAutosave,
      };
    }

    logAutosavePerf("resolve_latest_source", perfStart, {
      path: "fallback_scan",
      source: null,
    });
    return {
      source: null,
      autosave: null,
    };
  };

  /**
   * Load the most recent current-project snapshot.
   */
  loadCurrentProject = (callback: LoadCurrentProjectCallback): void => {
    ProjectStorage.getCurrentProject()
      .then((currentProjectEntry) => {
        if (!currentProjectEntry || !currentProjectEntry.autosaveData) {
          this.loadCurrentProjectFallback(callback);
          return;
        }

        const hoursSinceLastSave =
          (Date.now() - currentProjectEntry.lastModified) / (1000 * 60 * 60);
        if (hoursSinceLastSave > 24) {
          this.loadCurrentProjectFallback(callback);
          return;
        }

        this.showWaitOverlay();
        window.Wick.AutoSave.generateProjectFromAutosaveData(
          currentProjectEntry.autosaveData,
          (project: WickProjectEngine) => {
            this.setupNewProject(project);
            this.hideWaitOverlay();
            callback(true);
          },
        );
      })
      .catch((err) => {
        console.warn(
          "Failed to load current project from Dexie, trying fallback:",
          err,
        );
        this.loadCurrentProjectFallback(callback);
      });
  };

  /**
   * Fallback loader that checks localforage/localStorage backups.
   */
  loadCurrentProjectFallback = (callback: LoadCurrentProjectCallback): void => {
    let backupData: StoredCurrentProjectRecord | null = null;
    try {
      const backupStr = localStorage.getItem(
        "wickEditor_currentProject_backup",
      );
      if (backupStr) {
        backupData = parseCurrentProjectRecordMaybe(JSON.parse(backupStr));
      }
    } catch (e) {
      void e;
      // ignore backup parse errors
    }

    localforage
      .getItem("wickEditor_currentProject")
      .then((currentProjectData: unknown) => {
        const parsedCurrentData =
          parseCurrentProjectRecordMaybe(currentProjectData);
        const projectData = chooseMostRecentCurrentProject(
          backupData,
          parsedCurrentData,
        );

        if (!projectData || !projectData.autosaveData) {
          callback(false);
          return;
        }

        const hoursSinceLastSave =
          (Date.now() - projectData.lastModified) / (1000 * 60 * 60);
        if (hoursSinceLastSave > 24) {
          callback(false);
          return;
        }

        this.showWaitOverlay();
        const autosaveData = toAutosaveData(projectData.autosaveData);
        window.Wick.AutoSave.generateProjectFromAutosaveData(
          autosaveData,
          (project: WickProjectEngine) => {
            this.setupNewProject(project);
            this.hideWaitOverlay();
            callback(true);
          },
        );
      })
      .catch((err) => {
        if (backupData && backupData.autosaveData) {
          this.showWaitOverlay();
          const autosaveData = toAutosaveData(backupData.autosaveData);
          window.Wick.AutoSave.generateProjectFromAutosaveData(
            autosaveData,
            (project: WickProjectEngine) => {
              this.setupNewProject(project);
              this.hideWaitOverlay();
              callback(true);
            },
          );
        } else {
          console.warn("Failed to load current project from fallback:", err);
          callback(false);
        }
      });
  };

  /**
   * Automatically load the most recent autosave on startup.
   */
  loadAutosavedProjectOnStartup = (): void => {
    this.loadCurrentProject((didLoadCurrentProject: boolean) => {
      if (didLoadCurrentProject) {
        return;
      }

      this.loadAutosavedProject(() => {});
    });
  };

  /**
   * Attempts to load an autosaved project, preferring Dexie storage.
   */
  loadAutosavedProject = (callback: AutosaveCallback): void => {
    const perfStart = getPerfNowMs();
    this.getMostRecentAutosaveSource()
      .then((result) => {
        if (result.source === null) {
          logAutosavePerf("load_autosaved_project", perfStart, {
            source: null,
            loaded: false,
          });
          callback();
          return;
        }

        this.showWaitOverlay();

        if (result.source === "legacy") {
          window.Wick.AutoSave.load(
            result.autosave.uuid,
            (project: WickProjectEngine) => {
              this.setupNewProject(project);
              this.hideWaitOverlay();
              logAutosavePerf("load_autosaved_project", perfStart, {
                source: "legacy",
                loaded: true,
                uuid: result.autosave.uuid,
              });
              callback();
            },
          );
          return;
        }

        window.Wick.AutoSave.generateProjectFromAutosaveData(
          result.autosave,
          (project: WickProjectEngine) => {
            this.setupNewProject(project);
            this.hideWaitOverlay();
            logAutosavePerf("load_autosaved_project", perfStart, {
              source: "dexie",
              loaded: true,
              uuid: result.autosave.projectData.uuid,
            });
            callback();
          },
        );
      })
      .catch((error) => {
        logAutosavePerf("load_autosaved_project", perfStart, {
          source: "unknown",
          loaded: false,
          error: error instanceof Error ? error.message : "unknown",
        });
        callback();
      });
  };
  /**
   * Check if auto saved project exists.
   * @param  {Function} callback a callback which receives a boolean.
   * True if an autosave exists.
   */
  doesAutoSavedProjectExist = (callback: (exists: boolean) => void): void => {
    const fallbackCheck = () => {
      ProjectStorage.getLatestAutosave()
        .then((latestAutosave) => {
          if (latestAutosave) {
            callback(true);
            return;
          }

          window.Wick.AutoSave.getAutosavesList(
            (autosaveList: AutosaveEntry[]) => {
              ProjectStorage.reconcileLegacyAutosaves(autosaveList);
              callback(autosaveList.length > 0);
            },
          );
        })
        .catch(() => {
          window.Wick.AutoSave.getAutosavesList(
            (autosaveList: AutosaveEntry[]) => {
              ProjectStorage.reconcileLegacyAutosaves(autosaveList);
              callback(autosaveList.length > 0);
            },
          );
        });
    };

    const latestIndexedAutosave = ProjectStorage.getLatestIndexedAutosave();
    if (!latestIndexedAutosave) {
      fallbackCheck();
      return;
    }

    if (latestIndexedAutosave.source === "dexie") {
      ProjectStorage.getAutosaveByUUID(latestIndexedAutosave.uuid)
        .then((autosave) => {
          if (autosave) {
            callback(true);
            return;
          }

          fallbackCheck();
        })
        .catch(() => {
          fallbackCheck();
        });
      return;
    }

    this.getLegacyLatestAutosave()
      .then((autosave) => {
        if (autosave && autosave.uuid === latestIndexedAutosave.uuid) {
          callback(true);
          return;
        }

        fallbackCheck();
      })
      .catch(() => {
        fallbackCheck();
      });
  };

  /**
   * Clears autosaved project data from both Dexie and legacy autosave stores.
   */
  clearAutoSavedProject = (callback: AutosaveCallback): void => {
    const perfStart = getPerfNowMs();
    let usedIndexedDexie = false;
    let usedIndexedLegacy = false;
    let deletedUUIDCount = 0;

    const clearCurrentProjectSnapshots = async () => {
      await ProjectStorage.clearCurrentProject().catch(() => {
        /* ignore */
      });
      await localforage.removeItem("wickEditor_currentProject").catch(() => {
        /* ignore */
      });

      try {
        localStorage.removeItem("wickEditor_currentProject_backup");
      } catch {
        // ignore localStorage cleanup errors.
      }
    };

    const deleteLegacyAutosaveByUUID = (uuid: string) =>
      new Promise<void>((resolve) => {
        try {
          window.Wick.AutoSave.delete(uuid, () => {
            ProjectStorage.removeLegacyAutosave(uuid);
            resolve();
          });
        } catch {
          ProjectStorage.removeLegacyAutosave(uuid);
          resolve();
        }
      });

    const resolveLatestDexieUUID = async (): Promise<string | null> => {
      const indexedDexieAutosave =
        ProjectStorage.getLatestIndexedAutosaveForSource("dexie");
      if (indexedDexieAutosave?.uuid) {
        usedIndexedDexie = true;
        return indexedDexieAutosave.uuid;
      }

      const latestDexieAutosave = await ProjectStorage.getLatestAutosave().catch(
        () => null,
      );
      return latestDexieAutosave?.uuid ?? null;
    };

    const resolveLatestLegacyUUID = async (): Promise<string | null> => {
      const indexedLegacyAutosave =
        ProjectStorage.getLatestIndexedAutosaveForSource("legacy");
      if (indexedLegacyAutosave?.uuid) {
        usedIndexedLegacy = true;
        return indexedLegacyAutosave.uuid;
      }

      const latestLegacyAutosave = await this.getLegacyLatestAutosave().catch(
        () => null,
      );
      return latestLegacyAutosave?.uuid ?? null;
    };

    Promise.all([resolveLatestDexieUUID(), resolveLatestLegacyUUID()])
      .then(([latestDexieUUID, latestLegacyUUID]) => {
        const uuidsToDelete = new Set<string>();
        if (latestDexieUUID) {
          uuidsToDelete.add(latestDexieUUID);
        }
        if (latestLegacyUUID) {
          uuidsToDelete.add(latestLegacyUUID);
        }

        if (uuidsToDelete.size === 0 && this.project?.uuid) {
          uuidsToDelete.add(this.project.uuid);
        }
        deletedUUIDCount = uuidsToDelete.size;

        return Promise.all(
          Array.from(uuidsToDelete).map((uuid) =>
            Promise.all([
              ProjectStorage.deleteAutosave(uuid).catch(() => {
                /* ignore */
              }),
              deleteLegacyAutosaveByUUID(uuid),
            ]),
          ),
        );
      })
      .finally(() => {
        clearCurrentProjectSnapshots().finally(() => {
          logAutosavePerf("clear_autosaved_project", perfStart, {
            deletedUUIDCount,
            usedIndexedDexie,
            usedIndexedLegacy,
          });
          callback();
        });
      });
  };

  /**
   * Toggle onion skinning on/off.
   */
  toggleOnionSkin = (): void => {
    this.project.onionSkinEnabled = !this.project.onionSkinEnabled;
    this.projectDidChange({ actionName: "Toggle Onion Skinning" });
  };

  /**
   * Return all possible sound assets.
   */
  getAllSoundAssets = (): WickAssetEngine[] => {
    return this.project.getAssets("Sound") as WickAssetEngine[];
  };

  /**
   * Toggles the preview play between on and off states.
   */
  togglePreviewPlaying = (): void => {
    if (this.processingAction) return;

    let onionSkinningWasOn = false;
    if (!this.state.previewPlaying && this.project.onionSkinEnabled) {
      this.toggleOnionSkin();
      onionSkinningWasOn = true;
    }

    this.showWaitOverlay();
    this.processingAction = true;

    // Apply the change of the current selection before clearing it.
    if (this.project.selection.numObjects > 0) {
      this.project.view.applyChanges?.();
      this.project.selection.clear();
    }

    // Turn onion skinning back on if it was turned off.
    if (
      this.state.previewPlaying &&
      this.state.onionSkinningWasOn &&
      !this.project.onionSkinEnabled
    ) {
      this.toggleOnionSkin();
    }

    this.setState({
      previewPlaying: !this.state.previewPlaying,
      showCodeErrors: false,
      onionSkinningWasOn: onionSkinningWasOn,
    });

    this.hideWaitOverlay();
    this.processingAction = false;
  };

  /**
   * Start playing the project from the beginning of the timeline.
   */
  startPreviewPlayFromBeginning = (): void => {
    if (this.state.previewPlaying) return;

    const focus = this.project.focus;
    if (focus && typeof focus === "object" && "timeline" in focus) {
      (
        focus as { timeline: { playheadPosition: number } }
      ).timeline.playheadPosition = 1;
    }
    this.togglePreviewPlaying();
  };

  /**
   * Stops the project if it is currently preview playing and displays any errors in the code window.
   * @param {object} error - any errors called while playing
   */
  stopPreviewPlaying = (error?: WickScriptError): void => {
    this.setState({
      previewPlaying: false,
      codeEditorOpen:
        this.project.error === undefined ? this.state.codeEditorOpen : true,
      showCodeErrors: this.project.error === undefined ? false : true,
    });

    if (error) {
      const objectUuid = error.uuid;
      if (objectUuid) {
        let obj = window.Wick.ObjectCache.getObjectByUUID(objectUuid);

        if (obj) {
          this.selectObject(obj as SelectableObject);
        }
      }

      if (error.name) {
        this.editScript(error.name);
      }
    }

    this.projectDidChange({ actionName: "Stop Preview Playing" });
  };

  /**
   * Clears the current error message in the project.
   */
  clearCodeEditorError = (): void => {
    this.project.error = null;
    this.setState({
      codeError: null,
    });
    this.projectDidChange({ actionName: "Clear Code Editor Error" });
  };

  /**
   * Copies the selection state and selected objects to the clipboard.
   */
  copySelectionToClipboard = (): void => {
    if (this.project.copySelectionToClipboard()) {
      this.projectDidChange({ actionName: "Copy Selection" });
    } else {
      this.toast("There is nothing to copy.", "warning");
    }
  };

  /**
   * Duplicates the current objects in the selection.
   */
  duplicateSelection = (): void => {
    if (this.project.duplicateSelection()) {
      this.projectDidChange({ actionName: "Duplicate Selection" });
    } else {
      this.toast("There is nothing to duplicate.", "warning");
    }
  };

  /**
   * Copies the selected objects to the clipboard and then deletes them from the project.
   */
  cutSelectionToClipboard = (): void => {
    if (this.project.cutSelectionToClipboard()) {
      this.projectDidChange({ actionName: "Cut Selection" });
    } else {
      this.toast("There is nothing to duplicate.", "warning");
    }
  };

  /**
   * Attempts to paste in objects on the clipboard if they are available.
   * @return {[type]} [description]
   */
  pasteFromClipboard = (): void => {
    if (this.project.pasteClipboardContents()) {
      this.projectDidChange({ actionName: "Paste from Clipboard" });
    } else {
      this.toast("There is nothing in the clipboard to paste.", "warning");
    }
  };

  /**
   * Creates a new keyframe at the current playhead position.
   */
  addTweenKeyframe = (): void => {
    if (!this.project.activeFrame) return;
    this.project.activeFrame.createTween();
    this.projectDidChange({ actionName: "Add Tween Keyframe" });
  };

  /**
   * Adds tweens to selected frames, or to the active frame when valid.
   */
  addTweenToSelection = (): void => {
    this.createTween();
  };

  /**
   * Returns all existing fonts in the project.
   */
  getExistingFonts = (): string[] => {
    return this.project.getFonts();
  };

  /**
   * returns true if the project has the passed in font.
   * @param {string} font Font to check
   * @return {boolean} true if the project has this font.
   */
  hasFont = (font: string): boolean => {
    return this.project.hasFont(font);
  };

  extendFrame = (): void => {
    const frames = this.selectionObjectsOfType<WickFrameEngine>("Frame");
    this.project.extendFrames(frames);
    this.project.guiElement.draw();
    this.triggerTimelineSoftRender();
  };

  shrinkFrame = (): void => {
    const frames = this.selectionObjectsOfType<WickFrameEngine>("Frame");
    this.project.shrinkFrames(frames);
    this.project.guiElement.draw();
    this.triggerTimelineSoftRender();
  };

  moveFrameRight = (): void => {
    this.project.moveSelectedFramesRight();
    this.project.guiElement.draw();
    this.triggerTimelineSoftRender();
  };

  moveFrameLeft = (): void => {
    this.project.moveSelectedFramesLeft();
    this.project.guiElement.draw();
    this.triggerTimelineSoftRender();
  };

  createTween = (): void => {
    if (!this.project.canCreateTween) {
      this.toast("Select a contentful frame to add a tween.", "warning");
      return;
    }

    this.project.createTween();
    this.projectDidChange({ actionName: "Create Tween" });
  };

  cutFrame = (): void => {
    this.project.cutSelectedFrames();
    this.projectDidChange({ actionName: "Cut Frame" });
  };

  insertBlankFrame = (): void => {
    this.project.insertBlankFrame();
    this.projectDidChange({ actionName: "Insert Blank Frame" });
  };

  extendSelectedFramesAndPushOtherFrames = (): void => {
    const frames = this.selectionObjectsOfType<WickFrameEngine>("Frame");
    this.project.extendFramesAndPushOtherFrames(frames);
    this.project.guiElement.draw();
    this.triggerTimelineSoftRender();
  };

  shrinkSelectedFramesAndPullOtherFrames = (): void => {
    const frames = this.selectionObjectsOfType<WickFrameEngine>("Frame");
    this.project.shrinkFramesAndPullOtherFrames(frames);
    this.project.guiElement.draw();
    this.triggerTimelineSoftRender();
  };

  extendActiveFramesAndPushOtherFrames = (): void => {
    const frames = this.project.activeTimeline.activeFrames;
    this.project.extendFramesAndPushOtherFrames(frames);
    this.project.guiElement.draw();
    this.triggerTimelineSoftRender();
  };

  shrinkActiveFramesAndPullOtherFrames = (): void => {
    const frames = this.project.activeTimeline.activeFrames;
    this.project.shrinkFramesAndPullOtherFrames(frames);
    this.project.guiElement.draw();
    this.triggerTimelineSoftRender();
  };

  exportSelectedClip = (): void => {
    var clip = this.project.selection.getSelectedObject();
    if (!clip) return;
    if (!(clip instanceof window.Wick.Clip)) return;

    window.Wick.WickObjectFile.toWickObjectFile(clip, "blob", (file: Blob) => {
      window.saveFileFromWick?.(file, clip.identifier || "object", ".wickobj");
    });
  };

  onEyedropperPickedColor = (event: EyedropperEvent): void => {
    this._onEyedropperPickedColor(event.color);
    this.activateLastTool();
  };

  handleWickFileLoad = (event: WickFileInputEvent): void => {
    const files = event.target?.files;
    let file: File | undefined;

    if (Array.isArray(files)) {
      file = files[0];
    } else if (files && typeof files.item === "function") {
      file = files.item(0) ?? undefined;
    }

    if (!file) {
      console.warn("handleWickFileLoad: no files recieved");
      return;
    }

    this.importProjectAsWickFile(file);
  };

  /**
   * Loads Local Wick File from
   * @param {*} fileEntry
   */
  loadLocalWickFile = (fileEntry: LocalFileEntry): void => {
    const fileApi = window as Window & BrowserFileAPI;
    if (fileApi.loadWickFileEntry) {
      fileApi.loadWickFileEntry(fileEntry, (blob: File) => {
        // Wraps the file in a fake event. TODO: Simplify this.
        this.handleWickFileLoad({
          target: {
            files: [blob],
          },
        });
      });
    } else {
      console.error("No File Entry Opener Provided");
    }
  };

  /**
   * Deletes local Wick File From Storage.
   * @param {FileEntry} fileEntry
   */
  deleteLocalWickFile = (fileEntry: LocalFileEntry): void => {
    const fileApi = window as Window & BrowserFileAPI;
    fileApi.deleteLocalWickFile?.(fileEntry);
  };

  /**
   * Reloads any saved files currently on disk.
   */
  reloadSavedWickFiles = (): void => {
    const fileApi = window as Window & BrowserFileAPI;
    if (fileApi.getSavedWickFiles) {
      fileApi.getSavedWickFiles((files: unknown[]) => {
        this.setState({
          localSavedFiles: files,
        });
      });
    }
  };
}

export default EditorCore;
