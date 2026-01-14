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
 * Utility class for bundling Wick projects inside ZIP files.
 */
export class ZIPExport {
    static bundleProject(project: any, done: (blob: Blob) => void): void {
        this._downloadDependenciesFiles((items: any[]) => {
            window.Wick.WickFile.toWickFile(project, (wickFile: any) => {
                this._bundleFilesIntoZip(wickFile, items, done);
            });
        });
    }

    static _downloadDependenciesFiles(done: (files: any[]) => void): void {
        var list: Promise<any>[] = [];
        var urls = [
            "index.html",
            "preloadjs.min.js",
            "wickengine.js",
        ];
        var results: any[] = [];

        urls.forEach(function (url: string, i: number) {
            list.push(
                fetch(Wick.resourcepath + url).then(function (res: Response) {
                    results[i] = {
                        data: res.blob(),
                        name: url,
                    };
                })
            );
        });

        Promise
            .all(list)
            .then(function () {
                done(results);
            });
    }

    static _bundleFilesIntoZip(wickFile: any, dependenciesFiles: any[], done: (blob: Blob) => void): void {
        var zip = new JSZip();
        dependenciesFiles.forEach((file: any) => {
            zip.file(file.name, file.data);
        });
        zip.file('project.wick', wickFile);

        zip.generateAsync({
            type: "blob",
            compression: "DEFLATE",
            compressionOptions: {
                level: 9
            },
        }).then(done);
    }
}

// Expose to global namespace
Wick.ZIPExport = ZIPExport;
