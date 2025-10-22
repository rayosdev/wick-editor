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

interface ProjectArgs {
    name?: string;
    width?: number;
    height?: number;
    framerate?: number;
    backgroundColor?: Wick.Color;
}

interface MousePosition {
    x: number;
    y: number;
}

interface PanPosition {
    x: number;
    y: number;
}

interface ToolsCollection {
    brush: Wick.Tools.Brush;
    cursor: Wick.Tools.Cursor;
    ellipse: Wick.Tools.Ellipse;
    eraser: Wick.Tools.Eraser;
    eyedropper: Wick.Tools.Eyedropper;
    fillbucket: Wick.Tools.FillBucket;
    interact: Wick.Tools.Interact;
    line: Wick.Tools.Line;
    none: Wick.Tools.None;
    pan: Wick.Tools.Pan;
    pathcursor: Wick.Tools.PathCursor;
    pencil: Wick.Tools.Pencil;
    rectangle: Wick.Tools.Rectangle;
    text: Wick.Tools.Text;
    zoom: Wick.Tools.Zoom;
}

/**
 * Class representing a Wick Project.
 */
Wick.Project = class extends Wick.Base {
    private _name: string;
    private _width: number;
    private _height: number;
    private _framerate: number;
    private _backgroundColor: Wick.Color;
    private _hitTestOptions: any;
    private _zoom: number;
    private _onionSkinEnabled: boolean;
    private _mousePosition: MousePosition;
    private _lastMousePosition: MousePosition;
    private _isMouseDown: boolean;
    private _internalErrorMessages: string[];
    private _mouseTargets: any[];
    private _keysDown: string[];
    private _keysLastDown: string[];
    private _currentKey: string | null;
    private _tickIntervalID: any;
    private _hideCursor: boolean;
    private _muted: boolean;
    private _publishedMode: boolean;
    private _showClipBorders: boolean;
    private _userErrorCallback: ((error: any) => void) | null;
    private _tools: ToolsCollection;
    private _toolSettings: Wick.ToolSettings;
    private _playing: boolean;
    private _scriptSchedule: any[];
    private _error: any;
    private _focus: any;
    private _renderBlackBars: boolean;

    public pan: PanPosition;
    public rotation: number;
    public onionSkinSeekBackwards: number;
    public onionSkinSeekForwards: number;
    public selection: Wick.Selection;
    public history: Wick.History;
    public clipboard: Wick.Clipboard;
    public root: Wick.Clip;
    public focus: Wick.Clip;
    public soundsPlayed: any[];
    public activeTool: string;

    /**
     * Create a project.
     * @param {string} name - Project name. Default "My Project".
     * @param {number} width - Project width in pixels. Default 720.
     * @param {number} height - Project height in pixels. Default 480.
     * @param {number} framerate - Project framerate in frames-per-second. Default 12.
     * @param {Color} backgroundColor - Project background color in hex. Default #ffffff.
     */
    constructor(args?: ProjectArgs) {
        if (!args) args = {};
        super(args);

        this._name = args.name || 'My Project';
        this._width = args.width || 720;
        this._height = args.height || 480;
        this._framerate = args.framerate || 12;
        this._backgroundColor = args.backgroundColor || new Wick.Color('#ffffff');
        this._hitTestOptions = this.getDefaultHitTestOptions();

        this.pan = { x: 0, y: 0 };
        this._zoom = 1.0;
        this.rotation = 0.0;

        this._onionSkinEnabled = false;
        this.onionSkinSeekBackwards = 1;
        this.onionSkinSeekForwards = 1;

        this.selection = new Wick.Selection();
        this.history = new Wick.History();
        this.clipboard = new Wick.Clipboard();

        this.root = new Wick.Clip({ project: this });
        this.root._identifier = 'Project';

        this.focus = this.root;

        this._mousePosition = { x: 0, y: 0 };
        this._lastMousePosition = { x: 0, y: 0 };
        this._isMouseDown = false;
        this._internalErrorMessages = [];

        this.soundsPlayed = []; // List of all sounds that have been played during this play through of the project.

        this._mouseTargets = [];

        this._keysDown = [];
        this._keysLastDown = [];
        this._currentKey = null;

        this._tickIntervalID = null;

        this._hideCursor = false;
        this._muted = false;
        this._publishedMode = false; // Review the publishedMode setter for rules.
        this._showClipBorders = true;

        this._userErrorCallback = null;

        this._tools = {
            brush: new Wick.Tools.Brush(),
            cursor: new Wick.Tools.Cursor(),
            ellipse: new Wick.Tools.Ellipse(),
            eraser: new Wick.Tools.Eraser(),
            eyedropper: new Wick.Tools.Eyedropper(),
            fillbucket: new Wick.Tools.FillBucket(),
            interact: new Wick.Tools.Interact(),
            line: new Wick.Tools.Line(),
            none: new Wick.Tools.None(),
            pan: new Wick.Tools.Pan(),
            pathcursor: new Wick.Tools.PathCursor(),
            pencil: new Wick.Tools.Pencil(),
            rectangle: new Wick.Tools.Rectangle(),
            text: new Wick.Tools.Text(),
            zoom: new Wick.Tools.Zoom(),
        };

        for (var toolName in this._tools) {
            this._tools[toolName].project = this;
        }

        this.activeTool = 'cursor';

        this._toolSettings = new Wick.ToolSettings();
        this._toolSettings.onSettingsChanged((name, value) => {
            if (name === 'fillColor') {
                this.selection.fillColor = value.rgba;
            } else if (name === 'strokeColor') {
                this.selection.strokeColor = value.rgba;
            }
        });

        this._playing = false;

        this._scriptSchedule = [];
        this._error = null;

        this.history.project = this;
        this.history.pushState(Wick.History.StateType.ONLY_VISIBLE_OBJECTS);
    }

    /**
     * Prepares the project to be used in an editor.
     */
    prepareProjectForEditor (): void {
        this.project.resetCache();
        this.project.recenter();
        this.project.view.prerender();
        this.project.view.render();
    }

    /**
     * Used to initialize the state of elements within the project. Should only be called after
     * deserialization of project and all objects within the project.
     */
    initialize (): void {
        // Fixing all clip positions... This should be done in an internal method when the project is done loading...
        this.activeFrame && this.activeFrame.clips.forEach(clip => {
            clip.applySingleFramePosition();
        });
    }

    /**
     * Resets the cache and removes all unlinked items from the project.
     */
    resetCache (): void {
      Wick.ObjectCache.removeUnusedObjects(this);
    }

    /**
     * TODO: Remove all elements created by this project.
     */
    destroy (): void {
        this.guiElement.removeAllEventListeners();
    }

    _deserialize (data: any): void {
        super._deserialize(data);

        this.name = data.name;
        this.width = data.width;
        this.height = data.height;
        this.framerate = data.framerate;
        this.backgroundColor = new Wick.Color(data.backgroundColor);

        this._focus = data.focus;

        this._hideCursor = false;
        this._muted = false;
        this._renderBlackBars = true;

        this._hitTestOptions = this.getDefaultHitTestOptions();

        // reset rotation, but not pan/zoom.
        // not resetting pan/zoom is convenient when preview playing.
        this.rotation = 0;
    }

    _serialize(args?: any): any {
        var data = super._serialize(args);

        data.name = this.name;
        data.width = this.width;
        data.height = this.height;
        data.backgroundColor = this.backgroundColor.rgba;
        data.framerate = this.framerate;

        data.onionSkinEnabled = this.onionSkinEnabled
        data.onionSkinSeekForwards = this.onionSkinSeekForwards;
        data.onionSkinSeekBackwards = this.onionSkinSeekBackwards;

        data.focus = this.focus.uuid;

        // Save some metadata which will eventually end up in the wick file
        data.metadata = Wick.WickFile.generateMetaData();

        return data;
    }

    get classname(): string {
        return 'Project';
    }

    // Property getters and setters
    get name(): string {
        return this._name;
    }

    set name(name: string) {
        this._name = name;
    }

    get width(): number {
        return this._width;
    }

    set width(width: number) {
        this._width = width;
    }

    get height(): number {
        return this._height;
    }

    set height(height: number) {
        this._height = height;
    }

    get framerate(): number {
        return this._framerate;
    }

    set framerate(framerate: number) {
        this._framerate = framerate;
    }

    get backgroundColor(): Wick.Color {
        return this._backgroundColor;
    }

    set backgroundColor(backgroundColor: Wick.Color) {
        this._backgroundColor = backgroundColor;
    }

    get zoom(): number {
        return this._zoom;
    }

    set zoom(zoom: number) {
        this._zoom = zoom;
    }

    get onionSkinEnabled(): boolean {
        return this._onionSkinEnabled;
    }

    set onionSkinEnabled(onionSkinEnabled: boolean) {
        this._onionSkinEnabled = onionSkinEnabled;
    }

    get mousePosition(): MousePosition {
        return this._mousePosition;
    }

    set mousePosition(mousePosition: MousePosition) {
        this._mousePosition = mousePosition;
    }

    get isMouseDown(): boolean {
        return this._isMouseDown;
    }

    set isMouseDown(isMouseDown: boolean) {
        this._isMouseDown = isMouseDown;
    }

    get keysDown(): string[] {
        return this._keysDown;
    }

    set keysDown(keysDown: string[]) {
        this._keysDown = keysDown;
    }

    get currentKey(): string | null {
        return this._currentKey;
    }

    set currentKey(currentKey: string | null) {
        this._currentKey = currentKey;
    }

    get hideCursor(): boolean {
        return this._hideCursor;
    }

    set hideCursor(hideCursor: boolean) {
        this._hideCursor = hideCursor;
    }

    get muted(): boolean {
        return this._muted;
    }

    set muted(muted: boolean) {
        this._muted = muted;
    }

    get publishedMode(): boolean {
        return this._publishedMode;
    }

    set publishedMode(publishedMode: boolean) {
        this._publishedMode = publishedMode;
    }

    get showClipBorders(): boolean {
        return this._showClipBorders;
    }

    set showClipBorders(showClipBorders: boolean) {
        this._showClipBorders = showClipBorders;
    }

    get playing(): boolean {
        return this._playing;
    }

    set playing(playing: boolean) {
        this._playing = playing;
    }

    get toolSettings(): Wick.ToolSettings {
        return this._toolSettings;
    }

    get tools(): ToolsCollection {
        return this._tools;
    }

    get activeTimeline(): Wick.Timeline {
        return this.focus.timeline;
    }

    get activeFrame(): Wick.Frame | null {
        return this.activeTimeline.activeFrame;
    }

    get activeFrames(): Wick.Frame[] {
        return this.activeTimeline.activeFrames;
    }

    get assets(): Wick.Asset[] {
        return this.getChildren('Asset');
    }

    get clips(): Wick.Clip[] {
        return this.getChildrenRecursive('Clip');
    }

    get frames(): Wick.Frame[] {
        return this.getChildrenRecursive('Frame');
    }

    get layers(): Wick.Layer[] {
        return this.getChildrenRecursive('Layer');
    }

    get paths(): Wick.Path[] {
        return this.getChildrenRecursive('Path');
    }

    get tweens(): Wick.Tween[] {
        return this.getChildrenRecursive('Tween');
    }

    get mouseMove(): MousePosition {
        return {
            x: this._mousePosition.x - this._lastMousePosition.x,
            y: this._mousePosition.y - this._lastMousePosition.y
        };
    }

    get mouseMoveX(): number {
        return this.mouseMove.x;
    }

    get mouseMoveY(): number {
        return this.mouseMove.y;
    }

    get mouseX(): number {
        return this._mousePosition.x;
    }

    get mouseY(): number {
        return this._mousePosition.y;
    }

    // Methods will be added in the next part due to file size constraints
    // This is a partial conversion - the full file would be much longer
}
