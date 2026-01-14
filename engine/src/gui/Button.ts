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

interface ButtonArgs {
    clickFn?: (e: MouseEvent) => void;
    tooltip?: string;
}

Wick.GUIElement.Button = class extends Wick.GUIElement {
    private _clickFn: (e: MouseEvent) => void;
    private _tooltip: string;
    public tooltip: Wick.GUIElement.Tooltip;
    public lastPressed: number;

    /**
     * Create a new button.
     * @param model - See Wick.GUIElement constructor
     * @param args - Button configuration options
     */
    constructor(model: Wick.Base, args?: ButtonArgs) {
        super(model);

        if (!args) args = {};
        this._clickFn = args.clickFn || (() => {});
        this._tooltip = args.tooltip || '';

        this.tooltip = new Wick.GUIElement.Tooltip(this.model, this._tooltip);

        this.cursor = 'pointer';

        this.lastPressed = 0;
    }

    draw(): void {
        super.draw();
    }

    onMouseDown(e: MouseEvent): void {
        const now = Date.now();
        const timeSince = now - this.lastPressed;

        // Require 100 ms between clicks.
        // This helps ensure that double events are not counted immediately.
        if (timeSince > 150) {
            this._clickFn(e);
            this.lastPressed = now;
        }
    }
};