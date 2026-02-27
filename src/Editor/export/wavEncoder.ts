const PCM_BIT_DEPTH = 16;
const PCM_BYTES_PER_SAMPLE = PCM_BIT_DEPTH / 8;
const WAV_HEADER_BYTES = 44;

const writeAscii = (view: DataView, offset: number, text: string): void => {
  for (let index = 0; index < text.length; index += 1) {
    view.setUint8(offset + index, text.charCodeAt(index));
  }
};

export const encodeAudioBufferToWav = (audioBuffer: AudioBuffer): ArrayBuffer => {
  const channelCount = audioBuffer.numberOfChannels;
  const frameCount = audioBuffer.length;
  const sampleRate = audioBuffer.sampleRate;
  const blockAlign = channelCount * PCM_BYTES_PER_SAMPLE;
  const byteRate = sampleRate * blockAlign;
  const dataSize = frameCount * blockAlign;

  const wavBuffer = new ArrayBuffer(WAV_HEADER_BYTES + dataSize);
  const view = new DataView(wavBuffer);

  writeAscii(view, 0, "RIFF");
  view.setUint32(4, 36 + dataSize, true);
  writeAscii(view, 8, "WAVE");
  writeAscii(view, 12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, channelCount, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, PCM_BIT_DEPTH, true);
  writeAscii(view, 36, "data");
  view.setUint32(40, dataSize, true);

  let offset = WAV_HEADER_BYTES;
  for (let frame = 0; frame < frameCount; frame += 1) {
    for (let channel = 0; channel < channelCount; channel += 1) {
      const samples = audioBuffer.getChannelData(channel);
      const sample = Math.max(-1, Math.min(1, samples[frame] ?? 0));
      const intSample =
        sample < 0 ? Math.round(sample * 0x8000) : Math.round(sample * 0x7fff);
      view.setInt16(offset, intSample, true);
      offset += PCM_BYTES_PER_SAMPLE;
    }
  }

  return wavBuffer;
};
