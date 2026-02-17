import { deepGet } from "../kernel/deepObject";

export const EDITOR_REQUIRED_SURFACE = [
  "AutoSave.delete",
  "AutoSave.generateAutosaveData",
  "AutoSave.generateProjectFromAutosaveData",
  "AutoSave.getAutosavesList",
  "AutoSave.load",
  "AutoSave.save",
  "Clip",
  "Clip.animationTypes",
  "ClipAsset",
  "Color",
  "FileAsset.getValidExtensions",
  "GIFAsset.fromImages",
  "HTMLExport.bundleProject",
  "HTMLPreview.previewProject",
  "History.StateType",
  "ImageAsset",
  "ImageSequence.toPNGSequence",
  "Layer",
  "ObjectCache.getObjectByUUID",
  "Project",
  "SVGAsset",
  "SVGFile.toSVGFile",
  "Tween.VALID_EASING_TYPES",
  "WickFile.fromWickFile",
  "WickFile.toWickFile",
  "WickObjectFile.toWickObjectFile",
  "ZIPExport.bundleProject",
  "resourcepath"
] as const;

export function findMissingSurface(api: unknown, requiredSurface: readonly string[]): string[] {
  const missing: string[] = [];

  for (const path of requiredSurface) {
    if (deepGet(api, path) === undefined) {
      missing.push(path);
    }
  }

  return missing;
}
