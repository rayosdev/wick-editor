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
            try {
                const text = fr.result as string;
                const data = JSON.parse(text);

                // Use alert for debugging since console.log might not work in engine context
                const debugInfo = {
                    hasExport: !!(data && data.export),
                    hasProject: !!(data && data.project),
                    hasObject: !!(data && data.object),
                    hasChildren: !!(data && data.children),
                    dataKeys: data ? Object.keys(data) : [],
                    wickBaseAvailable: !!Wick.Base,
                    wickBaseImportAvailable: !!(Wick.Base && Wick.Base.import),
                    wickBaseFromDataAvailable: !!(Wick.Base && Wick.Base.fromData)
                };
                
                // Try to log to console first, then alert if needed
                try {
                    console.log('WickFile.fromWickFile: Debug info:', debugInfo);
                } catch (e) {
                    alert('WickFile.fromWickFile: Debug info: ' + JSON.stringify(debugInfo));
                }

                // New format: full export payload
                if (data && data.export && data.export.object && data.export.children) {
                    console.log('WickFile.fromWickFile: Using new export format');
                    try {
                        const project = Wick.Base.import(data.export, null);
                        console.log('WickFile.fromWickFile: Import successful, project:', project);
                        callback(project);
                        return;
                    } catch (importError) {
                        console.error('WickFile.fromWickFile: Import failed:', importError);
                        callback(null);
                        return;
                    }
                }

                // Legacy format: minimal serialized project only
                if (data && data.project) {
                    console.log('WickFile.fromWickFile: Using legacy format');
                    try {
                        // For legacy format, we need to create a new project and manually set the properties
                        // instead of using fromData which tries to initialize with missing children
                        const project = new window.Wick.Project();
                        
                        // Manually set the project properties from the serialized data
                        project.name = data.project.name;
                        project.width = data.project.width;
                        project.height = data.project.height;
                        project.framerate = data.project.framerate;
                        project.backgroundColor = new window.Wick.Color(data.project.backgroundColor);
                        project.onionSkinEnabled = data.project.onionSkinEnabled;
                        project.onionSkinSeekForwards = data.project.onionSkinSeekForwards;
                        project.onionSkinSeekBackwards = data.project.onionSkinSeekBackwards;
                        
                        // Set focus to the first clip in the project, or null if no clips exist
                        const clips = project.getChildren('Clip');
                        if (clips.length > 0) {
                            project._focus = clips[0].uuid;
                        } else {
                            project._focus = null;
                        }
                        
                        console.log('WickFile.fromWickFile: Legacy project created successfully');

                        // Warn if children cannot be reconstructed (no object graph present)
                        if (data.project.children && data.project.children.length > 0) {
                            console.warn('Wick.WickFile.fromWickFile: legacy file missing object graph; children will not be reconstructed.');
                        }

                        callback(project);
                        return;
                    } catch (fromDataError) {
                        console.error('WickFile.fromWickFile: Legacy project creation failed:', fromDataError);
                        callback(null);
                        return;
                    }
                }

                // Fallback: attempt direct import if structure resembles Base.export
                if (data && data.object && data.children) {
                    console.log('WickFile.fromWickFile: Using fallback format');
                    try {
                        const project = Wick.Base.import(data, null);
                        console.log('WickFile.fromWickFile: Fallback import successful, project:', project);
                        callback(project);
                        return;
                    } catch (fallbackError) {
                        console.error('WickFile.fromWickFile: Fallback import failed:', fallbackError);
                        callback(null);
                        return;
                    }
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
