/*
 * Copyright 2019 WICKLETS LLC
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
 * Utility class for creating and parsing wick files.
 */
export class WickFile {
    /**
     * Generate some metadata for debugging wick projects.
     * @returns {object}
     */
    static generateMetaData(): any {
        return {
            wickengine: Wick.version,
            lastModified: +new Date(),
            platform: {
                name: platform.name,
                version: platform.version,
                product: platform.product,
                manufacturer: platform.manufacturer,
                layout: platform.layout,
                os: {
                    architecture: platform.os.architecture,
                    family: platform.os.family,
                    version: platform.os.version,
                },
                description: platform.description,
            }
        };
    }

    /**
     * Create a project from a wick file.
     * @param {Blob | string} wickFile - Wick file containing project data (can be a Blob or a dataURL string)
     * @param {function} callback - Function called when the project is done being loaded
     */
    static fromWickFile(wickFile: Blob | string, callback: (project: any) => void): void {
        if (typeof wickFile === 'string') {
            wickFile = Wick.ExportUtils.dataURItoBlob(wickFile);
        }

        var fr = new FileReader();

        fr.onload = function() {
            callback(fr.result);
        };

        fr.readAsText(wickFile);
    }

    /**
     * Create a wick file from the project.
     * @param {Wick.Project} project - the project to create a wick file from
     * @param {function(string)} onError - Can be 'blob' or 'dataurl'.
     * @param {function(blob)} callback - function to call when done
     * @returns {Blob}
     */
    static toWickFile(project: any, callback: (wickFile: any) => void, format: string = 'blob'): void {
        var wickFileData = {
            project: project.serialize(),
            metadata: Wick.WickFile.generateMetaData()
        };

        var wickFileString = JSON.stringify(wickFileData);
        var wickFileBlob = new Blob([wickFileString], { type: 'application/json' });

        if (format === 'dataurl') {
            var fr = new FileReader();
            fr.onload = function() {
                callback(fr.result);
            };
            fr.readAsDataURL(wickFileBlob);
        } else {
            callback(wickFileBlob);
        }
    }
}

// Expose to global namespace
Wick.WickFile = WickFile;
