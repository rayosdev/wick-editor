// @ts-ignore - no types available
import toWav from "audiobuffer-to-wav";

declare global {
  interface Window {
    toWavFunc: typeof toWav;
  }
}

window.toWavFunc = toWav;

interface AudioExportArgs {
  project: any;
  onProgress?: (progress: number) => void;
  soundInfo: any;
}

class AudioExport {
  static generateAudioFile = async (
    args: AudioExportArgs
  ): Promise<Uint8Array | undefined> => {
    const { project, onProgress, soundInfo } = args;

    const audioArgs = {
      soundInfo: soundInfo,
      onProgress: onProgress,
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
