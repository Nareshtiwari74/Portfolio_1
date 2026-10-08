/**
 * What `getPlayback` returns and what `/api/spotify/playback` sends down.
 *
 * Every field is optional because one shape covers all four outcomes: a track
 * that is playing, the last one that played, "nothing to show", and a failed
 * call. The row renders from whatever is present, so a caller never has to
 * narrow before reading `name`.
 */
export type SpotifyPlayback = {
  /** False only when the portfolio's Spotify integration is disabled. */
  available?: boolean;
  isPlaying?: boolean;
  name?: string;
  artists?: string;
  albumArt?: string;
  url?: string;
  durationMs?: number;
  progressMs?: number;
  /** 0..1 position through the track, for the progress ring on the disc. */
  progress?: number;
  /** Set when Spotify answered but had no track to give. */
  message?: string;
  /** Set when the call itself failed. */
  error?: string;
  details?: unknown;
  hint?: string;
};
