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

/**
 * The Timeline is responsible for drawing the following GUI elements:
 * - Breadcrumbs
 * - Frames Container
 * - Layers Container
 * - Horizontal + Vertical Scrollbars
 * - Number Line
 */
export class Timeline extends Wick.GUIElement {
    breadcrumbs: any;
    actionButtonsContainer: any;
    layersContainer: any;
    framesContainer: any;
    numberLine: any;
    horizontalScrollbar: any;
    verticalScrollbar: any;

    /**
     * Create a new GUIElement
     */
    constructor(model: any) {
        super(model);

        this.breadcrumbs = new Wick.GUIElement.Breadcrumbs(model);
        this.actionButtonsContainer = new Wick.GUIElement.ActionButtonsContainer(model);
        this.layersContainer = new Wick.GUIElement.LayersContainer(model);
        this.framesContainer = new Wick.GUIElement.FramesContainer(model);
        this.numberLine = new Wick.GUIElement.NumberLine(model);
        this.horizontalScrollbar = new Wick.GUIElement.Scrollbar(model, 'horizontal');
        this.verticalScrollbar = new Wick.GUIElement.Scrollbar(model, 'vertical');
    }

    /**
     * Draw this GUIElement
     */
    draw(): void {
        super.draw();

        var ctx = this.ctx;
        var bounds = this.getBounds();

        // Draw background
        ctx.fillStyle = '#2a2a2a';
        ctx.fillRect(bounds.x, bounds.y, bounds.width, bounds.height);

        // Draw all child elements
        this.breadcrumbs.draw();
        this.actionButtonsContainer.draw();
        this.layersContainer.draw();
        this.framesContainer.draw();
        this.numberLine.draw();
        this.horizontalScrollbar.draw();
        this.verticalScrollbar.draw();
    }

    /**
     * Update this GUIElement
     */
    update(): void {
        super.update();

        // Update all child elements
        this.breadcrumbs.update();
        this.actionButtonsContainer.update();
        this.layersContainer.update();
        this.framesContainer.update();
        this.numberLine.update();
        this.horizontalScrollbar.update();
        this.verticalScrollbar.update();
    }

    /**
     * Get the bounds of this GUIElement
     */
    getBounds(): { x: number; y: number; width: number; height: number } {
        // Timeline bounds are typically the entire timeline area
        return {
            x: 0,
            y: 0,
            width: this.canvas.width,
            height: this.canvas.height
        };
    }
}

// Expose to global namespace
Wick.GUIElement.Timeline = Timeline;
