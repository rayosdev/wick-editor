import AudioExport from "./AudioExport";
// @ts-ignore - no types available
import b64toBuff from "base64-arraybuffer";

const ENABLE_LOGGING = false;
const EXPORT_IMAGE_START = 10;
const EXPORT_AUDIO_START = 40;
const EXPORT_VIDEO_START = 70;

interface VideoExportArgs {
  project: any;
  width?: number;
  height?: number;
  onProgress?: (message: string, percentage: number) => void;
  onError?: (error: Error) => void;
  onFinish: () => void;
  soundInfo?: any[];
}

interface Dimensions {
  width: number;
  height: number;
}

interface MemoryFile {
  name: string;
  data: Uint8Array;
}

class VideoExport {
  /**
   * Render a video from a Wick project
   */
  static renderVideo = async (args: VideoExportArgs): Promise<void> => {
    const images = await VideoExport._generateProjectImages(args);
    const soundInfo = [...args.project.soundsPlayed]; // Make a deepcopy of the sound info.
    args.soundInfo = soundInfo;
    const audio = await VideoExport._generateAudioFile(args);

    await VideoExport._generateVideo({ images: images, audio: audio, args });
  };

  static _generateAudioFile = async (
    args: VideoExportArgs
  ): Promise<Uint8Array | undefined> => {
    const { onProgress } = args;

    onProgress && onProgress("Generating Audio Track...", EXPORT_AUDIO_START);

    return AudioExport.generateAudioFile(args as any);
  };

  /**
   * Stores all frames of the project in the ffmpegjs memfs filesystem.
   */
  static _generateProjectImages = async (
    args: VideoExportArgs
  ): Promise<MemoryFile[]> => {
    const { project, onProgress } = args;
    const dimensions = VideoExport._ensureValidDimensions(
      args.width || project.width,
      args.height || project.height
    );

    onProgress && onProgress("Rendering Images", EXPORT_IMAGE_START);

    return new Promise((resolve) => {
      const imageData: MemoryFile[] = [];

      // Get frame images from project, send to the video worker.
      let frameNumber = 0;
      project.generateImageSequence({
        imageType: "image/jpeg",

        width: dimensions.width,
        height: dimensions.height,

        onProgress: (currentFrame: number, numTotalFrames: number) => {
          const progress =
            EXPORT_IMAGE_START + (currentFrame / numTotalFrames) * 20;
          onProgress &&
            onProgress(
              "Rendering Frame " + currentFrame + "/" + numTotalFrames,
              progress
            );
        },

        onFinish: (images: HTMLImageElement[]) => {
          // Load frame images into the web worker's memory
          onProgress && onProgress("Converting Frames", EXPORT_AUDIO_START);
          images.forEach((image) => {
            // Create Name and array buffer of frame image.
            const paddedNum = (frameNumber + "").padStart(12, "0");
            const name = "frame" + paddedNum + ".jpg";

            // Get the base 64 value and convert it to an array buffer.
            const cleanBase64 = image.src.split(",")[1];
            const safeBase64 = cleanBase64 ?? "";
            const buffer = b64toBuff.decode(safeBase64);

            // Store name and buffer in memfs appropriate object.
            imageData.push({ name: name, data: new Uint8Array(buffer) });

            // Increase frame number.
            frameNumber += 1;
          });

          resolve(imageData);
        },
      });
    });
  };

  static _generateVideo = async ({
    images,
    audio,
    args,
  }: {
    images: MemoryFile[];
    audio: Uint8Array | undefined;
    args: VideoExportArgs;
  }): Promise<void> => {
    const { project, onProgress, onFinish } = args;

    // Save on Done
    const onDone = (data: Uint8Array | ArrayBuffer) => {
      if (!(data instanceof Uint8Array)) {
        data = new Uint8Array(data);
      }
      const blob = new Blob([data.buffer as ArrayBuffer]);
      (window as any).saveFileFromWick(blob, project.name, ".mp4");
      onProgress && onProgress("Rendering Complete! Downloading...", 100);
      onFinish();
    };

    let workerReady = false;
    const _worker = new Worker("corelibs/video/worker-asm.js");
    _worker.onmessage = (e: MessageEvent) => {
      const msg = e.data;

      switch (msg.type) {
        case "ready":
          ENABLE_LOGGING && console.log("Worker ready");
          workerReady = true;
          break;
        case "stdout":
          VideoExport._parseProgressMessage(msg.data, args);
          ENABLE_LOGGING && console.log("output: ", msg.data);
          break;
        case "stderr":
          ENABLE_LOGGING && console.error("Error:", msg);
          break;
        case "done":
          ENABLE_LOGGING && console.log(msg);
          onDone(msg.data[0].data);
          break;
        case "exit":
          _worker.terminate();
          break;
        case "error":
          console.error("Video Renderer had an error. Please Try Again");
          console.error(msg);
          break;
        default:
          break;
      }
    };

    const runFFMPEGCommand = (
      ffmpegArgs: string[],
      workerMemoryFiles: MemoryFile[]
    ) => {
      ENABLE_LOGGING &&
        console.log("Running ffmpeg", ffmpegArgs, workerMemoryFiles);
      _worker.postMessage({
        type: "command",
        arguments: ffmpegArgs,
        files: workerMemoryFiles,
        commandName: "video_render",
      });
    };

    const waitUntilReady = (callback: () => void) => {
      const waitUntilReadyInterval = setInterval(() => {
        ENABLE_LOGGING && console.log("Waiting on Worker");
        if (workerReady) {
          clearInterval(waitUntilReadyInterval);
          callback();
        }
      }, 10);
    };

    onProgress && onProgress("Rendering Final Video", EXPORT_VIDEO_START);

    let allFiles: MemoryFile[] = images;

    if (audio) allFiles = allFiles.concat([{ data: audio, name: "audio.wav" }]);

    let inputs = ["-i", "frame%12d.jpg"];

    if (audio) {
      inputs = inputs.concat(["-i", "audio.wav"]);
    }

    // Slow down the video if the framerate is less than 6 (framerate <6 causes a corrupted video to render)
    let filterv = "showinfo";
    if (project.framerate < 6) {
      filterv = "setpts=" + 6 / project.framerate + "*PTS," + filterv;
    }

    let dimensions: Dimensions = {
      width: args.width || project.width,
      height: args.height || project.height,
    };
    dimensions = VideoExport._ensureValidDimensions(
      dimensions.width,
      dimensions.height
    );

    const command = [
      "-r",
      "" + Math.max(6, project.framerate),
      "-s",
      dimensions.width + "x" + dimensions.height,
      ...inputs,
      "-pix_fmt",
      "yuv420p",
      "-q:v",
      "10", //10=good quality, 31=bad quality
      "-strict",
      "-2",
      "-filter:v",
      filterv,
      "out.mp4",
    ];

    waitUntilReady(() => runFFMPEGCommand(command, allFiles));
  };

  // ffmpeg does not like odd numbers in the video width/height.
  // this chops off pixels to ensure an even width/height
  // this may be an issue specifically with the h264 codec:
  // https://stackoverflow.com/questions/20847674/ffmpeg-libx264-height-not-divisible-by-2
  static _ensureValidDimensions(width: number, height: number): Dimensions {
    let newWidth = width;
    let newHeight = height;

    if (newWidth % 2 === 1) {
      newWidth -= 1;
    }
    if (newHeight % 2 === 1) {
      newHeight -= 1;
    }

    return {
      width: newWidth,
      height: newHeight,
    };
  }

  static _parseProgressMessage(message: any, args: VideoExportArgs): void {
    if (!message) return;
    if (!(typeof message === "string")) return;
    if (!message.includes("pts_time:")) return;

    let time: any;

    time = message.split("pts_time");
    if (!time) return;
    time = time[1];
    if (!time) return;
    time = time.split("pos");
    if (!time) return;
    time = time[0];
    if (!time) return;
    time = time.replace(":", "");
    if (!time) return;
    const timeNumber = Number(time).toFixed(2);

    args.onProgress &&
      args.onProgress("Rendered: " + timeNumber + " seconds", 85);
  }
}

export default VideoExport;
