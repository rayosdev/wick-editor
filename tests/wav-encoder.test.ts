import { describe, expect, it } from "vitest";
import { encodeAudioBufferToWav } from "Editor/export/wavEncoder";

const readAscii = (view: DataView, offset: number, length: number): string => {
  let value = "";
  for (let index = 0; index < length; index += 1) {
    value += String.fromCharCode(view.getUint8(offset + index));
  }
  return value;
};

describe("encodeAudioBufferToWav", () => {
  it("writes a valid PCM16 WAV header and interleaved sample data", () => {
    const left = new Float32Array([0, -1, 1, 0.5]);
    const right = new Float32Array([0.25, 0, -0.25, 1]);

    const audioBuffer = {
      numberOfChannels: 2,
      length: 4,
      sampleRate: 48000,
      getChannelData: (channel: number) => (channel === 0 ? left : right),
    } as AudioBuffer;

    const result = encodeAudioBufferToWav(audioBuffer);
    const view = new DataView(result);

    expect(result.byteLength).toBe(44 + 4 * 2 * 2);
    expect(readAscii(view, 0, 4)).toBe("RIFF");
    expect(readAscii(view, 8, 4)).toBe("WAVE");
    expect(readAscii(view, 12, 4)).toBe("fmt ");
    expect(view.getUint16(20, true)).toBe(1);
    expect(view.getUint16(22, true)).toBe(2);
    expect(view.getUint32(24, true)).toBe(48000);
    expect(view.getUint16(34, true)).toBe(16);
    expect(readAscii(view, 36, 4)).toBe("data");
    expect(view.getUint32(40, true)).toBe(16);

    expect(view.getInt16(44, true)).toBe(0);
    expect(view.getInt16(46, true)).toBe(8192);
    expect(view.getInt16(48, true)).toBe(-32768);
    expect(view.getInt16(50, true)).toBe(0);
    expect(view.getInt16(52, true)).toBe(32767);
    expect(view.getInt16(54, true)).toBe(-8192);
    expect(view.getInt16(56, true)).toBe(16384);
    expect(view.getInt16(58, true)).toBe(32767);
  });
});
