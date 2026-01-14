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

Wick.Tools.Line = class extends Wick.Tool {
    public name: string;
    public path: any; // paper.Path
    public startPoint: any; // paper.Point
    public endPoint: any; // paper.Point

    /**
     * Creates an instance of the line tool.
     */
    constructor () {
        super();

        this.name = 'line';

        this.path = new this.paper.Path({insert:false});

        this.startPoint;
        this.endPoint;
    }

    get doubleClickEnabled (): boolean {
        return false;
    }

    /**
     * A crosshair cursor.
     * @type {string}
     */
    get cursor (): string {
        return 'crosshair';
    }

    get isDrawingTool (): boolean {
        return true;
    }

    onActivate (e: any): void {
        this.path.remove();
    }

    onDeactivate (e: any): void {
        this.path.remove();
    }

    onMouseDown (e: any): void {
        this.startPoint = e.point;
    }

    onMouseDrag (e: any): void {
        this.path.remove();
        this.endPoint = e.point;
        this.path = new paper.Path.Line(this.startPoint, this.endPoint);
        this.path.strokeCap = 'round';
        this.path.strokeColor = this.getSetting('strokeColor').rgba;
        this.path.strokeWidth = this.getSetting('strokeWidth');
    }

    onMouseUp (e: any): void {
        this.path.remove();
        this.addPathToProject(this.path);
        this.fireEvent({eventName: 'canvasModified', actionName: 'line'});
    }
}
