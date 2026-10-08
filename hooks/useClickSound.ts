"use client";

import { useCallback, useRef } from "react";

/**
 * Plays a short click sample on demand. The `Audio` element is created on the
 * first play rather than on mount, so a visitor who never triggers it pays no
 * decode cost, and playback rejections (autoplay policy) are swallowed.
 */
export const useClickSound = (src: string, volume = 0.7) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  return useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(src);
      audioRef.current.volume = volume;
    }
    const audio = audioRef.current;
    audio.currentTime = 0;
    audio.play().catch(() => {});
  }, [src, volume]);
};
