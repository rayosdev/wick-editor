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

export class GUIElement {
    private _model: any;
    private _root: any;
    private _localTranslation: any;
    canAutoScrollY: boolean;
    canAutoScrollX: boolean;
    cursor: string;

    static GRID_DEFAULT_CELL_WIDTH = 20;

    /**
     * Create a new GUIElement
     * @param {Wick.Base} model - The object containing the data to use to draw this GUIElement
     */
    constructor(model: any) {
        this.model = model;

        this.canAutoScrollY = false;
        this.canAutoScrollX = false;

        this.cursor = 'default';
    }

    /**
     * The object to use the data from to create this GUIElement
     * @type {Wick.Base}
     */
    set model(model: any) {
        this._model = model;
    }

    get model(): any {
        return this._model;
    }

    /**
     * The root GUIElement.
     * @type {Wick.GUIElement}
     */
    get project(): any {
        if (!this._root) {
            this._root = this.model.project.guiElement;
        }
        return this._root;
    }

    /**
     * The canvas that this GUIElement belongs to.
     */
    get canvas(): HTMLCanvasElement {
        return this.project._canvas;
    }

    /**
     * The context of the canvas that this GUIElement belongs to.
     */
    get ctx(): CanvasRenderingContext2D {
        return this.model.project.guiElement._ctx;
    }

    /**
     * The current translation of the canvas. NOTE: This won't work without the following polyfill:
     * https://github.com/goessner/canvas-currentTransform
     * @type {object}
     */
    get currentTranslation(): { x: number; y: number } {
        var transform = this.ctx.currentTransform;
        return {
            x: transform.e,
            y: transform.f,
        };
    }

    /**
     * A copy of the transformation of the canvas when this object was drawn.
     * @type {object}
     */
    get localTranslation(): any {
        return this._localTranslation;
    }

    /**
     * The current grid cell width that all GUIElements are based off of.
     * @type {number}
     */
    get gridCellWidth(): number {
        return Wick.GUIElement.GRID_DEFAULT_CELL_WIDTH;
    }

    /**
     * Draw this GUIElement.
     */
    draw(): void {
        // Implemented by subclasses
    }

    /**
     * Update this GUIElement.
     */
    update(): void {
        // Implemented by subclasses
    }

    /**
     * Check if a point is inside this GUIElement.
     * @param {object} point - The point to check
     * @returns {boolean}
     */
    isPointInside(point: { x: number; y: number }): boolean {
        // Implemented by subclasses
        return false;
    }

    /**
     * Handle mouse down events.
     * @param {object} e - The mouse event
     */
    onMouseDown(e: any): void {
        // Implemented by subclasses
    }

    /**
     * Handle mouse up events.
     * @param {object} e - The mouse event
     */
    onMouseUp(e: any): void {
        // Implemented by subclasses
    }

    /**
     * Handle mouse move events.
     * @param {object} e - The mouse event
     */
    onMouseMove(e: any): void {
        // Implemented by subclasses
    }

    /**
     * Handle mouse enter events.
     * @param {object} e - The mouse event
     */
    onMouseEnter(e: any): void {
        // Implemented by subclasses
    }

    /**
     * Handle mouse leave events.
     * @param {object} e - The mouse event
     */
    onMouseLeave(e: any): void {
        // Implemented by subclasses
    }

    /**
     * Handle click events.
     * @param {object} e - The mouse event
     */
    onClick(e: any): void {
        // Implemented by subclasses
    }

    /**
     * Handle double click events.
     * @param {object} e - The mouse event
     */
    onDoubleClick(e: any): void {
        // Implemented by subclasses
    }

    /**
     * Handle key down events.
     * @param {object} e - The keyboard event
     */
    onKeyDown(e: any): void {
        // Implemented by subclasses
    }

    /**
     * Handle key up events.
     * @param {object} e - The keyboard event
     */
    onKeyUp(e: any): void {
        // Implemented by subclasses
    }

    /**
     * Get the bounds of this GUIElement.
     * @returns {object}
     */
    getBounds(): { x: number; y: number; width: number; height: number } {
        // Implemented by subclasses
        return { x: 0, y: 0, width: 0, height: 0 };
    }

    /**
     * Set the local translation for this GUIElement.
     * @param {object} translation - The translation to set
     */
    setLocalTranslation(translation: { x: number; y: number }): void {
        this._localTranslation = { ...translation };
    }

    /**
     * Get the current cursor for this GUIElement.
     * @returns {string}
     */
    getCursor(): string {
        return this.cursor;
    }

    /**
     * Set the cursor for this GUIElement.
     * @param {string} cursor - The cursor to set
     */
    setCursor(cursor: string): void {
        this.cursor = cursor;
    }
}

// Expose to global namespace
Wick.GUIElement = GUIElement;
