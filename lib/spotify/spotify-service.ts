import { createHash } from "crypto";

import axios from "axios";

import { createMemoryCache } from "@/lib/memoryCache";
import { integrationConfig } from "@/lib/site";
import type { SpotifyPlayback } from "@/types/spotify";

export const isSpotifyConfigured = () =>
  (process.env.SPOTIFY_ENABLED === "true" ||
    integrationConfig.activityEnabled) &&
  Boolean(
    process.env.SPOTIFY_CLIENT_ID?.trim() &&
    process.env.SPOTIFY_CLIENT_SECRET?.trim() &&
    process.env.SPOTIFY_REFRESH_TOKEN?.trim(),
  );

/**
 * Access tokens live an hour, and the song row polls this every 5s, so
 * refreshing on every call would spend two Spotify requests where one will do.
 * Held ten minutes short of the hour to leave room for clock drift.
 */
const accessTokenCache = createMemoryCache<string>(50 * 60_000);
const lastTrackCache = createMemoryCache<{
  playback: SpotifyPlayback;
  observedAt: number;
}>(24 * 60 * 60_000);
let credentialsKey = "";

type SpotifyTrack = {
  type?: string;
  name?: string;
  artists?: { name?: string }[];
  album?: { images?: { url?: string }[] };
  external_urls?: { spotify?: string };
  duration_ms?: number;
};

const toPlayback = (
  track: SpotifyTrack | null | undefined,
  isPlaying: boolean,
  position?: number,
): SpotifyPlayback | null => {
  if (!track?.name || (track.type && track.type !== "track")) return null;
  const durationMs =
    typeof track.duration_ms === "number" && Number.isFinite(track.duration_ms)
      ? Math.max(0, track.duration_ms)
      : 0;
  const progressMs =
    typeof position === "number" && Number.isFinite(position)
      ? Math.max(0, Math.min(position, durationMs))
      : 0;

  return {
    isPlaying,
    name: track.name,
    artists: Array.isArray(track.artists)
      ? track.artists
          .map((artist) => artist.name)
          .filter(Boolean)
          .join(", ")
      : "",
    albumArt: track.album?.images?.[0]?.url,
    url: track.external_urls?.spotify,
    durationMs,
    progressMs,
    progress: durationMs > 0 ? progressMs / durationMs : 0,
  };
};

const lastKnownPlayback = (): SpotifyPlayback | null => {
  const last = lastTrackCache.get();
  return last ? { ...last.playback, isPlaying: false } : null;
};

export const getPlayback = async function handler(
  clientId: string,
  clientSecret: string,
  refreshToken: string,
): Promise<SpotifyPlayback> {
  try {
    // 1) Reuse the cached access token, refreshing it only once it expires
    if (!clientId || !clientSecret || !refreshToken) {
      accessTokenCache.clear();
      lastTrackCache.clear();
      credentialsKey = "";
      return { error: "Missing Spotify credentials" };
    }

    // Keep both caches tied to the configured account; changing credentials
    // must never carry another account's token or listening history forward.
    const nextKey = createHash("sha256")
      .update(JSON.stringify([clientId, clientSecret, refreshToken]))
      .digest("hex");
    if (credentialsKey !== nextKey) {
      accessTokenCache.clear();
      lastTrackCache.clear();
      credentialsKey = nextKey;
    }

    let accessToken = accessTokenCache.get();

    if (!accessToken) {
      const params = new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      });

      const tokenResp = await axios.post(
        "https://accounts.spotify.com/api/token",
        params.toString(),
        {
          timeout: 10_000,
          headers: {
            Authorization:
              "Basic " +
              Buffer.from(clientId + ":" + clientSecret).toString("base64"),
            "Content-Type": "application/x-www-form-urlencoded",
          },
        },
      );

      const refreshedToken: unknown = tokenResp.data?.access_token;
      if (typeof refreshedToken !== "string" || !refreshedToken.trim()) {
        throw new Error("Missing access token");
      }
      accessToken = refreshedToken;
      accessTokenCache.set(accessToken);
    }

    // 2) First try: currently playing track
    const now = await axios.get(
      "https://api.spotify.com/v1/me/player/currently-playing",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        timeout: 10_000,
        validateStatus: () => true,
      },
    );

    // A revoked or rotated token comes back as a 401. Dropping the cached one
    // here means the next poll refreshes it, rather than every call failing
    // until the entry expires on its own.
    if (now.status === 401) accessTokenCache.clear();

    // Spotify can still return the current track while paused. That track is
    // more recent than a possibly empty or delayed playback-history response.
    const current =
      now.status === 200
        ? toPlayback(
            now.data?.item,
            now.data?.is_playing === true,
            now.data?.progress_ms,
          )
        : null;
    if (current) {
      lastTrackCache.set({ playback: current, observedAt: Date.now() });
      return current;
    }

    // 3) Fallback: recently played
    const recent = await axios.get(
      "https://api.spotify.com/v1/me/player/recently-played?limit=1",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        timeout: 10_000,
        validateStatus: () => true, // Also validate status here to handle 403 gracefully
      },
    );

    if (recent.status === 401) accessTokenCache.clear();

    const history = recent.status === 200 ? recent.data?.items?.[0] : null;
    const last = toPlayback(history?.track, false);
    if (last) {
      const playedAt = Date.parse(history.played_at);
      const remembered = lastTrackCache.get();
      // A stale history entry must not replace a track we just observed.
      if (!remembered || playedAt > remembered.observedAt) {
        lastTrackCache.set({
          playback: last,
          observedAt: Number.isFinite(playedAt) ? playedAt : 0,
        });
        return last;
      }
    }

    // A stopped player can return 204 before history contains its last track.
    // Use only real previously observed data, and keep the disc stopped.
    return (
      lastKnownPlayback() ?? {
        isPlaying: false,
        message: "No playback data available",
      }
    );
  } catch (err) {
    // Keep upstream responses and credential-bearing request details private.
    console.error(
      "Spotify request failed:",
      axios.isAxiosError(err)
        ? (err.response?.status ?? err.code ?? "network error")
        : "unexpected response",
    );

    return (
      lastKnownPlayback() ?? {
        error: "Failed to fetch playback",
      }
    );
  }
};
