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
     * @param {Blob | string} wickFile - Can be a Blob, Data URI string, raw base64 string, or raw JSON string.
     * @param {function} callback - Function called when the project is done being loaded
     * @param {string} format - Optional hint. "base64" forces raw base64 decoding.
     */
    static fromWickFile(
        wickFile: Blob | string,
        callback: (project: any) => void,
        format: string = 'blob'
    ): void {
        try {
            if (typeof wickFile === 'string') {
                const input = wickFile.trim();

                if (input.startsWith('{') || input.startsWith('[')) {
                    wickFile = new Blob([input], { type: 'application/json' });
                } else if (/^data:/i.test(input)) {
                    wickFile = Wick.ExportUtils.dataURItoBlob(input);
                } else {
                    const base64 = input.replace(/\s+/g, '');
                    if (format === 'base64' || /^[A-Za-z0-9+/=]+$/.test(base64)) {
                        wickFile = Wick.ExportUtils.dataURItoBlob(
                            `data:application/json;base64,${base64}`
                        );
                    } else {
                        wickFile = Wick.ExportUtils.dataURItoBlob(input);
                    }
                }
            }
        } catch (e) {
            console.error('Wick.WickFile.fromWickFile: Failed to decode wick file input', e);
            callback(null);
            return;
        }

        var fr = new FileReader();

        fr.onload = function() {
            try {
                const text = fr.result as string;
                const data = JSON.parse(text);

                // New format: full export payload
                if (data && data.export && data.export.object && data.export.children) {
                    callback(Wick.Base.import(data.export, null));
                    return;
                }

                // Legacy format: minimal serialized project only
                if (data && data.project) {
                    // For legacy format, we need to create a new project and manually set the properties
                    // instead of using fromData which tries to initialize with missing children.
                    const project = new window.Wick.Project();

                    project.name = data.project.name;
                    project.width = data.project.width;
                    project.height = data.project.height;
                    project.framerate = data.project.framerate;
                    project.backgroundColor = new window.Wick.Color(data.project.backgroundColor);
                    project.onionSkinEnabled = data.project.onionSkinEnabled;
                    project.onionSkinSeekForwards = data.project.onionSkinSeekForwards;
                    project.onionSkinSeekBackwards = data.project.onionSkinSeekBackwards;

                    const clips = project.getChildren('Clip');
                    project._focus = clips.length > 0 ? clips[0].uuid : null;

                    if (data.project.children && data.project.children.length > 0) {
                        console.warn(
                            'Wick.WickFile.fromWickFile: legacy file missing object graph; children will not be reconstructed.'
                        );
                    }

                    callback(project);
                    return;
                }

                // Fallback: attempt direct import if structure resembles Base.export
                if (data && data.object && data.children) {
                    callback(Wick.Base.import(data, null));
                    return;
                }

                console.error('Wick.WickFile.fromWickFile: Unrecognized wick file format');
                callback(null);
            } catch (e) {
                console.error('Wick.WickFile.fromWickFile: Failed to parse wick file', e);
                callback(null);
            }
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
        // Save full object graph so deserialization can reconstruct children and assets
        const exportPayload = project.export();
        var wickFileData = {
            export: exportPayload,
            metadata: Wick.WickFile.generateMetaData()
        };

        var wickFileString = JSON.stringify(wickFileData);
        var wickFileBlob = new Blob([wickFileString], { type: 'application/json' });

        if (format === 'dataurl' || format === 'base64') {
            var fr = new FileReader();
            fr.onload = function() {
                const result = String(fr.result || '');
                if (format === 'base64') {
                    const commaIndex = result.indexOf(',');
                    callback(commaIndex >= 0 ? result.slice(commaIndex + 1) : result);
                } else {
                    callback(result);
                }
            };
            fr.readAsDataURL(wickFileBlob);
        } else {
            callback(wickFileBlob);
        }
    }
}

// Expose to global namespace
Wick.WickFile = WickFile;
