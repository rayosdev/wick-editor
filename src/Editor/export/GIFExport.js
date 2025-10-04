import { GIFEncoder, quantize, applyPalette } from 'gifenc';

class GIFExport {
  /**
   * Create an animated GIF from a Wick project.
   * @param {Wick.Project} project - the Wick project to create a GIF out of.
   * @param {function} done - Callback that passes the GIF file as a blob when the GIF is done rendering.
   */
  static createAnimatedGIFFromProject (args) {
    let { project, onProgress, onFinish } = args;

    const combiningProgress = 40;
    const renderingProgress = 70;
    const finishedProgress = 99;

    onProgress("Creating Gif", 10);

    let width = args.width || project.width;
    let height = args.height || project.height;

    // Initialize gifenc GIFEncoder
    let gif = new GIFEncoder();

    let frameDelay = 1000 / project.framerate;
    let framesProcessed = 0;
    let totalFrames = 0;

    gif.on('finished', (gif) => {
      onProgress('Saving GIF file (this may take a while)...', finishedProgress);
      onFinish(gif);
    });

    gif.on('progress', (progress) => {
      let prog = 100*progress;
      onProgress(`Rendering GIF: ${prog.toFixed(2)}%`, renderingProgress + progress*(finishedProgress-renderingProgress));
    })

    let combineImageSequence = images => {
      totalFrames = images.length;

      images.forEach((image, index) => {
        // Convert canvas/image to RGBA data
        let canvas, ctx;
        if (image instanceof HTMLCanvasElement) {
          canvas = image;
          ctx = canvas.getContext('2d');
        } else {
          // Create canvas from image
          canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          ctx = canvas.getContext('2d');
          ctx.drawImage(image, 0, 0, width, height);
        }

        let imageData = ctx.getImageData(0, 0, width, height);
        let rgbaData = imageData.data;

        // Quantize colors and apply palette
        let palette = quantize(rgbaData, 256);
        let indexedData = applyPalette(rgbaData, palette);

        // Add frame to gif
        let frameOptions = {
          palette: palette,
          delay: frameDelay
        };

        if (index === 0) {
          frameOptions.first = true;
        }

        if (index === images.length - 1) {
          // Last frame
          gif.writeFrame(indexedData, width, height, frameOptions);
          gif.finish();
          let output = gif.bytes();
          let blob = new Blob([output], {type: 'image/gif'});
          onProgress('Saving GIF file (this may take a while)...', finishedProgress);
          onFinish(blob);
        } else {
          gif.writeFrame(indexedData, width, height, frameOptions);
        }

        framesProcessed++;
        let progress = framesProcessed / totalFrames;
        onProgress(`Processing frame ${framesProcessed}/${totalFrames}`, combiningProgress + progress * (renderingProgress - combiningProgress));
      });
    }

    let updateProgress = (completed, maxFrames) => {
      // Change visual of the loading bar
      let message = "Rendered " + completed + "/" + maxFrames + " frames";
      let percentage = (combiningProgress * (completed/maxFrames));
      onProgress(message, percentage);
    }

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
