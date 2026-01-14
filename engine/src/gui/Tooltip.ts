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

Wick.GUIElement.Tooltip = class extends Wick.GUIElement {
    private label: string;

    constructor(model: Wick.Base, label: string) {
        super(model);

        this.label = label;
    }

    draw(x: number, y: number): void {
        super.draw();

        // No label was given yet - don't render.
        if (!this.label) return;

        const ctx = this.ctx;

        // Font settings
        ctx.font = "14px Nunito Sans";
        const textContent = this.label;
        const textWidth = ctx.measureText(textContent).width;
        const textHeight = 14;

        // Tooltip
        ctx.save();
        let tx = x - textWidth / 2;
        let ty = y + textHeight;

        // Restrict tooltip so it's always on-screen
        const xMin = 3;
        if (tx < xMin) tx = xMin;

        if (ty > this.canvas.height) {
            ty = y - textHeight;
        }

        // Background
        ctx.fillStyle = "#333333";
        ctx.fillRect(tx - 3, ty - textHeight - 3, textWidth + 6, textHeight + 6);

        // Text
        ctx.fillStyle = "#ffffff";
        ctx.fillText(textContent, tx, ty);

        ctx.restore();
    }
};
