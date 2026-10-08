/**
 * Web Audio playback for the inlined sound assets. A single `AudioContext` and
 * a decoded-buffer cache are shared across the app, so a sample is decoded once
 * however many components play it, and each play is its own source node —
 * retriggering mid-sample overlaps cleanly instead of restarting one element.
 */

let audioContext: AudioContext | null = null;
const bufferCache = new Map<string, AudioBuffer>();

export const getAudioContext = (): AudioContext => {
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  return audioContext;
};

export const decodeAudioData = async (
  dataUri: string
): Promise<AudioBuffer> => {
  const cached = bufferCache.get(dataUri);
  if (cached) return cached;

  const context = getAudioContext();
  const base64 = dataUri.split(",")[1] ?? "";
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  const audioBuffer = await context.decodeAudioData(bytes.buffer.slice(0));
  bufferCache.set(dataUri, audioBuffer);
  return audioBuffer;
};

export type PlaySoundOptions = {
  /** Gain applied to the sample. Above 1 amplifies, and clips past its headroom. */
  volume?: number;
  playbackRate?: number;
  onEnd?: () => void;
};

export type SoundPlayback = {
  stop: () => void;
};

export const playSound = async (
  dataUri: string,
  options: PlaySoundOptions = {}
): Promise<SoundPlayback> => {
  const { volume = 1, playbackRate = 1, onEnd } = options;

  const context = getAudioContext();
  // Autoplay policy leaves the context suspended until a user gesture.
  if (context.state === "suspended") {
    await context.resume();
  }

  const buffer = await decodeAudioData(dataUri);
  const source = context.createBufferSource();
  const gain = context.createGain();

  source.buffer = buffer;
  source.playbackRate.value = playbackRate;
  gain.gain.value = volume;

  source.connect(gain);
  gain.connect(context.destination);

  source.onended = () => onEnd?.();
  source.start(0);

  return {
    stop: () => {
      try {
        source.stop();
      } catch {
        // Already stopped.
      }
    },
  };
};
