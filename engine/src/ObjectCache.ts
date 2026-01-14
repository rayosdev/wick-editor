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

// NOTE:
// This should probably not be global, and instead, each Wick.Project should own an ObjectCache.
// It's too hard to test if there's a shared ObjectCache between many projects.

/**
 * Global utility class for storing and retrieving large file data.
 */
WickObjectCache = class {
    private _objects: { [uuid: string]: Wick.Base } = {};
    private _objectsNeedAutosave: { [uuid: string]: boolean } = {};

    /**
     * Create a WickObjectCache.
     */
    constructor () {
        this._objects = {};
        this._objectsNeedAutosave = {};
    }

    /**
     * Add an object to the cache.
     * @param {Wick.Base} object - the object to add
     */
    addObject (object: Wick.Base): void {
        this._objects[object.uuid] = object;

        /*object.children.forEach(child => {
            this.addObject(child);
        });*/
    }

    /**
     * Remove an object from the cache.
     * @param {Wick.Base} object - the object to remove from the cache
     */
    removeObject (object: Wick.Base): void {
        if (object.classname === 'Project') {
            object.destroy();
            return; // TODO, remove this.
        }
        delete this._objects[object.uuid];
    }

    /**
     * Remove an object from the cache.
     * @param {string} uuid - uuid of the object to remove from the cache
     */
    removeObjectByUUID(uuid: string): void {
        delete this._objects[uuid];
    }

    /**
     * Remove all objects from the Object Cache.
     */
    clear (): void {
        this._objects = {};
        this._objectsNeedAutosave = {};
    }

    /**
     * Get an object by its UUID.
     * @returns {Wick.Base}
     */
    getObjectByUUID (uuid: string): Wick.Base | null {
        if(!uuid) {
            console.error('ObjectCache: getObjectByUUID: uuid is required.');
        }

        var object = this._objects[uuid];
        if(!object) {
            console.error("Warning: object with uuid " + uuid + " was not found in the cache.");
            return null;
        } else {
            return object;
        }
    }

    /**
     * All objects in the cache.
     * @returns {Wick.Base[]}
     */
    getAllObjects (): Wick.Base[] {
        var allObjects: Wick.Base[] = [];

        for (var uuid in this._objects) {
            allObjects.push(this._objects[uuid]);
        }

        return allObjects;
    }

    /**
     * Remove all objects that are in the project, but are no longer linked to the root object.
     * This is basically a garbage collection function. This function attempts to keep objects
     * that are referenced in undo/redo.
     * @param {Wick.Project} project - the project to use to determine which objects have no references
     */
    removeUnusedObjects (project: Wick.Project): void {
        var activeObjects = this.getActiveObjects(project);
        let uuids = activeObjects.map(obj => obj.uuid);
        uuids.push(project.uuid); // Don't forget to include the project itself...

        let uuidSet = new Set(uuids);

        let historyIDs = project.history.getObjectUUIDs();

        uuidSet = new Set([...historyIDs, ...uuidSet]);

        this.getAllObjects().forEach(object => {
            if(!uuidSet.has(object.uuid)) {
                this.removeObject(object);
            }
        });
    }

    /**
     * Removes all objects with the temporary flag set to true.
     */
    removeTemporaryObjects (): void {
        this.getAllObjects().forEach(obj => {
            if (obj.temporary) {
                this.removeObject(obj);
            }
        })
    }

    /**
     * Get all objects that are referenced in the given project.
     * @param {Wick.Project} project - the project to check if children are active in.
     * @returns {Wick.Base[]} the active objects.
     */
    getActiveObjects (project: Wick.Project): Wick.Base[] {
        // This does the same thing, but it's WAY faster.
        return project.getChildrenRecursive().map(object => {
            return this.getObjectByUUID(object.uuid);
        });
    }

    /**
     * Saves an object to be autosaved upon the next auto save.
     * @param {Wick.Base} object object to be saved.
     */
    markObjectToBeAutosaved (object: Wick.Base): void {
        this._objectsNeedAutosave[object.uuid] = true;
    }

    /**
     * Removes a given object from the list of objects that must be autosaved.
     * @param {Wick.Base} object - the object to remove from the list of objects to be autosaved.
     */
    clearObjectToBeAutosaved (object: Wick.Base): void {
        delete this._objectsNeedAutosave[object.uuid];
    }

    /**
     * Returns true if a given object is marked to be autosaved during the next autosave.
     * @param {Wick.Base} object - the object to check for autosave
     */
    objectNeedsAutosave (object: Wick.Base): boolean {
        return Wick.ObjectCache._objectsNeedAutosave[object.uuid];
    }

    /**
     * Returns an array of objects that currently need to be autosaved.
     * @returns {Wick.Base[]} The objects that are marked to be autosaved.
     */
    getObjectsNeedAutosaved (): Wick.Base[] {
        return Object.keys(this._objectsNeedAutosave).map(uuid => this.getObjectByUUID(uuid));
    }
}

Wick.ObjectCache = new WickObjectCache();
