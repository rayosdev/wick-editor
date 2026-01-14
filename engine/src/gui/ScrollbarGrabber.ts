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

type ScrollbarDirection = 'horizontal' | 'vertical';

interface Bounds {
    x: number;
    y: number;
    width: number;
    height: number;
}

Wick.GUIElement.ScrollbarGrabber = class extends Wick.GUIElement {
    public direction: ScrollbarDirection;
    public horizontalLength: number;
    public verticalLength: number;
    public scrollRatioX: number;
    public scrollRatioY: number;

    constructor(model: Wick.Base, direction: ScrollbarDirection) {
        super(model);

        this.cursor = 'grab';

        this.direction = direction;
        this.horizontalLength = 100;
        this.verticalLength = 50;
    }

    draw(): void {
        super.draw();

        const ctx = this.ctx;

        // Set color based on if the mouse is hovered over the bar
        const fillColor = this.mouseState === 'over' ? Wick.GUIElement.SCROLLBAR_ACTIVE_FILL_COLOR : Wick.GUIElement.SCROLLBAR_FILL_COLOR;
        const r = Wick.GUIElement.SCROLLBAR_BORDER_RADIUS;
        const s = Wick.GUIElement.SCROLLBAR_SIZE - Wick.GUIElement.SCROLLBAR_MARGIN;

        // Draw the bar
        ctx.fillStyle = fillColor;
        ctx.save();
        ctx.translate(Wick.GUIElement.SCROLLBAR_MARGIN / 2, Wick.GUIElement.SCROLLBAR_MARGIN / 2);
        if (this.direction === 'horizontal') {
            ctx.beginPath();
            ctx.roundRect(0, 0, this.horizontalLength, s, r);
            ctx.fill();
        } else if (this.direction === 'vertical') {
            ctx.beginPath();
            ctx.roundRect(0, 0, s, this.verticalLength, r);
            ctx.fill();
        }
        ctx.restore();
    }

    onMouseDrag(e: MouseEvent): void {
        if (this.direction === 'horizontal') {
            this.project.scrollX += e.movementX * this.scrollRatioX;
        } else if (this.direction === 'vertical') {
            this.project.scrollY += e.movementY * this.scrollRatioY;
        }
    }

    get bounds(): Bounds {
        if (this.direction === 'horizontal') {
            return {
                x: 0,
                y: 0,
                width: this.horizontalLength,
                height: Wick.GUIElement.SCROLLBAR_SIZE,
            };
        } else if (this.direction === 'vertical') {
            return {
                x: 0,
                y: 0,
                width: Wick.GUIElement.SCROLLBAR_SIZE,
                height: this.verticalLength,
            };
        }
        // Fallback (should never reach here with proper typing)
        return { x: 0, y: 0, width: 0, height: 0 };
    }
};
