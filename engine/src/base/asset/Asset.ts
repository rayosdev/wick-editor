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

export class Asset extends Wick.Base {
    name: string;

    /**
     * Creates a new Wick Asset.
     * @param {string} name - the name of the asset
     */
    constructor(args: any) {
        if (!args) args = {};
        super(args);

        this.name = args.name;
    }

    _serialize(args: any): any {
        var data = super._serialize(args);
        data.name = this.name;
        return data;
    }

    _deserialize(data: any): void {
        super._deserialize(data);
        this.name = data.name;
    }

    /**
     * A list of all objects using this asset.
     */
    getInstances(): any[] {
        // Implemented by subclasses
        return [];
    }

    /**
     * Check if there are any objects in the project that use this asset.
     * @returns {boolean}
     */
    hasInstances(): boolean {
        // Implemented by sublasses
        return false;
    }

    /**
     * Remove all instances of this asset from the project. (Implemented by ClipAsset, ImageAsset, and SoundAsset)
     */
    removeAllInstances(): void {
        // Implemented by sublasses
    }

    get classname(): string {
        return 'Asset';
    }
}

// Expose to global namespace
Wick.Asset = Asset;
