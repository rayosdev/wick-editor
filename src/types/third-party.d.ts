// Minimal third-party module declarations to reduce TS noise
// Add more modules here as we encounter errors.

declare module 'audiobuffer-to-wav' {
  /**
   * Convert an AudioBuffer to a WAV ArrayBuffer/Uint8Array.
   * This is a minimal typing; adjust if you need more precise types.
   */
  export default function toWav(audioBuffer: AudioBuffer): ArrayBuffer;
}

// Generic fallback for worker files (if any imports like 'file.worker.js')
declare module '*.worker.js' {
  const value: any;
  export default value;
}
