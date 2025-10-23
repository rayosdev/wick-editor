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

Wick.View.Path = class extends Wick.View {
    private _item: any;

    /**
     * Create a path view.
     */
    constructor () {
        super();

        this._item = null;
    }

    /**
     * The paper.js representation of the Wick Path.
     */
    get item (): any {
        if(!this._item) {
            this.render();
        }

        return this._item;
    }

    /**
     *
     */
    render (): void {
        if(!this.model.json) {
            console.warn('Path ' + this.model.uuid + ' is missing path JSON.');
            return;
        }

        this.importJSON(this.model.json);
    }

    /**
     * Import path from JSON.
     */
    importJSON (json: any): void {
        if(!json) return;

        this._item = this.paper.Path.importJSON(json);
        this._item.data = this._item.data || {};
        this._item.data.wickObject = this.model;
    }

    /**
     * Export path to JSON.
     */
    exportJSON (): any {
        return Wick.View.Path.exportJSON(this.item);
    }

    /**
     * Export a path as paper.js Path json data.
     */
    static exportJSON (item: any): any {
        // Recover original style (if needed - only neccesary if style was overritten by custom onion skin style)
        if(item.data.originalStyle) {
            item.strokeColor = item.data.originalStyle.strokeColor;
            item.fillColor = item.data.originalStyle.fillColor;
            item.strokeWidth = item.data.originalStyle.strokeWidth;
        }
        return item.exportJSON({asString:false});
    }

    /**
     * Apply changes to the path.
     */
    applyChanges (): void {
        if(!this._item) return;

        this.model.json = this.exportJSON();
    }

    /**
     * Remove the path view.
     */
    remove (): void {
        if(this._item) {
            this._item.remove();
        }
    }
}
