// @ts-ignore - no types available
import { GIFEncoder, quantize, applyPalette } from "gifenc";

interface CreateAnimatedGIFArgs {
  project: any;
  width?: number;
  height?: number;
  onProgress: (message: string, percentage: number) => void;
  onFinish: (blob: Blob) => void;
}

class GIFExport {
  /**
   * Create an animated GIF from a Wick project.
   * @param project - the Wick project to create a GIF out of.
   * @param onFinish - Callback that passes the GIF file as a blob when the GIF is done rendering.
   */
  static createAnimatedGIFFromProject(args: CreateAnimatedGIFArgs): void {
    const { project, onProgress, onFinish } = args;

    const combiningProgress = 40;
    const renderingProgress = 70;
    const finishedProgress = 99;

    onProgress("Creating Gif", 10);

    const width = args.width || project.width;
    const height = args.height || project.height;

    // Initialize gifenc GIFEncoder
    const gif = new GIFEncoder();

    const frameDelay = 1000 / project.framerate;
    let framesProcessed = 0;
    let totalFrames = 0;

    gif.on("finished", (gif: any) => {
      onProgress(
        "Saving GIF file (this may take a while)...",
        finishedProgress
      );
      onFinish(gif);
    });

    gif.on("progress", (progress: number) => {
      const prog = 100 * progress;
      onProgress(
        `Rendering GIF: ${prog.toFixed(2)}%`,
        renderingProgress + progress * (finishedProgress - renderingProgress)
      );
    });

    const combineImageSequence = (
      images: (HTMLCanvasElement | HTMLImageElement)[]
    ) => {
      totalFrames = images.length;

      images.forEach((image, index) => {
        // Convert canvas/image to RGBA data
        let canvas: HTMLCanvasElement;
        let ctx: CanvasRenderingContext2D | null;

        if (image instanceof HTMLCanvasElement) {
          canvas = image;
          ctx = canvas.getContext("2d");
        } else {
          // Create canvas from image
          canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          ctx = canvas.getContext("2d");
          ctx?.drawImage(image, 0, 0, width, height);
        }

        if (!ctx) return;

        const imageData = ctx.getImageData(0, 0, width, height);
        const rgbaData = imageData.data;

        // Quantize colors and apply palette
        const palette = quantize(rgbaData, 256);
        const indexedData = applyPalette(rgbaData, palette);

        // Add frame to gif
        const frameOptions: any = {
          palette: palette,
          delay: frameDelay,
        };

        if (index === 0) {
          frameOptions.first = true;
        }

        if (index === images.length - 1) {
          // Last frame
          gif.writeFrame(indexedData, width, height, frameOptions);
          gif.finish();
          const output = gif.bytes();
          const blob = new Blob([output], { type: "image/gif" });
          onProgress(
            "Saving GIF file (this may take a while)...",
            finishedProgress
          );
          onFinish(blob);
        } else {
          gif.writeFrame(indexedData, width, height, frameOptions);
        }

        framesProcessed++;
        const progress = framesProcessed / totalFrames;
        onProgress(
          `Processing frame ${framesProcessed}/${totalFrames}`,
          combiningProgress + progress * (renderingProgress - combiningProgress)
        );
      });
    };

    const updateProgress = (completed: number, maxFrames: number) => {
      // Change visual of the loading bar
      const message = "Rendered " + completed + "/" + maxFrames + " frames";
      const percentage = combiningProgress * (completed / maxFrames);
      onProgress(message, percentage);
    };

    // Get frame images from project, add to GIF
    project.generateImageSequence({
      width: width,
      height: height,
      onFinish: combineImageSequence,
      onProgress: updateProgress,
    });
  }
}

export default GIFExport;
