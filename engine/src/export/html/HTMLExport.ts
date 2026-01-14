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

/**
 * Utility class for bundling Wick projects inside HTML files.
 */
export class HTMLExport {
    /**
     * Bundles a wick project into the standalone HTML player. This creates a single-file playable Wick project.
     * @param {Wick.Project} project - The project to bundle.
     */
    static bundleProject(project: any, callback: (html: string) => void): void {
        Wick.WickFile.toWickFile(project, (wickFileBase64: string) => {
            fetch(Wick.resourcepath + 'emptyproject.html')
                .then(resp => resp.text())
                .then(text => {
                    text = text.replace('<!--INJECT_WICKPROJECTDATA_HERE-->', wickFileBase64);
                    callback(text);
                })
                .catch((e: any) => {
                    console.error('Wick.HTMLExport: Could not download HTML file template.');
                    console.error(e);
                });
        }, 'base64');
    }
}

// Expose to global namespace
Wick.HTMLExport = HTMLExport;
