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

interface FileInfo {
    src: string;
}

/**
 * Global utility class for storing and retrieving large file data.
 */
Wick.FileCache = class {
    private static _files: { [uuid: string]: FileInfo } = {};

    /**
     * A prefix to use in localforage so we can identify which items in localforage are files.
     * @type {string}
     */
    static get FILE_LOCALFORAGE_KEY_PREFIX (): string {
        return 'filesrc_'; // This should never change.
    }

    /**
     * Add a file to the cache.
     * @param {string} src - The file source
     * @param {string} uuid - The UUID of the file
     */
    static addFile (src: string, uuid: string): void {
        this._files[uuid] = {
            src: src
        };

        // Save asset to localforage
        localforage.setItem(this.getLocalForageKeyForUUID(uuid), src).then(() => {

        });
    }

    /**
     * Get info for a file by its UUID.
     * @param {string} uuid - The UUID of the file
     * @returns {object} The file info
     */
    static getFile (uuid: string): FileInfo | null {
        var file = this._files[uuid];
        if(!file) {
            console.error('Asset with UUID ' + uuid + ' was not found in FileCache!');
            return null;
        } else {
            return file;
        }
    }

    /**
     * Removes a file from the FileCache with a given UUID.
     * @param {string} uuid - the UUID of the file to remove.
     */
    static removeFile (uuid: string): void {
        delete this._files[uuid];

        // Remove file from localforage
        localforage.removeItem(this.getLocalForageKeyForUUID(uuid)).then(() => {});
    }

    /**
     * Loads all files from local forage associated with a previously saved project, if possible.
     * @param {Wick.Project} project - the project that we want to load assets for.
     * @param {function} callback - called when the assets are done being loaded.
     */
    static loadFilesFromLocalforage (project: Wick.Project, callback: () => void): void {
        Promise.all(project.getAssets().map(asset => {
            return localforage.getItem(this.getLocalForageKeyForUUID(asset.uuid));
        })).then((assets) => {
            for(var i = 0; i < assets.length; i++) {
                this.addFile(assets[i], project.getAssets()[i].uuid);
            }
            callback();
        });
    }

    /**
     * On object containing all files in WickFileCache.
     * @returns {object} All the files in an object with the format:
     */
    static getAllFiles (): Array<{uuid: string, src: string}> {
        var files: Array<{uuid: string, src: string}> = [];
        for (var uuid in this._files) {
            files.push({
                uuid: uuid,
                src: this._files[uuid].src,
            });
        }
        return files;
    }

    /**
     * Clear the cache.
     */
    static clear (): void {
        this._files = {};
    }

    static clearLocalforage (): void {
        // Clear all files from localforage
        for(var uuid in this._files) {
            localforage.removeItem(this.getLocalForageKeyForUUID(uuid)).then(() => {});
        }
    }

    static getLocalForageKeyForUUID (uuid: string): string {
        return this.FILE_LOCALFORAGE_KEY_PREFIX + uuid;
    }
}
