import * as fastgif from "./fastgif";

interface GIFImportArgs {
  gifFile: File;
  project: any;
  onFinish: (gifAsset: any) => void;
}

class GIFImport {
  static importGIFIntoProject(args: GIFImportArgs): void {
    const { gifFile, project, onFinish } = args;

    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const buf = e.target?.result as ArrayBuffer;

      const dataURLs: string[] = [];

      const wasmDecoder = new fastgif.Decoder();
      wasmDecoder
        .decode(buf)
        .then((decoded: Array<{ frame: ImageData; ms: number }>) => {
          const tempCanvas = document.createElement("canvas");
          const tempCtx = tempCanvas.getContext("2d");

          if (!tempCtx) return;

          decoded.forEach((frame) => {
            tempCanvas.width = frame.frame.width;
            tempCanvas.height = frame.frame.height;
            tempCtx.putImageData(frame.frame, 0, 0);
            dataURLs.push(tempCanvas.toDataURL());
          });

          const imageAssets: any[] = [];
          dataURLs.forEach((dataURL) => {
            const imageAsset = new (window as any).Wick.ImageAsset({
              filename: gifFile.name + "_" + dataURLs.indexOf(dataURL) + ".png",
              src: dataURL,
            });
            project.addAsset(imageAsset);
            imageAssets.push(imageAsset);
          });

          project.loadAssets(() => {
            (window as any).Wick.GIFAsset.fromImages(
              imageAssets,
              project,
              (gifAsset: any) => {
                gifAsset.name = gifFile.name;
                gifAsset.filename = gifFile.name;
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
