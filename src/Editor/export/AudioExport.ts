import toWav from "audiobuffer-to-wav";
import type {
  WickAudioProgressCallback,
  WickProject,
  WickSoundInfo,
} from "../types/engine.types";

declare global {
  interface Window {
    toWavFunc: typeof toWav;
  }
}

window.toWavFunc = toWav;

interface AudioExportArgs {
  project: WickProject;
  onProgress?: WickAudioProgressCallback;
  soundInfo?: WickSoundInfo[];
}

class AudioExport {
  static generateAudioFile = async (
    args: AudioExportArgs
  ): Promise<Uint8Array | undefined> => {
    const { project, onProgress, soundInfo } = args;

    const audioArgs = {
      soundInfo,
      onProgress,
    };

    return new Promise((resolve) => {
      project.generateAudioTrack(
        audioArgs,
        (audioBuffer: AudioBuffer | null) => {
          if (!audioBuffer) {
            resolve(undefined);
          } else {
            const wavBuffer = toWav(audioBuffer);
            resolve(new Uint8Array(wavBuffer));
          }
        }
      );
    });
  };
}

export default AudioExport;
