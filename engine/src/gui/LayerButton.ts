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

interface LayerButtonArgs {
    clickFn?: (e: MouseEvent) => void;
    tooltip?: string;
    toggledIcon?: string;
    untoggledIcon?: string;
    toggledTooltip?: string;
    untoggledTooltip?: string;
    isToggledFn?: () => boolean;
}

interface Bounds {
    x: number;
    y: number;
    width: number;
    height: number;
}

Wick.GUIElement.LayerButton = class extends Wick.GUIElement.Button {
    public toggledIcon: string;
    public untoggledIcon: string;
    public toggledTooltip: string;
    public untoggledTooltip: string;
    public isToggledFn: (() => boolean) | undefined;

    constructor(model: Wick.Base, args?: LayerButtonArgs) {
        super(model, args);

        this.toggledIcon = args?.toggledIcon || '';
        this.untoggledIcon = args?.untoggledIcon || '';
        this.toggledTooltip = args?.toggledTooltip || '';
        this.untoggledTooltip = args?.untoggledTooltip || '';
        this.isToggledFn = args?.isToggledFn;
    }

    /**
     * Draw this layer button.
     * @param isToggled - Should the button be toggled?
     */
    draw(isToggled?: boolean): void {
        super.draw();

        // Check if the button is toggled
        const isToggledState = this.isToggledFn && this.isToggledFn();

        const ctx = this.ctx;

        // Render different options depending on isToggledFn
        let icon: string | null = null;
        if (isToggledState) {
            this.tooltip.label = this.toggledTooltip;
            icon = this.toggledIcon;
        } else {
            this.tooltip.label = this.untoggledTooltip;
            icon = this.untoggledIcon;
        }

        // Change fill color depending on mouse interactions
        let fillColor: string;
        if (this.mouseState === 'down') {
            fillColor = Wick.GUIElement.LAYER_BUTTON_MOUSEDOWN_COLOR;
        } else if (this.mouseState === 'over') {
            fillColor = Wick.GUIElement.LAYER_BUTTON_HOVER_COLOR;
        } else if (isToggledState) {
            fillColor = Wick.GUIElement.LAYER_BUTTON_TOGGLE_ACTIVE_COLOR;
        } else {
            fillColor = Wick.GUIElement.LAYER_BUTTON_TOGGLE_INACTIVE_COLOR;
        }
        ctx.fillStyle = fillColor;

        // Button circle
        ctx.beginPath();
        ctx.arc(0, 0, Wick.GUIElement.LAYER_BUTTON_ICON_RADIUS, 0, 2 * Math.PI);
        ctx.fill();

        // Button icon
        const r = Wick.GUIElement.LAYER_BUTTON_ICON_RADIUS * 0.8;
        ctx.globalAlpha = 0.5;
        ctx.drawImage(Wick.GUIElement.Icons.getIcon(icon), -r, -r, r * 2, r * 2);
        ctx.globalAlpha = 1.0;
    }

    get bounds(): Bounds {
        const r = Wick.GUIElement.LAYER_BUTTON_ICON_RADIUS;
        return {
            x: -r,
            y: -r,
            width: r * 2,
            height: r * 2,
        };
    }
};
