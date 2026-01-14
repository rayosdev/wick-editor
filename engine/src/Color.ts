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

/* Small utility class for colors. */
Wick.Color = class {
    private _color: any; // paper.Color

    /**
     * Creates a Transformation.
     * @param {string} color - (Optional) Hex or Rgba color to create a Wick.Color from.
     */
    constructor (color?: string) {
        if(color) {
            this._color = new paper.Color(color);
        } else {
            this._color = new paper.Color();
        }
    }

    /**
     * The red value of the color. Ranges from 0.0 to 1.0.
     * @type {Number}
     */
    get r (): number {
        return this._color.red;
    }

    set r (r: number) {
        this._color.red = r;
    }

    /**
     * The green value of the color. Ranges from 0.0 to 1.0.
     * @type {Number}
     */
    get g (): number {
        return this._color.green;
    }

    set g (g: number) {
        this._color.green = g;
    }

    /**
     * The blue value of the color. Ranges from 0.0 to 1.0.
     * @type {Number}
     */
    get b (): number {
        return this._color.blue;
    }

    set b (b: number) {
        this._color.blue = b;
    }

    /**
     * The alpha value of the color. Ranges from 0.0 to 1.0.
     * @type {Number}
     */
    get a (): number {
        return this._color.alpha;
    }

    set a (a: number) {
        this._color.alpha = a;
    }

    /**
     * The color as a hex string. Example: "#AABBCC"
     * @type {String}
     */
    get hex (): string {
        return this._color.toCSS(true);
    }

    /**
     * The color as an rgba string. Example: "rgba(r,g,b,a)"
     */
    get rgba (): string {
        return this._color.toCSS();
    }

    /**
     * Adds together the r, g, and b values of both colors and produces a new color.
     * @param {Wick.Color} color - the color to add to this color
     * @returns {Wick.Color} the resulting color
     */
    add (color: Wick.Color): Wick.Color {
        var newColor = new Wick.Color();
        newColor.r = this.r + color.r;
        newColor.g = this.g + color.g;
        newColor.b = this.b + color.b;
        return newColor;
    }

    /**
     * Multiplies the r, g, and b values of both colors to produce a new color.
     * @param {Wick.Color} color - the color to multiply with this color
     * @returns {Wick.Color} the resulting color
     */
    multiply (n: number): Wick.Color {
        var newColor = new Wick.Color();
        newColor.r = this.r * n;
        newColor.g = this.g * n;
        newColor.b = this.b * n;
        return newColor;
    }

    /**
     * Averages the r, g, and b values of two colors.
     * @param {Wick.Color} colorA - a color to average with another color (order does not matter)
     * @param {Wick.Color} colorB - a color to average with another color (order does not matter)
     * @returns {Wick.Color} The resulting averaged color.
     */
    static average (colorA: Wick.Color, colorB: Wick.Color): Wick.Color {
        return colorA.multiply(0.5).add(colorB.multiply(0.5));
    }
}
