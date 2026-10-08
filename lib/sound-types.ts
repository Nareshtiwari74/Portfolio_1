/** A short audio sample inlined as a data URI, so playback needs no network round trip. */
export type SoundAsset = {
  name: string;
  dataUri: string;
  /** Length in seconds. */
  duration: number;
  format: "mp3" | "wav" | "ogg";
  license: "CC0" | "OGA-BY" | "MIT";
  author: string;
};
