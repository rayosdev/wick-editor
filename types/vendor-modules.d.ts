declare module "audiobuffer-to-wav" {
  type ToWavOptions = {
    float32?: boolean;
  };

  export default function toWav(
    audioBuffer: AudioBuffer,
    options?: ToWavOptions,
  ): ArrayBuffer;
}

declare module "base64-arraybuffer" {
  const base64ArrayBuffer: {
    decode(base64: string): ArrayBuffer;
    encode(buffer: ArrayBuffer): string;
  };

  export default base64ArrayBuffer;
}

declare module "gifenc" {
  export type RGBAData = Uint8Array | Uint8ClampedArray | number[];
  export type IndexedData = Uint8Array | number[];
  export type Palette = number[][];

  export type GifFrameWriteOptions = {
    palette: Palette;
    delay?: number;
    first?: boolean;
  };

  export class GIFEncoder {
    on(event: "finished", callback: (blob: Blob) => void): void;
    on(event: "progress", callback: (progress: number) => void): void;
    writeFrame(
      indexedData: IndexedData,
      width: number,
      height: number,
      options: GifFrameWriteOptions,
    ): void;
    finish(): void;
    bytes(): Uint8Array;
  }

  export function quantize(rgbaData: RGBAData, maxColors: number): Palette;
  export function applyPalette(rgbaData: RGBAData, palette: Palette): Uint8Array;
}
