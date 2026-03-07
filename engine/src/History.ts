/*
 * Copyright 2020 WICKLETS LLC
 *
 * This file is part of Wick Engine.
 *
 * Wick Engine is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Wick Engine is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Wick Engine.  If not, see <https://www.gnu.org/licenses/>.
 */

interface HistoryState {
    state: any[];
    objects: Set<string>;
    actionName: string;
    timeSinceLastPush: number;
    projectViewState?: HistoryProjectViewState;
}

interface HistoryProjectViewState {
    activeTool: string | null;
    showClipBorders: boolean;
    onionSkinEnabled: boolean;
    onionSkinSeekBackwards: number;
    onionSkinSeekForwards: number;
}

type HistoryStackEntry = HistoryState | any[];

/**
 * History utility class for undo/redo functionality.
 */
Wick.History = class {
    private _undoStack: HistoryStackEntry[] = [];
    private _redoStack: HistoryStackEntry[] = [];
    private _snapshots: { [name: string]: any[] } = {};
    private lastHistoryPush: number;
    public project: Wick.Project;

    /**
     *
     * @type {boolean}
     */
    static get VERBOSE (): boolean {
        return false;
    }

    /**
     * An Enum of all types of state saves.
     */
    static get StateType () {
        return {
            ALL_OBJECTS: 1,
            ALL_OBJECTS_WITHOUT_PATHS: 2,
            ONLY_VISIBLE_OBJECTS: 3,
        };
    }

    /**
     * Creates a new history object
     */
    constructor () {
        this.reset();
        this.lastHistoryPush = Date.now(); 
    }

    /**
     * Resets history in the editor. This is non-reversible.
     */
    reset (): void {
        this._undoStack = [];
        this._redoStack = [];
        this._snapshots = {};
    }

    /**
     * Returns all objects that are currently referenced by the history.
     * @returns {Set} uuids of all objects currently referenced in the history.
     */
    getObjectUUIDs (): Set<string> {
        let objects = new Set<string>();

        for (let i = 0; i < this._undoStack.length; i++) {
            const state = this._normalizeHistoryEntry(this._undoStack[i]);
            if (!state) continue;

            this._undoStack[i] = state;
            objects = new Set([...objects, ...state.objects]);
        }

        for (let i = 0; i < this._redoStack.length; i++) {
            const state = this._normalizeHistoryEntry(this._redoStack[i]);
            if (!state) continue;

            this._redoStack[i] = state;
            objects = new Set([...objects, ...state.objects]);
        }

        return objects;
    }

    /**
     * Push the current state of the ObjectCache to the undo stack.
     * @param {number} filter - the filter to choose which objects to serialize. See Wick.History.StateType
     * @param {string} actionName - Optional: Name of the action conducted to generate this state. If no name is presented, "Unknown Action" is presented in its place.
     */
    pushState (filter: number, actionName?: string): void {
        this._redoStack = [];
        let now = Date.now();
        let state = this._generateState(filter);
        let objects = this._extractObjectUUIDs(state);
        let stateObject: HistoryState = {
            state,
            objects: objects,
            actionName: actionName || "Unknown Action",
            timeSinceLastPush: now - this.lastHistoryPush,
            projectViewState: this._captureProjectViewState(),
        }

        this.lastHistoryPush = now;

        this._undoStack.push(stateObject);
        this._undoStack = this._undoStack.slice(-64); // get the last 64 items in the undo stack
    }

    /**
     * Pop the last state in the undo stack off and apply the new last state to the project.
     * @returns {boolean} True if the undo stack is non-empty, false otherwise
     */
    popState (): boolean {
        if(this._undoStack.length <= 1) {
            return false;
        }

        var lastState = this._normalizeHistoryEntry(this._undoStack.pop());
        if (!lastState) {
            return false;
        }

        this._redoStack.push(lastState);

        var currentStateObject = this._normalizeHistoryEntry(
            this._undoStack[this._undoStack.length - 1]
        );
        if (!currentStateObject) {
            this._redoStack.pop();
            this._undoStack.push(lastState);
            return false;
        }

        this._undoStack[this._undoStack.length - 1] = currentStateObject;
        this._recoverState(currentStateObject);

        return true;
    }

    /**
     * Recover a state that was undone.
     * @returns {boolean} True if the redo stack is non-empty, false otherwise
     */
    recoverState (): boolean {
        if(this._redoStack.length === 0) {
            return false;
        }

        var recoveredState = this._normalizeHistoryEntry(this._redoStack.pop());
        if (!recoveredState) {
            return false;
        }

        this._undoStack.push(recoveredState);

        this._recoverState(recoveredState);

        return true;
    }

    /**
     *
     * @param {string} name - the name of the snapshot
     * @param {number} filter - the filter to choose which objects to serialize. See Wick.History.StateType
     */
    saveSnapshot (name: string, filter?: number): void {
        this._snapshots[name] = this._generateState(filter || Wick.History.StateType.ALL_OBJECTS_WITHOUT_PATHS);
    }

    /**
     * Save a state to the list of snapshots to be recovered at any time.
     * @param {string} name - the name of the snapshot to recover
     */
    loadSnapshot (name: string): void {
        this._recoverState(this._snapshots[name]);
    }

    /**
     * The number of states currently stored for undoing.
     * @type {number}
     */
    get numUndoStates (): number {
        return this._undoStack.length;
    }

    /**
     * The number of states currently stored for redoing.
     * @type {number}
     */
    get numRedoStates (): number {
        return this._redoStack.length;
    }

    // NOTE: State saving/recovery can be greatly optimized by only saving the state of the things that were actually changed.
    _generateState (stateType?: number): any[] {
        var objects: Wick.Base[] = [];

        if(stateType === undefined) {
            stateType = Wick.History.StateType.ALL_OBJECTS;
        }

        if(stateType === Wick.History.StateType.ALL_OBJECTS) {
            objects = this._getAllObjects();
        } else if (stateType === Wick.History.StateType.ALL_OBJECTS_WITHOUT_PATHS) {
            objects = this._getAllObjectsWithoutPaths();
        } else if(stateType === Wick.History.StateType.ONLY_VISIBLE_OBJECTS) {
            objects = this._getVisibleObjects();
        } else {
            console.error('Wick.History._generateState: A valid stateType is required.');
            return [];
        }

        if(Wick.History.VERBOSE) {
            console.log('Wick.History._generateState: Serializing ' + objects.length + ' objects using mode=' + stateType);
        }

        return objects.map(object => {
            // The object most likely was altered in some way, make sure those changes will be reflected in the autosave.
            object.needsAutosave = true;

            return object.serialize();
        });
    }

    _extractObjectUUIDs (state: any[]): Set<string> {
        return new Set(
            (Array.isArray(state) ? state : [])
                .map(obj => obj && obj.uuid)
                .filter(uuid => typeof uuid === 'string')
        );
    }

    _getActiveToolName (): string | null {
        const activeTool = this.project && this.project.activeTool;
        if (typeof activeTool === 'string') {
            return activeTool;
        }

        if (activeTool && typeof activeTool.name === 'string') {
            return activeTool.name;
        }

        return null;
    }

    _captureProjectViewState (): HistoryProjectViewState {
        return {
            activeTool: this._getActiveToolName(),
            showClipBorders: !!this.project.showClipBorders,
            onionSkinEnabled: !!this.project.onionSkinEnabled,
            onionSkinSeekBackwards: this.project.onionSkinSeekBackwards,
            onionSkinSeekForwards: this.project.onionSkinSeekForwards,
        };
    }

    _normalizeHistoryEntry (entry: HistoryStackEntry | undefined): HistoryState | null {
        if (!entry) {
            return null;
        }

        if (Array.isArray(entry)) {
            return {
                state: entry,
                objects: this._extractObjectUUIDs(entry),
                actionName: "Unknown Action",
                timeSinceLastPush: 0,
            };
        }

        const state = Array.isArray(entry.state) ? entry.state : [];
        return {
            state,
            objects: entry.objects instanceof Set ? entry.objects : this._extractObjectUUIDs(state),
            actionName: typeof entry.actionName === 'string' ? entry.actionName : "Unknown Action",
            timeSinceLastPush:
                typeof entry.timeSinceLastPush === 'number' ? entry.timeSinceLastPush : 0,
            projectViewState: entry.projectViewState,
        };
    }

    _applyProjectViewState (projectViewState?: HistoryProjectViewState): void {
        if (!projectViewState) {
            return;
        }

        const project = this.project as Wick.Project & {
            _activeTool?: Wick.Tool;
            tools?: { [key: string]: Wick.Tool };
        };

        project.showClipBorders = projectViewState.showClipBorders;
        project.onionSkinSeekBackwards = projectViewState.onionSkinSeekBackwards;
        project.onionSkinSeekForwards = projectViewState.onionSkinSeekForwards;
        project.onionSkinEnabled = projectViewState.onionSkinEnabled;

        if (
            projectViewState.activeTool &&
            project.tools &&
            project.tools[projectViewState.activeTool]
        ) {
            project._activeTool = project.tools[projectViewState.activeTool];
        }
    }

    _recoverState (entry: HistoryStackEntry | undefined): void {
        const normalizedEntry = this._normalizeHistoryEntry(entry);
        if (!normalizedEntry || !Array.isArray(normalizedEntry.state)) {
            console.warn('Wick.History._recoverState: invalid history state.');
            return;
        }

        normalizedEntry.state.forEach(objectData => {
            if (!objectData || typeof objectData.uuid !== 'string') {
                return;
            }

            var object = Wick.ObjectCache.getObjectByUUID(objectData.uuid);
            if (!object || typeof object.deserialize !== 'function') {
                return;
            }

            object.deserialize(objectData);
        });

        this._applyProjectViewState(normalizedEntry.projectViewState);
    }

    _getAllObjects (): Wick.Base[] {
        var objects = Wick.ObjectCache.getActiveObjects(this.project);
        objects.push(this.project);
        return objects;
    }

    // this is used for an optimization when snapshots are saved for preview playing.
    _getAllObjectsWithoutPaths (): Wick.Base[] {
        return this._getAllObjects().filter(object => {
            return !(object instanceof Wick.Path);
        });
    }

    _getVisibleObjects (): Wick.Base[] {
        var stateObjects: Wick.Base[] = [];

        // the project itself (for focus, options, etc)
        stateObjects.push(this.project);

        // the assets in the project
        this.project.getAssets().forEach(asset => {
            stateObjects.push(asset);
        });

        // the focused clip
        stateObjects.push(this.project.focus);

        // the focused timeline
        stateObjects.push(this.project.focus.timeline);

        // the selection
        stateObjects.push(this.project.selection);

        // layers on focused timeline
        this.project.activeTimeline.layers.forEach(layer => {
            stateObjects.push(layer);
        });

        // frames on focused timeline
        this.project.activeTimeline.frames.forEach(frame => {
            stateObjects.push(frame);
        });

        // objects+tweens on active frames
        this.project.activeFrames.forEach(frame => {
            frame.paths.forEach(path => {
                stateObjects.push(path);
            });
            frame.clips.forEach(clip => {
                stateObjects.push(clip);
            });
            frame.tweens.forEach(tween => {
                stateObjects.push(tween);
            })
        });

        return stateObjects;
    }
}
