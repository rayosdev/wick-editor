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

Wick.Tools.Zoom = class extends Wick.Tool {
    public name: string;
    public ZOOM_IN_AMOUNT: number;
    public ZOOM_OUT_AMOUNT: number;
    public MIN_ZOOMBOX_SIZE: number;
    public zoomBox: any; // paper.Path

    /**
     * Creates a zoom tool.
     */
    constructor () {
        super();

        this.name = 'zoom';

        this.ZOOM_IN_AMOUNT = 1.25;
        this.ZOOM_OUT_AMOUNT = 0.8;

        this.MIN_ZOOMBOX_SIZE = 20;

        this.zoomBox = null;
    }

    get doubleClickEnabled (): boolean {
        return false;
    }

    /**
     * A zoom-in cursor.
     * @type {string}
     */
    get cursor (): string {
        return 'zoom-in';
    }

    onActivate (e: any): void {

    }

    onDeactivate (e: any): void {
        this.deleteZoomBox();
    }

    onMouseDown (e: any): void {

    }

    onMouseDrag (e: any): void {
        this.deleteZoomBox();
        this.createZoomBox(e);
    }

    onMouseUp (e: any): void {
        if(this.zoomBox && this.zoomBoxIsValidSize()) {
            var bounds = this.zoomBox.bounds;
            var viewBounds = this.paper.view.bounds;
            this.paper.view.center = bounds.center;
            this.paper.view.scale(Math.min(
                viewBounds.height / bounds.height,
                viewBounds.width / bounds.width
            ));
        } else {
            var zoomAmount = e.modifiers.alt ? this.ZOOM_OUT_AMOUNT : this.ZOOM_IN_AMOUNT;
            this.paper.view.scale(zoomAmount, e.point);
        }

        this.deleteZoomBox();

        this.fireEvent({eventName: 'canvasViewTransformed'});
    }

    createZoomBox (e: any): void {
        var bounds = new this.paper.Rectangle(e.downPoint, e.point);
        bounds.x += 0.5;
        bounds.y += 0.5;
        this.zoomBox = new this.paper.Path.Rectangle(bounds);
        this.zoomBox.strokeColor = 'black';
        this.zoomBox.strokeWidth = 1.0 / this.paper.view.zoom;
    }

    deleteZoomBox (): void {
        if(this.zoomBox) {
            this.zoomBox.remove();
            this.zoomBox = null;
        }
    }

    zoomBoxIsValidSize (): boolean {
        return this.zoomBox.bounds.width > this.MIN_ZOOMBOX_SIZE
            && this.zoomBox.bounds.height > this.MIN_ZOOMBOX_SIZE;
    }
}
