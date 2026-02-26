import * as fastgif from "./fastgif";
import type { WickAsset, WickProject } from "../types/engine.types";
import { getWickRuntime } from "Editor/Util/wickRuntime";

interface GIFImportArgs {
  gifFile: File;
  project: WickProject;
  onFinish: (gifAsset: WickAsset) => void;
  onProgress?: (percent: number) => void;
}

class GIFImport {
  static importGIFIntoProject(args: GIFImportArgs): void {
    const { gifFile, project, onFinish, onProgress } = args;

    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const buf = e.target?.result as ArrayBuffer;

      const dataURLs: string[] = [];

      const wasmDecoder = new fastgif.Decoder();
      wasmDecoder
        .decode(buf)
        .then((decoded: Array<{ imageData: ImageData; delay: number }>) => {
          onProgress?.(25);
          const tempCanvas = document.createElement("canvas");
          const tempCtx = tempCanvas.getContext("2d");

          if (!tempCtx) return;

          decoded.forEach((frame) => {
            tempCanvas.width = frame.imageData.width;
            tempCanvas.height = frame.imageData.height;
            tempCtx.putImageData(frame.imageData, 0, 0);
            dataURLs.push(tempCanvas.toDataURL());
          });

          const wickRuntime = getWickRuntime();
          const ImageAssetCtor = wickRuntime?.ImageAsset;
          const fromImages = wickRuntime?.GIFAsset?.fromImages;
          if (
            typeof ImageAssetCtor !== "function" ||
            typeof fromImages !== "function"
          ) {
            return;
          }

          const imageAssets: WickAsset[] = [];
          dataURLs.forEach((dataURL, index) => {
            const imageAsset = new ImageAssetCtor({
              filename: `${gifFile.name}_${index}.png`,
              src: dataURL,
            });
            project.addAsset(imageAsset);
            imageAssets.push(imageAsset);
          });
          onProgress?.(75);

          project.loadAssets(() => {
            fromImages(
              imageAssets,
              project,
              (gifAsset: WickAsset) => {
                gifAsset.name = gifFile.name;
                gifAsset.filename = gifFile.name;
                onProgress?.(100);
                onFinish(gifAsset);
              }
            );
          });
        });
    };
    reader.readAsArrayBuffer(gifFile);
  }
}

export default GIFImport;
